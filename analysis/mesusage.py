import sys
from typing import List

import pandas as pd
from tqdm import tqdm

sys.path.append("/Users/linerahal/Documents/GitHub/datamed/datamed_dash/")


def get_dataframe() -> pd.DataFrame:
    cols = [
        "Cas CRPV",
        "Mode Recueil",
        "Typ Décl",
        "Typ Cas",
        "Typ Notif",
        "Cadre Notif",
        "Sex",
        "Age",
        "Grave",
        "Décès",
        "Notif",
        "Médicaments",
        "Voie",
        "Début TT",
        "Fin TT",
        "Durée",
        "Début EI",
        "Fin EI",
        "HLT",
        "HLGT",
        "SOC long",
        "Evolution",
    ]
    df = pd.read_excel(
        "data/20210104 - YAuffray - Mésusages depuis 2015.xlsx",
        sheet_name="Complet",
        usecols=cols,
    )

    df = df.rename(
        columns={
            "Cas CRPV": "cas_crpv",
            "Mode Recueil": "mode_recueil",
            "Typ Décl": "type_decla",
            "Typ Cas": "type_cas",
            "Typ Notif": "type_notif",
            "Cadre Notif": "cadre_notif",
            "Début EI": "debut_ei",
            "Fin EI": "fin_ei",
            "Sex": "sexe",
            "Age": "age",
            "Médicaments": "nom",
            "Indication": "indication",
            "Voie": "voie",
            "Type": "type",
            "Evolution": "evolution",
            "HLT": "hlt",
            "HLGT": "hlgt",
            "SOC long": "soc_long",
            "Début TT": "debut_traitement",
            "Fin TT": "fin_traitement",
            "Grave": "grave",
            "Décès": "deces",
            "Notif": "date_notif",
        }
    )

    df.nom = df.nom.str.lower()
    df.age = df.age.apply(lambda x: x.replace(" A", ""))
    # df.nom = df.nom.apply(lambda x: [s.replace("s ", "") for s in x.split(", ") if s.startswith("s")])
    for col in df.columns:
        df[col] = df[col].apply(
            lambda x: x.replace("\n", ", ") if isinstance(x, str) else x
        )

    return df


def separate_str(x) -> List:
    return [s.replace("s ", "") for s in x.split(", ") if s.startswith("s")]


def split_str(x):
    if isinstance(x, str):
        return x.split(", ")
    else:
        return x


def format_rows(df: pd.DataFrame, col_names: List) -> pd.DataFrame:
    for col_name in tqdm(col_names):
        print(col_name)
        if col_name == "nom":
            s = df[col_name].apply(separate_str).apply(pd.Series, 1).stack()
        else:
            s = df[col_name].apply(split_str).apply(pd.Series, 1).stack()
        s.index = s.index.droplevel(-1)  # to line up with df's index
        s.name = col_name
        del df[col_name]
        df = df.join(s)
        del s
        print("done")
        print("---------------------------------")
    return df


def main():
    df = get_dataframe()

    col_names = [
        "nom",
        "debut_ei",
        "fin_ei",
        "debut_traitement",
        "fin_traitement",
        "voie",
        "hlt",
        "hlgt",
        "soc_long",
        "evolution",
        "indication",
    ]
    df = format_rows(df, col_names)
