import IPython
from flask import Flask, Response
import argparse
from flask_graphql import GraphQLView
from flask_apscheduler import APScheduler
from pathlib import Path
import requests
from flask_cors import CORS
import http.client
from .graphql import schema
from .db import db
from .handle_event import handle_event
from .test import create_mock_db
from . import locationSuccess

this_folder = Path(__file__).parent
SQLITE_DATABASE_PATH = this_folder / "../project.db"
FRONTEND_SERVER_HOST = "localhost:3000"
FRONTEND_BUILD_FOLDER = this_folder / "../build/"

class Config:
    SCHEDULER_API_ENABLED = True
    SQLALCHEMY_DATABASE_URI = f"sqlite:///{SQLITE_DATABASE_PATH}"


app = Flask(__name__, static_url_path="/blabla")
# app = Flask(__name__, static_url_path="", static_folder=FRONTEND_BUILD_FOLDER)
app.config.from_object(Config())
CORS(app)

scheduler = APScheduler()
scheduler.init_app(app)

@scheduler.task("cron", id="process_events", minute="*")
def process_events():
    print("~~~ Processing events ~~~")
    with app.app_context():
        handle_event()
    print("~~~ Done Processing events ~~~")


@app.route("/<path:path>")
def frontend_proxy(path):
    try:
        connection = http.client.HTTPConnection(FRONTEND_SERVER_HOST)
        connection.request("GET", "/" + path)
        response = connection.getresponse()
        data = response.read()
        connection.close()
        content = data.decode('utf-8')
        flask_response = Response(content, mimetype=response.headers["Content-Type"])
        flask_response.headers["Access-Control-Allow-Origin"] = "*"
        return flask_response
    except Exception as e:
        print(str(e))
        raise

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
