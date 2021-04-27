
from . import fetch_data

def list_specialite():
    return fetch_data.fetch_table("specialite", "cis")

def list_specialite_substances(cis):
    substances_df = fetch_data.fetch_table("specialite_substance", "cis")
    df = substances_df.loc[cis]
    return df