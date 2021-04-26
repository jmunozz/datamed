import pandas as pd
from sqlalchemy import create_engine

import settings

engine = None


def connect_db():
    global engine
    url = settings.DBURL or "mysql+pymysql://{user}:{pwd}@{host}/{db}".format(
                host=settings.DBHOSTNAME,
                db=settings.DBNAME,
                user=settings.DBUSERNAME,
                pwd=settings.DBPWD)
    if not engine:
        engine = create_engine(url, echo=False)
    return engine


def create_table_from_df(df: pd.DataFrame, settings):
    engine = connect_db()
    args = {**{"con": engine}, **settings}
    print(args)
    df.to_sql(**args)
