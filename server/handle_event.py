import clustering
from datetime import datetime, timedelta
from .db import db

# Assuming you have an Event model defined and an engine object named "engine"
# Create a session


# Calculate the current time and the time 36 hours from now
current_time = datetime.now()
end_time = current_time + timedelta(hours=36)

# Query events that occur within the specified time range
events = db.session.query(Event).filter(and_(Event.time >= current_time, Event.time <= end_time)).all()

# Print the events
for event in events:
    print(event)


