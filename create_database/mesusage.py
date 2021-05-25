import helpers
import settings
from datetime import datetime as dt

import pandas as pd
from tqdm import tqdm


def format_age(age_str: str):
    try:
        return int(age_str.replace(" A", ""))
    except ValueError:
        return None


def get_dataframe(_settings) -> pd.DataFrame:
    df = helpers.load_excel_to_df(_settings)

    df = df.rename(
        columns={
            "Cas CRPV": "cas_crpv",
            "Mode Recueil": "mode_recueil",
            "Typ Décl": "type_decla",
            "Typ Cas": "type_cas",
            "Typ Notif": "type_notif",
            "Cadre Notif": "cadre_notif",
            "Durée": "duree",
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

    df = df.where(pd.notnull(df), None)
    df.nom = df.nom.str.lower()
    df.age = df.age.apply(format_age)
    df.duree = df.duree.apply(lambda x: x.replace(" Jour", ""))
    df.type_notif = df.type_notif.apply(lambda x: _settings["declarants"].get(x, x))
    df.sexe = df.sexe.apply(lambda x: _settings["sexes"].get(x, x))
    return df


def separate_str(x):
    return [s.replace("s ", "") for s in x.split("\n") if s.startswith("s ")]


def split_str(x):
    if isinstance(x, str):
        return x.split("\n")
    else:
        return x


def parse_date(date_str: str):
    if date_str:
        try:
            return dt.strptime(date_str, "%d/%m/%Y")
        except ValueError:
            return None
    else:
        return None


def categorize_age(age: int) -> str:
    if age <= 19:
        return "0-19 ans"
    elif 20 <= age <= 59:
        return "20-59 ans"
    elif age >= 60:
        return "60 ans et plus"


def reformat_dataframe(df_mes: pd.DataFrame) -> pd.DataFrame:
    mes = df_mes.to_dict(orient="records")

    mesusages = []
    for m in tqdm(mes):
        noms = separate_str(m["nom"])
        voies = split_str(m["voie"])
        duree = split_str(m["duree"])
        debut_tt = split_str(m["debut_traitement"])
        fin_tt = split_str(m["fin_traitement"])
        debut_ei = split_str(m["debut_ei"])
        fin_ei = split_str(m["fin_ei"])
        hlt = split_str(m["hlt"])
        hlgt = split_str(m["hlgt"])
        soc_long = split_str(m["soc_long"])
        evolution = split_str(m["evolution"])
        indications = split_str(m["indication"])
        for i in range(len(noms)):
            mesusages.append(
                {
                    "cas_crpv": m["cas_crpv"],
                    "mode_recueil": m["mode_recueil"],
                    "type_decla": m["type_decla"],
                    "type_cas": m["type_cas"],
                    "type_notif": m["type_notif"],
                    "cadre_notif": m["cadre_notif"],
                    "sexe": m["sexe"],
                    "age": m["age"],
                    "grave": m["grave"],
                    "deces": m["deces"],
                    "date_notif": m["date_notif"],
                    "nom": noms[i],
                    "voie": voies[i] if voies and i + 1 <= len(voies) else None,
                    "debut_traitement": debut_tt[i]
                    if debut_tt and i + 1 <= len(debut_tt)
                    else None,
                    "fin_traitement": fin_tt[i]
                    if fin_tt and i + 1 <= len(fin_tt)
                    else None,
                    "duree": duree[i] if duree and i + 1 <= len(duree) else None,
                    "debut_ei": debut_ei[i]
                    if debut_ei and i + 1 <= len(debut_ei)
                    else None,
                    "fin_ei": fin_ei[i] if fin_ei and i + 1 <= len(fin_ei) else None,
                    "hlt": hlt[i] if hlt and i + 1 <= len(hlt) else None,
                    "hlgt": hlgt[i] if hlgt and i + 1 <= len(hlgt) else None,
                    "soc_long": soc_long[i]
                    if soc_long and i + 1 <= len(soc_long)
                    else None,
                    "evolution": evolution[i]
                    if evolution and i + 1 <= len(evolution)
                    else None,
                    "indication": indications[i]
                    if indications and i + 1 <= len(indications)
                    else None,
                }
            )

    df = pd.DataFrame(mesusages)

    df.debut_ei = df.debut_ei.apply(parse_date)
    df.fin_ei = df.fin_ei.apply(parse_date)
    df.debut_traitement = df.debut_traitement.apply(parse_date)
    df.fin_traitement = df.fin_traitement.apply(parse_date)
    df.date_notif = df.date_notif.apply(parse_date)

    df.age = df.age.apply(categorize_age)

    return df
