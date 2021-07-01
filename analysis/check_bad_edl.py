import os

import pandas as pd
from tqdm import tqdm
from xlrd import XLRDError

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


def listdir_nohidden(path: str):
    """
    List not hidden files in directory
    Avoid .DS_Store files for Mac
    """
    for f in os.listdir(path):
        if not f.startswith("."):
            yield f


def check_rules():
    path = "/Users/linerahal/Desktop/ANSM/EDL/2020/Fiches B/"

    files = list(listdir_nohidden(path))

    bad_edl_list = []
    for f in tqdm(files):
        try:
            df = pd.read_excel(path + f)
            df.columns = (
                df.columns.str.lower().str.strip().str.replace("\n", " ")
            )  # Clean column title
            df = df.where(pd.notnull(df), None)
            while not df.empty and all(v is None for v in list(df.iloc[0].values)):
                df.drop(index=df.index[0], axis=0, inplace=True)
            if list(df.columns)[: len(SCHEMA)] != list(SCHEMA.keys()):
                bad_edl_list.append(
                    {"fichier": f, "raison": "colonnes ne correspondent pas"}
                )
            if "cis" in df.columns and None in df.cis.unique():
                bad_edl_list.append({"fichier": f, "raison": "fusion de cellules"})
            if (
                "site(s) de fabrication de la substance active" in df.columns
                and "\n\nor\n"
                in " ".join(
                    df[df["site(s) de fabrication de la substance active"].notnull()][
                        "site(s) de fabrication de la substance active"
                    ]
                    .apply(lambda x: str(x))
                    .unique()
                )
            ):
                bad_edl_list.append(
                    {
                        "fichier": f,
                        "raison": "Utilise " "or" " pour séparer les adresses",
                    }
                )
            if (
                "site(s) de fabrication de la substance active" in df.columns
                and "------"
                in " ".join(
                    df[df["site(s) de fabrication de la substance active"].notnull()][
                        "site(s) de fabrication de la substance active"
                    ]
                    .apply(lambda x: str(x))
                    .unique()
                )
            ):
                bad_edl_list.append(
                    {
                        "fichier": f,
                        "raison": "Utilise ------ pour séparer les adresses",
                    }
                )
            else:
                continue
        except XLRDError:
            bad_edl_list.append({"fichier": f, "raison": "erreur de lecture"})
            continue

    df_bad = pd.DataFrame(bad_edl_list)
    df_bad.to_csv("~/Desktop/edl_2021_bad_format.csv", sep=";", encoding="utf-8", index=False)
