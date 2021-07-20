from dash.development.base_component import Component
from dash_html_components import Div, A, Video

from .commons import SingleSection


def APropos() -> Component:
    return Div(
        [
            Div(className="header-space"),
            Div(
                [
                    Video(
                        src="https://minio.lab.sspcloud.fr/rroffo/DemoDay/DataMed.mp4",
                        controls=True,
                        height=700,
                        title="Vidéo EIG4 DataMed - fin de défi !",
                        className="d-flex m-auto",
                    ),
                    Div(
                        "À propos de data.ansm",
                        className="fp-section fp-section-1 d-flex justify-content-center h1 mt-5 mb-5",
                    ),
                ],
            ),
            Div(
                [
                    SingleSection(
                        "Un outil accessible pour tous",
                        [
                            Div(
                                "data.ansm est un outil à destination du grand public et des professionnels de santé "
                                "qui permet de réunir en un seul endroit plusieurs types de données sur les médicaments, "
                                "dont des données exclusives à l’ANSM comme les effets indésirables et les ruptures "
                                "de stock.",
                                className="mb-3",
                            ),
                            Div(
                                "L’accès aux informations autour des "
                                "médicaments se veut rapide, intuitif et accompagné.",
                            ),
                        ],
                    ),
                    SingleSection(
                        "Les Entrepreneurs d’Intérêt Général au service de l’Agence",
                        [
                            Div(
                                [
                                    Div(
                                        "Cet outil est né d’une collaboration entre trois Entrepreneurs "
                                        "d’Intérêt Général et l’ANSM, à travers le défi ",
                                        className="d-inline",
                                    ),
                                    A(
                                        "DataMed.",
                                        href="https://entrepreneur-interet-general.etalab.gouv.fr/defis/2020/datamed.html",
                                        className="ExternalLink d-inline",
                                        target="_blank"
                                    ),
                                ],
                                className="mb-3",
                            ),
                            Div(
                                "Le programme Entrepreneurs d'Intérêt Général a pour objectif de faire travailler "
                                "ensemble des personnes extérieures à l'administration, aux compétences numériques "
                                "pointues, et des agents publics engagés dans une démarche d'innovation. Les "
                                "entrepreneurs d'intérêt général sont répartis en binômes ou trinômes "
                                "pluridisciplinaires. Avec leurs mentors, ils ont eu 10 mois pour relever un défi "
                                "d'amélioration du service public à l'aide du numérique et des données.",
                            ),
                        ],
                    ),
                    SingleSection(
                        "L'ouverture de données complexes et sensibles",
                        [
                            Div(
                                "L’ANSM est chargée de faciliter l'accès à l'innovation thérapeutique, de garantir la "
                                "sécurité des produits de santé et d’informer et échanger avec les patients et "
                                "professionnels de santé. Elle détient, pour assurer ses missions, de nombreuses "
                                "données issues de l'ensemble de ses activités.",
                                className="mb-3",
                            ),
                            Div(
                                "L’ANSM souhaite favoriser la transparence sur l’action publique, améliorer "
                                "l’information sur le médicament - notamment à destination des patients et des "
                                "professionnels de santé - et valoriser les données de santé.",
                                className="mb-3",
                            ),
                            Div(
                                "C’est pourquoi, depuis 2019, l’ANSM a mis en place une stratégie d’ouverture de "
                                "ses données pour communiquer sur ses actions et valoriser son expertise. Cependant, "
                                "ces données (vigilance sur les médicaments et les dispositifs "
                                "médicaux, ruptures de stock de médicament) sont complexes et sensibles.",
                            ),
                        ],
                    ),
                    SingleSection(
                        "Des données exclusives à l’ANSM",
                        [
                            Div(
                                "L’ANSM ouvre pour la première fois une partie des données exploitées par ses "
                                "agents. Dans un premier temps, deux services sont concernés :",
                                className="mb-3",
                            ),
                            Div(
                                "- les données de la Direction de l’Inspection "
                                "(sur les ruptures de stock de médicaments)",
                                className="mb-3",
                            ),
                            Div(
                                "- les données de la Direction de la Surveillance (sur les effets indésirables des "
                                "médicaments, les erreurs médicamenteuses et le bon usage du médicament)",
                                className="mb-3",
                            ),
                            Div(
                                "Ces dernières ont fait l’objet d’un nettoyage, d’une analyse et d’une "
                                "agrégation rigoureuse afin d'assurer la confidentialité des données.",
                            ),
                        ],
                    ),
                ],
                className="mentions",
            ),
        ],
        className="container-fluid p-0",
    )
