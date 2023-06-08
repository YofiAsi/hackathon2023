from . import clustering
from .models.User import User
from .models.Event import Event, Attendee
import IPython
from datetime import datetime

def create_db(db, interactive=False):
    events = list(db.session.execute(db.select(Event)).scalars())

    if not events:
        event = Event(
            name='game',
            time=datetime.now(),
            longtitude=30,
            latitude=30,
        )

        for i in range(30):
            user = User(
                name=f'user{i}',
                email=f'user{i}@gmail.com',
                latitude=37,
                longitude=37,
            )
            db.session.add(user)
            db.session.commit()
            event.attendees.append(Attendee(user_id=user.id, is_driver=False))

        db.session.add(event)
        db.session.commit()

        print('created event')

    if interactive:
        IPython.embed()


if __name__ == '__main__':
    from .db import db
    with db.app.app_context():
        create_db(db, interactive=True)
