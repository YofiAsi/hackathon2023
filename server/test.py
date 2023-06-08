from .app import app
from .db import db
from . import clustering
from .models.User import User
from .models.Event import Event, EventUsers
from datetime import datetime

with app.app_context():
    for i in range(100):
        user = User(
            name=f'user{i}',
            email=f'user{i}@gmail.com',
        )
        db.session.add(user)

    event = Event(
        name='game',
        time=datetime.now(),
        longtitude=30,
        latitude=30,
    )
    db.session.add(event)

    # db.session.add(EventUsers(event_id=1, user_id=1))

    db.session.commit()
