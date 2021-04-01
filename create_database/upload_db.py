import os
from datetime import datetime as dt
from typing import Dict

import pandas as pd
from sqlalchemy import create_engine

# Credentials to database connection
HOSTNAME = "localhost"
DBNAME = "rs_db"
UNAME = "root"
MYSQL_PWD = os.environ.get("MYSQL_PWD")


def upload_table_from_db(table_name: str) -> pd.DataFrame:
    """
    Upload fabrication_sites or atc or cis_compo tables
    :param table_name: name of the table
    ('fabrication_sites' or 'cis_compo' or 'atc' in rs_db database)
    :return: dataframe
    """
    engine = create_engine(
        "mysql+pymysql://{user}:{pw}@{host}/{db}".format(
            host=HOSTNAME, db=DBNAME, user=UNAME, pw=MYSQL_PWD
        ),
        echo=False,
    )

    # Load dataframe from database
    print("Start uploading {} table in dataframe...".format(table_name), end="\n")
    df = pd.read_sql("SELECT * FROM {}".format(table_name), con=engine)
    print("Finished!")
    return df


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


def upload_cis_from_bdpm(
    path: str = "./create_database/data/BDPM/CIS_bdpm.txt",
) -> pd.DataFrame:
    """
    Upload BDPM compositions database
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_bdpm.txt file and put in dataframe
    col_names = [
        "cis",
        "denomination_specialite",
        "forme_pharma",
        "voies_administration",
        "statut_amm",
        "type_amm",
        "etat_commercialisation",
        "date_amm",
        "statut_bdm",
        "num_autorisation_euro",
        "titulaires",
        "surveillance_renforcee",
    ]
    df = pd.read_csv(path, sep="\t", encoding="latin1", names=col_names, header=None)
    return df


def upload_cis_compo_from_bdpm(
    path: str = "./create_database/data/BDPM/CIS_COMPO_bdpm.txt",
) -> pd.DataFrame:
    """
    Upload BDPM compositions database
    In http://base-donnees-publique.medicaments.gouv.fr/telechargement.php
    :return: dataframe
    """
    # Read CIS_COMPO_bdpm.txt file and put in dataframe
    col_names = [
        "cis",
        "elem_pharma",
        "code_substance",
        "substance_active",
        "dosage",
        "ref_dosage",
        "nature_composant",
        "num_lien",
        "v",
    ]
    df = pd.read_csv(path, sep="\t", encoding="latin1", names=col_names, header=None)
    df = df.drop(["v"], axis=1)  # Remove v column, filled with NaN only
    # Put substance_active field in lower case
    df = clean_columns(df, "substance_active")
    return df


def upload_cis_cip_from_bdpm(
    path: str = "./create_database/data/BDPM/CIS_CIP_bdpm.txt",
) -> pd.DataFrame:
    """
    Upload BDPM compositions database
    In http://base-donnees-publique.medicaments.gouv.fr/telechargement.php
    Attention : 4 dernière colonnes retirées car pb d'écriture des nombres
    ex : comment transformer 4,768,73 en 4768,73 ?
    :return: dataframe
    """
    # Read CIS_CIP_bdpm.txt file and put in dataframe
    col_names = [
        "cis",
        "cip7",
        "libelle_presentation",
        "statut_admin_presentation",
        "etat_commercialisation",
        "date_declaration_commercialisation",
        "cip13",
        "agrement_collectivites",
        "taux_remboursement",
        "prix_medicament_euro",
        "chelou_1",
        "chelou_2",
        "indications_remboursement",
    ]
    df = pd.read_csv(path, sep="\t", encoding="latin1", names=col_names, header=None)
    # Retirer les 4 dernières colonnes
    df = df.drop(
        ["prix_medicament_euro", "chelou_1", "chelou_2", "indications_remboursement"],
        axis=1,
    )
    # Convertir les dates en format datetime
    df.date_declaration_commercialisation = df.date_declaration_commercialisation.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y")
    )
    return df


def upload_cis_from_rsp(
    path: str = "./create_database/data/RSP/CIS_RSP.txt",
) -> pd.DataFrame:
    """
    Upload RSP CIS table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "nom_spe_pharma",
        "forme_pharma",
        "voie_admin",
        "statut_amm",
        "type_amm",
        "etat_commercialisation",
        "code_doc",
    ]
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str},
    )
    # Put substance_active field in lower case
    df = clean_columns(df, "nom_spe_pharma")
    return df


def upload_compo_from_rsp(
    path: str = "./create_database/data/RSP/COMPO_RSP.txt",
) -> pd.DataFrame:
    """
    Upload RSP COMPO table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read COMPO_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "elem_pharma",
        "code_substance",
        "substance_active",
        "dosage",
        "ref_dosage",
        "nature_composant",
        "num_lien",
        "v",
    ]
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str, "code_substance": str},
    )
    df = df[~df.substance_active.isna()]
    # Put substance_active field in lower case
    df = clean_columns(df, "substance_active")
    return df


def upload_cis_cip_from_rsp(
    path: str = "./create_database/data/RSP/CIS_CIP_RSP.txt",
) -> pd.DataFrame:
    """
    Upload RSP compositions database
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_CIP_bdpm.txt file and put in dataframe
    col_names = [
        "cis",
        "cip7",
        "libelle_presentation",
        "statut_admin_presentation",
        "etat_commercialisation",
        "date_declaration_commercialisation",
        "cip13",
    ]
    df = pd.read_csv(path, sep="\t", encoding="latin1", names=col_names, header=None)
    # Convertir les dates en format datetime
    df.date_declaration_commercialisation = df.date_declaration_commercialisation.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y") if x != " " else None
    )
    return df


def get_api_by_cis() -> Dict:
    """
    Get substance_active (API) list for each CIS
    :return: dict of list
    """
    # Load dataframe
    df_bdpm = upload_table_from_db("cis_compo")
    # List CIS codes
    cis_list = df_bdpm.cis.unique()
    # Create dict of list
    api_by_cis = {
        str(cis): list(df_bdpm[df_bdpm.cis == cis].substance_active.unique())
        for cis in cis_list
    }
    return api_by_cis
