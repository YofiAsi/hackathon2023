from ..db import db
from .User import User


class Event(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    time = db.Column(db.DateTime, nullable=False)
    longtitude = db.Column(db.Float, nullable=False)
    latitude = db.Column(db.Float, nullable=False)
    
    attendees = db.relationship("Attendee", back_populates="event")


class Attendee(db.Model):
    event_id = db.Column(db.Integer, db.ForeignKey("event.id"), primary_key=True)
    event = db.relationship(Event, foreign_keys=[event_id], back_populates="attendees")
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), primary_key=True)
    user = db.relationship(User, foreign_keys=[user_id])
    is_driver = db.Column(db.Boolean, nullable=False)
    capacity = db.Column(db.Integer)
    pick_up_longtitude = db.Column(db.Float)
    pick_up_latitude = db.Column(db.Float)
    gender = db.Column(db.Integer)

    assigned_driver_id = db.Column(db.Integer, db.ForeignKey("attendee.user_id"), primary_key=True, nullable=True)
    assigned_passengers = db.relationship("Attendee", foreign_keys=[assigned_driver_id], backref=db.backref("assigned_driver", remote_side=[user_id]))
