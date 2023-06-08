from . import clustering
from .models.User import User
from .models.Event import Event, Attendee
import IPython
from datetime import datetime , timedelta

def create_db(db, interactive=False):
    events = list(db.session.execute(db.select(Event)).scalars())

    if not events:
        event = Event(
            name='game',
            time=datetime.now()+timedelta(hours=24),
            longtitude=30,
            latitude=30,
        )

        for i in range(100):
            user = User(
                name=f'user{i}',
                email=f'user{i}@gmail.com',
                latitude=37+i/1000,
                longitude=37+i/1000,
                gender=i%2,
            )
            db.session.add(user)
            db.session.commit()
            if i % 2 == 0:
                event.attendees.append(Attendee(user_id=user.id, is_driver=True, capacity=max(1,i%5), pick_up_latitude=user.latitude, pick_up_longtitude=user.longitude,gender=user.gender))
            else:
                event.attendees.append(Attendee(user_id=user.id, is_driver=False, capacity=0 , pick_up_latitude=user.latitude, pick_up_longtitude=user.longitude, gender = user.gender))

        db.session.add(event)
        db.session.commit()

        print('created event')

    if interactive:
        IPython.embed()


if __name__ == '__main__':
    from .db import db
    with db.app.app_context():
        create_db(db, interactive=True)
