import json
from collections import defaultdict
from typing import List, Dict, Tuple

import pandas as pd
import requests
from bs4 import BeautifulSoup
from tqdm import tqdm

import paths
from dash_database.create_tables import upload_cis_from_rsp


def get_cis_list() -> List:
    df_cis = upload_cis_from_rsp(paths.P_CIS_RSP)

    # Add atc class to df_cis dataframe
    df_atc = pd.read_excel(
        paths.P_CIS_ATC, names=["cis", "atc", "nom_atc"], header=0, dtype={"cis": str}
    )
    df_atc.nom_atc = df_atc.nom_atc.str.lower()

    df_cis = df_cis.merge(df_atc, on="cis", how="left")
    df_cis = df_cis.where(pd.notnull(df_cis), None)
    df_cis = df_cis.rename(columns={"nom_spe_pharma": "nom"})

    return df_cis.cis.unique()


def scrap_bdpm(cis_list: List) -> Tuple[Dict, List[Dict]]:
    notice_dict = defaultdict()
    notices = []
    for cis in tqdm(cis_list):
        page = requests.get(
            "http://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
                cis
            )
        )

        # Fetch webpage
        soup = BeautifulSoup(page.content, "html.parser")
        # print(soup.prettify())

        if soup.body.findAll(
            text="Le document demandé n'est pas disponible pour ce médicament"
        ):
            print(cis)
            page = requests.get(
                "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}".format(
                    cis
                )
            )
            soup = BeautifulSoup(page.content, "html.parser")

        notice_elements = soup.find_all("p", {"class": "AmmCorpsTexte"})
        notice = ""
        for ele in notice_elements:
            if (
                ele.text.replace("\n", " ")
                .strip()
                .startswith("Classe pharmacothérapeutique")
                or "ATC" in ele.text.replace("\n", " ").strip()
            ):
                continue
            else:
                notice += ele.text.replace("\n", " ").strip().lower().capitalize() + " "
        notice_dict[cis] = notice
        notices.append({"cis": cis, "notice": notice})
    return notice_dict, notices


def __main__():
    cis_list = get_cis_list()
    notice_dict, notices = scrap_bdpm(cis_list)
    with open("./datamed_dash/data/notice_by_cis.json", "w") as outfile:
        json.dump(notice_dict, outfile)
    with open("./datamed_dash/data/notices.json", "w") as outfile:
        json.dump(notices, outfile)
