import json
from typing import Dict

import pandas as pd
import unidecode
from nltk.corpus import stopwords
from tqdm import tqdm

STOPWORDS = stopwords.words("french")

POPULATION_NOMS = {
    "Adulte": "Adultes",
    "Nouveau né": "Nouveaux nés",
    "Femme enceinte": "Femmes enceintes",
}

with open("data/causes.json") as f:
    CAUSES = json.loads(f.read())

with open("data/nature.json") as f:
    NATURE = json.loads(f.read())


def get_produit_denom(denomination: str) -> str:
    denomination = unidecode.unidecode(denomination)
    return denomination.split()[0]


def get_forme_denom(denomination: str) -> str:
    denomination = unidecode.unidecode(denomination)
    return denomination.split()[-1]


def get_denom_linked_to_specialite(df: pd.DataFrame, specialite: str) -> pd.DataFrame:
    # Return dataframe containing denominations that contain:
    # 1) product name (eg: doliprane)
    # 2) pharmaceutical form (eg: comprimé)
    specialite = (
        unidecode.unidecode(specialite)
        .replace(",", "")
        .replace(")", "")
        .replace("(", "")
    )  # Remove accents and punctuation
    produit_specialite = specialite.split()[0]
    forme_specialite = specialite.split()[-1]
    return df[
        (df.produit_denom == produit_specialite) & (df.forme_denom == forme_specialite)
    ]


def get_erreur_df(df_base: pd.DataFrame, cis: str, col: str) -> pd.DataFrame:
    df = df_base.groupby(col).denomination.count().reset_index()
    df["pourcentage"] = df.apply(
        lambda x: round(x.denomination / df.denomination.sum() * 100, 2), axis=1
    )

    if col == "cause_erreur":
        df["explication"] = df.cause_erreur.apply(lambda x: CAUSES.get(x, None))
    elif col == "nature_erreur":
        df["explication"] = df.nature_erreur.apply(lambda x: NATURE.get(x, None))

    df.drop(["denomination"], inplace=True, axis=1)
    df.insert(loc=0, column="cis", value=cis)
    return df.sort_values(by=["cis", "pourcentage"])


def get_corresp_df(df: pd.DataFrame, df_spe: pd.DataFrame) -> pd.DataFrame():
    frames = []
    for cis in tqdm(list(df_spe.index.values)):
        specialite = df_spe.loc[cis].nom
        df_erreurs = get_denom_linked_to_specialite(df, specialite)

        if not df_erreurs.empty:
            # Put cis -> denominations correspondences in dataframe
            df_corresp = df_erreurs[["denomination"]].drop_duplicates().copy()
            df_corresp["cis"] = cis
            frames.append(df_corresp)

    return pd.concat(frames).reset_index(drop=True).set_index("cis")


def get_table_df(df: pd.DataFrame, df_spe: pd.DataFrame, col: str) -> pd.DataFrame:
    frames = []
    for cis in tqdm(list(df_spe.index.values)):
        specialite = df_spe.loc[cis].nom
        df_erreurs = get_denom_linked_to_specialite(df, specialite)
        df_erreurs = df_erreurs[df_erreurs[col] != "Non renseigné"]

        if len(df_erreurs) > 10:
            frames.append(get_erreur_df(df_erreurs, cis, col))

    return pd.concat(frames).reset_index(drop=True).set_index("cis")


def clean_emed_df(df: pd.DataFrame, _settings: Dict) -> pd.DataFrame:
    gravite_dict = {"NR": "Non renseigné", "Oui": "Grave", "Non": "Non grave"}

    # Cleaning
    df = df[~df.denomination.isna()]
    df.denomination = df.denomination.apply(lambda x: x.lower().strip() if x else None)
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: _settings["noms_lieux"].get(x, x))

    df[_settings["no_info"]] = df[_settings["no_info"]].where(
        pd.notnull(df), "Non renseigné"
    )
    df.population_erreur = df.population_erreur.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: "Non renseigné" if x == "NR" else x)
    df.effet_indesirable = df.effet_indesirable.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.gravite = df.gravite.apply(lambda x: gravite_dict.get(x, x))
    df.initial_erreur = df.initial_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.nature_erreur = df.nature_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.cause_erreur = df.cause_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )

    df["produit_denom"] = df.denomination.apply(get_produit_denom)
    df["forme_denom"] = df.denomination.apply(get_forme_denom)

    df.population_erreur = df.population_erreur.apply(
        lambda x: POPULATION_NOMS.get(x, x)
    )
    return df
