from ..db import db


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    event_name = db.Column(db.String, unique=True, nullable=False)
    longtitude = db.Column(db.float)
    latitude = db.Column(db.float)
    event_time = db.Column(db.DateTime)
class EventUsers(db.Model):
    __tablename__ = 'EventUsers'

    event_id = db.Column(db.Integer, ForeignKey('event.id'))
    user_id = db.Column(db.Integer, ForeignKey('user.id'))
    driver = db.Column(db.Boolean, nullable=False)
    