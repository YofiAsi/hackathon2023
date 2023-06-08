from .app import app
from .db import db
from . import clustering
from .models.User import User
from .models.Event import Event, Attendee
import IPython
from datetime import datetime

with app.app_context():
    events = list(db.session.execute(db.select(Event)).scalars())

    if not events:
        event = Event(
            name='game',
            time=datetime.now(),
            longtitude=30,
            latitude=30,
        )

        for i in range(100):
            user = User(
                name=f'user{i}',
                email=f'user{i}@gmail.com',
            )
            db.session.add(user)
            db.session.commit()
            event.attendees.append(Attendee(user_id=user.id, is_driver=False))

        db.session.add(event)
        db.session.commit()

    IPython.embed()
