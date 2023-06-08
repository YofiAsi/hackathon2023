import requests
import json
 


ACCESS_TOKEN = 'pk.eyJ1IjoiZG9yZmFsYWgiLCJhIjoiY2xpbXg5Mm5pMHZlODNmbW1lbmhqa2o2ciJ9.8L61s6cS4pxPs3iqE7h2CQ'
MIN_DIST = 500
MINUTES = 60
ZERO_WEIGHT = 0
GENDER_WEIGHT = 5
WALK_PACE=85



def calc_dist_weight(driver_latitude:float,driver_longitude:float, passenger_latitude:float,passenger_longitude):
    url = f'https://api.mapbox.com/directions/v5/mapbox/driving/{driver_longitude},{driver_latitude};{passenger_longitude},{passenger_latitude}?alternatives=true&access_token={ACCESS_TOKEN}'
    response = requests.get(url,verify=False)
    data = response.json()
    distance = data['routes'][0]['distance']
    duration = data['routes'][0]['duration']/MINUTES
    if distance < MIN_DIST:
        return ZERO_WEIGHT
    return round(min(duration,distance/WALK_PACE),3)
    
def calc_gender_weight(driver_geneder:str,passenger_gender):
    if driver_geneder == passenger_gender:
        return ZERO_WEIGHT
    return GENDER_WEIGHT

def get_weight(driver,passenger):
    distance_weight = calc_dist_weight(driver.latitdude,driver.longitude,passenger.latitude,passenger.longitude)
    gender_weight = calc_gender_weight(driver.geneder,passenger.gender)
    return distance_weight + gender_weight   
 



origin_latitude = 32.110950
origin_longitude = 34.806691
destination_latitude = 32.783356
destination_longitude = 34.966765

url = f'https://api.mapbox.com/directions/v5/mapbox/driving/{origin_longitude},{origin_latitude};{destination_longitude},{destination_latitude}?alternatives=true&access_token={ACCESS_TOKEN}'

response = requests.get(url,verify=False)
data = response.json()

print(json.dumps(data,indent=4))
distance = data['routes'][0]['distance']
duration = data['routes'][0]['duration']

steps = data['routes'][0]['legs'][0]['steps']