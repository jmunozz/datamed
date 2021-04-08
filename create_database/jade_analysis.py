import math
import re
from typing import List

import numpy as np
import pandas as pd
from tqdm import tqdm
from xlrd import XLRDError

from utils import files_explorer

SCHEMA = {
    "dénomination de la spécialité": "denomination_specialite",
    "cis": "cis",
    "dénomination commune (dci)": "dci",
    "type d'amm": "type_amm",
    "titulaire de l'amm": "titulaire_amm",
    "site(s) de production  / sites de production alternatif(s)": "sites_production",
    "site(s) de conditionnement primaire": "sites_conditionnement_primaire",
    "site(s) de conditionnement secondaire": "sites_conditionnement_secondaire",
    "site d'importation": "sites_importation",
    "site(s) de contrôle": "sites_controle",
    "site(s) d'échantillothèque": "sites_echantillotheque",
    "site(s) de certification": "sites_certification",
    "substance active": "substance_active",
    "site(s) de fabrication de la substance active": "sites_fabrication_substance_active",
    "mitm (oui/non)": "mitm",
    "pgp (oui/non)": "pgp",
}


def clean_column(col):
    """
    Clean dataframe columns content
    :param col: DataFrame column
    :return: cleaned column
    """
    return (
        col.astype(str)
        .str.lower()
        .str.strip()
        .str.replace("\n", " ")
        .replace("nan", np.nan)
    )


def convert_cis(cis_str: str) -> str:
    """
    Convert cis codes in int type if possible
    """
    pattern = re.compile("nl[0-9]{5}cis[0-9]{8}")
    cis_pattern = cis_str.replace(" ", "").replace(" /", "")
    cis_tmp = (
        cis_str.replace(" ", "")
        .replace("cis", "")
        .replace(":", "")
        .replace(u"\xa0", u"")
        .replace(".", "")[:8]
    )

    if cis_str.isdigit() and len(cis_str) > 8:
        # May be CIP code instead of CIS
        return cis_str
    elif pattern.match(cis_pattern):
        # Fix entries like 'nl 32 991 / cis 6 640 362 1'
        # or 'nl 47 695 cis 6 927 922 1'
        return re.sub("nl[0-9]{5}cis", "", cis_pattern)
    elif cis_tmp.isdigit():
        # Try to find CIS code in str
        return cis_tmp
    else:
        # Else keep it like that
        return cis_str


def global_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    """
    Data cleaning
    Lower case + remove spaces + remove all NaN rows
    :param df: DataFrame (raw data)
    :return: DataFrame
    """
    # Global cleaning
    df[df.columns] = df[df.columns].apply(clean_column)
    df = df.applymap(lambda x: re.sub(" +", " ", x) if isinstance(x, str) else x)
    df.columns = df.columns.str.lower().str.strip().str.replace("\n", " ")
    return df


def columns_cleaning(df: pd.DataFrame) -> pd.DataFrame:
    # Select only 17 first columns
    df = df.iloc[:, : len(SCHEMA) + 1]
    df = df.rename(columns=SCHEMA)
    df = df.dropna(how="all", subset=df.columns[:-1])
    # Correct CIS codes
    df.cis = df.cis.apply(lambda x: convert_cis(x) if not pd.isnull(x) else math.nan)
    # Remove rows having bad information
    df = df[
        df.denomination_specialite
        != "une ligne par dénomination et par susbtance active"
    ]
    return df


def get_filenames(path: str) -> List:
    """
    Get the list of files sharing the same structure (given in cols list)
    Upgrade: should find a way to load only the header of the Excel file
    :return: list
    """
    # List all files in directory
    # (avoid .DS_Store files for macos)
    files = list(files_explorer.listdir_nohidden(path))

    for f in files:
        try:
            df_file = pd.read_excel(path + f)
            df_file.columns = (
                df_file.columns.str.lower().str.strip().str.replace("\n", " ")
            )  # Clean column title
            if list(df_file.columns)[: len(SCHEMA)] == list(SCHEMA.keys()):
                yield f
        except XLRDError:
            print("File {} is corrupted".format(f))
            continue


def build_api_fab_sites_dataframe(path: str) -> pd.DataFrame:
    """
    Choose interesting columns (corresponding to most recent files)
    Filter on files containing those columns
    Create big dataframe with all those files
    Clean the dataframe
    :return: DataFrame
    """
    # Get filenames having good structure
    filenames = list(get_filenames(path))

    # Create dataframe
    file_list = []
    for f in tqdm(filenames):
        df_file = pd.read_excel(path + f)
        df_file["filename"] = f
        file_list.append(df_file)
    df_data = pd.concat(file_list, axis=0, ignore_index=True, sort=False)

    # Clean dataframe
    df_tmp = global_cleaning(df_data)
    df_cleaned = columns_cleaning(df_tmp)
    return df_cleaned
