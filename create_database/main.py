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


def create_tables_rsp_compo(settings):
    fpath = download_rsp_compo()
    # table substance
    df = load_to_df_rsp_compo_for_substance(fpath, settings[0]["read_csv"])
    db.create_table_from_df(df, settings[0]["to_sql"])
    # table specialite_substance
    df = load_to_df_rsp_compo_for_specialite_substance(fpath, settings[1]["read_csv"])
    db.create_table_from_df(df, settings[1]["to_sql"])



def download_rsp_compo():
    url = settings.RSP_COMPO_URL
    tmp_folder = settings.TMP_FOLDER
    fpath = path.join(tmp_folder, 'RSP_COMPO.txt')
    helpers.download_file_from_url(url, fpath)
    return fpath


def load_to_df_rsp_compo_for_substance(fpath, settings):
    args = {**{ "filepath_or_buffer": fpath}, **settings}
    df = pd.read_csv(**args)
    # Cleaning
    df = df[df.nature_composant == "SA"]
    df = df.rename(columns={"substance_active": "nom"})
    df = df[["nom"]]
    df = df[~df.index.duplicated(keep="first")]
    helpers.serie_to_lowercase(df, ["nom"])
    return df

def load_to_df_rsp_compo_for_specialite_substance(fpath, settings):
    args = {**{ "filepath_or_buffer": fpath}, **settings}
    df = pd.read_csv(**args)
    # Cleaning
    df = df[df.nature_composant == "SA"]
    df = df[["code", "elem_pharma", "dosage", "ref_dosage"]]
    df = df.rename(columns={"code": "code_substance"})
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

def find_cis_cip_bdpm(pattern):
    return helpers.list_files(settings.DATA_FOLDER, pattern)[0]

def load_to_df_cis_cip_bdpm(fpath, settings):
    args = {**{ "filepath_or_buffer": fpath },**settings}
    df = pd.read_csv(**args)
    #Cleaning
    df = df.drop(
    ["prix_medicament_euro", "chelou_1", "chelou_2", "indications_remboursement"],
    axis=1)
    df = df.where(pd.notnull(df), None)
    return df    


def create_table_cis_cip_bdpm(settings):
    fpath = find_cis_cip_bdpm(settings["source"]["pattern"])
    df = load_to_df_cis_cip_bdpm(fpath, settings["read_csv"])
    db.create_table_from_df(df, settings["to_sql"])


## ORDEI



def load_to_df_ordei_specialite(_settings):
    fpath = helpers.find_file(settings.DATA_FOLDER, _settings["source"]["pattern"])
    args = {**{ "filepath_or_buffer": fpath}, **_settings["read_csv"]}
    df = pd.read_csv(**args)
    return df

def load_to_df_ordei_substance(_settings):
    fpath = helpers.find_file(settings.DATA_FOLDER, _settings["source"]["pattern"])
    args = {**{ "filepath_or_buffer": fpath}, **_settings["read_csv"]}
    df = pd.read_csv(**args)
    return df

def create_spe_conso_ordei_table(_settings): 
    df = load_to_df_ordei_specialite(_settings[0])
    df = df.groupby("cis").sum()
    df["exposition"] = df["conso"].apply(helpers.get_exposition_level, type="specialite")
    df = df[["exposition"]]
    db.create_table_from_df(df, _settings[0]["to_sql"])


def create_spe_patients_sexe_table(_settings):
    df = load_to_df_ordei_specialite(_settings[0])
    conso = df.groupby(["cis", "sexe"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["cis","sexe"])
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[1]["to_sql"])

def create_spe_patients_age_table(_settings):
    df = load_to_df_ordei_specialite(_settings[0])
    conso = df.groupby(["cis", "age"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["cis","age"])
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[2]["to_sql"])

def create_substance_ordei_table(_settings): 
    df = load_to_df_ordei_substance(_settings)
    years = df.groupby(["code", "annee"]).agg({"conso": "sum", "cas": "sum"})
    years.drop(years[years.cas <= 10].index, inplace=True)
    years.drop(years[years.conso <= 10].index, inplace=True)
    years["exposition"] = years["conso"].apply(helpers.get_exposition_level, type="substance")
    case_ratio = df.groupby(["code"]).sum({"conso": "sum", "cas": "sum"}).apply(lambda x: float(x.cas * 10000 / x.conso), axis=1).rename("taux_cas")
    final_df = years.join(case_ratio, on=["code"])
    final_df.rename(columns={"conso": "conso_annee", "cas": "cas_annee"}, inplace=True)
    final_df.reset_index(inplace=True, level=["annee"])
    db.create_table_from_df(final_df, _settings["to_sql"])

# def create_spe_patients_age_table(settings):
# def create_substance_ordei_table(settings):
# def create_substance_patients_sexe_table(settings):
# def create_substance_patients_age_table(settings):
# def create_substance_cas_sexe_table(settings):
# def create_substance_cas_age_table(settings):
# def create_notificateurs_table(settings):
# def create_substance_soclong_table(settings):
# def create_hlt_table(settings):




# create_table_bdpm_cis(settings.files["bdpm_cis"])
# create_tables_rsp_compo(settings.files["rsp_compo"])
# create_table_atc(settings.files["atc"])
# create_table_cis_cip_bdpm(settings.files["cis_cip_bdpm"])



# create_spe_conso_ordei_table(settings.files["ordei_specialite"])
# create_spe_patients_sexe_table(settings.files["ordei_specialite"])
# create_spe_patients_age_table(settings.files["ordei_specialite"])
create_substance_ordei_table(settings.files["ordei_substance"])
# create_substance_patients_sexe_table(settings[""])
# create_substance_patients_age_table(settings[""])
# create_substance_cas_sexe_table(settings[""])
# create_substance_cas_age_table(settings[""])
# create_notificateurs_table(settings[""])
# create_substance_soclong_table(settings[""])
# create_hlt_table(settings[""])