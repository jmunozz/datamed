from os import path

import pandas as pd
from tqdm import tqdm

import db
import erreurs_med as em
import helpers
import settings

engine = db.connect_db()
conn = engine.connect()


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


def load_to_df_bdpm_cis(fpath, settings):
    args = {**{"filepath_or_buffer": fpath}, **settings}
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
    fpath = path.join(tmp_folder, "RSP_COMPO.txt")
    helpers.download_file_from_url(url, fpath)
    return fpath


def load_to_df_rsp_compo(fpath, settings):
    args = {**{"filepath_or_buffer": fpath}, **settings}
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


def find_emed(pattern):
    return helpers.list_files(settings.DATA_FOLDER, pattern)[0]


def load_to_df_emed(fpath, settings) -> pd.DataFrame:
    args = {**{"io": fpath}, **settings["read_excel"]}
    df = pd.read_excel(**args)

    # Cleaning
    df = df[~df.denomination.isna()]
    df.denomination = df.denomination.apply(lambda x: x.lower().strip() if x else None)
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: settings["noms_lieux"].get(x, x))

    df[settings["no_info"]] = df[settings["no_info"]].where(
        pd.notnull(df), "Non renseigné"
    )
    df.population_erreur = df.population_erreur.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: "Non renseigné" if x == "NR" else x)
    df.effet_indesirable = df.effet_indesirable.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.gravite = df.gravite.apply(lambda x: "Non renseigné" if x == "NR" else x)
    df.initial_erreur = df.initial_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.nature_erreur = df.nature_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.cause_erreur = df.cause_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    return df


def create_table_emed(_settings):
    fpath = find_emed(_settings["source"]["pattern"])
    if fpath.exists():
        df = load_to_df_emed(fpath, _settings)
        df["produit_denom"] = df.denomination.apply(em.get_produit_denom)
        df["forme_denom"] = df.denomination.apply(em.get_forme_denom)

        df_spe = pd.read_sql("specialite", conn)
        df_spe = df_spe.set_index("cis")

        df_corresp = em.get_corresp_df(df, df_spe)
        args = {**{"name": "cis_erreurs_med_corresp"}, **_settings["to_sql"]}
        db.create_table_from_df(df_corresp, args)

        for table_name, table_columns in tqdm(_settings["tables"].items()):
            print("{} table creation".format(table_name))
            df_table = em.get_table_df(df, df_spe, table_columns)
            args = {
                **{"name": "erreur_med_{}".format(table_name)},
                **_settings["to_sql"],
            }
            db.create_table_from_df(df_table, args)


create_table_bdpm_cis(settings.files["bdpm_cis"])
create_table_rsp_compo(settings.files["rsp_compo"])
create_table_atc(settings.files["atc"])
create_table_emed(settings.files["erreurs_med"])
