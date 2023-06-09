import IPython
from flask import Flask, redirect, url_for
import argparse
from flask_graphql import GraphQLView
from flask_apscheduler import APScheduler
from pathlib import Path
from .graphql import schema
from .db import db
from .handle_event import handle_event
from .test import create_mock_db
from . import locationSuccess

this_folder = Path(__file__).parent
SQLITE_DATABASE_PATH = this_folder / "../project.db"

class Config:
    SCHEDULER_API_ENABLED = True
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_DATABASE_PATH}"


app = Flask(__name__)
app.config.from_object(Config())

scheduler = APScheduler()
scheduler.init_app(app)

@scheduler.task("cron", id="process_events", minute="*")
def process_events():
    print("~~~ Processing events ~~~")
    with app.app_context():
        handle_event()


@app.route("/")
def crust():
    return redirect(url_for("graphql"))

app.add_url_rule("/graphql", view_func=GraphQLView.as_view("graphql", schema=schema, graphiql=True))
app.register_blueprint(locationSuccess.bp, url_prefix="/locationSuccess")


def main():
    parser = argparse.ArgumentParser()
    parser.add_argument("command", choices=["start", "process-events", "test"])
    parser.add_argument("--production", action="store_false", dest="debug")
    args = parser.parse_args()

    db.init_app(app)

    with app.app_context():
        # reset DB and create mock if in debug
        if args.debug:
            db.drop_all()

        db.create_all()

        if args.debug:
            create_mock_db(db)

    if args.command == "start":
        scheduler.start()
        app.run(debug=args.debug)
    elif args.command == "process-events":
        process_events()
    elif args.command == "test":
        # open a console with a db connection
        with app.app_context():
            IPython.embed()

if __name__ == "__main__":
    main()
