from ..db import db


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String)
    gender = db.Column(db.Integer)
    # cars: list[str]
    # locations: list[tuple[float, float]]
