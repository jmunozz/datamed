from os import path
from typing import List, Dict

import pandas as pd
import unidecode
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

    cols_no_info = [
        "population_erreur",
        "initial_erreur",
        "nature_erreur",
        "cause_erreur",
        "gravite",
        "effet_indesirable",
    ]
    df[cols_no_info] = df[cols_no_info].where(pd.notnull(df), "Non renseigné")

    df.population_erreur = df.population_erreur.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.lieu_erreur = df.lieu_erreur.apply(lambda x: "Non renseigné" if x == "NR" else x)
    df.effet_indesirable = df.effet_indesirable.apply(
        lambda x: "Non renseigné" if x == "NR" else x
    )
    df.initial_erreur = df.initial_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.nature_erreur = df.nature_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
    )
    df.cause_erreur = df.cause_erreur.apply(
        lambda x: "Non renseigné" if x == "NI" else x
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
    df = df.set_index("cis")
    return df


def get_produit_denom(denomination: str) -> str:
    denomination = unidecode.unidecode(denomination)
    return denomination.split()[0]


def get_forme_denom(denomination: str) -> str:
    denomination = unidecode.unidecode(denomination)
    return denomination.split()[-1]


def get_denom_linked_to_specialite(df: pd.DataFrame, specialite: str) -> pd.DataFrame:
    specialite = unidecode.unidecode(specialite)
    produit_specialite = specialite.split()[0].replace(",", "")
    forme_specialite = specialite.split()[-1].replace(",", "").replace(")", "").replace("(", "")

    # Return dataframe containing denominations that contain:
    # 1) product name (eg: doliprane)
    # 2) pharmaceutical form (eg: comprimé)
    return df[
        (df.produit_denom == produit_specialite)
        & (df.forme_denom.str.contains(forme_specialite))
    ]
    #return df[
    #    (df.denomination.apply(unidecode.unidecode).str.startswith(produit_specialite))
    #    & (df.denomination.apply(unidecode.unidecode).str.contains(forme_specialite))
    #]


def get_dataframe(df_base: pd.DataFrame, cis: str, fields: List[str]) -> pd.DataFrame:
    df = df_base.groupby(fields).id.count().reset_index()
    df.id = df.apply(lambda x: x.id / df.id.sum() * 100, axis=1)
    df = df.rename(columns={"id": "pourcentage"})
    df["cis"] = cis
    return df.sort_values(by=["pourcentage"], ascending=False)


def main():
    df_mesusage = get_mesusage_dataframe()
    df_mesusage["produit_denom"] = df_mesusage.denomination.apply(get_produit_denom)
    df_mesusage["forme_denom"] = df_mesusage.denomination.apply(get_forme_denom)
    df_spe = get_specialite_dataframe()

    frames_lieu = []
    frames_population = []
    frames_initial = []
    frames_nature = []
    frames_cause = []

    for cis in tqdm(list(df_spe.index.values)):
        specialite = df_spe.loc[cis].nom
        df_erreurs = get_denom_linked_to_specialite(df_mesusage, specialite)

        if not df_erreurs.empty:
            print(specialite)
            frames_lieu.append(get_dataframe(df_erreurs, cis, ["lieu_erreur"]))
            frames_population.append(get_dataframe(df_erreurs, cis, ["population_erreur"]))
            frames_initial.append(
                get_dataframe(df_erreurs, cis, ["initial_erreur", "gravite"])
            )
            frames_nature.append(get_dataframe(df_erreurs, cis, ["nature_erreur", "gravite"]))
            frames_cause.append(get_dataframe(df_erreurs, cis, ["cause_erreur", "gravite"]))

    df_lieu = pd.concat(frames_lieu)
    df_population = pd.concat(frames_population)
    df_initial = pd.concat(frames_initial)
    df_nature = pd.concat(frames_nature)
    df_cause = pd.concat(frames_cause)
