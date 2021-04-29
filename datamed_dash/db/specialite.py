from app import cache

from . import fetch_data


@cache.memoize(300)
def get_specialite(cis):
    return list_specialite().loc[cis]


def list_specialite():
    return fetch_data.fetch_table("specialite", "cis")


def list_specialite_substances(cis):
    substances_df = fetch_data.fetch_table("specialite_substance", "cis")
    df = substances_df.loc[[cis]]
    return df

def get_sexe_df(cis): 
    df = fetch_data.fetch_table("specialite_patient_sexe_ordei", "cis")
    return df.loc[cis]

def get_erreur_med_effet_indesirable(cis): 
    df = fetch_data.fetch_table("erreur_med_effet_indesirable", "cis")
    return df.loc[cis]
