from os import path

import pandas as pd

import db
import helpers
import settings


def create_table_bdpm_cis(settings):
    bdpm_cis_path = download_bdpm_cis()
    df = load_to_df_bdpm_cis(bdpm_cis_path, settings["read_csv"])
    db.create_table_from_df(df, settings["to_sql"])


def download_bdpm_cis():
    url = settings.BDPM_CIS_URL
    tmp_folder = settings.TMP_FOLDER
    bdpm_cis_path = path.join(tmp_folder, "BDPM_CIS.txt")
    helpers.download_file_from_url(url, bdpm_cis_path)
    return bdpm_cis_path


def load_to_df_bdpm_cis(path, settings):
    args = {**{"filepath_or_buffer": path}, **settings}
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
    fpath = path.join(tmp_folder, "RSP_COMPO.txt")
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

def load_csv_to_df(_settings):
    fpath = helpers.find_file(settings.DATA_FOLDER, _settings["source"]["pattern"])
    # fix bug in pandas when setting type for index (see https://github.com/pandas-dev/pandas/issues/35816)
    read_csv_settings = _settings["read_csv"]
    index_col = read_csv_settings.get("index_col")
    dtype = read_csv_settings.get("dtype")
    cast_str_index = False
    if index_col and dtype and dtype[index_col] == str:
        cast_str_index = True
    if cast_str_index:
        del read_csv_settings["index_col"]
    args = {**{ "filepath_or_buffer": fpath}, **read_csv_settings}
    df = pd.read_csv(**args)
    if cast_str_index:
        df.set_index(index_col, drop=True, inplace=True)
    return df

def create_spe_conso_ordei_table(_settings): 
    df = load_csv_to_df(_settings[0])
    df = df.groupby("cis").sum()
    df["exposition"] = df["conso"].apply(helpers.get_exposition_level, type="specialite")
    df = df[["exposition"]]
    db.create_table_from_df(df, _settings[0]["to_sql"])


def create_spe_patients_sexe_table(_settings):
    df = load_csv_to_df(_settings[0])
    conso = df.groupby(["cis", "sexe"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["cis","sexe"])
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[1]["to_sql"])

def create_spe_patients_age_table(_settings):
    df = load_csv_to_df(_settings[0])
    conso = df.groupby(["cis", "age"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["cis","age"])
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[2]["to_sql"])

def create_substance_ordei_table(_settings):
    df = load_csv_to_df(_settings[0])
    df_by_years = df.groupby(["code", "annee"]).agg(conso_annee=("conso", "sum"), cas_annee=("cas", "sum"))
    df_by_years["exposition"] = df_by_years["conso_annee"].apply(helpers.get_exposition_level, type="substance")
    df_by_code = df_by_years.groupby("code").agg(conso=("conso_annee", "sum"), cas=("cas_annee", "sum"))
    final_df = df_by_years.join(df_by_code, on=["code"])
    final_df.reset_index(inplace=True, level=["annee"])
    db.create_table_from_df(final_df, _settings[0]["to_sql"])

def create_substance_patients_sexe_table(_settings):
    df = load_csv_to_df(_settings[0])
    df["sexe"] = df["sexe"].apply(lambda x: helpers.mapSexeToCode(x))
    conso = df.groupby(["code", "sexe"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["code","sexe"])
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[1]["to_sql"])


def create_substance_patients_age_table(_settings):
    df = load_csv_to_df(_settings[0])
    conso = df.groupby(["code", "age"])["conso"].sum().rename("conso")
    conso_pct = conso.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_patients")
    final_df = pd.merge(conso, conso_pct, on=["code","age"])
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[2]["to_sql"])


def create_substance_cas_sexe_table(_settings):
    df = load_csv_to_df(_settings[0])
    df["sexe"] = df["sexe"].apply(lambda x: helpers.mapSexeToCode(x))
    cas = df.groupby(["code", "sexe"])["cas"].sum().rename("cas")
    cas_pct = cas.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_cas")
    final_df = pd.merge(cas, cas_pct, on=["code","sexe"])
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[3]["to_sql"])


def create_substance_cas_age_table(_settings):
    df = load_csv_to_df(_settings[0])
    cas = df.groupby(["code", "age"])["cas"].sum().rename("cas")
    cas_pct = cas.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_cas")
    final_df = pd.merge(cas, cas_pct, on=["code","age"])
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[4]["to_sql"])



def create_notificateurs_table(_settings):
    df = load_csv_to_df(_settings)
    decla = df.groupby(["code", "notificateur"])["n_decla"].sum().rename("decla")
    decla_pct = decla.groupby(level=0).apply(lambda x: 100 * x/ float(x.sum())).rename("pourcentage_decla")
    final_df = pd.merge(decla, decla_pct, on=["code","notificateur"])
    final_df.reset_index(inplace=True, level=["notificateur"])
    db.create_table_from_df(final_df, _settings["to_sql"])


def create_substance_soclong_table(_settings):
    df = load_csv_to_df(_settings)
    total_case_per_sex_and_age = df.groupby(["code", "sexe", "age"]).agg({ "n_cas": "max"})
    total_case = total_case_per_sex_and_age.groupby("code").agg({ "n_cas": "sum" })
    decla_eff = df.groupby(["code", "soc_long"]).agg({ "n_decla_eff": "sum"}).reset_index(level="soc_long")
    final_df = pd.merge(total_case, decla_eff, left_index=True, right_on=["code"])
    final_df["pourcentage_cas"] = final_df.apply(lambda x: float(x.n_decla_eff * 100 / x.n_cas), axis=1, result_type="expand")
    # final_df.drop(["n_cas"], inplace=True, axis=1)
    db.create_table_from_df(final_df, _settings["to_sql"])

def create_hlt_table(_settings_soclong, _settings):
    df = load_csv_to_df(_settings)
    soclong_df = load_csv_to_df(_settings_soclong)
    total_case_per_sex_and_age = soclong_df.groupby(["code", "sexe", "age"]).agg({ "n_cas": "max"})
    total_cases = total_case_per_sex_and_age.groupby(["code"]).agg({ "n_cas": "sum" })
    hlt = df.groupby(["code", "soc_long", "effet_hlt"]).agg({"n_decla_eff_hlt": "sum"})
    hlt.reset_index(["effet_hlt", "soc_long"], inplace=True)
    final_df = pd.merge(total_cases, hlt, left_index=True, right_index=True)
    final_df["pourcentage_cas"] = final_df.apply(lambda x: float(x.n_decla_eff_hlt * 100 / x.n_cas), axis=1, result_type="expand")
    db.create_table_from_df(final_df, _settings["to_sql"])


# create_table_bdpm_cis(settings.files["bdpm_cis"])
# create_tables_rsp_compo(settings.files["rsp_compo"])
# create_table_atc(settings.files["atc"])
# create_table_cis_cip_bdpm(settings.files["cis_cip_bdpm"])



# create_spe_conso_ordei_table(settings.files["ordei_specialite"])
# create_spe_patients_sexe_table(settings.files["ordei_specialite"])
# create_spe_patients_age_table(settings.files["ordei_specialite"])
create_substance_ordei_table(settings.files["ordei_substance"])
# create_substance_patients_sexe_table(settings.files["ordei_substance"])
# create_substance_patients_age_table(settings.files["ordei_substance"])
# create_substance_cas_sexe_table(settings.files["ordei_substance"])
# create_substance_cas_age_table(settings.files["ordei_substance"])
# create_notificateurs_table(settings.files["ordei_notificateurs"])
# create_substance_soclong_table(settings.files["ordei_soclong"])
# create_hlt_table(settings.files["ordei_soclong"], settings.files["ordei_soclong_hlt"])
