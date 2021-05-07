from app import cache

import pandas as pd
from .fetch_data import fetch_table, return_sub_df_or_none, as_index_list
from db import fetch_data

# cis can be a str or a list
@cache.memoize(300)
def get_specialite_df(cis):
    return return_sub_df_or_none(fetch_table("specialite", "cis"), cis)


def list_atc():
    return fetch_table("classes_atc", "code")


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


def get_erreur_med_population(cis):
    return return_sub_df_or_none(fetch_table("erreur_med_population", "cis"), cis)


def get_erreur_med_cause(cis):
    return return_sub_df_or_none(fetch_table("erreur_med_cause", "cis"), cis)


def get_erreur_med_nature(cis):
    return return_sub_df_or_none(fetch_table("erreur_med_nature", "cis"), cis)


def get_erreur_med_denom(cis):
    return return_sub_df_or_none(fetch_table("erreur_med_cis_denomination", "cis"), cis)


def get_exposition(cis):
    return return_sub_df_or_none(fetch_table("specialite_exposition", "cis"), cis)


def get_age_df(cis):
    return return_sub_df_or_none(
        fetch_table("specialite_patient_age_ordei", "cis"), cis
    )


def get_description_df(cis):
    return return_sub_df_or_none(fetch_table("description", "cis"), cis)


def get_atc_df(cis) -> pd.DataFrame:
    spe_atc_df = return_sub_df_or_none(fetch_table("specialite_atc", "cis"), cis)
    if spe_atc_df is None:
        return None
    return pd.merge(spe_atc_df, list_atc(), left_on="atc", right_index=True, how="left")


def list_substances(cis):
    from .substance import get_substance_df

    df_spe_sub = get_specialite_substance_df(cis)
    return get_substance_df(df_spe_sub["code_substance"].values)


def get_presentation_df(cis):
    return return_sub_df_or_none(fetch_table("presentation", "cis"), cis)


def list_ruptures(cis):
    df_presentation = get_presentation_df(cis)
    return get_ruptures_df(df_presentation["cip13"].values)


def get_ruptures_df(cips):
    return return_sub_df_or_none(fetch_table("ruptures", "cip13"), cips)
