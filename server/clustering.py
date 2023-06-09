from .models.User import User
import networkx as nx
import requests
from .models import Event
from sqlalchemy import and_
import math
from matplotlib import pyplot as plt
import threading

SOURCE = -1
SINK = -2
EDGE_MAX_DISTANCE = 20
ACCESS_TOKEN = "pk.eyJ1IjoiZG9yZmFsYWgiLCJhIjoiY2xpbXg5Mm5pMHZlODNmbW1lbmhqa2o2ciJ9.8L61s6cS4pxPs3iqE7h2CQ"
MIN_DIST = 500
MINUTES = 60
ZERO_WEIGHT = 0
GENDER_WEIGHT = 5
WALK_PACE = 85
BOUNDBOX_EPSILON = 1/111
INF_WEIGHT = math.inf
WORKERS=100
COST_PER_MINUTE = 0.35
requests.packages.urllib3.disable_warnings() 

class Cluster:
    def __init__(self, users, event: Event) -> None:
        self.graph = nx.DiGraph()
        self.users: list[User] = users
        self.drivers = []
        self.passengers = []
        self.event = event
        self.price_dict = {}
    def get_drivers(self):
        self.drivers = [user for user in self.users if user.is_driver]

    def get_passengers(self):
        self.passengers = [user for user in self.users if not user.is_driver]

    def add_nodes(self):
        self.graph.add_node(SOURCE)
        for driver in self.drivers:
            self.graph.add_node(driver.user_id)
        for passenger in self.passengers:
            self.graph.add_node(passenger.user_id)
        self.graph.add_node(SINK)

    def add_edges(self):
        self.add_edges_from_source_to_drivers()
        self.add_edges_from_drivers_to_passengers()
        self.add_edges_from_passengers_to_sink()

    def add_edges_from_source_to_drivers(self):
        for driver in self.drivers:
            self.graph.add_edge(SOURCE, driver.user_id, capacity=driver.capacity, weight=0)
    
    def calc_edge(self,driver,passenger):
            weight = self.get_weight(driver, passenger) 
            if weight <= EDGE_MAX_DISTANCE:
                self.graph.add_edge(driver.user_id, passenger.user_id, capacity = 1, weight = weight)

   
    def add_edges_from_drivers_to_passengers(self):

        cnt=0
        for driver in self.drivers:
            for i in range(0,len(self.passengers),WORKERS): 
                iter_threader = [threading.Thread(target=self.calc_edge, args=[driver,self.passengers[j]]) for j in range (i,min(i+WORKERS,len(self.passengers)))]
                for t in iter_threader: #runs the task in threads
                    t.start()
                for t in iter_threader: #sync the threads before moving to the next iteration or exit the loop
                    t.join()
                cnt+=WORKERS
            
    

    def add_edges_from_passengers_to_sink(self):
        for passenger in self.passengers:
            self.graph.add_edge(passenger.user_id, SINK, capacity=1, weight=0)

    def build_graph(self):
        # get data
        self.get_drivers()
        self.get_passengers()

        # add node
        self.add_nodes()

        # add edges
        self.add_edges()

    def min_cost_max_flow(self):
        flow_dict = nx.max_flow_min_cost(self.graph, SOURCE, SINK)
        return flow_dict
    
    def get_driver_passenger_pairs(self, flow_dict):
        driver_passenger_pairs = []
        for driver_id in flow_dict:
            if driver_id == SOURCE or driver_id == SINK: continue
            for passenger_id in flow_dict[driver_id]:
                if passenger_id == SOURCE or passenger_id == SINK: continue
                if flow_dict[driver_id][passenger_id] > 0:
                    driver_passenger_pairs.append((driver_id, passenger_id,int(self.price_dict[driver_id])))
        return driver_passenger_pairs
    
    def get_prices(self):
        for driver in self.drivers:
            self.price_dict[driver.user_id] = self.calc_drive_price(driver.pick_up_latitude , driver.pick_up_longtitude)

    def calc_drive_price(self, driver_latitude: float, driver_longitude: float):
        url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{driver_longitude},{driver_latitude};{self.event.longtitude},{self.event.latitude}?alternatives=true&access_token={ACCESS_TOKEN}"
        response = requests.get(url, verify=False )
        data = response.json()
        duration = data["routes"][0]["duration"] / MINUTES
        return duration*COST_PER_MINUTE

    def get_event_clusters(self):
        self.build_graph()
        # Display the graph
        self.get_prices()
        flow_dict = self.min_cost_max_flow()
        driver_passenger_pairs = self.get_driver_passenger_pairs(flow_dict)
        return driver_passenger_pairs


    def calc_dist_weight(self, driver_latitude: float, driver_longitude: float, passenger_latitude: float, passenger_longitude):
        url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{driver_longitude},{driver_latitude};{passenger_longitude},{passenger_latitude}?alternatives=true&access_token={ACCESS_TOKEN}"
        response = requests.get(url, verify=False )
        data = response.json()
        distance = data["routes"][0]["distance"]
        duration = data["routes"][0]["duration"] / MINUTES
        if distance < MIN_DIST:
            return ZERO_WEIGHT
        return round(min(duration, distance / WALK_PACE), 3)

    def calc_gender_weight(self, driver_gender, passenger_gender):
        if driver_gender == passenger_gender:
            return ZERO_WEIGHT
        return GENDER_WEIGHT


    def get_weight(self, driver, passenger):
        bounding_box_weight = self.calc_bounding_box_weight(driver, passenger)
        if bounding_box_weight != ZERO_WEIGHT:
            return INF_WEIGHT
        distance_weight = self.calc_dist_weight(driver.pick_up_latitude, driver.pick_up_longtitude, passenger.pick_up_latitude, passenger.pick_up_longtitude)
        gender_weight = self.calc_gender_weight(driver.gender, passenger.gender)
        return int(distance_weight + gender_weight)

    def calc_driver_boundingbox(self,driver):
        x_left = min(driver.pick_up_longtitude,self.event.longtitude) - BOUNDBOX_EPSILON
        x_right = max(driver.pick_up_longtitude,self.event.longtitude) + BOUNDBOX_EPSILON
        y_low= min(driver.pick_up_latitude,self.event.latitude) - BOUNDBOX_EPSILON
        y_high= max(driver.pick_up_latitude,self.event.latitude) + BOUNDBOX_EPSILON
        return (x_left, x_right, y_low, y_high)

    def calc_bounding_box_weight(self,driver,passenger):
        driver_bounding_box = self.calc_driver_boundingbox(driver)
        if passenger.pick_up_longtitude > driver_bounding_box[0] and passenger.pick_up_longtitude <driver_bounding_box[1]:
            if passenger.pick_up_latitude > driver_bounding_box[2] and passenger.pick_up_latitude <driver_bounding_box[3]:
                return ZERO_WEIGHT
        return INF_WEIGHT
