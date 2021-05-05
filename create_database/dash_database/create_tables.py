from typing import Dict
from os import path

import pandas as pd
from sqlalchemy.types import Integer, Text, Date

import paths
from models import connect_db
from ordei import Ordei
from utils import upload_cis_from_bdpm, upload_compo_from_rsp, upload_cis_cip_from_bdpm
import helpers
import settings

engine = connect_db()
connection = engine.connect()

EXPOSITION = {
    "spécialité": {1000: 1, 5000: 2, 15000: 3, 50000: 4},
    "substance": {5000: 1, 25000: 2, 100000: 3, 500000: 4},
}


def push_to_table(df: pd.DataFrame, table_name: str, dtypes_dict: Dict):
    """
    Push dataframe to table
    """
    df.to_sql(
        table_name,
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype=dtypes_dict,
    )


def create_specialite_table():
    """
    Table specialite, listing all possible CIS codes
    """
    df_cis = upload_cis_from_bdpm(paths.P_CIS_BDPM)

    # Add atc class to df_cis dataframe
    df_atc = pd.read_excel(
        paths.P_CIS_ATC, names=["cis", "atc", "nom_atc"], header=0, dtype={"cis": str}
    )
    df_atc.nom_atc = df_atc.nom_atc.str.lower()

    df_cis = df_cis.merge(df_atc, on="cis", how="left")
    df_cis = df_cis.where(pd.notnull(df_cis), None)

    push_to_table(
        df_cis,
        "specialite",
        {
            "cis": Text,
            "nom": Text,
            "forme_pharma": Text,
            "voie_admin": Text,
            "atc": Text,
            "nom_atc": Text,
            "statut_amm": Text,
            "type_amm": Text,
            "etat_commercialisation": Text,
            "date_amm": Date,
            "statut_bdpm": Text,
            "num_autorisation": Text,
            "titulaires": Text,
            "surveillance_renforcee": Text,
        },
    )


def create_substance_table():
    """
    Table substance_active
    """
    df_api = upload_compo_from_rsp(paths.P_COMPO_RSP)
    df_api = df_api[df_api.nature_composant == "SA"]
    df_api = df_api.rename(columns={"substance_active": "nom"})
    df_api = df_api[["code", "nom"]]
    df_api = df_api.drop_duplicates(["code"], keep="last")

    push_to_table(
        df_api,
        "substance",
        {
            "id": Integer,
            "code": Text,
            "nom": Text,
        },
    )


def create_spe_substance_table():
    """
    Table specialite_substance
    """
    df = upload_compo_from_rsp(paths.P_COMPO_RSP)
    df = df[df.nature_composant == "SA"]
    df = df[["cis", "code", "elem_pharma", "dosage", "ref_dosage"]]
    df = df.rename(columns={"code": "code_substance"})
    df = df.drop_duplicates()

    push_to_table(
        df,
        "specialite_substance",
        {
            "cis": Text,
            "code_substance": Text,
            "elem_pharma": Text,
            "dosage": Text,
            "ref_dosage": Text,
        },
    )


def create_presentation_table():
    """
    Table listing all possible presentations (CIP13), with corresponding CIS code
    From BDPM
    (In RSP, some CIP13 are linked to multiple CIS, ex: 3400936432826 -> 60197246 & 69553494)
    """
    df = upload_cis_cip_from_bdpm(paths.P_CIS_CIP_BDPM)
    df = df.where(pd.notnull(df), None)

    push_to_table(
        df,
        "presentation",
        {
            "cis": Text,
            "cip13": Text,
            "nom": Text,
            "taux_remboursement": Text,
        },
    )


def save_to_database():
    """
    Push data into database tables
    """
    create_specialite_table()

    create_substance_table()

    create_spe_substance_table()

    create_presentation_table()

    ordei = Ordei()
    ordei.create_ordei_tables()
