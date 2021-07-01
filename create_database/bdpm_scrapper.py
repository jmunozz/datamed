import functools
import json
from multiprocessing import Pool
from typing import List, Dict, Tuple

import pandas as pd
import requests
from bs4 import BeautifulSoup

import db
import settings

engine = db.connect_db()


def get_cis_list() -> List:
    df_cis = pd.read_sql("specialite", engine)
    return list(df_cis.cis.unique())


def check_publication_type(_type: str):
    if _type.lower() not in ALLOWED_TYPES:
        return "Autre"
    return _type


@functools.lru_cache(maxsize=None)
def scrap_bdpm(cis: str) -> Tuple[Dict, List]:
    print(f"scrap_bdpm for cis: ${cis}")
    page = requests.get(
        "http://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
            cis
        )
    )
    # Fetch webpage
    soup = BeautifulSoup(page.content, "html.parser")
    # print(soup.prettify())
    # Find description elements
    description_content = ""
    description_elements = soup.find_all(
        "p", {"class": ["AmmCorpsTexte", "AmmListePuces1"]}
    )
    if description_elements:
        for ele in description_elements:
            if (
                ele.text.replace("\n", " ")
                .replace("·", "")
                .strip()
                .startswith("Classe pharmacothérapeutique")
                or "ATC" in ele.text.replace("\n", " ").strip()
            ):
                continue
            # elif ele.attrs["class"] == ['AmmListePuces1']:
            else:
                description_content += (
                    ele.text.replace("\n", " ").strip().lower().capitalize() + " "
                )
    description = dict(cis=cis, description=description_content)
    # Find publications elements
    publications = []
    publications_ul_elem = soup.select("#liste_infos_importantes > li > a")
    if publications_ul_elem:
        for p in publications_ul_elem:
            text = str(p.string)
            type = check_publication_type(text.split("-")[-1].strip())
            if type == "Autre":
                title = text
            else:
                title = "-".join(text.split("-")[:-1])
            publications.append(dict(link=p["href"], type=type, title=title, cis=cis))

    return description, publications


def create_description_table():
    cis_list = get_cis_list()
    with Pool(10) as p:
        all_scraps = p.map(scrap_bdpm, cis_list)
        all_descriptions = list(map(lambda x: x[0], all_scraps))
        with open("data/descriptions.json", "w") as outfile:
            json.dump(all_descriptions, outfile)
        df = pd.DataFrame(all_descriptions, columns=["cis", "description"])
        df = df.set_index("cis")
        db.create_table_from_df(df, settings.files["description"]["to_sql"])


ALLOWED_TYPES = ["point d'information", "communiqué"]


def create_publications_table():
    cis_list = get_cis_list()
    with Pool(10) as p:
        flatten = lambda t: [item for sublist in t for item in sublist]
        all_scraps = p.map(scrap_bdpm, cis_list)
        all_publications = flatten(list(map(lambda x: x[1], all_scraps)))
        with open("data/publications.json", "w") as outfile:
            json.dump(all_publications, outfile)
        df = pd.DataFrame(all_publications, columns=["cis", "title", "type", "link"])
        df = df.set_index("cis")
        db.create_table_from_df(df, settings.files["publications"]["to_sql"])


if __name__ == "__main__":
    create_description_table()
    create_publications_table()
