import paths
from create_tables import upload_cis_from_rsp

LOGOS_DICT = {
    "collyre": "collyre",
    "oculaire": "collyre",
    "comprimé": "comprimé",
    "tablette": "comprimé",
    "pilule": "comprimé",
    "film orodispersible": "comprimé",
    "crème": "crème",
    "gel": "crème",
    "lotion": "crème",
    "pommade": "crème",
    "mousse": "crème",
    "pâte": "crème",
    "émulsion": "liquide",
    "solution": "liquide",
    "gaz": "gaz",
    "inhalation": "gaz",
    "granule": "granule",
    "granulé": "granule",
    "graines": "granules",
    "gélule": "gélule",
    "capsule": "gélule",
    "plante": "plante",
    "cataplasme": "plante",
    "poudre": "poudre",
    "lyophilisat": "poudre",
    "implant": "implant",
    "tampon": "implant",
    "injectable": "seringue",
    "injection": "seringue",
    "pansement": "pansement",
    "compresse": "pansement",
    "emplâtre": "pansement",
    "perfusion": "seringue",
    "sirop": "sirop",
    "bain de bouche": "sirop",
    "buvable": "sirop",
    "suppositoire": "suppositoire",
    "ovule": "suppositoire",
    "pulvérisation": "spray",
    "collutoire": "spray",
}


def get_specialite_logo(spe: str) -> str:
    specialite_logos = [
        LOGOS_DICT[forme_pharma]
        for forme_pharma in LOGOS_DICT.keys()
        if forme_pharma in spe
    ]
    if not specialite_logos:
        return "autre"
    if len(specialite_logos) > 1:
        if "liquide" in specialite_logos:
            specialite_logos.remove("liquide")
            return specialite_logos[0]
        else:
            return "multi"
    else:
        return specialite_logos[0]


def get_data():
    df = upload_cis_from_rsp(paths.P_CIS_RSP)

    df["logo"] = df.forme_pharma.apply(lambda x: get_specialite_logo(x))

    df[["cis", "nom_spe_pharma", "forme_pharma", "logo"]].to_csv(
        "~/Desktop/logos_spécialités.csv", index=False, sep=";"
    )
