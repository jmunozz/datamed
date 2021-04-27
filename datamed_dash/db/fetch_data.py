
import pandas as pd

from . import utils
import app

@app.cache.memoize(300)
def fetch_table(table_name, index_col):
    engine = utils.connect_db()
    return pd.read_sql_table(table_name, engine, index_col=index_col)