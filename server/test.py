from .models.User import User
from .models.Event import Event, Attendee
from datetime import datetime, timedelta

def create_mock_db(db):
    events = list(db.session.execute(db.select(Event)).scalars())

    if not events:
        event = Event(
            name='game',
            time=datetime.now()+timedelta(hours=24),
            longtitude=37,
            latitude=37,
        )

        for i in range(20):
            user = User(
                name=f'user{i}',
                email=f'user{i}@gmail.com',
                latitude=37+(i+1)/1000,
                longitude=37+(i+1)/1000,
                gender=i%2,
            )
            db.session.add(user)
            db.session.commit()

            if i % 2 == 0:
                event.attendees.append(Attendee(
                    user_id=user.id,
                    is_driver=True,
                    capacity=max(1, i%5),
                    pick_up_latitude=user.latitude,
                    pick_up_longtitude=user.longitude,
                    gender=user.gender,
                    price=0,
                    assigned_passengers=[],
                ))
            else:
                event.attendees.append(Attendee(
                    user_id=user.id,
                    is_driver=False,
                    capacity=0,
                    pick_up_latitude=user.latitude,
                    pick_up_longtitude=user.longitude,
                    gender=user.gender,
                ))
                event.attendees[-1].assigned_driver = event.attendees[0]

        db.session.add(event)
        db.session.commit()
