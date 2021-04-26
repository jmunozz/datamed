import pandas as pd
import unidecode
from nltk.corpus import stopwords
from tqdm import tqdm

STOPWORDS = stopwords.words("french")


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
    df = df.drop(columns=["denomination"])
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

    return pd.concat(frames).reset_index(drop=True)


def get_table_df(df: pd.DataFrame, df_spe: pd.DataFrame, col: str) -> pd.DataFrame:
    frames = []
    for cis in tqdm(list(df_spe.index.values)):
        specialite = df_spe.loc[cis].nom
        df_erreurs = get_denom_linked_to_specialite(df, specialite)
        df_erreurs = df_erreurs[df_erreurs[col] != "Non renseigné"]

        if not df_erreurs.empty:
            frames.append(get_erreur_df(df_erreurs, cis, col))

    return pd.concat(frames).reset_index(drop=True)
