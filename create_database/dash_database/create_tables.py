import json
import zipfile
from datetime import datetime as dt
from typing import List, Dict

import pandas as pd
from sqlalchemy.orm import sessionmaker
from sqlalchemy.types import Integer, Text, String, Float

import paths
from models import connect_db

with zipfile.ZipFile(paths.P_NOTICE, "r") as z:
    filename = z.namelist()[0]
    with z.open(filename) as f:
        data = f.read()
        NOTICE = json.loads(data.decode("utf-8"))

engine = connect_db()  # establish connection
connection = engine.connect()
Session = sessionmaker(bind=engine)
session = Session()


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


def upload_cis_from_rsp(path: str) -> pd.DataFrame:
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
        "v",
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


def upload_compo_from_rsp(path: str) -> pd.DataFrame:
    """
    Upload RSP COMPO table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read COMPO_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "elem_pharma",
        "code",
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
        dtype={"cis": str, "code": str},
    )
    df = df[~df.substance_active.isna()]
    # Put substance_active field in lower case
    df = clean_columns(df, "substance_active")
    return df


def upload_cis_cip_from_bdpm(path: str) -> pd.DataFrame:
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
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str, "cip13": str},
    )
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


def get_specialite():
    """
    Table specialite, listing all possible CIS codes
    """
    df_cis = upload_cis_from_rsp(paths.P_CIS_RSP)

    # Add atc class to df_cis dataframe
    df_atc = pd.read_excel(
        paths.P_CIS_ATC, names=["cis", "atc", "nom_atc"], header=0, dtype={"cis": str}
    )
    df_atc.nom_atc = df_atc.nom_atc.str.lower()

    df_cis = df_cis.merge(df_atc, on="cis", how="left")
    df_cis = df_cis.where(pd.notnull(df_cis), None)
    df_cis = df_cis.rename(columns={"nom_spe_pharma": "nom"})

    df_cis.to_sql(
        "specialite",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "nom": Text,
            "forme_pharma": Text,
            "voie_admin": Text,
            "atc": Text,
            "nom_atc": Text,
            "statut_amm": Text,
            "type_amm": Text,
            "etat_commercialisation": Text,
        },
    )


def get_substance():
    """
    Table substance_active
    """
    df_api = upload_compo_from_rsp(paths.P_COMPO_RSP)
    df_api = df_api[df_api.nature_composant == "SA"]
    df_api = df_api.rename(columns={"substance_active": "nom"})
    df_api = df_api[["code", "nom"]]
    df_api = df_api.drop_duplicates(["code"], keep="last")

    df_api.to_sql(
        "substance",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "id": Integer,
            "code": String(120),
            "nom": Text,
        },
    )


def get_spe_substance():
    """
    Table specialite_substance
    """
    df = upload_compo_from_rsp(paths.P_COMPO_RSP)
    df = df[df.nature_composant == "SA"]
    df = df[["cis", "code", "elem_pharma", "dosage", "ref_dosage"]]
    df = df.rename(columns={"code": "code_substance"})
    df = df.drop_duplicates()

    df.to_sql(
        "specialite_substance",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "code_substance": Text,
            "elem_pharma": Text,
            "dosage": Text,
            "ref_dosage": Text,
        },
    )


def get_notice() -> List[Dict]:
    return NOTICE


def get_presentation():
    """
    Table listing all possible presentations (CIP13), with corresponding CIS code
    From BDPM
    (In RSP, some CIP13 are linked to multiple CIS, ex: 3400936432826 -> 60197246 & 69553494)
    """
    df = upload_cis_cip_from_bdpm(paths.P_CIS_CIP_BDPM)
    df = df.where(pd.notnull(df), None)

    df.to_sql(
        "presentation",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "cip13": String(120),
            "nom": Text,
            "taux_remboursement": Text,
        },
    )


def compute_pourcentage(
    df: pd.DataFrame, substance: pd.Series, key: str, field: str
) -> float:
    return substance[field] / df[df[key] == substance[key]][field].sum() * 100


def get_spe_ordei_dataframe() -> pd.DataFrame:
    df = pd.read_csv(
        "~/Documents/GitHub/datamed/ordei/data/open_medic2014_2018_cis_agg.csv",
        sep=";",
        dtype={"codeCIS": str},
    )
    df = df.drop(["Unnamed: 0", "sexe"], axis=1)
    return df.rename(
        columns={
            "codeCIS": "cis",
            "AGE": "age",
            "n_conso_14_18": "conso",
            "SEXE": "sexe",
        }
    )


def get_spe_conso_ordei():
    df = get_spe_ordei_dataframe()

    df = df.groupby("cis")["conso"].sum().reset_index()

    df.to_sql(
        "specialite_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "conso": Integer,
        },
    )


def get_spe_patients_sexe():
    df = get_spe_ordei_dataframe()

    df_sexe = (
        df.groupby(["cis", "sexe"])
        .agg({"conso": "sum"})
        .groupby(["cis", "sexe"])
        .agg({"conso": "sum"})
        .reset_index()
    )
    df_sexe["pourcentage_patients"] = df_sexe.apply(
        lambda x: compute_pourcentage(df_sexe, x, "cis", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    df.to_sql(
        "specialite_patient_sexe_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "sexe": String(120),
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def get_spe_patients_age():
    df = get_spe_ordei_dataframe()

    df_age = (
        df.groupby(["cis", "age"])
        .agg({"conso": "sum"})
        .groupby(["cis", "age"])
        .agg({"conso": "sum"})
        .reset_index()
    )
    df_age["pourcentage_patients"] = df_age.apply(
        lambda x: compute_pourcentage(df_age, x, "cis", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    df.to_sql(
        "specialite_patient_age_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "cis": String(120),
            "age": String(120),
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def get_substance_dataframe() -> pd.DataFrame:
    df = pd.read_csv(
        "~/Documents/GitHub/datamed/ordei/data/bnpv_open_medic1418_sa_codex.csv",
        encoding="ISO-8859-1",
        sep=";",
        dtype={"codeSubstance": str},
    )
    df = df.drop("Unnamed: 0", axis=1)

    return df.rename(
        columns={
            "ANNEE": "annee",
            "SEXE": "sexe",
            "AGE": "age",
            "SUBSTANCE_CODEX_UNIQUE": "substance",
            "codeSubstance": "code",
            "n_conso": "conso",
            "n_cas": "cas",
        }
    )


def get_substance_annee():
    df_sa_patients = get_substance_dataframe()

    df_annee = (
        df_sa_patients.groupby(["code", "annee"])
        .agg({"conso": "sum", "cas": "sum"})
        .reset_index()
    )
    df_annee["conso_annee"] = df_annee.conso.apply(lambda x: x if x >= 10 else None)
    df_annee["cas_annee"] = df_annee.cas.apply(lambda x: x if x >= 10 else None)
    df_annee = df_annee.drop(["conso", "cas"], axis=1)

    df = (
        df_sa_patients.groupby(["code", "annee"])
        .agg({"conso": "sum", "cas": "sum"})
        .groupby("code")
        .agg({"conso": "sum", "cas": "sum"})
        .reset_index()
    )
    df.cas = df.cas.apply(lambda x: x if x >= 10 else None)
    df["taux_cas"] = df.apply(
        lambda x: x.cas * 100000 / x.conso if x.cas >= 10 else None, axis=1
    )

    df = df.merge(df_annee, on="code", how="left")

    df.to_sql(
        "substance_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "conso": Integer,
            "cas": Integer,
            "taux_cas": Float,
            "annee": Integer,
            "conso_annee": Integer,
            "cas_annee": Integer,
        },
    )


def get_substance_patients_sexe():
    df = get_substance_dataframe()

    df_sexe = (
        df.groupby(["code", "annee", "sexe"])
        .agg({"conso": "sum"})
        .groupby(["code", "sexe"])
        .agg({"conso": "sum"})
        .reset_index()
    )
    df_sexe["pourcentage_patients"] = df_sexe.apply(
        lambda x: compute_pourcentage(df_sexe, x, "code", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    df_sexe = df_sexe[["code", "sexe", "pourcentage_patients"]]

    df_sexe.to_sql(
        "substance_patient_sexe_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "sexe": String(120),
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def get_substance_patients_age():
    df = get_substance_dataframe()

    df_age = (
        df.groupby(["code", "annee", "age"])
        .agg({"conso": "sum"})
        .groupby(["code", "age"])
        .agg({"conso": "sum"})
        .reset_index()
    )
    df_age["pourcentage_patients"] = df_age.apply(
        lambda x: compute_pourcentage(df_age, x, "code", "conso")
        if x.conso > 10
        else None,
        axis=1,
    )
    df_age = df_age[["code", "age", "pourcentage_patients"]]

    df_age.to_sql(
        "substance_patient_age_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "age": String(120),
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def get_substance_cas_sexe():
    df = get_substance_dataframe()

    df_sexe = (
        df.groupby(["code", "annee", "sexe"])
        .agg({"cas": "sum"})
        .groupby(["code", "sexe"])
        .agg({"cas": "sum"})
        .reset_index()
    )
    df_sexe["pourcentage_cas"] = df_sexe.apply(
        lambda x: compute_pourcentage(df_sexe, x, "code", "cas")
        if x.cas > 10
        else None,
        axis=1,
    )

    df_sexe = df_sexe[["code", "sexe", "pourcentage_cas"]]

    df_sexe.to_sql(
        "substance_cas_sexe_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "sexe": String(120),
            "cas": Integer,
            "pourcentage_cas": Float,
        },
    )


def get_substance_cas_age():
    df = get_substance_dataframe()

    df_age = (
        df.groupby(["code", "annee", "age"])
        .agg({"cas": "sum"})
        .groupby(["code", "age"])
        .agg({"cas": "sum"})
        .reset_index()
    )
    df_age["pourcentage_cas"] = df_age.apply(
        lambda x: compute_pourcentage(df_age, x, "code", "cas")
        if x.cas >= 10
        else None,
        axis=1,
    )
    df_age = df_age[["code", "age", "pourcentage_cas"]]

    df_age.to_sql(
        "substance_cas_age_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "age": String(120),
            "cas": Integer,
            "pourcentage_cas": Float,
        },
    )


def get_notificateurs():
    df = pd.read_csv(
        "~/Documents/GitHub/datamed/ordei/data/bnpv_notif_sa_codex_open.csv",
        encoding="ISO-8859-1",
        sep=";",
        dtype={"codeSubstance": str},
    )
    df = df.drop("Unnamed: 0", axis=1)

    df = df.rename(
        columns={
            "TYP_NOTIF": "notificateur",
            "SEXE": "sexe",
            "AGE": "age",
            "SUBSTANCE_CODEX_UNIQUE": "substance_active",
            "codeSubstance": "code",
        }
    )

    df_notif = (
        df.groupby(["code", "notificateur"]).agg({"n_decla": "sum"}).reset_index()
    )
    df_notif["pourcentage_notif"] = df_notif.apply(
        lambda x: compute_pourcentage(df_notif, x, "code", "n_decla")
        if x.n_decla >= 10
        else None,
        axis=1,
    )
    df_notif = df_notif[["code", "notificateur", "pourcentage_notif"]]

    df_notif.to_sql(
        "substance_notif_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "notificateur": Text,
            "pourcentage_notif": Float,
        },
    )


def get_substance_soclong_dataframe() -> pd.DataFrame:
    df = pd.read_csv(
        "~/Documents/GitHub/datamed/ordei/data/bnpv_eff_soclong_sa_codex_open.csv",
        encoding="ISO-8859-1",
        sep=";",
        dtype={"codeSubstance": str},
    )
    df = df.drop("Unnamed: 0", axis=1)

    df = df.rename(
        columns={
            "SEXE": "sexe",
            "AGE": "age",
            "SOC_LONG": "soc_long",
            "SUBSTANCE_CODEX_UNIQUE": "substance_active",
            "codeSubstance": "code",
        }
    )

    temp = df.groupby(["code", "soc_long"]).agg({"n_decla_eff": "sum"}).reset_index()
    temp2 = (
        df.drop_duplicates(subset=["code", "age", "sexe", "n_cas"])
        .groupby("code")
        .agg({"n_cas": "sum"})
        .reset_index()
    )

    return temp.merge(temp2, on="code", how="left")


def get_substance_soclong():
    df = get_substance_soclong_dataframe()
    df["pourcentage_cas"] = (df.n_decla_eff / df.n_cas) * 100
    df.pourcentage_cas = df.apply(
        lambda x: x.pourcentage_cas if x.n_decla_eff >= 10 else None, axis=1
    )
    return df[["code", "soc_long", "pourcentage_cas"]].sort_values(
        by=["pourcentage_cas"], ascending=False
    )


def get_hlt():
    df_soclong = get_substance_soclong_dataframe()
    df = pd.read_csv(
        "~/Documents/GitHub/datamed/ordei/data/bnpv_eff_hlt_soclong_sa_codex_open.csv",
        encoding="ISO-8859-1",
        sep=";",
        dtype={"codeSubstance": str},
    )
    df = df.drop("Unnamed: 0", axis=1)

    df = df.rename(
        columns={
            "SEXE": "sexe",
            "AGE": "age",
            "EFFET_HLT": "effet_hlt",
            "SOC_LONG": "soc_long",
            "SUBSTANCE_CODEX_UNIQUE": "substance_active",
            "codeSubstance": "code",
        }
    )

    df = (
        df.groupby(["code", "effet_hlt", "soc_long"])
        .agg({"n_decla_eff_hlt": "sum"})
        .reset_index()
        .sort_values(by="n_decla_eff_hlt", ascending=False)
    )
    df = df.merge(
        df_soclong[["code", "soc_long", "n_cas"]], on=["code", "soc_long"], how="left"
    )

    df["pourcentage_cas"] = (df.n_decla_eff_hlt / df.n_cas) * 100
    df.pourcentage_cas = df.apply(
        lambda x: x.pourcentage_cas if x.n_decla_eff_hlt >= 10 else None, axis=1
    )
    return df[["code", "soc_long", "effet_hlt", "pourcentage_cas"]]
