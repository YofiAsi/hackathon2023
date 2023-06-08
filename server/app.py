from flask import Flask, request
from .db import db, init_db
from .models import User

app = Flask(__name__)
init_db(app)

SUCCESS = "Okay"

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"

@app.route("/create", methods=["POST"])
def user_create():
    user = User(
        username=request.args["name"],
        email=request.args["email"],
        gender=request.args["gender"],
    )
    db.session.add(user)
    db.session.commit()

    return SUCCESS

@app.route("/user/<int:id>")
def user_detail(_id):
    user = db.get_or_404(User, _id)
    return user

@app.route("/user/<int:id>/delete", methods=["GET", "POST"])
def user_delete(id):
    user = db.get_or_404(User, id)

    if request.method == "POST" or request.method == "GET":
        db.session.delete(user)
        db.session.commit()

    return SUCCESS

@app.route("/test")
def test():
    users = db.session.execute(db.select(User).order_by(User.username)).scalars()
    return [user.id for user in users]

if __name__ == "__main__":
    app.run()
