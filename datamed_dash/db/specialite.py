from app import cache
from db import substance

from .fetch_data import fetch_table, return_sub_df_or_none


@cache.memoize(300)
def get_specialite(cis):
    return list_specialite().loc[cis]


def list_specialite():
    return fetch_table("specialite", "cis")


def get_specialite_substance_df(cis):
    return return_sub_df_or_none(fetch_table("specialite_substance", "cis"), cis)


def get_sexe_df(cis):
    return return_sub_df_or_none(
        fetch_table("specialite_patient_sexe_ordei", "cis"), cis
    )


def get_erreur_med_effet_indesirable(cis):
    return return_sub_df_or_none(
        fetch_table("erreur_med_effet_indesirable", "cis"), cis
    )


def get_exposition(cis):
    return return_sub_df_or_none(fetch_table("specialite_exposition", "cis"), cis)


def get_age_df(cis):
    return return_sub_df_or_none(
        fetch_table("specialite_patient_age_ordei", "cis"), cis
    )


def list_substances(cis):
    df_spe_sub = get_specialite_substance_df(cis)
    return substance.list_substances(df_spe_sub["code_substance"])
