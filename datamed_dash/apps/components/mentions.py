from app import app
from dash.development.base_component import Component
from dash_html_components import Div, Img, A

from .commons import SingleSection


def FirstSection() -> Component:
    return Div(
        [
            SingleSection(
                "Éditeur",
                [
                    Div(
                        "Agence Nationale de Sécurité du Médicament et des produits de santé",
                        className="normal-text-bold",
                    ),
                    Div(
                        "143-147 Boulevard Anatole France",
                    ),
                    Div(
                        "93285 Saint-Denis Cedex",
                    ),
                    Div(
                        "Tél : +33(0)1 55 87 30 00",
                    ),
                    Div(
                        "Fax : +33(0)1 55 87 30 12",
                    ),
                    Div(
                        "Directrice de la publication : Direction Générale de l'ANSM",
                    ),
                    Div(
                        "Pour contacter les webmasters : webmaster@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Hébergeur",
                [
                    A(
                        "ITS Integra",
                        href="https://www.itsintegra.com/",
                        className="ExternalLink",
                    ),
                    Div(
                        "42 rue de Bellevue",
                    ),
                    Div(
                        "92100 Boulogne-Billancourt",
                    ),
                    Div(
                        "Tél : +33(0)1 78 89 35 00",
                    ),
                    Div(
                        "Mail : contact@itsgroup.com",
                    ),
                ],
            ),
            SingleSection(
                "Conception et Développement",
                [
                    A(
                        "Entrepreneurs d'Intérêt Général",
                        href="https://entrepreneur-interet-general.etalab.gouv.fr/",
                        className="ExternalLink",
                    ),
                    Div(
                        "Line Rahal : line.rahal@ansm.sante.fr",
                    ),
                    Div("Joëlle Chong : joelle.chong@ansm.sante.fr", className="mb-3"),
                    A(
                        "Studio 67",
                        href="",
                        className="ExternalLink",
                    ),
                    Div(
                        "Jordan Munoz : jordan@studio67.fr",
                    ),
                ],
            ),
            SingleSection(
                "Utilisation des données et Copyright",
                [
                    Div(
                        "Les données et les informations présentes sur le site Internet "
                        "www.data.ansm.sante.fr sont mises à disposition du public par l'Agence "
                        "Nationale de Sécurité du Médicament et des produits de santé.",
                    ),
                    Div(
                        "Ces informations sont protégées par la Convention de Berne sur la Protection des "
                        "œuvres littéraires et artistiques, par d'autres conventions internationales et par les "
                        "législations nationales sur le droit d'auteur et les droits dérivés. "
                        "L'information et les données contenues sur le site Internet peuvent faire "
                        "l'objet de revues, ou être reproduites ou traduites à des fins de recherche ou "
                        "d'étude personnelle, mais ne peuvent être ni vendues ni utilisées à des fins commerciales.",
                        className="mb-3",
                    ),
                    Div(
                        "Toute utilisation des données ou des informations provenant du site data.ansm doit "
                        "obligatoirement mentionner l'ANSM en tant que source de l'information.",
                        className="normal-text-bold mb-3",
                    ),
                    Div(
                        "La reproduction, la traduction, ou toute utilisation de données ou d’informations "
                        "provenant du site Internet de l’ANSM à des fins autres que personnelles, éducatives "
                        "ou non commerciales, est subordonnée à l'obtention préalable d'une autorisation écrite "
                        "formelle de la directrice générale de l’ANSM.",
                    ),
                ],
            ),
            SingleSection(
                "Établissement de liens",
                [
                    Div(
                        "Tout site public ou privé est autorisé à établir, sans autorisation préalable, "
                        "un lien vers la page d’accueil ou directement vers les informations diffusées "
                        "par le site www.data.ansm.sante.fr.",
                    ),
                    Div(
                        "Mais en aucun cas les pages du site www.data.ansm.sante.fr ne doivent se retrouver "
                        "imbriquées à l'intérieur des pages d'un autre site. Tout doit être fait pour indiquer "
                        "clairement à l’internaute qu’il se trouve sur le site www.data.ansm.sante.fr et lui "
                        "permettre d’y naviguer librement.",
                        className="mb-3",
                    ),
                    Div(
                        "Pour sa part, l’ANSM établit des liens uniquement sur les sites publics et n'est en rien "
                        "responsable de liens qui sont faits vers son site. Cependant, si vous créez un lien vers "
                        "l’ANSM, nous apprécierions d’en être informés par un simple mail à : webmaster@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Avertissement général",
                [
                    Div(
                        "La mention de firmes ou de produits commerciaux n'implique pas que ces "
                        "firmes ou produits commerciaux sont agréés ou recommandés par l'ANSM.",
                    ),
                ],
            ),
            SingleSection(
                "Protection des données à caractère personnel",
                [
                    Div(
                        "Le site data.ansm ne contient aucune donnée à caractère personnel. Les données publiées "
                        "sont issues des bases de données de l'ANSM et ont fait l'objet d'une anonymisation afin "
                        "de garantir la protection de la vie privée des patients. Pour cela, seules des données "
                        "agrégées sont mises en ligne. Lorsqu'un effet indésirable concerne moins de 10 patients, "
                        "le nombre de personnes concernées n'est pas affiché, afin d'éviter toute  réidentification "
                        "possible des patients.",
                    ),
                ],
            ),
        ]
    )


def AllSections() -> Component:
    return Div(
        FirstSection(), className="mentions"
    )


def MentionsLegales() -> Component:
    return Div(
        [
            Div(className="header-space"),
            Div(
                [
                    Div(
                        "Mentions Légales",
                        className="fp-section fp-section-1 d-flex justify-content-center h1 mt-5",
                    ),
                    Div(
                        Img(
                            src=app.get_asset_url("big_illustration_4.svg"),
                        ),
                        className="fp-section fp-section-1 d-flex justify-content-center",
                    ),
                ],
            ),
            AllSections(),
        ],
        className="container-fluid p-0",
    )
