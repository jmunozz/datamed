import json
import sys
from datetime import datetime as dt
from typing import List, Dict

import pandas as pd
import unicodedata2
from country_list import countries_for_language
from decouple import config
from sqlalchemy import create_engine
from sqlalchemy.types import String

sys.path.append("/Users/linerahal/Documents/GitHub/datamed")

import db
from jade_analysis import build_api_fab_sites_dataframe
from map_making.get_geoloc import get_locations
from transform_db import compute_best_matches

engine = db.connect_db()


def get_substance_by_cis() -> Dict:
    """
    Get substance_active (API) list for each CIS
    :return: dict of list
    """
    # Load dataframe
    df_sub_spe = pd.read_sql("specialite_substance", engine)
    df_sub = pd.read_sql("substance", engine)
    df = df_sub_spe.merge(df_sub, left_on="code_substance", right_on="code", how="left")
    # List CIS codes
    cis_list = df.cis.unique()
    return {str(cis): list(df[df.cis == cis].nom.unique()) for cis in cis_list}


def get_excels_df() -> pd.DataFrame:
    """
    Concatenate Excel files
    Compute cosine similarity
    :return:
    """
    # path = "/Users/ansm/Documents/GitHub/datamed/create_database/data/jade_final/"
    path = "/Users/linerahal/Desktop/ANSM/EDL/2019/jade_final/"
    # Load dataframe
    print("Loading dataframe from concatenated Excel files...")
    df_2019 = build_api_fab_sites_dataframe(path)
    df_2019["annee"] = 2019

    path = "/Users/linerahal/Desktop/ANSM/EDL/2020/Fiches B/"
    print("Loading dataframe from concatenated Excel files...")
    df_2020 = build_api_fab_sites_dataframe(path)
    df_2020["annee"] = 2020

    df = pd.concat([df_2019, df_2020])

    # Get api by CIS from RSP COMPO.txt file
    substance_by_cis = get_substance_by_cis()

    # Compute best match api using RSP
    best_match_list = compute_best_matches(df, substance_by_cis)
    df_match = pd.DataFrame(best_match_list)
    df_match.to_csv(
        "/Users/linerahal/Documents/GitHub/datamed/create_database/data/best_match_api.csv",
        index=False,
        sep=";",
    )
    print("best_match_api.csv printed!")

    best_match_dict = {
        (m["cis"], m["excel"]): {"api_rsp": m["rsp"], "cos_sim": m["cos_sim"]}
        for m in best_match_list
    }
    df["substance_active_match"] = df.apply(
        lambda x: best_match_dict[(x.cis, x.substance_active)]["api_rsp"]
        if (x.cis, x.substance_active) in best_match_dict
        else x.substance_active,
        axis=1,
    )
    df["cos_sim"] = df.apply(
        lambda x: best_match_dict[(x.cis, x.substance_active)]["cos_sim"]
        if (x.cis, x.substance_active) in best_match_dict
        else None,
        axis=1,
    )
    df = df.drop(["substance_active"], axis=1)
    df = df.rename(columns={"substance_active_match": "substance_active"})
    df = df.dropna(
        subset=["cis", "substance_active", "sites_fabrication_substance_active"]
    )
    df = df.drop_duplicates(
        subset=["cis", "substance_active", "sites_fabrication_substance_active"]
    )

    df_sub = pd.read_sql("substance", engine)
    df = df.merge(df_sub, left_on="substance_active", right_on="nom", how="left")
    df = df[
        [
            "annee",
            "cis",
            "denomination_specialite",
            "dci",
            "code",
            "substance_active",
            "type_amm",
            "titulaire_amm",
            "sites_production",
            "sites_conditionnement_primaire",
            "sites_conditionnement_secondaire",
            "sites_importation",
            "sites_controle",
            "sites_echantillotheque",
            "sites_certification",
            "sites_fabrication_substance_active",
            "mitm",
            "pgp",
            "filename",
        ]
    ]
    df = df.rename(columns={"code": "code_substance"})
    return df


def get_country(address: str, country_list: List, country_dict: Dict) -> Dict:
    country_in_address = {}
    for country in country_list:
        if country in address:
            country_in_address[country_dict.get(country, country)] = address.count(
                country
            )
    return country_in_address


def get_countries_list(df: pd.DataFrame, path: str) -> List[Dict]:
    df = df[["sites_fabrication_substance_active"]]
    df = df.drop_duplicates()
    df = df.reset_index(drop=True)

    countries_en = [c[1].lower() for c in countries_for_language("en")]
    countries_fr = [c[1].lower() for c in countries_for_language("fr")]

    # json contenant des écritures particulières non listées par les appels ci-dessus
    with open(
        "/Users/linerahal/Documents/GitHub/datamed/map_making/data/countries.json"
    ) as json_file:
        country_dict = json.load(json_file)

    all_countries = set(countries_fr + countries_en + list(country_dict.keys()))

    # Ajouter les écritures sans accents
    country_list = []
    for word in all_countries:
        if word not in country_list:
            country_list.append(word)
            word_no_accents = "".join(
                (
                    c
                    for c in unicodedata2.normalize("NFD", word)
                    if unicodedata2.category(c) != "Mn"
                )
            )
            if word_no_accents not in country_list:
                country_list.append(word_no_accents)
    country_list = sorted(country_list)

    # Lister les pays qui apparaissent vraiment dans les adresses de la dataframe
    countries_in_df = []
    addresses = df.sites_fabrication_substance_active.unique()
    for address in addresses:
        countries = get_country(address, country_list, country_dict).keys()
        for country in countries:
            if country not in countries_in_df:
                countries_in_df.append(country)

    df["country"] = df.sites_fabrication_substance_active.apply(
        lambda x: get_country(x, country_list, country_dict)
    )

    # Pour les adresses pour lesquelles on n'a pas réussi à trouver les pays,
    # on utilise la geocoding API
    not_found_addresses = df[
        df.country == {}
    ].sites_fabrication_substance_active.unique()
    df_not_found_addresses = get_locations(
        not_found_addresses,
        "address_locations_{}.csv".format(dt.now().date().strftime("%d%m%Y")),
    )
    country_by_address = df_not_found_addresses.to_dict(orient="records")
    country_by_address_dict = {c["address"]: c["country"] for c in country_by_address}

    # Résultat de la geocoding injecté dans la dataframe de départ
    df.loc[df.country == {}, "country"] = df.loc[
        df.country == {}, "sites_fabrication_substance_active"
    ].apply(
        lambda x: get_country(country_by_address_dict[x], country_list, country_dict)
        if country_by_address_dict[x]
        else {}
    )

    for country in countries_in_df:
        df[country_dict.get(country, country)] = df.country.apply(
            lambda x: x.get(country, 0)
        )

    # Replace NaN values with None
    df = df.where(df.notnull(), None)
    df = df.rename(columns={"sites_fabrication_substance_active": "address"})

    cols_keep = [c for c in df.columns if c != "country"]

    return df[cols_keep].to_csv(path, sep=";", index=False)


def get_prod_list(df: pd.DataFrame) -> List[Dict]:
    """
    Create table listing all possible occurrences of (cis, substance_active, address)
    """
    # Load substance_active table and join with dataframe
    df_api = pd.read_sql_table("substance_active", connection)
    df = df.merge(df_api, how="left", left_on="substance_active", right_on="name")
    df = df.rename(columns={"id": "substance_active_id"})

    # Replace NaN values with None
    df = df.where(df.notnull(), None)

    return [
        {
            k: v
            for k, v in zip(
                (
                    "cis",
                    "substance_active_id",
                    "substance_active",
                    "sites_fabrication_substance_active",
                    "denomination_specialite",
                    "dci",
                    "type_amm",
                    "titulaire_amm",
                    "sites_production",
                    "sites_conditionnement_primaire",
                    "sites_conditionnement_secondaire",
                    "sites_importation",
                    "sites_controle",
                    "sites_echantillotheque",
                    "sites_certification",
                    "mitm",
                    "pgp",
                    "filename",
                ),
                (
                    row["cis"],
                    int(row["substance_active_id"]),
                    row["substance_active"],
                    row["sites_fabrication_substance_active"],
                    row["denomination_specialite"],
                    row["dci"],
                    row["type_amm"],
                    row["titulaire_amm"],
                    row["sites_production"],
                    row["sites_conditionnement_primaire"],
                    row["sites_conditionnement_secondaire"],
                    row["sites_importation"],
                    row["sites_controle"],
                    row["sites_echantillotheque"],
                    row["sites_certification"],
                    row["mitm"],
                    row["pgp"],
                    row["filename"],
                ),
            )
        }
        for index, row in df.iterrows()
    ]


def connect_edl_db():
    global engine
    url = "postgresql://{user}:{pwd}@{host}/{db}".format(
        host=config("DBHOSTNAME"),
        db=config("DBNAME_EDL"),
        user="linerahal",
        pwd=config("DBPWD_EDL"),
    )
    if not engine:
        engine = create_engine(url, echo=False)
    return engine


def main():
    df = get_excels_df()
    _settings = {
        "name": "etats_des_lieux",
        "if_exists": "replace",
        "index": True,
        "dtype": {"cis": String},
    }
    engine = connect_edl_db()
    args = {**{"con": engine}, **_settings}
    df.to_sql(**args)

    # Write countries by address csv file
    path = "~/Documents/GitHub/datamed/create_database/data/countries_by_address.csv"
    get_countries_list(df, path)
