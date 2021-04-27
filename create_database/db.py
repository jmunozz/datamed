import time
from typing import Dict

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
        pwd=settings.DBPWD,
    )
    if not engine:
        engine = create_engine(url, echo=False)
    return engine


def create_table_from_df(df: pd.DataFrame, _settings: Dict):
    engine = connect_db()
    start_time = time.time()
    args = {**{"con": engine}, **_settings}
    print(args["name"])
    df.to_sql(**args)
    print("--------- %s seconds ---------" % round(time.time() - start_time, 2))
