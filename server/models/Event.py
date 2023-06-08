from ..db import db

EventUsers = db.Table(
    "event_users",
    db.Model.metadata,
    db.Column("event_id", db.ForeignKey("event.id")),
    db.Column("user_id", db.ForeignKey("user.id")),
)

class Event(db.Model):
    __tablename__ = 'event'

    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    longtitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)

# class EventUser(db.Model):
#     event_id = db.Column(db.Integer, db.ForeignKey('event.id'))
#     user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     is_driver = db.Column(db.Boolean, nullable=False)

# class Passengers(db.Model):
#     driver_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     passenger_id = db.Column(db.Integer, db.ForeignKey('user.id'))
#     pick_up_longtitude = db.Column(db.Float)
#     pick_up_latitude = db.Column(db.Float)
