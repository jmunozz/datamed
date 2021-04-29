from .fetch_data import fetch_table, return_sub_df_or_none


def list_substances(substances_codes_list):
    substances_df = fetch_table("substance", "code")
    df = substances_df.loc[substances_codes_list]
    return df


def get_age_df(code): 
    return return_sub_df_or_none(fetch_table("substance_patient_age_ordei", "code"), code)

def get_sexe_df(code): 
    return return_sub_df_or_none(fetch_table("substance_patient_sexe_ordei", "code"), code)

def get_exposition_df(code): 
    return return_sub_df_or_none(fetch_table("substance_exposition", "code"), code)