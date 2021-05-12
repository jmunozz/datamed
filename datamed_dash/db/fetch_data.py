import app
import pandas as pd

from . import utils


#@app.cache.memoize(3000)
def fetch_table(table_name, index_col):
    engine = utils.connect_db()
    return pd.read_sql_table(table_name, engine, index_col=index_col)


def transform_df_to_series_list(df):
    if isinstance(df, pd.DataFrame):
        return [x[1] for x in df.iterrows()]
    elif isinstance(df, pd.Series):
        return [df]


def get_one_value(df, index, column):
    return df.at[index, column][0]


def return_sub_df_or_none(df, key):
    # use of [[]] always return a df otherwise, could be a series
    if isinstance(key, str):
        key = [key]
    try:
        df = df.loc[df.index.intersection(key)]
        return None if df.empty else df
    except KeyError:
        return None


# return the index column of a dataframe as a list
def as_index_list(df):
    return df.index.values


# return the first row of a dataframe as a series
def as_series(df):
    return df.iloc[0]


def get_df_len(df):
    return len(df.index)
