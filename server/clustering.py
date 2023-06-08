from .models.User import User
import networkx as nx
import requests
import json
import requests
import math

SOURCE = -2
SINK = -1
EDGE_MAX_DISTANCE = 20
ACCESS_TOKEN = "pk.eyJ1IjoiZG9yZmFsYWgiLCJhIjoiY2xpbXg5Mm5pMHZlODNmbW1lbmhqa2o2ciJ9.8L61s6cS4pxPs3iqE7h2CQ"
MIN_DIST = 500
MINUTES = 60
ZERO_WEIGHT = 0
GENDER_WEIGHT = 5
WALK_PACE = 85
BOUNDBOX_EPSILON = 1/111
INF_WEIGHT = math.inf


class Cluster:
    def __init__(self, users) -> None:
        self.graph = nx.DiGraph()
        self.users: list[User] = users
        self.drivers = []
        self.passengers = []

    def get_drivers(self):
        self.drivers = [user for user in self.users if user.is_driver]

    def get_passengers(self):
        self.passengers = [user for user in self.users if not user.is_driver]

    def add_nodes(self):
        self.graph.add_node(SOURCE)
        for driver in self.drivers:
            self.graph.add_node(driver.id)
        for passenger in self.passengers:
            self.graph.add_node(passenger.id)
        self.graph.add_node(SINK)

    def add_edges(self):
        self.add_edges_from_source_to_drivers()
        self.add_edges_from_drivers_to_passengers()
        self.add_edges_from_passengers_to_sink()

    def add_edges_from_source_to_drivers(self):
        for driver in self.drivers:
            self.graph.add_edge(SOURCE, driver.id, capacity=driver.capacity, weight=0)

    def add_edges_from_drivers_to_passengers(self):
        for driver in self.drivers:
            for passenger in self.passengers:
                # how to get driver and passenger to get weight
                weight = self.get_weight(driver, passenger) 
                if weight <= EDGE_MAX_DISTANCE:
                    self.graph.add_edge(driver.id, passenger.id, capacity=1, weight=weight)

    def add_edges_from_passengers_to_sink(self):
        for passenger in self.passengers:
            self.graph.add_edge(passenger.id, SINK, capacity=1, weight=0)

    def build_graph(self):
        # get data
        self.get_drivers()
        self.get_passengers()

        # add node
        self.add_nodes()

        # add edges
        self.add_edges()

    def min_cost_max_flow(self):
        flow_dict = nx.max_flow_min_cost(self.graph, SOURCE, SINK, weight="weight", capacity="capacity")
        return flow_dict
    
    def get_driver_passenger_pairs(self, flow_dict):
        driver_passenger_pairs = []
        for driver_id in flow_dict:
            if driver_id == SOURCE or driver_id == SINK: continue
            for passenger_id in flow_dict[driver_id]:
                if passenger_id == SOURCE or passenger_id == SINK: continue
                if flow_dict[driver_id][passenger_id] > 0:
                    driver_passenger_pairs.append((driver_id, passenger_id))
        return driver_passenger_pairs

    def get_event_clusters(self):
        self.build_graph()
        flow_dict = self.min_cost_max_flow()
        driver_passenger_pairs = self.get_driver_passenger_pairs(flow_dict)
        return driver_passenger_pairs


    def calc_dist_weight(self, driver_latitude: float, driver_longitude: float, passenger_latitude: float, passenger_longitude):
        url = f"https://api.mapbox.com/directions/v5/mapbox/driving/{driver_longitude},{driver_latitude};{passenger_longitude},{passenger_latitude}?alternatives=true&access_token={ACCESS_TOKEN}"
        response = requests.get(url, verify=False)
        data = response.json()
        distance = data["routes"][0]["distance"]
        duration = data["routes"][0]["duration"] / MINUTES
        if distance < MIN_DIST:
            return ZERO_WEIGHT
        return round(min(duration, distance / WALK_PACE), 3)

    def calc_gender_weight(self, driver_geneder: str, passenger_gender):
        if driver_geneder == passenger_gender:
            return ZERO_WEIGHT
        return GENDER_WEIGHT

    def get_weight(self, driver, passenger):
        distance_weight = self.calc_dist_weight(driver.pick_up_latitude, driver.pick_up_longtitude, passenger.pick_up_latitude, passenger.pick_up_longtitude)
        gender_weight = self.calc_gender_weight(driver.geneder, passenger.gender)
        return distance_weight + gender_weight
