from flask_sqlalchemy import SQLAlchemy
from pathlib import Path

this_folder = Path(__file__).parent
SQLITE_DATABASE_PATH = this_folder / "../project.db"

# create the extension
db = SQLAlchemy()

def init_db(app, debug: bool):
    # configure the SQLite database, relative to the app instance folder
    app.config["SQLALCHEMY_DATABASE_URI"] = f"sqlite:///{SQLITE_DATABASE_PATH}"
    # initialize the app with the extension
    db.init_app(app)

    with app.app_context():
        if debug:
            db.drop_all()
        db.create_all()
        if debug:
            from .test import create_db
            create_db(db)
