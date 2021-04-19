from os import path

import pandas as pd
from nltk.corpus import stopwords

STOPWORDS = stopwords.words("french")

P_ROOT = "~/Documents/GitHub/datamed/create_database/data/"
P_CIS_BDPM = path.join(P_ROOT, "BDPM/CIS_bdpm.txt")


NOMS_LIEUX = {
    "ES": "Établissement de santé",
    "EMS": "Établissement médico-social",
    "HAD": "Domicile",
}


def get_mesusage_dataframe() -> pd.DataFrame:
    df = pd.read_excel(
        "~/Documents/GitHub/datamed/analysis/data/RqHackathon_20190911.xlsx"
    )
    df = df.rename(
        columns={
            "codeATC": "atc",
            "DCI": "dci",
            "causeErreur": "cause_erreur",
            "natureErreur": "nature_erreur",
            "populationErreur": "population_erreur",
            "qualifErreur": "qualif_erreur",
            "lieuErreur": "lieu_erreur",
            "initialErreur": "initial_erreur",
            "EI": "effet_indesirable",
            "graviteConsequence": "gravite",
        }
    )
    df = df[
        [
            "id",
            "denomination",
            "dci",
            "atc",
            "cause_erreur",
            "nature_erreur",
            "population_erreur",
            "qualif_erreur",
            "lieu_erreur",
            "initial_erreur",
            "effet_indesirable",
            "gravite",
        ]
    ]
    df = df[~df.denomination.isna()]
    df.denomination = df.denomination.apply(lambda x: x.lower().strip() if x else None)
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: NOMS_LIEUX.get(x, x))
    df.population_erreur = df.population_erreur.apply(
        lambda x: "Non renseigné" if not x or x == "NR" else x
    )
    df = df.where(pd.notnull(df), None)
    return df


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


def upload_cis_from_bdpm(path: str) -> pd.DataFrame:
    """
    Upload RSP CIS table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "nom",
        "forme_pharma",
        "voie_admin",
        "statut_amm",
        "type_amm",
        "etat_commercialisation",
        "date_amm",
        "statut_bdpm",
        "num_autorisation",
        "titulaires",
        "surveillance_renforcee",
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
    df = clean_columns(df, "nom")
    return df


def get_specialite_dataframe() -> pd.DataFrame:
    df = upload_cis_from_bdpm(P_CIS_BDPM)
    df = df.where(pd.notnull(df), None)
    df = df[["cis", "nom"]]
    return df


def get_denom_linked_to_specialite(df: pd.DataFrame, specialite: str) -> pd.DataFrame:
    produit_specialite = specialite.split()[0]
    forme_specialite = specialite.split()[-1]

    # Return dataframe containing denominations that contain:
    # 1) product name (eg: doliprane)
    # 2) pharmaceutical form (eg: comprimé)
    return df[
        (df.denomination.str.startswith(produit_specialite))
        & (df.denomination.str.contains(forme_specialite))
    ]
