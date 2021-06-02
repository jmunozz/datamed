import math
from datetime import datetime as dt
from os import path
from typing import Dict, Optional

import pandas as pd
from tqdm import tqdm

import db
import erreurs_med as em
import mesusage
import helpers
import settings
from logos_formes_pharma import get_specialite_icon

engine = db.connect_db()


def create_table_cis_atc(_settings: Dict):
    df = helpers.load_excel_to_df(_settings)
    db.create_table_from_df(df, _settings["to_sql"])


def create_table_bdpm_cis(_settings: Dict):
    fpath = helpers.download_file_from_url(
        settings.BDPM_CIS_URL, path.join(settings.TMP_FOLDER, "BDPM_CIS.txt")
    )
    df = helpers.load_csv_to_df(_settings, path=fpath)
    # cleaning
    helpers.serie_to_lowercase(df, _settings["read_csv"]["names"][1:])
    db.create_table_from_df(df, _settings["to_sql"])


def create_tables_rsp_compo(_settings: Dict):
    fpath = helpers.download_file_from_url(
        settings.RSP_COMPO_URL, path.join(settings.TMP_FOLDER, "RSP_COMPO.txt")
    )
    # table substance
    df = helpers.load_csv_to_df(_settings[0], path=fpath)
    # cleaning
    df = df[df.nature_composant == "SA"]
    df = df.rename(columns={"substance_active": "nom"})
    df = df[["nom"]]
    df = df[~df.index.duplicated(keep="first")]
    helpers.serie_to_lowercase(df, ["nom"])
    db.create_table_from_df(df, _settings[0]["to_sql"])
    # table specialite_substance
    df = helpers.load_csv_to_df(_settings[1], path=fpath)
    # cleaning
    df = df[df.nature_composant == "SA"]
    df = df[["code", "elem_pharma", "dosage", "ref_dosage"]]
    df = df.rename(columns={"code": "code_substance"})
    db.create_table_from_df(df, _settings[1]["to_sql"])


def create_table_atc(_settings: Dict):
    fpath = helpers.find_file(settings.DATA_FOLDER, _settings["source"]["pattern"])
    if fpath.exists():
        df = load_to_df_atc(fpath)
        db.create_table_from_df(df, _settings["to_sql"])


def load_to_df_atc(fpath):
    serie = pd.read_json(fpath, typ="series")
    df = serie.to_frame("label")
    df.index.set_names(names="code", inplace=True)
    return df


def create_table_cis_cip_bdpm(_settings: Dict):
    df = helpers.load_csv_to_df(_settings)
    # cleaning
    df = df.drop(
        ["prix_medicament_euro", "chelou_1", "chelou_2", "indications_remboursement"],
        axis=1,
    )
    df = df.where(pd.notnull(df), None)
    db.create_table_from_df(df, _settings["to_sql"])


# ORDEI


def round_small_values(conso_value: int) -> Optional[int]:
    if conso_value <= 10:
        return None
    if 10 < conso_value < 50:
        return 50
    elif 50 <= conso_value < 95:
        return 100
    else:
        return round(conso_value, -int(math.log10(conso_value)))


def create_spe_conso_ordei_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    df = df.groupby("cis").agg(n_conso_an=("n_conso_an", "sum"), conso=("conso", "sum"))
    df["exposition"] = df["n_conso_an"].apply(
        helpers.get_exposition_level, type="specialite"
    )
    df["conso_an_trunc"] = df.n_conso_an.apply(round_small_values)
    df = df[["conso_an_trunc", "exposition"]]
    db.create_table_from_df(df, _settings[0]["to_sql"])


def create_spe_patients_sexe_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    conso = df.groupby(["cis", "sexe"]).conso.sum().rename("conso")
    conso_pct = (
        conso.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100)
        .rename("pourcentage_patients")
    )
    final_df = pd.merge(conso, conso_pct, on=["cis", "sexe"])
    final_df.drop(["conso"], axis=1, inplace=True)
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[1]["to_sql"])


def create_spe_patients_age_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    conso = df.groupby(["cis", "age"]).conso.sum().rename("conso")
    conso_pct = (
        conso.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100)
        .rename("pourcentage_patients")
    )
    final_df = pd.merge(conso, conso_pct, on=["cis", "age"])
    final_df.drop(["conso"], axis=1, inplace=True)
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[2]["to_sql"])


def create_substance_ordei_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    df_by_years = df.groupby(["code", "annee"]).agg(
        conso_annee=("conso", "sum"), cas_annee=("cas", "sum")
    )
    df_by_code = df_by_years.groupby("code").agg(
        conso=("conso_annee", "sum"),
        cas=("cas_annee", "sum"),
        exposition=(
            "conso_annee",
            lambda x: helpers.get_total_exposition_level(x, "substance"),
        ),
    )
    final_df = df_by_years.join(df_by_code, on="code")
    final_df = helpers.filter_df_on_low_values(final_df, ["cas", "cas_annee"])
    final_df["taux_cas"] = final_df.apply(
        axis=1, func=lambda x: x.cas * 100000 / x.conso if x.cas >= 10 else None
    )
    final_df["conso_an_trunc"] = final_df.conso.apply(
        lambda x: round_small_values(x / 5)
    )

    final_df.drop(["conso"], inplace=True, axis=1)
    final_df.reset_index(inplace=True, level=["annee"])
    db.create_table_from_df(final_df, _settings[0]["to_sql"])


def create_substance_patients_sexe_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    df.sexe = df.sexe.apply(lambda x: helpers.mapSexeToCode(x))
    conso = df.groupby(["code", "sexe"]).conso.sum().rename("conso")
    conso = helpers.filter_serie_on_low_values(conso)
    conso_pct = (
        conso.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100 if x is not None else None)
        .rename("pourcentage_patients")
    )
    final_df = pd.merge(conso, conso_pct, on=["code", "sexe"])
    final_df.pourcentage_patients = final_df.apply(
        lambda x: x.pourcentage_patients
        if not final_df.loc[x.name[0]].pourcentage_patients.isnull().values.any()
        else None,
        axis=1,
    )
    final_df.drop(["conso"], inplace=True, axis=1)
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[1]["to_sql"])


def create_substance_patients_age_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    conso = df.groupby(["code", "age"]).conso.sum().rename("conso")
    conso = helpers.filter_serie_on_low_values(conso)
    conso_pct = (
        conso.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100 if x is not None else None)
        .rename("pourcentage_patients")
    )
    final_df = pd.merge(conso, conso_pct, on=["code", "age"])
    final_df.pourcentage_patients = final_df.apply(
        lambda x: x.pourcentage_patients
        if not final_df.loc[x.name[0]].pourcentage_patients.isnull().values.any()
        else None,
        axis=1,
    )
    final_df.reset_index(inplace=True, level=["age"])
    final_df.drop(["conso"], inplace=True, axis=1)
    db.create_table_from_df(final_df, _settings[2]["to_sql"])


def create_substance_cas_sexe_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    df.sexe = df.sexe.apply(lambda x: helpers.mapSexeToCode(x))
    cas = df.groupby(["code", "sexe"]).cas.sum().rename("cas")
    cas = helpers.filter_serie_on_low_values(cas)
    cas_pct = (
        cas.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100 if cas is not None else None)
        .rename("pourcentage_cas")
    )
    final_df = pd.merge(cas, cas_pct, on=["code", "sexe"])
    final_df.pourcentage_cas = final_df.apply(
        lambda x: x.pourcentage_cas
        if not final_df.loc[x.name[0]].pourcentage_cas.isnull().values.any()
        else None,
        axis=1,
    )
    final_df.drop(["cas"], axis=1, inplace=True)
    final_df.reset_index(inplace=True, level=["sexe"])
    db.create_table_from_df(final_df, _settings[3]["to_sql"])


def create_substance_cas_age_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings[0])
    cas = df.groupby(["code", "age"])["cas"].sum().rename("cas")
    cas = helpers.filter_serie_on_low_values(cas)
    cas_pct = (
        cas.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100 if cas is not None else None)
        .rename("pourcentage_cas")
    )
    final_df = pd.merge(cas, cas_pct, on=["code", "age"])
    final_df.pourcentage_cas = final_df.apply(
        lambda x: x.pourcentage_cas
        if not final_df.loc[x.name[0]].pourcentage_cas.isnull().values.any()
        else None,
        axis=1,
    )
    final_df.drop(["cas"], axis=1, inplace=True)
    final_df.reset_index(inplace=True, level=["age"])
    db.create_table_from_df(final_df, _settings[4]["to_sql"])


def create_notificateurs_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings)
    decla = df.groupby(["code", "notificateur"]).n_decla.sum()
    decla_pct = (
        decla.groupby(level=0)
        .apply(lambda x: x / x.sum() * 100)
        .rename("pourcentage_notif")
    )
    final_df = pd.merge(decla, decla_pct, on=["code", "notificateur"])
    final_df.pourcentage_notif = final_df.apply(
        lambda x: x.pourcentage_notif if x.n_decla > 10 else None, axis=1
    )
    final_df.drop(["n_decla"], axis=1, inplace=True)
    final_df.reset_index(inplace=True, level=["notificateur"])
    db.create_table_from_df(final_df, _settings["to_sql"])


def create_substance_soclong_table(_settings: Dict):
    df = helpers.load_csv_to_df(_settings)
    total_case_per_sex_and_age = df.groupby(["code", "sexe", "age"]).agg(
        {"n_cas": "max"}
    )
    total_case = total_case_per_sex_and_age.groupby("code").agg({"n_cas": "sum"})
    decla_eff = (
        df.groupby(["code", "soc_long"]).n_decla_eff.sum().reset_index(level="soc_long")
    )
    final_df = pd.merge(total_case, decla_eff, left_index=True, right_on=["code"])
    final_df = helpers.filter_df_on_low_values(final_df, ["n_decla_eff", "n_cas"])
    final_df["pourcentage_cas"] = final_df.apply(
        lambda x: x.n_decla_eff / x.n_cas * 100 if x.n_decla_eff and x.n_cas else None,
        axis=1,
        result_type="expand",
    )
    final_df.drop(["n_cas", "n_decla_eff"], inplace=True, axis=1)
    db.create_table_from_df(final_df, _settings["to_sql"])


def create_hlt_table(_settings_soclong: Dict, _settings: Dict):
    df = helpers.load_csv_to_df(_settings)
    soclong_df = helpers.load_csv_to_df(_settings_soclong)
    decla_eff = soclong_df.groupby(["code", "soc_long"]).agg({"n_decla_eff": "sum"})
    hlt = df.groupby(["code", "soc_long", "effet_hlt"]).agg({"n_decla_eff_hlt": "sum"})
    hlt.reset_index(["effet_hlt"], inplace=True)

    tmp_df = pd.merge(decla_eff, hlt, left_index=True, right_index=True)

    soclong_hlt = (
        tmp_df.groupby(["code", "soc_long"])
        .n_decla_eff_hlt.sum()
        .rename("n_decla_eff_soclong")
    )
    final_df = pd.merge(tmp_df, soclong_hlt, left_index=True, right_index=True)

    final_df["pourcentage_cas"] = final_df.apply(
        lambda x: x.n_decla_eff_hlt / x.n_decla_eff_soclong * 100,
        axis=1,
        result_type="expand",
    )
    final_df.pourcentage_cas = final_df.apply(
        lambda x: x.pourcentage_cas if x.n_decla_eff_hlt >= 10 else None, axis=1
    )
    final_df.reset_index(["soc_long"], inplace=True)
    final_df.drop(
        ["n_decla_eff_soclong", "n_decla_eff_hlt", "n_decla_eff"], inplace=True, axis=1
    )
    db.create_table_from_df(final_df, _settings["to_sql"])


def create_table_emed(_settings: Dict):
    df = helpers.load_excel_to_df(_settings)
    df = em.clean_emed_df(df, _settings)

    df_spe = pd.read_sql("specialite", engine)
    df_spe = df_spe.set_index("cis")

    df_corresp = em.get_corresp_df(df, df_spe)
    args_corresp = {**{"name": "erreur_med_cis_denomination"}, **_settings["to_sql"]}
    db.create_table_from_df(df_corresp, args_corresp)

    for table_name, table_column in tqdm(_settings["tables"].items()):
        print("{} table creation".format(table_name))
        df_table = em.get_table_df(df, df_spe, table_column)
        args = {
            **{"name": "erreur_med_{}".format(table_name)},
            **_settings["to_sql"],
        }
        db.create_table_from_df(df_table, args)


def get_circuit(row: pd.Series) -> Optional[str]:
    if row.Circuit_Touche_Ville == "NR" and row.Circuit_Touche_Hopital == "NR":
        return None
    elif row.Circuit_Touche_Ville == "VILLE":
        return "ville"
    elif row.Circuit_Touche_Hopital == "HOPITAL":
        return "hôpital"
    elif row.Circuit_Touche_Ville == "HOPITAL/VILLE":
        return "ville et hôpital"


def get_old_ruptures_df(df_spe: pd.DataFrame) -> pd.DataFrame:
    """
    Table ruptures
    """
    df = pd.read_excel(
        "data/Annexe 1_ListeDesRuptures.xlsx",
        sheet_name="BDD Ruptures",
        header=0,
        parse_dates=[
            "DatePrevi_Ville",
            "DatePrevi_Hôpital",
        ],
        usecols=[
            "Signalement",
            "Date Signalement",
            "Laboratoire",
            "Spécialité",
            "Rupture",
            "Etat dossier",
            "ATC",
            "DCI",
            "Indications",
            "Circuit_Touche_Ville",
            "Circuit_Touche_Hopital",
            "DatePrevi_Ville",
            "DatePrevi_Hôpital",
            "Cause propre",
        ],
    )

    df = df.rename(
        columns={
            "Signalement": "numero",
            "Date Signalement": "date",
            "Laboratoire": "laboratoire",
            "Spécialité": "nom",
            "Rupture": "classification",
            "Etat dossier": "etat",
            "ATC": "atc",
            "DCI": "dci",
            "Indications": "indications",
            "DatePrevi_Ville": "prevision_remise_dispo_ville",
            "DatePrevi_Hôpital": "prevision_remise_dispo_hopital",
            "Cause propre": "cause",
        }
    )

    df["circuit"] = df.apply(get_circuit, axis=1)

    # If "ville et hôpital", insert two rows: one "ville" and one "hôpital"
    s = df.circuit.str.split(" et ").apply(pd.Series, 1).stack()
    s.index = s.index.droplevel(-1)  # to line up with df's index
    s.name = "circuit"
    del df["circuit"]
    df = df.join(s)

    df = df.drop(["Circuit_Touche_Ville", "Circuit_Touche_Hopital"], axis=1)
    df.cause = df.cause.str.lower()
    df.dci = df.dci.str.lower()
    df.laboratoire = df.laboratoire.str.lower().str.capitalize()
    df.nom = df.nom.str.lower()
    df.classification = df.classification.str.lower()
    df.etat = df.etat.str.lower()
    df = df.where(pd.notnull(df), None)
    df = df.drop_duplicates()

    df = df.merge(df_spe[["cis", "nom"]], on="nom", how="left")
    return df


def create_table_mesures(_settings: Dict):
    df = helpers.load_csv_to_df(_settings)
    df = df.rename(
        columns={
            "Etat": "etat_mesure",
            "Numéro Rupture": "numero",
            "Identifiant": "identifiant",
            "Description": "description",
            "Nom Produit": "nom",
            "Demande de mise en place": "date_demande",
            "Date mise en place": "date_mise_en_place",
            "Date de fin prévisionnelle": "date_previ_fin",
            "Date de clotûre": "date_cloture",
            "Justification": "justification",
        }
    )
    helpers.serie_to_lowercase(df, ["etat_mesure", "nom"])
    db.create_table_from_df(df, _settings["to_sql"])


def create_table_ruptures(_settings_ruptures: Dict, _settings_signalements: Dict):
    df_spe = pd.read_sql("specialite", engine).reset_index()
    df_old = get_old_ruptures_df(df_spe)

    df = helpers.load_csv_to_df(_settings_ruptures).reset_index()
    df = df.where(pd.notnull(df), None)
    df["cause"] = None
    helpers.serie_to_lowercase(
        df, ["etat", "classification", "nom", "nom_atc", "circuit", "laboratoire"]
    )
    df.laboratoire = df.laboratoire.str.capitalize()
    df.indications = df.indications.apply(lambda x: x.replace("  T", ", T"))

    df.date = df.date.apply(lambda x: dt.strptime(x, "%d/%m/%Y") if x else None)
    df.debut_ville = df.debut_ville.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y") if x else None
    )
    df.prevision_remise_dispo_ville = df.prevision_remise_dispo_ville.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y") if x else None
    )
    df.debut_hopital = df.debut_hopital.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y") if x else None
    )
    df.prevision_remise_dispo_hopital = df.prevision_remise_dispo_hopital.apply(
        lambda x: dt.strptime(x, "%d/%m/%Y") if x else None)

    df.cip13 = df.cip13.astype(str)

    df_pres = pd.read_sql("presentation", engine)
    df = df.merge(df_pres[["cip13", "cis"]], on="cip13", how="left")

    df_tot = pd.concat([df, df_old], axis=0, ignore_index=True)
    df_tot["atc2"] = df_tot.atc.apply(lambda x: x[:3] if x else None)
    df_tot["annee"] = df_tot.date.dt.year

    df_tot = df_tot.where(pd.notnull(df_tot), None)

    create_table_signalements(df_tot, df_pres, _settings_signalements)

    df_tot = df_tot.set_index("numero")
    db.create_table_from_df(df_tot, _settings_ruptures["to_sql"])


def create_table_signalements(df: pd.DataFrame, df_pres: pd.DataFrame, _settings: Dict):
    df_atc = pd.read_sql("classes_atc", engine)
    df = df.merge(df_atc, left_on="atc2", right_on="code", how="left")

    df_spe = pd.read_sql("specialite_atc", engine)
    df_spe["atc2"] = df_spe.atc.apply(lambda x: x[:3])
    df_spe = df_spe.merge(df_atc, left_on="atc2", right_on="code", how="left")

    df_pres = df_pres.merge(df_spe[["cis", "atc2", "label"]], on="cis", how="left")

    df_pres_atc = df_pres.groupby("label").cip13.count().reset_index()
    df_pres_atc = df_pres_atc.rename(columns={"cip13": "nb_presentations"})

    df_sig = df.groupby(["annee", "label"]).numero.count().reset_index()
    df_sig = df_sig.rename(columns={"numero": "nb_signalements"}).sort_values(
        by="nb_signalements", ascending=False
    )
    df_sig = df_sig.merge(df_pres_atc, on="label", how="left").sort_values(
        by=["annee", "nb_signalements"], ascending=False
    )
    df_sig = df_sig.set_index("annee")

    db.create_table_from_df(df_sig, _settings["to_sql"])


def create_table_icones(_settings: Dict):
    df = pd.read_sql("specialite", engine)
    df = df[["cis", "forme_pharma"]]
    df["icone"] = df.forme_pharma.apply(lambda x: get_specialite_icon(x))
    db.create_table_from_df(df.set_index("cis"), _settings["to_sql"])


def create_table_mesusage(_settings: Dict):
    df = helpers.load_excel_to_df(_settings)
    df = mesusage.clean_df(df, _settings)
    df = mesusage.reformat_dataframe(df)

    df_spe = pd.read_sql("specialite", engine)
    df = df.merge(df_spe[["cis", "nom"]], on="nom", how="left")

    for table_name, table_columns in _settings["tables"].items():
        if table_name.startswith("mesusage_global"):
            df_agg = mesusage.get_proporition_df(df, table_columns)
            args = {
                **{"name": table_name},
                **_settings["to_sql"],
            }
            db.create_table_from_df(df_agg, args)
        else:
            df_agg = mesusage.get_proporition_df(df, table_columns)
            df_agg = df_agg.set_index("cis")
            args = {
                **{"name": table_name},
                **_settings["to_sql"],
            }
            db.create_table_from_df(df_agg, args)



create_table_bdpm_cis(settings.files["bdpm_cis"])
create_tables_rsp_compo(settings.files["rsp_compo"])
create_table_cis_cip_bdpm(settings.files["cis_cip_bdpm"])
create_table_atc(settings.files["atc"])
create_table_cis_atc(settings.files["cis_atc"])

# Ordei
create_spe_conso_ordei_table(settings.files["ordei_specialite"])
create_spe_patients_sexe_table(settings.files["ordei_specialite"])
create_spe_patients_age_table(settings.files["ordei_specialite"])
create_substance_ordei_table(settings.files["ordei_substance"])
create_substance_patients_sexe_table(settings.files["ordei_substance"])
create_substance_patients_age_table(settings.files["ordei_substance"])
create_substance_cas_sexe_table(settings.files["ordei_substance"])
create_substance_cas_age_table(settings.files["ordei_substance"])
create_notificateurs_table(settings.files["ordei_notificateurs"])
create_substance_soclong_table(settings.files["ordei_soclong"])
create_hlt_table(settings.files["ordei_soclong"], settings.files["ordei_soclong_hlt"])

# Erreurs médicamenteuses
create_table_emed(settings.files["erreurs_med"])

# TrustMed
create_table_ruptures(settings.files["ruptures"], settings.files["signalements"])
create_table_mesures(settings.files["mesures"])

# Logos
create_table_icones(settings.files["icones"])

# Mésusage
create_table_mesusage(settings.files["mesusage"])