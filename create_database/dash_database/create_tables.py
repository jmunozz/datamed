from datetime import datetime as dt
from typing import Dict

import pandas as pd
from sqlalchemy.types import Integer, Text, String, Float

import paths
from models import connect_db
from bdpm_scrapper import create_description_table

engine = connect_db()
connection = engine.connect()

EXPOSITION = {
    "spécialité": {1000: 1, 5000: 2, 15000: 3, 50000: 4},
    "substance": {5000: 1, 25000: 2, 100000: 3, 500000: 4},
}


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
    df_cis = upload_cis_from_rsp(paths.P_CIS_RSP)

    # Add atc class to df_cis dataframe
    df_atc = pd.read_excel(
        paths.P_CIS_ATC, names=["cis", "atc", "nom_atc"], header=0, dtype={"cis": str}
    )
    df_atc.nom_atc = df_atc.nom_atc.str.lower()

    df_cis = df_cis.merge(df_atc, on="cis", how="left")
    df_cis = df_cis.where(pd.notnull(df_cis), None)
    df_cis = df_cis.rename(columns={"nom_spe_pharma": "nom"})
    df_cis = df_cis[
        [
            "cis",
            "nom",
            "forme_pharma",
            "voie_admin",
            "atc",
            "nom_atc",
            "statut_amm",
            "type_amm",
            "etat_commercialisation",
        ]
    ]

    push_to_table(
        df_cis,
        "substance",
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


def compute_percentage(
    df: pd.DataFrame, substance: pd.Series, key: str, field: str
) -> float:
    return substance[field] / df[df[key] == substance[key]][field].sum() * 100


def get_spe_ordei_dataframe() -> pd.DataFrame:
    df = pd.read_csv(
        paths.P_ORDEI_SPECIALITE,
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


def create_spe_conso_ordei_table():
    df = get_spe_ordei_dataframe()

    df = df.groupby("cis")["conso"].sum().reset_index()
    df["exposition"] = df.conso.apply(
        lambda x: max(EXPOSITION["spécialité"].items(), key=lambda y: x <= y[0])[1]
        if x <= 50000
        else 5
    )

    push_to_table(
        df,
        "specialite_ordei",
        {
            "cis": Text,
            "exposition": Integer,
        },
    )


def create_spe_patients_sexe_table():
    df = get_spe_ordei_dataframe()

    df_sexe = df.groupby(["cis", "sexe"]).agg({"conso": "sum"}).reset_index()

    df_sexe["pourcentage_patients"] = df_sexe.apply(
        lambda x: compute_percentage(df_sexe, x, "cis", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    push_to_table(
        df_sexe,
        "specialite_patient_sexe_ordei",
        {
            "cis": Text,
            "sexe": Text,
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def create_spe_patients_age_table():
    df = get_spe_ordei_dataframe()

    df_age = df.groupby(["cis", "age"]).agg({"conso": "sum"}).reset_index()

    df_age["pourcentage_patients"] = df_age.apply(
        lambda x: compute_percentage(df_age, x, "cis", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    push_to_table(
        df_age,
        "specialite_patient_age_ordei",
        {
            "cis": Text,
            "age": Text,
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def get_substance_dataframe() -> pd.DataFrame:
    df = pd.read_csv(paths.P_ORDEI_SUBSTANCE,
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


def create_substance_ordei_table():
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
    df["exposition"] = df.conso.apply(
        lambda x: max(EXPOSITION["substance"].items(), key=lambda y: x <= y[0])[1]
        if x <= 500000
        else 5
    )

    df.cas = df.cas.apply(lambda x: x if x >= 10 else None)
    df["taux_cas"] = df.apply(
        lambda x: x.cas * 100000 / x.conso if x.cas >= 10 else None, axis=1
    )

    df = df.merge(df_annee, on="code", how="left")

    push_to_table(
        df,
        "substance_ordei",
        {
            "code": Text,
            "exposition": Integer,
            "cas": Integer,
            "taux_cas": Float,
            "annee": Integer,
            "conso_annee": Integer,
            "cas_annee": Integer,
        },
    )


def create_substance_patients_sexe_table():
    df = get_substance_dataframe()

    df_sexe = df.groupby(["code", "sexe"]).agg({"conso": "sum"}).reset_index()

    df_sexe["pourcentage_patients"] = df_sexe.apply(
        lambda x: compute_percentage(df_sexe, x, "code", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )

    df_sexe = df_sexe[["code", "sexe", "pourcentage_patients"]]

    push_to_table(
        df_sexe,
        "substance_patient_sexe_ordei",
        {
            "code": Text,
            "sexe": Text,
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def create_substance_patients_age_table():
    df = get_substance_dataframe()

    df_age = df.groupby(["code", "age"]).agg({"conso": "sum"}).reset_index()

    df_age["pourcentage_patients"] = df_age.apply(
        lambda x: compute_percentage(df_age, x, "code", "conso")
        if x.conso >= 10
        else None,
        axis=1,
    )
    df_age = df_age[["code", "age", "pourcentage_patients"]]

    push_to_table(
        df_age,
        "substance_patient_age_ordei",
        {
            "code": Text,
            "age": Text,
            "conso": Integer,
            "pourcentage_patients": Float,
        },
    )


def create_substance_cas_sexe_table():
    df = get_substance_dataframe()

    df_sexe = df.groupby(["code", "sexe"]).agg({"cas": "sum"}).reset_index()

    df_sexe["pourcentage_cas"] = df_sexe.apply(
        lambda x: compute_percentage(df_sexe, x, "code", "cas")
        if x.cas >= 10
        else None,
        axis=1,
    )

    df_sexe = df_sexe[["code", "sexe", "pourcentage_cas"]]

    push_to_table(
        df_sexe,
        "substance_cas_sexe_ordei",
        {
            "code": Text,
            "sexe": Text,
            "cas": Integer,
            "pourcentage_cas": Float,
        },
    )


def create_substance_cas_age_table():
    df = get_substance_dataframe()

    df_age = df.groupby(["code", "age"]).agg({"cas": "sum"}).reset_index()

    df_age["pourcentage_cas"] = df_age.apply(
        lambda x: compute_percentage(df_age, x, "code", "cas") if x.cas >= 10 else None,
        axis=1,
    )
    df_age = df_age[["code", "age", "pourcentage_cas"]]

    push_to_table(
        df_age,
        "substance_cas_age_ordei",
        {
            "code": Text,
            "age": Text,
            "cas": Integer,
            "pourcentage_cas": Float,
        },
    )


def create_notificateurs_table():
    df = pd.read_csv(
        paths.P_ORDEI_NOTIF,
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
        lambda x: compute_percentage(df_notif, x, "code", "n_decla")
        if x.n_decla >= 10
        else None,
        axis=1,
    )
    df_notif = df_notif[["code", "notificateur", "pourcentage_notif"]]

    push_to_table(
        df_notif,
        "substance_notif_ordei",
        {
            "code": Text,
            "notificateur": Text,
            "pourcentage_notif": Float,
        },
    )


def get_substance_soclong_dataframe() -> pd.DataFrame:
    df = pd.read_csv(
        paths.P_ORDEI_SOCLONG,
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


def create_substance_soclong_table():
    df = get_substance_soclong_dataframe()
    df["pourcentage_cas"] = (df.n_decla_eff / df.n_cas) * 100
    df.pourcentage_cas = df.apply(
        lambda x: x.pourcentage_cas if x.n_decla_eff >= 10 else None, axis=1
    )
    df = df[["code", "soc_long", "pourcentage_cas"]].sort_values(by=["code"])

    df.to_sql(
        "substance_soclong_ordei",
        engine,
        if_exists="replace",
        index=False,
        chunksize=500,
        dtype={
            "code": String(120),
            "soc_long": Text,
            "pourcentage_cas": Float,
        },
    )


def create_hlt_table():
    df_soclong = get_substance_soclong_dataframe()

    df = pd.read_csv(
        paths.P_ORDEI_HLT,
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
    df = df[["code", "soc_long", "effet_hlt", "pourcentage_cas"]]

    push_to_table(
        df,
        "substance_hlt_ordei",
        {
            "code": Text,
            "soc_long": Text,
            "effet_hlt": Text,
            "pourcentage_cas": Float,
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

    create_spe_conso_ordei_table()

    create_spe_patients_sexe_table()

    create_spe_patients_age_table()

    create_substance_ordei_table()

    create_substance_patients_sexe_table()

    create_substance_patients_age_table()

    create_substance_cas_sexe_table()

    create_substance_cas_age_table()

    create_notificateurs_table()

    create_substance_soclong_table()

    create_hlt_table()
