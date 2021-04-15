import pandas as pd
from datetime import datetime as dt


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
        "surveillance_renforcee"
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