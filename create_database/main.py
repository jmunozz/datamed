from os import path
from pathlib import Path
import json

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
    helpers.serie_to_lowercase(df, settings["names"][1:])
    return df


def create_table_rsp_compo(settings):
    fpath = download_rsp_compo()
    df = load_to_df_rsp_compo(fpath, settings["read_csv"])
    db.create_table_from_df(df, settings["to_sql"])


def download_rsp_compo():
    url = settings.RSP_COMPO_URL
    tmp_folder = settings.TMP_FOLDER
    fpath = path.join(tmp_folder, 'RSP_COMPO.txt')
    helpers.download_file_from_url(url, fpath)
    return fpath


def load_to_df_rsp_compo(fpath, settings):
    args = {**{ "filepath_or_buffer": fpath}, **settings}
    df = pd.read_csv(**args)
    # Cleaning
    df = df[df.nature_composant == "SA"]
    df = df.rename(columns={"substance_active": "nom"})
    df = df[["nom"]]
    df = df[~df.index.duplicated(keep="first")]
    helpers.serie_to_lowercase(df, ["nom"])
    return df

def create_table_atc(settings):
    fpath = find_atc(settings["source"]["pattern"])
    if fpath.exists():
        df = load_to_df_atc(fpath)
        db.create_table_from_df(df, settings["to_sql"])

def find_atc(pattern): 
    return helpers.list_files(settings.DATA_FOLDER, pattern)[0]

def load_to_df_atc(fpath): 
    serie = pd.read_json(fpath, typ="series")
    df = serie.to_frame("label_atc")
    df.index.set_names(names="code_atc", inplace=True)
    return df

create_table_bdpm_cis(settings.files["bdpm_cis"])
create_table_rsp_compo(settings.files["rsp_compo"])
create_table_atc(settings.files["atc"])