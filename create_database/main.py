from os import path

import pandas as pd

import db
import settings
import helpers
from sqlalchemy.types import Integer, Text, Date


def create_table_bdpm_cis(settings):
    bdpm_cis_path = download_bdpm_cis()
    df = load_to_df_bdpm_cis(bdpm_cis_path, settings["read_csv"])
    db.create_table_from_df(df, settings["to_sql"])


def download_bdpm_cis(): 
    url = settings.BDPM_CIS_URL
    tmp_folder = settings.TMP_FOLDER
    bdpm_cis_path = path.join(tmp_folder, 'BDPM_CIS.txt')
    helpers.download_file_from_url(url, bdpm_cis_path)
    return bdpm_cis_path


def load_to_df_bdpm_cis(path, settings):
    args = {**{ "filepath_or_buffer": path}, **settings}
    df = pd.read_csv(**args)
    # Put substance_active field in lower case
    helpers.serie_to_lowercase(df, settings["names"])
    return df


create_table_bdpm_cis(settings.files["bdpm_cis"])