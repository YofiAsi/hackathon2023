from .models.User import User
import networkx as nx
EDGE_MAX_DISTANCE = 20

class Cluster:
    def __init__(self) -> None:
        self.graph = nx.DiGraph()
        self.users: list[User] = {}
        self.drivers = []
        self.passengers = []

    def get_drivers(self):
        self.drivers = [user for user in self.users.values() if user.is_driver]

    def get_passengers(self):
        self.passengers = [user for user in self.users.values() if not user.is_driver]

    def add_nodes(self):
        self.graph.add_node("source")
        for driver in self.drivers:
            self.graph.add_node(driver.id)
        for passenger in self.passengers:
            self.graph.add_node(passenger.id)
        self.graph.add_node("sink")


    def add_edges(self):
        self.add_edges_from_source_to_drivers()
        self.add_edges_from_drivers_to_passengers()
        self.add_edges_from_passengers_to_sink()

    def add_edges_from_source_to_drivers(self):
        for driver in self.drivers:
            self.graph.add_edge("source", driver.id, capacity=driver.capacity,weight = 0)


    def add_edges_from_drivers_to_passengers(self):
        for driver in self.drivers:
            for passenger in self.passengers:
                weight = self.get_weight(driver.id, passenger.id)
                if  weight <= EDGE_MAX_DISTANCE:
                    self.graph.add_edge(driver.id, passenger.id, capacity = 1,weight = weight)

    def add_edges_from_passengers_to_sink(self):
        for passenger in self.passengers:
            self.graph.add_edge(passenger.id, "sink", capacity=1,weight = 0)

    def build_graph(self):
        #get data
        self.get_drivers()
        self.get_passengers()

        #add node
        self.add_nodes()

        #add edges
        self.add_edges()
    
    def min_cost_max_flow(self):
        flow_dict = nx.max_flow_min_cost(self.graph, "source", "sink", weight="weight",capacity="capacity")
        return  flow_dict
    


class Node:
    def __init__(self, user) -> None:
        self.id = user.id
        self.capacity = user.capacity
        self.driver = user.driver
    
    def __repr__(self) -> str:
        return f"Node({self.id}, {self.capacity}, {self.driver})"


        