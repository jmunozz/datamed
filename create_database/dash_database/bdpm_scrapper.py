import json
from typing import List, Dict

import pandas as pd
import requests
from bs4 import BeautifulSoup
from sqlalchemy.types import Text
from tqdm import tqdm

import paths
from create_tables import upload_cis_from_rsp, push_to_table


def get_cis_list() -> List:
    df_cis = upload_cis_from_rsp(paths.P_CIS_RSP)
    return df_cis.cis.unique()


def scrap_bdpm(cis_list: List) -> List[Dict]:
    descriptions = []
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
                "https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
                    cis
                )
            )
            soup = BeautifulSoup(page.content, "html.parser")

        description_elements = soup.find_all("p", {"class": "AmmCorpsTexte"})

        description = ""
        for ele in description_elements:
            if (
                ele.text.replace("\n", " ")
                .strip()
                .startswith("Classe pharmacothérapeutique")
                or "ATC" in ele.text.replace("\n", " ").strip()
            ):
                continue
            else:
                description += (
                    ele.text.replace("\n", " ").strip().lower().capitalize() + " "
                )
        descriptions.append({"cis": cis, "description": description})
    return descriptions


def create_description_table():
    cis_list = get_cis_list()
    descriptions = scrap_bdpm(cis_list)

    with open("./datamed_dash/data/descriptions.json", "w") as outfile:
        json.dump(descriptions, outfile)

    push_to_table(
        pd.DataFrame(descriptions),
        "description",
        {
            "cis": Text,
            "description": Text,
        },
    )
