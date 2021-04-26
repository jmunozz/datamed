from decouple import config
from sqlalchemy.types import Integer, Text, Date, String, Float


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
DBURL= config("DBURL")
FILTER_THREESHOLD = config("FILTER_THREESHOLD", default=10, cast=int)

EXPOSITION = {
    "specialite": {1000: 1, 5000: 2, 15000: 3, 50000: 4},
    "substance": {5000: 1, 25000: 2, 100000: 3, 500000: 4},
}


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
    "rsp_compo": [
        {
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
                "index_col": "code",
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
        {
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
                "index_col": "cis",
                "dtype": {"cis": str, "code": str},
            },
            "to_sql": {
                "name": "specialite_substance",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "cis": String(16),
                    "code_substance": String(16),
                    "elem_pharma": Text,
                    "dosage": Text,
                    "ref_dosage": Text,
                },
            },
        },
    ],
    "atc": {
        "source": {"pattern": "atc_names.json"},
        "to_sql": {
            "name": "classes_atc",
            "if_exists": "replace",
            "index": True,
            "dtype": {"code_atc": String(16)},
        },
    },
    "cis_cip_bdpm": {
        "source": {"pattern": "CIS_CIP_bdpm.txt"},
        "read_csv": {
            "sep": "\t",
            "encoding": "latin1",
            "names": [
                "cis",
                "cip7",
                "libelle_presentation",
                "statut_admin_presentation",
                "etat_commercialisation",
                "date_declaration_commercialisation",
                "cip13",
                "agrement_collectivites",
                "taux_remboursement",
                "prix_medicament_euro",
                "chelou_1",
                "chelou_2",
                "indications_remboursement",
            ],
            "index_col": 0,
            "header": None,
            "dtype": {"cis": str, "cip13": str},
            "parse_dates": ["date_declaration_commercialisation"],
        },
        "to_sql": {
            "name": "presentation",
            "if_exists": "replace",
            "index": True,
            "dtype": {"cis": String(16)},
        },
    },
    "ordei_specialite": [
        {
            "source": {"pattern": "open_medic2014_2018_cis_agg.csv"},
            "read_csv": {
                "sep": ";",
                "dtype": {"cis": str},
                "usecols": ["cis", "age", "conso", "n_conso_an", "sexe"],
                "index_col": "cis",
                "header": 0,
                "names": ["index", "cis", "sexe", "age", "conso", "n_conso_an", "SEXE"],
            },
            "to_sql": {
                "name": "specialite_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {"cis": String(16), "exposition": Integer},
            },
        },
        {
            "to_sql": {
                "name": "specialite_patient_sexe_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "cis": String(16),
                    "sexe": Integer,
                    "conso": Integer,
                    "pourcentage_patients": Float,
                },
            }
        },
        {
            "to_sql": {
                "name": "specialite_patient_age_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "cis": String(16),
                    "age": Text,
                    "conso": Integer,
                    "pourcentage_patients": Float,
                },
            }
        },
    ],
    "ordei_substance": [
        {
            "source": {"pattern": "bnpv_open_medic1418_sa_codex.csv"},
            "read_csv": {
                "sep": ";",
                "encoding": "ISO-8859-1",
                "dtype": {"code": str},
                "usecols": [
                    "annee",
                    "sexe",
                    "age",
                    "substance",
                    "code",
                    "conso",
                    "cas",
                ],
                "index_col": "code",
                "header": 0,
                "names": [
                    "index",
                    "annee",
                    "sexe",
                    "age",
                    "substance",
                    "code",
                    "cas",
                    "conso",
                ],
            },
            "to_sql": {
                "name": "substance_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "code": String(16),
                    "exposition": Integer,
                    "cas": Integer,
                    "taux_cas": Float,
                    "annee": Integer,
                    "conso_annee": Integer,
                    "cas_annee": Integer,
                },
            },
        },
        {
            "to_sql": {
                "name": "substance_patient_sexe_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "code": String(16),
                    "sexe": Integer,
                    "conso": Integer,
                    "pourcentage_patients": Float,
                },
            }
        },
        {
            "to_sql": {
                "name": "substance_patient_age_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "code": String(16),
                    "age": Text,
                    "conso": Integer,
                    "pourcentage_patients": Float,
                },
            }
        },
        {
            "to_sql": {
                "name": "substance_cas_sexe_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "code": String(16),
                    "sexe": Integer,
                    "pourcentage_cas": Float,
                },
            }
        },
        {
            "to_sql": {
                "name": "substance_cas_age_ordei",
                "if_exists": "replace",
                "index": True,
                "dtype": {
                    "code": String(16),
                    "age": Text,
                    "pourcentage_cas": Float,
                },
            }
        },
    ],
    "ordei_notificateurs": {
        "source": {"pattern": "bnpv_notif_sa_codex_open.csv"},
        "read_csv": {
            "encoding": "ISO-8859-1",
            "sep": ";",
            "dtype": {"code": str},
            "usecols": [
                "notificateur",
                "substance_active",
                "code",
                "age",
                "sexe",
                "n_decla",
                "n_cas",
            ],
            "index_col": "code",
            "header": 0,
            "names": [
                "index",
                "notificateur",
                "substance_active",
                "code",
                "age",
                "sexe",
                "n_decla",
                "n_cas",
            ],
        },
        "to_sql": {
            "name": "substance_notif_ordei",
            "if_exists": "replace",
            "index": True,
            "dtype": {
                "code": String(16),
                "notificateur": Text,
                "pourcentage_decla": Float,
            },
        },
    },
    "ordei_soclong": {
        "source": {"pattern": "bnpv_eff_soclong_sa_codex_open.csv"},
        "read_csv": {
            "encoding": "ISO-8859-1",
            "sep": ";",
            "dtype": {"code": str},
            "usecols": [
                "substance_active",
                "code",
                "soc_long",
                "age",
                "sexe",
                "n_decla_eff",
                "n_cas",
            ],
            "index_col": "code",
            "header": 0,
            "names": [
                "index",
                "substance_active",
                "code",
                "soc_long",
                "age",
                "sexe",
                "n_decla_eff",
                "n_cas",
            ],
        },
        "to_sql": {
            "name": "substance_soclong_ordei",
            "if_exists": "replace",
            "index": True,
            "dtype": {"code": String(16), "soc_long": Text, "pourcentage_cas": Float},
        },
    },
    "ordei_soclong_hlt": {
        "source": {"pattern": "bnpv_eff_hlt_soclong_sa_codex_open.csv"},
        "read_csv": {
            "encoding": "ISO-8859-1",
            "sep": ";",
            "dtype": {"code": str},
            "usecols": [
                "subtance_active",
                "code",
                "age",
                "sexe",
                "effet_hlt",
                "soc_long",
                "n_decla_eff_hlt",
            ],
            "index_col": "code",
            "header": 0,
            "names": [
                "index",
                "subtance_active",
                "code",
                "age",
                "sexe",
                "effet_hlt",
                "soc_long",
                "n_decla_eff_hlt",
            ],
        },
        "to_sql": {
            "name": "substance_hlt_ordei",
            "if_exists": "replace",
            "index": True,
            "dtype": {
                "code": String(16),
                "soc_long": String(255),
                "effet_hlt": String(255),
                "pourcentage_cas": Float,
            },
        },
    },
    "cis_atc": {
        "source": {"pattern": "CIS-ATC_2021-01-04.xlsx"},
        "read_excel": {
            "dtype": {"cis": str},
            "index_col": "cis",
            "usecols": ["cis", "atc", "nom_atc"],
            "names": ["cis", "atc", "nom_atc"],
        },
        "to_sql": {
            "name": "specialite_atc",
            "index": True,
            "if_exists": "replace",
            "dtype": {"cis": String(16)},
        },
    },
}
