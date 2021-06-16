import urllib
from typing import Tuple, List
import dash
from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash_html_components as html
import dash.dependencies as dd
from dash.exceptions import PreventUpdate
import dash_table
import pandas as pd
import plotly.express as px
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash_core_components import Graph, Dropdown
from dash.dependencies import Input, Output
from datamed_custom_components import Accordion
from db import specialite, fetch_data, substance
from sm import SideMenu

from apps.components.commons import (
    PatientsTraites,
    HistoriqueRupturesTooltip,
    NoData,
    Header,
    EICasDeclareFigureBox,
    EITauxDeclarationBox,
    EIRepartitionAgeGraphBox,
    EIRepartitionSexeFigureBox,
    EIRepartitionGraviteGraphBox,
    EIRepartitionNotificateursFigureBox,
    EISystemesOrganesTooltip,
    EIRepartitionSystemeOrganesBox,
    EIRepartitionHLTBox,
)

from apps.components.utils import (
    Box,
    GraphBox,
    TopicSection,
    ArticleTitle,
    ExternalLink,
    SectionRow,
    date_as_string,
    nested_get,
    BoxArticle,
    BoxRow,
    CardBox,
    Grid,
)
from apps.graphs import (
    EMRepartitionGraviteGraph,
    EMRepartitionPopulationConcernee,
    EMRepartitionEffetsIndesirablesFigure,
    EMRepartitionNatureGraph,
    EMRepartitionErreursInitialesGraph,
    EMRepartitionCausesGraph,
)

from apps.constants.colors import PIE_COLORS_SPECIALITE


def EffetsIndesirablesSelect(df_sub: pd.DataFrame):
    _options = [
        dict(label=sub.nom.capitalize(), value=code) for code, sub in df_sub.iterrows()
    ]
    return Dropdown(
        id="effets-indesirables-select",
        options=_options,
        searchable=False,
        clearable=False,
        value=_options[0]["value"],
        className="EffetIndesirableSelectDropdown",
        optionHeight=50,
    )


def EffetsIndesirablesContent(sub_code: str = "") -> Component:
    if sub_code == "":
        return html.Div("Pas de sélection pour l'instant")
    # Fetch substances dataframes
    df_decla = substance.get_decla_df(sub_code)
    df_cas_sexe = substance.get_sexe_cas_df(sub_code)
    df_cas_age = substance.get_age_cas_df(sub_code)
    df_gravite = substance.get_gravite(sub_code)
    df_notif = substance.get_notif_df(sub_code)
    df_soclong = substance.get_soc_df(sub_code)
    return html.Div(
        [
            Grid(
                [
                    EICasDeclareFigureBox(df_decla),
                    EITauxDeclarationBox(df_decla),
                    EIRepartitionSexeFigureBox(df_cas_sexe),
                    EIRepartitionAgeGraphBox(df_cas_age),
                    EIRepartitionGraviteGraphBox(df_gravite),
                ],
                2,
            ),
            SectionRow(EIRepartitionNotificateursFigureBox(df_notif)),
            SectionRow(html.H3("Effets indésirables par système d'organe")),
            SectionRow(EISystemesOrganesTooltip()),
            SectionRow(EIRepartitionSystemeOrganesBox(df_soclong, "specialite")),
        ]
    )


def get_rcp_link(cis: str) -> str:
    link = "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=R".format(
        cis
    )
    fallback_link = "https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
        cis
    )
    page = requests.get(link)
    soup = BeautifulSoup(page.content, "html.parser")
    return (
        fallback_link
        if soup.body.findAll(
            text="Le document demandé n'est pas disponible pour ce médicament"
        )
        else link
    )


def get_notice_link(cis: str) -> str:
    link = "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=N".format(
        cis
    )
    fallback_link = "https://base-donnees-publique.medicaments.gouv.fr/extrait.php?specid={}".format(
        cis
    )
    page = requests.get(link)
    soup = BeautifulSoup(page.content, "html.parser")
    return (
        fallback_link
        if soup.body.findAll(
            text="Le document demandé n'est pas disponible pour ce médicament"
        )
        else link
    )


def get_has_link(series_spe: pd.Series) -> str:
    nom_specialite = series_spe.nom.capitalize()
    url_specialite = urllib.parse.quote_plus(nom_specialite)
    return "https://www.has-sante.fr/jcms/fc_2875171/fr/resultat-de-recherche?text={}&tmpParam=&opSearch=".format(
        url_specialite
    )


def Publications(df_pub: pd.DataFrame) -> str:
    if df_pub is None:
        return NoData()
    children = []
    for i, x in df_pub.iterrows():
        children.append(
            CardBox(
                html.Div(
                    [
                        html.H3(x.title),
                        html.A(
                            f"{x.type}", href=x.link, target="_blank", className="Link"
                        ),
                    ]
                ),
                img_classname="CardBoxImage-isCentered PublicationsBoxImage",
                classname="GridElem-1",
            )
        )
    return TopicSection(
        [
            SectionRow(html.H1("Publications", className="SectionTitle",)),
            Grid(children, 1),
        ],
        id="publications",
    )


def Specialite(cis: str) -> Tuple[Component, html.Div]:

    df_spe = specialite.get_specialite_df(cis)
    series_spe = fetch_data.as_series(df_spe)
    df_sub = specialite.list_substances(cis)
    df_age = specialite.get_age_df(cis)
    df_sexe = specialite.get_sexe_df(cis)
    df_expo = specialite.get_exposition(cis)
    df_desc = specialite.get_description_df(cis)
    df_atc = specialite.get_atc_df(cis)
    df_ei = specialite.get_erreur_med_effet_indesirable(cis)
    df_cause = specialite.get_erreur_med_cause(cis)
    df_nat = specialite.get_erreur_med_nature(cis)
    df_pop = specialite.get_erreur_med_population(cis)
    df_rup = specialite.get_ruptures(cis, df_spe)
    df_init = specialite.get_erreur_med_init(cis)
    df_gravite = specialite.get_erreur_med_gravite(cis)
    df_pub = specialite.get_publications(cis)

    return (
        Header(series_spe),
        html.Div(
            [
                SideMenu(
                    id="side-menu",
                    items=[
                        {"id": "description", "label": "Description"},
                        {"id": "patients-traites", "label": "Patients Traités"},
                        {
                            "id": "erreurs-medicamenteuses",
                            "label": "Erreurs médicamenteuses",
                        },
                        {
                            "id": "rupture-de-stock",
                            "label": "Historique des ruptures de stock",
                        },
                        {"id": "publications", "label": "Publications",},
                    ],
                    className="SideMenu",
                ),
                html.Div(
                    html.Div(
                        [
                            Description(df_spe, df_desc, df_atc, df_sub),
                            PatientsTraites(
                                df_age=df_age,
                                df_sexe=df_sexe,
                                df_expo=df_expo,
                                pie_colors=PIE_COLORS_SPECIALITE,
                            ),
                            ErreursMedicamenteuses(
                                df_init, df_ei, df_pop, df_cause, df_nat, df_gravite,
                            ),
                            EffetsIndesirables(df_sub),
                            RuptureDeStock(df_rup),
                            Publications(df_pub),
                        ],
                        className="ContentWrapper ContentWrapper-hasHeader",
                    ),
                    className="ContentLayoutWrapper",
                ),
            ],
            className="ContentLayout",
        ),
    )


def SubstanceLinks(df_sub: pd.DataFrame) -> Component:
    return html.Ul(
        [
            html.Li(
                html.A(
                    series.nom.capitalize(),
                    href="/apps/substance?search={}".format(code),
                    className="Link",
                    id="refresh-substances",
                ),
                className="ListItem",
            )
            for code, series in df_sub.iterrows()
        ],
        className="List",
    )


def Description(
    df_spe: pd.DataFrame,
    df_desc: pd.DataFrame,
    df_atc: pd.DataFrame,
    df_sub: pd.DataFrame,
) -> Component:
    series_spe = fetch_data.as_series(df_spe)
    series_desc = fetch_data.as_series(df_desc)
    series_atc = fetch_data.as_series(df_atc)
    cis = series_spe.name

    return TopicSection(
        SectionRow(
            Box(
                [
                    BoxArticle(
                        [ArticleTitle("Substance(s) active(s)"), SubstanceLinks(df_sub)]
                    ),
                    BoxArticle(
                        [
                            ArticleTitle(
                                "Classe ATC (Anatomique, Thérapeutique et Chimique)"
                            ),
                            html.Span(
                                "{} ({})".format(
                                    series_atc.label.capitalize(), series_atc.atc,
                                ),
                                className="Badge Badge-isSecondary normal-text",
                            ),
                        ]
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("État de commercialisation"),
                            html.Span(
                                series_spe.etat_commercialisation.capitalize(),
                                className="Badge normal-text",
                            ),
                        ],
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("Laboratoire"),
                            html.Span(
                                series_spe.titulaires.title(), className="normal-text",
                            ),
                        ],
                    ),
                    BoxArticle(
                        [
                            ArticleTitle("Description"),
                            html.P(
                                series_desc.description,
                                className="normal-text text-justify",
                            ),
                        ]
                    ),
                    BoxRow(
                        [
                            BoxArticle(
                                [
                                    ArticleTitle("Recommandations de la HAS"),
                                    ExternalLink(
                                        "Afficher les recommandations",
                                        get_has_link(series_spe),
                                    ),
                                ],
                                in_row=True,
                            ),
                            BoxArticle(
                                [
                                    ArticleTitle(
                                        "Infos pour les professionnels de santé"
                                    ),
                                    ExternalLink("Afficher le RCP", get_rcp_link(cis)),
                                ],
                                in_row=True,
                            ),
                            BoxArticle(
                                [
                                    ArticleTitle("Infos pour les patients"),
                                    ExternalLink(
                                        "Afficher la notice", get_notice_link(cis)
                                    ),
                                ],
                                in_row=True,
                            ),
                        ],
                    ),
                ],
            ),
        ),
        isFirst=True,
        id="description",
    )


def EMRepartitionEffetsIndesirablesFigureBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData(class_name="BoxContent-isHalf")
    return EMRepartitionEffetsIndesirablesFigure(df)


def EMRepartitionGraviteGraphBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData("BoxContent-isHalf")
    return EMRepartitionGraviteGraph(df)


def EMRepartitionPopulationConcerneeBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData("BoxContent-isHalf")
    return EMRepartitionPopulationConcernee(df)


def EMRepartitionErreursInitialesBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData()
    return EMRepartitionErreursInitialesGraph(df)


def EMRepartitionCausesBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData()
    return EMRepartitionCausesGraph(df)


def EMRepartitionNatureBox(df: pd.DataFrame) -> Component:
    if df is None:
        return NoData()
    return EMRepartitionNatureGraph(df)


def BoxListDenomination(df: pd.DataFrame):
    if df is None:
        return NoData()
    df.denomination = df.denomination.str.capitalize()
    return dash_table.DataTable(
        id="denomination-table",
        columns=[{"name": i, "id": i} for i in df[["denomination"]].columns],
        data=df.to_dict("records"),
        page_size=10,
        style_as_list_view=True,
        style_table={"overflowX": "auto"},
        style_cell={"height": "50px", "backgroundColor": "#FFF",},
        style_data={
            "fontSize": "14px",
            "fontWeight": "400",
            "font-family": "Roboto",
            "lineHeight": "18px",
            "textAlign": "left",
        },
        style_header={"display": "none"},
    )


def ErreursMedicamenteuses(
    df_init: pd.DataFrame,
    df_ei: pd.DataFrame,
    df_pop: pd.DataFrame,
    df_cause: pd.DataFrame,
    df_nat: pd.DataFrame,
    df_gravite: pd.DataFrame,
) -> Component:
    children = [
        SectionRow(html.H1("Erreurs médicamenteuses", className="SectionTitle")),
    ]
    dataframes = [df_ei, df_pop, df_init, df_cause, df_nat, df_gravite]
    if all(df is None for df in dataframes):
        children.append(NoData())
    else:
        children.extend(
            [
                SectionRow(
                    Box(
                        Accordion(
                            [
                                html.P(
                                    [
                                        html.Span(
                                            "Les données sur les erreurs médicamenteuses proviennent des déclarations de risque d’erreur "
                                            "ou d’erreurs médicamenteuses avec ou sans évènements indésirables, gérées par l’ANSM. Elles "
                                            "sont déclarées par les patients ou les professionnels de santé, notamment via le ",
                                        ),
                                        html.A(
                                            "portail des signalements",
                                            href="https://signalement.social-sante.gouv.fr",
                                            className="Link",
                                            target="_blank",
                                        ),
                                    ],
                                    className="justify-text normal-text",
                                ),
                                html.P(
                                    "Les erreurs médicamenteuses se classifient en fonction du stade (erreur de prescription, "
                                    "erreur de délivrance, erreur d’administration), de la nature et de la cause de l'erreur.",
                                    className="justify-text normal-text",
                                ),
                            ],
                            labelClass="InternalLink normal-text",
                            label="Comment sont calculés ces indicateurs ? D'où viennent ces données ?",
                        )
                    )
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Existence d’effets indésirables suite aux erreurs médicamenteuses",
                            [EMRepartitionEffetsIndesirablesFigureBox(df_ei)],
                        ),
                        GraphBox(
                            "Répartition de la population concernée par les erreurs médicamenteuses",
                            [EMRepartitionPopulationConcerneeBox(df_pop)],
                            tooltip=[
                                html.H4("Répartition des âges"),
                                html.P(
                                    [html.B("Nouveau-né: "), "0 à 28 jours"],
                                    className="regular-text",
                                ),
                                html.P(
                                    [
                                        html.B("Nourrisson: "),
                                        "> à 28 jours et < à 2 ans",
                                    ],
                                    className="regular-text",
                                ),
                                html.P(
                                    [html.B("Enfant: "), "⩾ à 2 ans et < 18 ans"],
                                    className="regular-text",
                                ),
                                html.P(
                                    [html.B("Adulte: "), "⩾ à 18 ans et < à 60 ans"],
                                    className="regular-text",
                                ),
                                html.P(
                                    [html.B("Personne âgée: "), "⩾ à 60 ans"],
                                    className="regular-text",
                                ),
                            ],
                        ),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Gravité des erreurs médicamenteuses",
                            [EMRepartitionGraviteGraphBox(df_gravite)],
                            className="Box-isHalf",
                            tooltip=[
                                html.H4("Cas grave"),
                                html.P(
                                    "Effet indésirable létal, ou susceptible de mettre la vie en danger, "
                                    "ou entraînant une invalidité ou une incapacité importante ou durable, "
                                    "ou provoquant ou prolongeant une hospitalisation, ou se manifestant par "
                                    "une anomalie ou une malformation congénitale.",
                                    className="regular-text",
                                ),
                            ],
                        ),
                    ],
                    withGutter=True,
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Étape de survenue des erreurs médicamenteuses",
                            [EMRepartitionErreursInitialesBox(df_init)],
                            tooltip=[
                                html.H4(
                                    "Étape de survenue des erreurs médicamenteuses"
                                ),
                                html.P(
                                    "L'erreur médicamenteuse peut survenir aux différentes étapes du processus "
                                    "d'utilisation : l'erreur de prescription par le médecin ou un autre professionnel "
                                    "de santé, ou par le patient lui-même dans le cas d'une auto-prescription, l'erreur "
                                    "de dispenciation, l'erreur de préparation, l'erreur de suivi thérapeutique, et "
                                    "enfin l'erreur d'administration par le patient lui-même, un aidant "
                                    "ou un professionnel de santé.",
                                    className="regular-text",
                                ),
                            ],
                        ),
                    ]
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Cause des erreurs médicamenteuses",
                            [EMRepartitionCausesBox(df_cause)],
                            tooltip=[
                                html.H4("Cause des erreurs médicamenteuses"),
                                html.P(
                                    "C'est l'origine de l'erreur, qui peut être d'origine produit, d'origine "
                                    "humaine ou d'origine technique.",
                                    className="regular-text",
                                ),
                                html.P(
                                    "- Cause produit : l’erreur trouve sa source, tout ou partie, dans la conception "
                                    "du médicament et de l’information qui lui est relative (dénomination, conditionnement"
                                    ", étiquetage, notice d’information, etc.).",
                                    className="regular-text",
                                ),
                                html.P(
                                    "- Cause humaine : l’erreur peut trouver sa source dans l’organisation du processus "
                                    "de prise en charge thérapeutique du patient (organisation du circuit du médicament, "
                                    "facteurs humains, facteurs environnementaux, pratiques professionnelles, etc.).",
                                    className="regular-text",
                                ),
                                html.P(
                                    "- Cause technique : par exemple un logiciel d'aide à la dispensation "
                                    "ou prescription peut être la source de l'erreur médicamenteuse",
                                    className="regular-text",
                                ),
                                html.P(
                                    "Seules les erreurs de type produit et de type technique sont dans le champs "
                                    "d'action de l'ANSM.",
                                    className="regular-text",
                                ),
                            ],
                        ),
                    ]
                ),
                SectionRow(
                    [
                        GraphBox(
                            "Nature des erreurs médicamenteuses",
                            [EMRepartitionNatureBox(df_nat)],
                            tooltip=[
                                html.H4("Nature des erreurs médicamenteuses"),
                                html.P(
                                    "Identifie le type d'erreur : par exemple une confusion entre deux médicaments. "
                                    "Il peut s'agir du bon médicament mais d'une erreur sur la dose, sur la durée de "
                                    "traitement ou sur la voie d'administration. Dans certains cas, le patient peut "
                                    "ne pas être la bonne personne.",
                                    className="regular-text",
                                ),
                            ],
                        ),
                    ]
                ),
            ]
        )
    return TopicSection(children, id="erreurs-medicamenteuses",)


def EffetsIndesirables(df_sub: pd.DataFrame) -> Component:
    return TopicSection(
        [
            SectionRow(
                html.H1(
                    "Cas déclarés d’effets indésirables des substances actives",
                    className="SectionTitle",
                )
            ),
            SectionRow(
                html.Div(
                    [
                        html.Div(
                            [
                                html.Img(
                                    src=app.get_asset_url("/substance_icon.svg"),
                                    className="EffetIndesirableSelectLabelImg",
                                ),
                                html.Span(
                                    "Effets indésirables de la substance active",
                                    className="normal-text EffetIndesirableSelectLabelSpan",
                                ),
                            ],
                            className="EffetIndesirableSelectLabel",
                        ),
                        EffetsIndesirablesSelect(df_sub),
                    ],
                    className="EffetIndesirableSelect",
                )
            ),
            SectionRow(
                html.Div(EffetsIndesirablesContent(), id="effets-indesirables-content",)
            ),
        ],
        id="",
    )


mapCircuitColRupture = {
    "ville": {
        "start": "debut_ville",
        "availability_date": "prevision_remise_dispo_ville",
    },
    "hôpital": {
        "start": "debut_hopital",
        "availability_date": "prevision_remise_dispo_hopital",
    },
}


def RuptureDeStockTableRowValues(values):
    return html.Div(
        [
            html.Div(v, style={"margin-bottom": "15px"}, className="normal-text")
            for v in values
        ],
        className="d-flex flex-column justify-content-start",
    )


def RuptureDeStockTableRowLabels(labels):
    return html.Div(
        [
            html.Div(
                label, className="normal-text-bold", style={"margin-bottom": "15px"}
            )
            for label in labels
        ],
        className="d-flex flex-column justify-content-start",
        style={"margin-right": "30px"},
    )


def RuptureCellRow(key, value):
    if key == "Statut":
        css_class_value = "Badge Badge-isSecondary"
    else:
        css_class_value = "Badge Badge-isInvisible"
    return html.Div(
        [html.Div(key), html.Div(html.Span(value, className=css_class_value))],
        className="RuptureCellRow",
    )


def RuptureCell(series_rup):
    circuit = series_rup.circuit
    col_start = nested_get(mapCircuitColRupture, f"{circuit}.start", None)
    col_availability_date = nested_get(
        mapCircuitColRupture, f"{circuit}.availability_date", None
    )
    availability_date = (
        date_as_string(series_rup.get(col_availability_date))
        if col_availability_date and not pd.isnull(series_rup[col_availability_date])
        else "Pas de données"
    )
    shortage_date = (
        date_as_string(series_rup.get(col_start))
        if col_start and not pd.isnull(series_rup[col_start])
        else "Pas de données"
    )

    infos = {
        "Présentation de médicament": series_rup.nom.capitalize(),
        "Statut": series_rup.classification.capitalize(),
        "Circuit": circuit.capitalize() if circuit else "Pas de données",
        "Cause": series_rup.cause.capitalize()
        if series_rup.cause
        else "Pas de données",
        "Date de signalement": date_as_string(series_rup.date),
        "Date de rupture": shortage_date,
        "Date de remise à disposition": availability_date,
    }

    return html.Div(
        [RuptureCellRow(key, value) for (key, value) in infos.items()],
        className="RuptureCell",
    )


def RuptureDeStockTable(df_rup: pd.DataFrame):
    rows = [RuptureCell(row) for label, row in df_rup.iterrows()]
    return html.Div(rows, className="Rupture")


def RuptureDeStock(df_rup: pd.DataFrame):
    if df_rup is None:
        df_rup = pd.DataFrame()
    else:
        df_rup = df_rup.sort_values(by=["date"], ascending=False)

    return TopicSection(
        [
            SectionRow(
                html.Div("Historique des ruptures de stock", className="SectionTitle")
            ),
            HistoriqueRupturesTooltip(),
            SectionRow(
                Box(
                    [
                        html.Div(
                            "{} signalement(s)".format(fetch_data.get_df_len(df_rup)),
                            className="normal-text",
                            style={"color": "#33C2D6"},
                        ),
                        RuptureDeStockTable(df_rup),
                    ],
                ),
            ),
            SectionRow(
                Box(
                    html.Div(
                        [
                            Box(
                                [
                                    html.Img(
                                        src=app.get_asset_url(
                                            "icons/pres_autre_120.svg"
                                        ),
                                    ),
                                ],
                                isBordered=False,
                                className="CardBoxImage CardBoxImage-isCentered RupturesBoxImage",
                            ),
                            Box(
                                [
                                    BoxArticle(
                                        [
                                            html.H3("Données de rupture de stock"),
                                            html.P(
                                                "Accédez aux données globales de l’état des ruptures de stock en "
                                                "France, ainsi qu’aux mesures prises par l’Agence pour prévenir "
                                                "la pénurie de médicaments."
                                            ),
                                            html.A(
                                                "visualiser les données",
                                                className="Btn Btn-isPrimary",
                                                role="button",
                                                href="/apps/ruptures",
                                            ),
                                        ]
                                    )
                                ],
                                isBordered=False,
                                className="CardBoxText",
                            ),
                        ],
                        className="CardBox",
                    ),
                    hasNoPadding=True,
                ),
            ),
        ],
        id="rupture-de-stock",
    )


@app.callback(
    Output(component_id="effets-indesirables-content", component_property="children"),
    Input(component_id="effets-indesirables-select", component_property="value"),
)
def update_effets_indesirables_content(input_value):
    return EffetsIndesirablesContent(input_value)


@app.callback(
    [
        dd.Output("update-on-click-data", "is_open"),
        dd.Output("body-modal", "children"),
        dd.Output("header-modal", "children"),
    ],
    [
        dd.Input("close-backdrop-specialite", "n_clicks"),
        dd.Input("soc-treemap-specialite", "clickData"),
    ],
    [dd.State("effets-indesirables-select", "value"),],
)
def open_ei_modal_on_specialite_page(clicks_close, click_data, sub_code):

    changed_id = [p["prop_id"] for p in dash.callback_context.triggered][0]

    # User has not clicked on modal yet
    if not click_data:
        raise PreventUpdate()
    # Modal has been closed by user
    if "close-backdrop" in changed_id:
        return False, "", ""
    current_entry = click_data["points"][0]["entry"]
    # User is going up in treemap
    if current_entry != "":
        return False, "", ""

    selected_soc = click_data["points"][0]["label"]

    # When called on specialite page sub_code state has been previously defined
    if sub_code:
        df_hlt = substance.get_hlt_df(sub_code)
        df_hlt = df_hlt[df_hlt.soc_long == selected_soc].sort_values(
            by="pourcentage_cas", ascending=False
        )
        return (
            True,
            EIRepartitionHLTBox(df_hlt),
            selected_soc,
            selected_soc,
        )

    else:
        return False, "", ""
