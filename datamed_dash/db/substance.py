from . import fetch_data


def list_substances(substances_codes_list):
    substances_df = fetch_data.fetch_table("substance", "code")
    df = substances_df.loc[substances_codes_list]
    return df