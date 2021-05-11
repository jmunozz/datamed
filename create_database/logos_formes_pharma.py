ICONS_DICT = {
    "collyre": ["collyre", "collyre en solution", "oculaire"],
    "comprimé": ["comprimé", "tablette", "pilule", "film orodispersible"],
    "crème": ["crème", "gel", "lotion", "pommade", "mousse", "pâte"],
    "liquide": ["liquide", "émulsion", "solution"],
    "gaz": ["gaz", "inhalation"],
    "granule": ["granule", "granulé", "graines"],
    "gélule": ["gélule", "capsule"],
    "plante": ["plante", "cataplasme"],
    "poudre": ["poudre", "poudre pour suspension buvable", "lyophilisat"],
    "implant": ["implant", "tampon"],
    "seringue": ["injectable", "injection", "perfusion"],
    "pansement": ["pansement", "compresse", "emplâtre"],
    "sirop": ["sirop", "bain de bouche", "buvable"],
    "suppositoire": ["suppositoire", "ovule"],
    "spray": ["pulvérisation", "collutoire"],
}


def get_specialite_icon(spe: str) -> str:
    specialite_icons = [
        forme_pharma
        for forme_pharma, icons_list in ICONS_DICT.items()
        if any(icon in spe for icon in icons_list)
    ]

    if not specialite_icons:
        return "autre"
    if len(specialite_icons) > 1:
        if "liquide" == specialite_icons[0]:
            specialite_icons.remove("liquide")
            return specialite_icons[0]
        if "poudre" in specialite_icons and "sirop" in specialite_icons:
            return "poudre"
        else:
            return "multi"
    else:
        return specialite_icons[0]
