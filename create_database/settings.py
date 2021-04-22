from decouple import config
from sqlalchemy.types import Text, Date, String


ENV = config("ENV", default="staging")
BDPM_CIS_URL = config(
    "BDPM_CIS_URL",
    "https://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_bdpm.txt",
)
RSP_COMPO_URL = config(
    "RSP_COMPO_URL",
    "http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/lirecomp.php",
)
TMP_FOLDER = config("TMP_FOLDER", "/tmp")
DATA_FOLDER = config("DATA_FOLDER", "./data")
DBHOSTNAME = config("DBHOSTNAME")
DBUSERNAME = config("DBUSERNAME")
DBPWD = config("DBPWD")
DBNAME = config("DBNAME")

files = {
    "bdpm_cis": {
        "read_csv": {
            "sep": "\t",
            "encoding": "latin1",
            "names": [
                "cis",
                "nom",
                "forme_pharma",
                "voie_admin",
                "statut_amm",
                "type_amm",
                "etat_commercialisation",
                "date_amm",
                "statut_bdpm",
                "num_autorisation",
                "titulaires",
                "surveillance_renforcee",
            ],
            "header": None,
            "index_col": "cis",
            "parse_dates": ["date_amm"],
            "dtype": {"cis": str},
        },
        "to_sql": {
            "name": "specialite",
            "if_exists": "replace",
            "index": True,
            "dtype": {
                "cis": String(16),
                "nom": Text,
                "forme_pharma": Text,
                "voie_admin": Text,
                "statut_amm": Text,
                "type_amm": Text,
                "etat_commercialisation": Text,
                "date_amm": Date,
                "statut_bdpm": Text,
                "num_autorisation": Text,
                "titulaires": Text,
                "surveillance_renforcee": Text,
            },
        },
    },
    "rsp_compo": {
        "read_csv": {
            "sep": "\t",
            "encoding": "latin1",
            "names": [
                "cis",
                "elem_pharma",
                "code",
                "substance_active",
                "dosage",
                "ref_dosage",
                "nature_composant",
                "num_lien",
                "v",
            ],
            "header": None,
            "index_col": 2,
            "dtype": {"cis": str, "code": str},
        },
        "to_sql": {
            "name": "substance",
            "if_exists": "replace",
            "index": True,
            "dtype": {
                "code": String(16),
                "nom": Text,
            },
        },
    },
    "atc": {
        "source": {"pattern": "atc_names.json"},
        "to_sql": {
            "name": "classes_atc",
            "if_exists": "replace",
            "index": True,
            "dtype": {"code_atc": String(16)},
        },
    },
    "erreurs_med": {
        "source": {"pattern": "RqHackathon_20190911.xlsx"},
        "read_excel": {
            "usecols": "F:M,O:R",
            "names": [
                "lieu_erreur",
                "initial_erreur",
                "nature_erreur",
                "cause_erreur",
                "population_erreur",
                "qualif_erreur",
                "effet_indesirable",
                "gravite",
                "denomination",
                "dci",
                "atc",
                "voie",
            ],
        },
        "noms_lieux": {
            "ES": "Établissement de santé",
            "EMS": "Établissement médico-social",
            "HAD": "Domicile",
        },
        "no_info": [
            "population_erreur",
            "initial_erreur",
            "nature_erreur",
            "cause_erreur",
            "gravite",
            "effet_indesirable",
        ],
        "tables": {
            "lieu": ["lieu_erreur"],
            "population": ["population_erreur"],
            "initial": ["initial_erreur", "gravite"],
            "nature": ["nature_erreur", "gravite"],
            "cause": ["cause_erreur", "gravite"],
        },
        "to_sql": {
            "if_exists": "replace",
            "index": True,
        },
    },
}
