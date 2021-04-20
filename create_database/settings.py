from decouple import config
from sqlalchemy.types import Integer, Text, Date


ENV = config("ENV", default="staging")
BDPM_CIS_URL = config("BDPM_CIS_URL", "https://base-donnees-publique.medicaments.gouv.fr/telechargement.php?fichier=CIS_bdpm.txt")
TMP_FOLDER = config("TMP_FOLDER", "/tmp")
DBHOSTNAME= config("DBHOSTNAME")
DBUSERNAME= config("DBUSERNAME")
DBPWD= config("DBPWD")
DBNAME= config("DBNAME")



files = {
    "bdpm_cis": {
        "read_csv": {
            "sep":"\t",
            "encoding":"latin1",
            "names":[
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
                "surveillance_renforcee"
            ],
            "header": None,
            "parse_dates":["date_amm"],
            "dtype":{"cis": str},    
        },
        "to_sql": {
            "name": "specialite",
            "if_exists": "replace",
            "index": "False",
            "dtype": {
                "cis": Text,
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
            }
        }
    }
}