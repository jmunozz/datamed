from app import app

NOTIF_IMAGE_URL = {
    "Autre professionnel de santé": app.get_asset_url("./doctor_1.svg"),
    "Dentiste": app.get_asset_url("./surgeon_1.svg"),
    "Infirmière": app.get_asset_url("./nurse_1.svg"),
    "Médecin généraliste": app.get_asset_url("./doctor_2.svg"),
    "Pharmacien": app.get_asset_url("./pharmacist.svg"),
    "Inconnu": app.get_asset_url("./face.svg"),
    "Non professionnel de santé": app.get_asset_url("./face.svg"),
    "Médecin spécialiste": app.get_asset_url("./surgeon_1.svg"),
}

NOTIF_NOM = {
    "Autre professionnel de santé": "Autre professionnel de santé",
    "Dentiste": "Dentiste",
    "Infirmière": "Infirmier",
    "Médecin généraliste": "Médecin généraliste",
    "Pharmacien": "Pharmacien",
    "Inconnu": "Inconnu",
    "Non professionnel de santé": "Patient",
    "Médecin spécialiste": "Médecin spécialiste",
}


UTILISATION = {
    1: "Utilisation très faible",
    2: "Utilisation faible",
    3: "Utilisation modérée",
    4: "Utilisation élevée",
    5: "Utilisation très élevée",
    "-": "Utilisation inconnue",
}

UTILISATION_IMG_URL = {
    "-": app.get_asset_url("indice-nodata.svg"),
    1: app.get_asset_url("indice-1.svg"),
    2: app.get_asset_url("indice-2.svg"),
    3: app.get_asset_url("indice-3.svg"),
    4: app.get_asset_url("indice-4.svg"),
    5: app.get_asset_url("indice-5.svg"),
}

SEXE = {1: "Hommes", 2: "Femmes"}

SEXE_IMG_URL = {
    1: app.get_asset_url("man_bw_150.svg"),
    2: app.get_asset_url("woman_bw_150.svg"),
}
