import pandas as pd
import db

engine = db.connect_db()


def get_ruptures_df() -> pd.DataFrame:
    return pd.read_excel(
        "data/Annexe 1_ListeDesRuptures.xlsx", header=0, sheet_name="BDD Ruptures"
    )


def clean_data(df: pd.DataFrame) -> pd.DataFrame:
    # Cleaning
    df = df[
        [
            "ID_Signal",
            "Signalement",
            "Date Signalement",
            "Laboratoire",
            "Spécialité",
            "Rupture",
            "Etat dossier",
            "Circuit_Touche_Ville",
            "Circuit_Touche_Hopital",
            "ATC",
            "DCI",
            "Date_Signal_Debut_RS",
            "Durée_Ville",
            "Durée_Hôpital",
            "DatePrevi_Ville",
            "DatePrevi_Hôpital",
            "Origine_Cause_RS",
            "Cause propre",
        ]
    ]
    df = df.rename(
        columns={
            "ID_Signal": "id_signal",
            "Signalement": "signalement",
            "Date Signalement": "date_signalement",
            "Laboratoire": "laboratoire",
            "Spécialité": "specialite",
            "Rupture": "rupture",
            "Etat dossier": "etat_dossier",
            "Circuit_Touche_Ville": "circuit_touche_ville",
            "Circuit_Touche_Hopital": "circuit_touche_hopital",
            "ATC": "atc",
            "DCI": "dci",
            "Date_Signal_Debut_RS": "date_signal_debut_rs",
            "Durée_Ville": "duree_ville",
            "Durée_Hôpital": "duree_hopital",
            "DatePrevi_Ville": "date_previ_ville",
            "DatePrevi_Hôpital": "date_previ_hopital",
            "Origine_Cause_RS": "origine_cause_rs",
            "Cause propre": "cause_propre",
        }
    )

    df.atc = df.atc.str.upper()
    df.specialite = df.apply(
        lambda x: x.specialite.replace(" /", "/")
        .replace("/ ", "/")
        .replace("intraoculaire", "intra-oculaire"),
        axis=1,
    )
    df.dci = df.dci.str.lower()
    df.laboratoire = df.laboratoire.str.lower()
    df.specialite = df.specialite.str.lower()
    df.rupture = df.rupture.str.lower()
    df.etat_dossier = df.etat_dossier.str.lower()
    df.duree_ville = df.duree_ville.str.lower()
    df.duree_hopital = df.duree_hopital.str.lower()
    df.circuit_touche_ville = df.circuit_touche_ville.str.lower()
    df.circuit_touche_hopital = df.circuit_touche_hopital.str.lower()
    df.origine_cause_rs = df.origine_cause_rs.str.lower()
    df.cause_propre = df.cause_propre.str.lower()
    df.date_signalement = pd.to_datetime(df.date_signalement).apply(lambda x: x.date())
    df.date_signal_debut_rs = pd.to_datetime(df.date_signal_debut_rs).apply(
        lambda x: x.date()
    )
    df.date_previ_ville = pd.to_datetime(df.date_previ_ville).apply(lambda x: x.date())
    df.date_previ_hopital = pd.to_datetime(df.date_previ_hopital).apply(
        lambda x: x.date()
    )
    df = df.where(pd.notnull(df), None)
    df = df.drop_duplicates()
    return df


def get_spe_dataframe() -> pd.DataFrame:
    return pd.read_sql("specialite", engine)


def get_pres_dataframe() -> pd.DataFrame:
    return pd.read_sql("presentation", engine)


def get_atc_dataframe() -> pd.DataFrame:
    return pd.read_sql("classes_atc", engine)


def get_spe_atc(df: pd.DataFrame, df_spe: pd.DataFrame):
    atc_list = df.atc.unique()

