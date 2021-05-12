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

CAUSES = {
    "Autre": "",
    "Non renseigné": "",
    "Défaut de conditionnement": "Erreur ou risque d’erreur lié à un conditionnement, étiquetage inadéquat ou un dispositif associé absent ou inapproprié.",
    "Défaut d’information": "Erreur ou risque d’erreur lié à une information absente, fausse ou entrainant des difficultés de compréhension au niveau de la notice, RCP, étiquetage.",
    "Erreur de pratique": "Erreur survenue dans le cadre de l’activité, de la fonction d’un professionnel de santé et pouvant être liée à une erreur humaine ou à un défaut organisationnel au sein du circuit du médicament.",
    "Erreur de substitution liée aux génériques": "Erreur ou risque d’erreur en lien avec la prescription d’un princeps et délivrance du mauvais générique (par exemple : princeps n’appartient à aucun groupe générique), générique n’a pas l’indication, princeps a deux principes actifs et délivrance d’un générique à un seul principe actif (ou vice et versa).",
    "Erreur utilisation": "Erreur ou risque d’erreur d’utilisation d’un médicament par un patient ou son entourage.",
    "Manque lisibilité": "Erreur ou risque d’erreur lié à une difficulté de lecture de l’étiquetage primaire ou secondaire d’un médicament (couleur n’offrant pas un contraste de lecture adapté, taille des caractères insuffisante).",
    "Mésusage": "",
    "Problème de qualité pharmaceutique": "",
    "Similitude des comprimés": "Erreur ou risque d’erreur lié à une ressemblance entre les formes galéniques de 2 ou plusieurs médicaments.",
    "Similitude des conditionnements": "Erreur ou risque d’erreur lié à une ressemblance du conditionnement de 2 ou plusieurs médicaments",
    "Similitude des noms": "Erreur ou risque d’erreur lié à une ressemblance lexicale entre le nom des médicaments et/ou des substances actives.",
    "Utilisation BdM": "Erreur ou risque d’erreur lié à un défaut ou dysfonctionnement potentiellement reproductible d’un outil informatique de prescription ou d’une base de données médicamenteuse.",
    "Utilisation LAP": "Erreur ou risque d’erreur lié à un défaut ou dysfonctionnement potentiellement reproductible d’un outil informatique de prescription ou d’une base de données médicamenteuse.",
    "Utilisation LAP ou BdM": "Erreur ou risque d’erreur lié à un défaut ou dysfonctionnement potentiellement reproductible d’un outil informatique de prescription ou d’une base de données médicamenteuse.",
}

NATURE = {
    "Autre": "",
    "Non renseigné": "",
    "Erreur de dosage": "Erreur médicamenteuse lié au choix d’un dosage ou d’une concentration erroné du médicament souhaité.",
    "Erreur de durée d’administration": "Erreur médicamenteuse liée à un écart par rapport à la période de traitement prévue dans le RCP.",
    "Erreur de débit d’administration": "Erreur médicamenteuse liée à la vitesse d’administration du médicament souhaité notamment lors de l’utilisation de pompe à perfusion ou de seringue électrique.",
    "Erreur de forme galénique": "Erreur médicamenteuse liée au choix d’une forme pharmaceutique erronée/inadaptée.",
    "Erreur de moment d’administration": "Erreur médicamenteuse liée à un écart par rapport à l’heure ou l’instant de l’administration du médicament souhaité prévu dans le RCP.",
    "Erreur de médicament": "Erreur médicamenteuse liée au choix d’un médicament pouvant intervenir à chaque étape du circuit du médicament. Il peut s’agir d’une erreur de substance active ou de spécialité.",
    "Erreur de patient": "Erreur médicamenteuse liée à une confusion d’identité d’un patient.",
    "Erreur de posologie ou de concentration": "Erreur médicamenteuse liée au choix du bon médicament au bon dosage mais à un rythme d’administration ou à une quantité de substance active sélectionnée erronée.",
    "Erreur de suivi thérapeutique et clinique": "Erreur médicamenteuse survenant après (à la suite ou à distance de l’étape d’administration) la mise en œuvre d’un traitement médicamenteux et concernant tout acte de soin relatif à la surveillance du médicament.",
    "Erreur de technique de préparation": "",
    "Erreur de technique d’administration": "Erreur médicamenteuse liée à une méthode, un moyen ou un procédé erroné/inapproprié lors de la manipulation/utilisation d’un médicament.",
    "Erreur de voie d’administration": "Erreur médicamenteuse liée au choix d’une autre voie d’administration que celle recommandée dans le RCP du médicament souhaité.",
    "Erreur d’omission": "Erreur médicamenteuse liée à l’absence, l’oubli d’un médicament ou d’un examen qui aurait dû être prévu, planifié, donné ou pris.",
    "Médicament périmé ou détérioré ou mal conservé": "Erreur médicamenteuse liée à l’emploi d’un médicament au-delà de sa date d’utilisation, d’un médicament altéré ou ayant été conservé dans conditions non prévues par le RCP.",
}


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

    df["produit_denom"] = df.denomination.apply(get_produit_denom)
    df["forme_denom"] = df.denomination.apply(get_forme_denom)

    df.population_erreur = df.population_erreur.apply(
        lambda x: POPULATION_NOMS.get(x, x)
    )
    return df
