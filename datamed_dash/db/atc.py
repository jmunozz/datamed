from . import fetch_data


def list_atc(cis):
    specialite_atc_df = fetch_data.fetch_table("specialite_atc", "cis")
    return specialite_atc_df.loc[[cis]]
