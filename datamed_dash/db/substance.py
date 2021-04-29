from .fetch_data import fetch_table, return_sub_df_or_none


def list_substances(substances_codes_list):
    substances_df = fetch_table("substance", "code")
    return return_sub_df_or_none(substances_df, substances_codes_list)


def get_df():
    return fetch_table("substance", "code")


def get_age_df(code):
    return return_sub_df_or_none(
        fetch_table("substance_patient_age_ordei", "code"), code
    )


def get_sexe_df(code):
    return return_sub_df_or_none(
        fetch_table("substance_patient_sexe_ordei", "code"), code
    )


def get_age_cas_df(code):
    return return_sub_df_or_none(fetch_table("substance_cas_age_ordei", "code"), code)


def get_sexe_cas_df(code):
    return return_sub_df_or_none(fetch_table("substance_cas_sexe_ordei", "code"), code)


def get_exposition_df(code):
    return return_sub_df_or_none(fetch_table("substance_exposition", "code"), code)


def get_decla_df(code):
    return return_sub_df_or_none(fetch_table("substance_ordei", "code"), code)


def get_notif_df(code):
    return return_sub_df_or_none(fetch_table("substance_notif_ordei", "code"), code)
