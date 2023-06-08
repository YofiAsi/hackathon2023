import pandas as pd
from mapbox import Geocoder
from .db import db
from .models import Event
import requests
from flask import Blueprint, request

bp = Blueprint("locationSuccess", __name__)
MAX_RADIUS = float('inf')
ACCESS_TOKEN = "pk.eyJ1IjoiZG9yZmFsYWgiLCJhIjoiY2xpbXg5Mm5pMHZlODNmbW1lbmhqa2o2ciJ9.8L61s6cS4pxPs3iqE7h2CQ"

@bp.route("/calculate")
def get_location_success():
    user_latitude = float(request.args["latitude"])
    user_longitude = float(request.args["longitude"])
    event_id = int(request.args["event_id"])
    # event = db.session.execute(db.select(Event).where(Event.id == event_id)).scalar()
    event = Event.query.get(event_id)
    return str(calc_success(user_latitude, user_longitude, event))

def read_population(): # read population data from csv file and add colum names
    df = pd.read_csv("data\Population.csv")
    df.columns = ['Population', 'City']
    return df

def location_population(latitude, longitude):
    df = read_population()
    # Define your Mapbox API access token
    # Create a geocoder object
    geocoder = Geocoder(access_token=ACCESS_TOKEN)
    
    # Query the Mapbox Geocoding API
    response = geocoder.reverse(lon=longitude, lat=latitude)

    # Extract the city from the response
    if response.status_code != 200 or len(response.geojson()['features']) == 0:
        print("Unable to retrieve city information")
        return 30

    features = response.geojson()['features']
    city = features[0]['context'][0]['text']
    population = df.loc[df['City'] == city]['Population']
    if not population.values:
        print("Unable to retrieve city information")
        return 30
    population = population.values[0]
    population = int(population.replace(',', ''))
    return population//10000



def people_in_radius(user_latitude, user_longitude, event: Event):
    nearby_users = 0
    attendes = event.attendees
    print("len of attendees", len(attendes))
    for attendee in attendes:
        passenger = attendee.user
        passenger_latitude = passenger.latitude
        passenger_longitude = passenger.longitude
        url = f'https://api.mapbox.com/directions/v5/mapbox/driving/{user_longitude},{user_latitude};{passenger_longitude},{passenger_latitude}?alternatives=true&access_token={ACCESS_TOKEN}'
        response = requests.get(url,verify=False)
        data = response.json()
        # print(data)
        distance = data['routes'][0]['distance']
        if distance < MAX_RADIUS:
            nearby_users += 1
    return nearby_users


def calc_success(user_latitude, user_longitude, event: Event):
    population_success = location_population(user_latitude, user_longitude)
    nearby_users = people_in_radius(user_latitude, user_longitude, event)
    print(population_success, nearby_users)
    return population_success + nearby_users
# location_population(32.1149298675333, 34.808149837601405)    
