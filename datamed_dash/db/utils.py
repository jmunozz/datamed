import os

from sqlalchemy import create_engine

engine = None


def connect_db():
    global engine
    # On Heroku DATABASE_URL is automatically populated with postgres plugin url connection
    url = os.environ.get("DB_URL")
    if not engine:
        engine = create_engine(url)
    return engine
