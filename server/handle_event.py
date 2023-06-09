from .clustering import Cluster
from datetime import datetime, timedelta
from .db import db
from .models import Event
from sqlalchemy import and_


# Assuming you have an Event model defined and an engine object named "engine"
# Create a session

def handle_event():
# Calculate the current time and the time 36 hours from now
    current_time = datetime.now()

    end_time = current_time + timedelta(hours = 24)
    

    # Query events that occur within the specified time range
    events = db.session.query(Event).filter(and_( Event.time <= end_time, Event.time >= current_time)).all()
    # Print the events
    for event in events:
        event_users = event.attendees # TODO get users from event
        event_cluster = Cluster(event_users, event)
        driver_passenger_price = event_cluster.get_event_clusters()
        id_to_user = {attendee.user_id: attendee for attendee in event_users}
        for driver_id, passenger_id, price in driver_passenger_price:
            id_to_user[driver_id].assigned_passengers.append(id_to_user[passenger_id])
            id_to_user[driver_id].price = price
            id_to_user[passenger_id].assigned_driver = id_to_user[driver_id]
            id_to_user[passenger_id].price = price
            
    db.session.add(event)
    db.session.commit()





