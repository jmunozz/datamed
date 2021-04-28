from urllib.parse import urlparse, parse_qs, urlencode, quote_plus, unquote_plus

import dash
import dash.dependencies as dd
import dash_bootstrap_components as dbc
import dash_html_components as html
import dash_table
import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
import requests
from app import app
from bs4 import BeautifulSoup
from dash.development.base_component import Component
from dash.exceptions import PreventUpdate
from dash_core_components import Graph
from db import specialite, substance, fetch_data
from sm import SideMenu

from .utils import Box, GraphBox, TopicSection, ArticleTitle, SectionTitle, ExternalLink
from ..constants.colors import PIE_COLORS
from ..constants.layouts import PIE_LAYOUT, STACKED_BAR_CHART_LAYOUT

UTILISATION = {
    1: "Utilisation faible",
    2: "Utilisation faible",
    3: "Utilisation moyenne",
    4: "Utilisation élevée",
    5: "Utilisation élevée",
}


def get_has_guideline_link(current_specialite):
    cis = current_specialite.name
    return "https://base-donnees-publique.medicaments.gouv.fr/affichageDoc.php?specid={}&typedoc=N".format(
        cis
    )


def get_rcp_link(cis) -> str:
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


def get_notice_link(cis) -> str:
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


# def Specialite(cis: str) -> Component:
#     return html.Div([
#         html.Div([],
#         style={"backgroundColor": "red", "height": "500px"}),
#         html.Div([],
#         style={"backgroundColor": "blue", "height": "500px"}),
#         html.Div([],
#         style={"backgroundColor": "red", "height": "500px"}),
#                 html.Div([],
#         style={"backgroundColor": "blue", "height": "500px"}),
#                 html.Div([],
#         style={"backgroundColor": "red", "height": "500px"}),
#     ],
#         className="container-fluid",
#         style={"marginTop": "88px", "position": "sticky", "top": "-500px"})


def Specialite(cis: str) -> Component:
    return html.Div(
        [
            SideMenu(
                id="side-menu",
                items=[
                    {"id": "description", "label": "Description"},
                    {"id": "population-concernee", "label": "Population concernée"},
                    {
                        "id": "erreurs-medicamenteuses",
                        "label": "Données de pharmacovigilance",
                    },
                ],
                className="side-menu",
            ),
            html.Div(
                [
                    Header(cis),
                    Description(cis),
                    PatientsTraites(cis),
                    ErreursMedicamenteuses(cis),
                    EffetsIndesirables(cis),
                ],
                className="container side-content",
            ),
        ],
        className="container-fluid p-0 content",
    )


def Header(cis: str) -> Component:
    spe = specialite.get_specialite(cis).nom
    return html.Div(
        [
            html.Div(spe.capitalize(), className="heading-4"),
            html.Div("Spécialité de médicament", className="large-text"),
            html.A("Qu'est-ce qu'une spécialité de médicament ?"),
        ],
        className="content-header",
    )


def Accordion() -> Component:
    return dbc.Card(
        [
            html.H2(
                dbc.Button(
                    "Comment sont calculés ces indicateurs ?",
                    color="link",
                    id="group-1-toggle",
                ),
                className="with-lightbulb",
            ),
            dbc.Collapse(
                dbc.CardBody(
                    [
                        html.P(
                            "Estimations obtenues à partir des données Open-Medic portant sur l’usage du médicament, délivré en pharmacie de ville en 2014 à 2018 et remboursé par l’Assurance Maladie. Pour plus d’informations, consultez : http://open-data-assurance-maladie.ameli.fr/medicaments/index.php"
                        ),
                        html.P(
                            "Attention : Les patients étant restitués par présentation dans les données Open Medic, ils sont comptabilisés autant de fois qu’ils ont eu de remboursements de présentations différentes d’un même produit/substance active. Les indicateurs restitués pourraient être surestimés pour certains médicaments."
                        ),
                    ]
                ),
                id="collapse-1",
            ),
        ],
        className="box",
    )


def Utilisation(cis: str):
    df_expo = fetch_data.fetch_table("specialite_exposition", "cis")
    utilisation = df_expo.loc[cis].exposition
    return dbc.Row(
        [
            Box(
                [
                    html.Div(
                        [
                            html.Div(
                                [
                                    html.Img(
                                        src=app.get_asset_url("family_restroom.svg")
                                    ),
                                    html.P("INDICE"),
                                ],
                                className="d-flex flex-column",
                            ),
                            html.Div(
                                [
                                    html.Div(str(utilisation), className="heading-1"),
                                    html.Div("/5", className="heading-4"),
                                ],
                                className="d-flex",
                            ),
                        ],
                        style={"flex": 1, "backgroundColor": "#00B3CC"},
                        className="p-3 d-flex flex-row justify-content-around align-items-center on-background",
                    ),
                    html.Div(
                        [
                            html.Div(UTILISATION[utilisation], className="heading-4"),
                            html.Div(
                                "Nombre de patients traités par an en France",
                                className="normal-text",
                            ),
                            html.Div(
                                "En savoir plus sur le taux d'exposition",
                                className="normal-text link",
                                style={"color": "#00B3CC"},
                            ),
                        ],
                        style={"flex": 3},
                        className="p-3",
                    ),
                ],
                class_name_wrapper="col-md-12",
                class_name="p-0 d-flex",
            )
        ]
    )


def SubstanceLinks(cis: str) -> Component:
    substances_specialite_df = specialite.list_specialite_substances(cis)
    substances_codes_list = [
        s[1] for s in substances_specialite_df["code_substance"].iteritems()
    ]
    substances_df = substance.list_substances(substances_codes_list)
    return html.Div(
        [
            html.A(
                sa.upper(),
                href="/apps/specialite?{}".format(
                    urlencode({"search": quote_plus(sa)})
                ),
                className="normal-text link d-block",
                id="refresh-substances",
            )
            for sa in substances_df["nom"]
        ]
    )


def Description(cis: str) -> Component:
    current_specialite_series = specialite.get_specialite(cis)
    df_description = fetch_data.fetch_table("description", "cis")

    df_cis_atc = fetch_data.fetch_table("specialite_atc", "cis").reset_index()
    df_atc = fetch_data.fetch_table("classes_atc", "code")
    df = df_cis_atc.merge(df_atc, left_on="atc", right_on="code", how="left").set_index(
        "cis"
    )

    return TopicSection(
        Box(
            [
                html.Article(
                    [ArticleTitle("Substance(s) active(s)"), SubstanceLinks(cis)]
                ),
                html.Article(
                    [
                        ArticleTitle("Statut de la spécialité de médicament"),
                        html.Div(
                            current_specialite_series.etat_commercialisation.upper(),
                            className="normal-text-cap d-block",
                            id="refresh-substances",
                        ),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Description"),
                        html.Div(
                            "Classe ATC (Anatomique, Thérapeutique et Chimique) : {} ({})".format(
                                df.loc[cis].label.capitalize(),
                                df.loc[cis].atc,
                            ),
                            className="normal-text",
                        ),
                        html.Div(df_description.loc[cis], className="normal-text"),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Recommandation HAS"),
                        ExternalLink(
                            "Afficher les recommandations",
                            get_has_guideline_link(current_specialite_series),
                        ),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Infos pour les professionnels de santé"),
                        ExternalLink("Afficher le RCP", get_rcp_link(cis)),
                    ]
                ),
                html.Article(
                    [
                        ArticleTitle("Infos pour les patients"),
                        ExternalLink("Afficher la notice", get_notice_link(cis)),
                    ]
                ),
            ],
            class_name_wrapper="overlap-top-content",
        ),
        id="description",
    )


def PatientsTraites(cis: str) -> Component:
    df_age = fetch_data.fetch_table("specialite_patient_age_ordei", "cis")
    fig = go.Figure(
        go.Pie(
            labels=df_age.loc[cis].age,
            values=df_age.loc[cis].pourcentage_patients,
            marker_colors=PIE_COLORS,  # px.colors.qualitative.Set3,
        )
    ).update_layout(PIE_LAYOUT)

    return TopicSection(
        [
            SectionTitle("Patients traités"),
            Accordion(),
            Utilisation(cis),
            dbc.Row(
                [
                    GraphBox(
                        "Répartition par sexe des patients traités",
                        [],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition par âge des patients traités",
                        [
                            Graph(
                                figure=fig,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
        ],
        id="population-concernee",
    )


def ErreursMedicamenteuses(cis: str) -> Component:
    df_ei = fetch_data.fetch_table("erreur_med_effet_indesirable", "cis")

    df_pop = fetch_data.fetch_table("erreur_med_population", "cis")
    fig_pop = go.Figure(
        go.Pie(
            labels=df_pop.loc[cis].population_erreur,
            values=df_pop.loc[cis].pourcentage,
            marker_colors=PIE_COLORS,
        )
    ).update_layout(PIE_LAYOUT)

    df_cause = fetch_data.fetch_table("erreur_med_cause", "cis")
    fig_cause = px.bar(
        df_cause.loc[cis],
        x="pourcentage",
        color="cause_erreur",
        labels={"pourcentage": "Proportion (%)", "cause_erreur": "Cause"},
        color_discrete_sequence=PIE_COLORS,
        orientation="h",
    )
    fig_cause.update_layout(STACKED_BAR_CHART_LAYOUT)
    fig_cause.update_layout(barmode="stack")

    df_nat = fetch_data.fetch_table("erreur_med_nature", "cis")
    fig_nat = px.bar(
        df_nat.loc[cis],
        x="pourcentage",
        color="nature_erreur",
        labels={"pourcentage": "Proportion (%)", "nature_erreur": "Nature"},
        color_discrete_sequence=PIE_COLORS,
        orientation="h",
    )
    fig_nat.update_layout(STACKED_BAR_CHART_LAYOUT)
    fig_nat.update_layout(barmode="stack")

    df_denom = fetch_data.fetch_table("erreur_med_cis_denomination", "cis")

    return TopicSection(
        [
            SectionTitle("Erreurs médicamenteuses"),
            html.Div(
                "Les erreurs médicamenteuses proviennent des déclarations d’erreurs médicamenteuses, "
                "gérée par l’ANSM. Les formes d’erreur se classifient sous 3 grandes catégories : "
                "Erreur de prescription, Erreur de délivrance, Erreur d’administration.",
                className="normal-text",
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Existance d’effets indésirables",
                        [],
                        class_name_wrapper="col-md-6",
                    ),
                    GraphBox(
                        "Répartition de la population concernée",
                        [
                            Graph(
                                figure=fig_pop,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-6",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Cause des erreurs médicamenteuses",
                        [
                            Graph(
                                figure=fig_cause,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Nature des erreurs médicamenteuses",
                        [
                            Graph(
                                figure=fig_nat,
                                responsive=True,
                            )
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
            dbc.Row(
                [
                    GraphBox(
                        "Liste des dénominations des médicaments concernés par ces erreurs médicamenteuses",
                        [
                            dash_table.DataTable(
                                id="denomination-table",
                                columns=[
                                    {"name": i, "id": i}
                                    for i in df_denom.loc[cis].columns
                                ],
                                data=df_denom.loc[cis].to_dict("records"),
                                page_size=10,
                                style_as_list_view=True,
                                style_table={"overflowX": "auto"},
                                style_cell={
                                    "height": "40px",
                                },
                                style_data={
                                    "fontSize": "12px",
                                    "fontWeight": "400",
                                    "font-family": "Roboto",
                                    "lineHeight": "16px",
                                    "textAlign": "left",
                                },
                                style_header={"display": "none"},
                            )
                        ],
                        class_name_wrapper="col-md-12",
                    ),
                ]
            ),
        ],
        id="erreurs-medicamenteuses",
    )


def EffetsIndesirables(cis: str) -> Component:
    df_cis_sub = fetch_data.fetch_table("specialite_substance", "cis").reset_index()
    df_sub = fetch_data.fetch_table("substance", "code").reset_index()
    df = df_cis_sub[df_cis_sub.cis == cis].merge(
        df_sub, left_on="code_substance", right_on="code", how="left"
    )
    substances_list = df.nom.unique()

    return TopicSection(
        [
            SectionTitle(
                "Cas déclarés d’effets indésirables des substances actives du Doliprane"
            ),
            html.Div(
                "Sont notifiés les effets indésirables que le patient ou son entourage suspecte d’être liés à "
                "l’utilisation d’un ou plusieurs médicaments et les mésusages, abus ou erreurs médicamenteuses. "
                "Il s’agit de cas évalués et validés par un comité d’experts.",
                className="normal-text",
            ),
            dbc.Row(
                [
                    AdverseEffectLink(substance.capitalize())
                    for substance in substances_list
                ]
            ),
        ],
        id="",
    )


def AdverseEffectLink(
    substance: str, class_name="normal-text-bold", style={"color": "#00B3CC"}
) -> Component:
    return Box(substance, class_name=class_name, style=style)


@app.callback(
    [
        dd.Output("update-on-click-data", "is_open"),
        dd.Output("body-modal", "children"),
        dd.Output("header-modal", "children"),
        dd.Output("selected-soc", "children"),
    ],
    [
        dd.Input("soc-chart-container", "n_clicks"),
        dd.Input("close-backdrop", "n_clicks"),
        dd.Input("url", "href"),
    ],
    [dd.State("selected-soc", "children"), dd.State("soc-bar-chart", "hoverData")],
)
def update_callback(
    clicks_container, clicks_close, href, previous_selected_soc, hover_data
):
    if not hover_data:
        return False, "", "", ""

    selected_soc = hover_data["points"][0]["label"]
    selected_soc_has_changed = selected_soc != previous_selected_soc

    if selected_soc_has_changed:
        parsed_url = urlparse(unquote_plus(href))
        query = parse_qs(parsed_url.query)
        selected_med = query["search"][0]

        if SPE_SA_DICT[selected_med] == "spécialité":
            medicament = SUBSTANCE_BY_SPECIALITE[selected_med]["produit"]
        else:
            medicament = selected_med

        df_hlt = pd.DataFrame(MED_DICT[medicament]["hlt"])
        df_hlt = df_hlt.rename(
            columns={"effet_hlt": "Détail des effets rapportés par nombre décroissant"}
        )
        df_hlt_details = df_hlt[df_hlt.soc_long == selected_soc][
            ["Détail des effets rapportés par nombre décroissant"]
        ]
        return (
            True,
            Table.from_dataframe(
                df_hlt_details,
                striped=True,
                bordered=True,
                hover=True,
                responsive=True,
            ),
            selected_soc,
            selected_soc,
        )
    else:
        return False, "", "", ""


@app.callback(
    dd.Output("url", "href"),
    [
        dd.Input("substance-specialite-table", "active_cell"),
        dd.Input("substance-specialite-table", "page_current"),
        dd.Input("substance-specialite-table", "page_size"),
    ],
    dd.State("substance-specialite-table", "data"),
)
def getActiveCell(active_cell, page_current, page_size, data):
    if active_cell:
        col = active_cell["column_id"]
        row = active_cell["row"]
        cellData = data[(page_current or 0) * page_size + row][col]
        return "/apps/specialite?" + urlencode({"search": quote_plus(cellData)})
    else:
        raise PreventUpdate


@app.callback(
    dd.Output("collapse-1", "is_open"),
    dd.Input("group-1-toggle", "n_clicks"),
    dd.State("collapse-1", "is_open"),
)
def toggle_accordion(n_clicks, is_open):
    ctx = dash.callback_context
    if not ctx.triggered:
        return False
    if n_clicks:
        return not is_open


# def SpecialiteDiv(current_specialite) -> Component:
#     cis = current_specialite.name
#     tooltip_text = (
#         "Les médicaments peuvent être regroupés suivant différents niveaux de "
#         "précision (du plus au moins précis) : la présentation (Doliprane "
#         "1000 mg, comprimé, boîte de 8 comprimés), la spécialité (Doliprane "
#         "1000 mg, comprimé), le produit (Doliprane), la substance active "
#         "(Paracétamol). La spécialité d’un médicament est donc caractérisée par "
#         "une dénomination spéciale (Doliprane) et un conditionnement "
#         "particulier (1000 mg, comprimé)."
#     )
#     specialite_atc_df = atc.list_atc(cis)

#     return Div(Div(
#         Div(
#             Div(
#                 [
#                     Div(
#                         I(
#                             className="bi bi-book d-flex justify-content-center pt-3",
#                             style={"font-size": "3rem"},
#                         ),
#                         className="position-absolute",
#                     ),
#                     Div(
#                         [
#                             Div(
#                                 current_specialite.nom.capitalize(),
#                                 className="heading-4",
#                             ),
#                             Div(
#                                 [
#                                     Div(
#                                         "SPÉCIALITÉ DE MÉDICAMENT",
#                                         className="caption-text d-inline-block",
#                                     ),
#                                     I(
#                                         className="info-icon bi bi-info-circle d-inline-block",
#                                         id="specialite-info-icon",
#                                     ),
#                                     Tooltip(
#                                         tooltip_text,
#                                         target="specialite-info-icon",
#                                         placement="right",
#                                     ),
#                                 ]
#                             ),
#                             Div(
#                                 "Substance(s) active(s)",
#                                 className="small-text-bold with-margin",
#                             ),
#                             SubstanceLinks(cis),
#                             CommercializationStatus(current_specialite),
#                             Div(
#                                 "Description",
#                                 className="small-text-bold with-margin",
#                             ),
#                             P(
#                                 "Classe ATC (Anatomique, Thérapeutique et Chimique) : {} ({})".format(
#                                     specialite_atc_df.loc[cis]["nom_atc"],
#                                     specialite_atc_df.loc[cis]["atc"],
#                                 ),
#                                 className="normal-text",
#                             ),
#                             Div(
#                                 [

#                                 ],
#                                 style={"margin-top": "34px"},
#                             ),
#                         ],
#                         className="pr-5",
#                         style={"padding-left": "70px"},
#                     ),
#                 ],
#                 className="description",
#             ),
#             className="col-md-12",
#         ),
#         className="row"),
#     className="col-12"
#     )

# def PieChart(medicament: str, var_1: str, var_2: str) -> Graph:
#     df = pd.DataFrame(MED_DICT[medicament][var_1])

#     if var_2 == "n_cas" and df.n_cas.isnull().all():
#         return NoData()

#     else:
#         fig = go.Figure(
#             go.Pie(
#                 labels=df[var_1],
#                 values=df[var_2],
#                 name="Répartition par {} des patients traités".format(var_1),
#                 marker_colors=PIE_COLORS,
#             )
#         ).update_layout(PIE_LAYOUT)
#         return Graph(
#             figure=fig,
#             className="img-card",
#             responsive=True,
#         )


# def SingleCurve(x: pd.Series, y: pd.Series, name: str, color: str) -> go.Scatter:
#     return go.Scatter(
#         x=x,
#         y=y,
#         mode="lines",
#         name=name,
#         line={
#             "shape": "spline",
#             "smoothing": 1,
#             "width": 4,
#             "color": color,
#         },
#     )


# def CourbesAnnees(medicament: str) -> Graph:
#     df_annee = pd.DataFrame(MED_DICT[medicament]["annee"])

#     fig = make_subplots(specs=[[{"secondary_y": True}]])

#     if df_annee.n_cas.min() >= 10:
#         fig.add_trace(
#             SingleCurve(df_annee.annee, df_annee.n_cas, "Cas déclarés", PIE_COLORS[1]),
#             secondary_y=False,
#         )

#     fig.add_trace(
#         SingleCurve(
#             df_annee.annee, df_annee.n_conso, "Patients traités", PIE_COLORS[2]
#         ),
#         secondary_y=True,
#     )

#     fig.update_yaxes(title_text="Nombre de cas déclarés", secondary_y=False)
#     fig.update_yaxes(title_text="Nombre de patients traités", secondary_y=True)

#     fig.update_xaxes(nticks=len(df_annee))

#     fig.update_layout(CURVE_LAYOUT)
#     return Graph(
#         figure=fig,
#         className="img-card",
#         responsive=True,
#     )


# def BarNotif(medicament: str) -> Graph:
#     if MED_DICT[medicament]["notif"]:
#         df_notif = pd.DataFrame(MED_DICT[medicament]["notif"])

#         fig = go.Figure(
#             go.Bar(
#                 y=df_notif.typ_notif,
#                 x=df_notif.n_decla,
#                 orientation="h",
#                 marker=dict(color=BAR_CHART_COLORS),
#             )
#         )
#         fig.update_layout(BAR_LAYOUT)
#         return Graph(
#             figure=fig,
#             className="img-card",
#             responsive=True,
#             style={"height": str(len(df_notif.typ_notif) * 50) + "px"},
#         )
#     else:
#         return NoData()


# def BarSoc(medicament: str) -> Graph:
#     if MED_DICT[medicament]["soclong"]:
#         df_soc = pd.DataFrame(MED_DICT[medicament]["soclong"])
#         df_soc = df_soc.head(10)

#         fig = go.Figure(
#             go.Bar(
#                 y=df_soc.soc_long,
#                 x=df_soc.n_decla_eff,
#                 orientation="h",
#                 marker=dict(color=BAR_CHART_COLORS),
#             )
#         )

#         fig.update_layout(BAR_LAYOUT)

#         return Div(
#             [
#                 Div(
#                     Graph(
#                         figure=fig,
#                         className="img-card",
#                         responsive=True,
#                         clear_on_unhover=True,
#                         id="soc-bar-chart",
#                         style={"height": str(len(df_soc.n_decla_eff) * 50) + "px"},
#                     ),
#                     id="soc-chart-container",
#                 ),
#                 Div(id="selected-soc", className="d-none"),
#                 HltModal(),
#             ]
#         )
#     else:
#         return NoData()


# def HltModal() -> Modal:
#     return Modal(
#         [
#             ModalHeader(id="header-modal"),
#             ModalBody(id="body-modal"),
#             ModalFooter(
#                 Button(
#                     "Fermer",
#                     id="close-backdrop",
#                     className="ml-auto button-text-bold",
#                     color="secondary",
#                     outline=True,
#                 )
#             ),
#         ],
#         scrollable=True,
#         centered=True,
#         id="update-on-click-data",
#     )


# def Organes(selected_med: str) -> Component:
#     if SPE_SA_DICT[selected_med] == "spécialité":
#         medicament = SUBSTANCE_BY_SPECIALITE[selected_med]["produit"]
#     else:
#         medicament = selected_med

#     tooltip_text = (
#         "Systèmes d’organes (SOC) avec le plus d’effets indésirables déclarés. En cliquant sur les barres latérales, "
#         "vous pourrez connaître le détail des EI déclarés pour chaque SOC. Attention : un cas n'est comptabilisé "
#         "qu’une seule fois par SOC en cas de plusieurs EI affectant le même SOC. Un cas peut en revanche être "
#         "comptabilisé sur plusieurs SOC différents (en fonction des EI déclarés)."
#     )
#     return Div(
#         [
#             SectionTitle(
#                 "Effets indésirables par système d'organes",
#                 "organes-info-icon",
#                 tooltip_text,
#             ),
#             Div(
#                 Div(
#                     Div(
#                         [
#                             P(
#                                 "Effets indésirables les plus déclarés par système d'organes",
#                                 className="normal-text",
#                             ),
#                             BarSoc(medicament),
#                         ],
#                         className="box",
#                     ),
#                     className="col-md-12",
#                 ),
#                 className="row",
#             ),
#         ],
#         className="col-12",
#     )

# def CasDeclares(selected_med: str) -> Component:
#     if SPE_SA_DICT[selected_med] == "spécialité":
#         medicament = SUBSTANCE_BY_SPECIALITE[selected_med]["produit"]
#     else:
#         medicament = selected_med

#     df = pd.DataFrame(MED_DICT[medicament]["annee"])
#     cas_an = round(df.n_cas.sum() / df.n_conso.sum() * 100000)

#     if 0 <= df.n_cas.sum() < 10:
#         cas_declares = "< 10"
#     else:
#         cas_declares = df.n_cas.sum()

#     tooltip_text = (
#         "Nombre de cas notifiés d’effets indésirables (EI) en France estimé à partir des données de la Base "
#         "Nationale de PharmacoVigilance (BNPV). La BNPV est alimentée par les centres régionaux de pharmacovigilance"
#         " qui sont notifiés par les professionnels de santé ou par les patients et association agréées via un "
#         "portail dédié : XX. Sont notifiés les EI que le patient ou son entourage suspecte d’être liés à l’utilisation "
#         "d’un ou plusieurs médicaments et les mésusages, abus ou erreurs médicamenteuses. Il s’agit de cas évalués et "
#         "validés par un comité d’experts. Pour plus d’informations, consultez : "
#         "https://ansm.sante.fr/page/la-surveillance-renforcee-des-medicaments Attention : Les cas déclarés par produit "
#         "ne tiennent pas compte de cas potentiels déclarés au niveau de la substance active "
#         "(environ 20% des observations)."
#     )

#     return Div([
#                 SectionTitle(
#                     "Cas déclarés d'effets indésirables",
#                     "cas-declares-info-icon",
#                     tooltip_text,
#                 ),
#                 Div([
#                     Div([
#                         Indicateur(
#                             cas_an,
#                             "cas/an",
#                             "Taux de déclaration pour 100 000 patients traités sur la période 2014/2018",
#                             "box",
#                         )
#                     ],
#                     className="col-md-6 col-sm-12"),
#                     Div([
#                         Indicateur(
#                             cas_declares,
#                             "cas déclarés",
#                             "Nombre de cas déclarés sur la période 2014/2018",
#                             "box",
#                         )
#                     ],
#                     className="col-md-6 col-sm_12")

#                 ],
#                 className="row")
#             ],
#             className="col-12")
#             # Div(
#             #     Div(
#             #         Div(
#             #             [
#             #                 Div(
#             #                     "Nombre de cas déclarés d'effets indésirables et patients traités par année",
#             #                     className="normal-text",
#             #                 ),
#             #                 Div([CourbesAnnees(medicament)], style={"height": "450px"})
#             #             ],
#             #             className="box",
#             #         ),
#             #         className="col-xl-8",
#             #     ),
#             #     className="row",
#             # ),
#             # Div(
#             #     [
#             #         Div(
#             #             Div(
#             #                 [
#             #                     Div(
#             #                         "Répartition par sexe des cas déclarés",
#             #                         className="normal-text",
#             #                     ),
#             #                     Div([PieChart(medicament, "sexe", "n_cas")], style={"height":"450px"})
#             #                 ],
#             #                 className="box",
#             #             ),
#             #             className="col-xl-4 col-lg-5",
#             #         ),
#             #         Div(
#             #             Div(
#             #                 [
#             #                     Div(
#             #                         "Répartition par âge des cas déclarés",
#             #                         className="normal-text",
#             #                     ),
#             #                     Div([PieChart(medicament, "age", "n_cas")], style={"height": "450px"})
#             #                 ],
#             #                 className="box",
#             #             ),
#             #             className="col-xl-4 col-lg-5",
#             #         ),
#             #         Div(
#             #             Div(
#             #                 [
#             #                     Div(
#             #                         "Répartition par type de notificateur",
#             #                         className="normal-text",
#             #                     ),
#             #                     BarNotif(medicament),
#             #                 ],
#             #                 className="box",
#             #             ),
#             #             className="col-xl-8",
#             #         ),
#             #     ],
#             #     className="row",
#             # )


# def NoData() -> Div:
#     return Div(
#         [
#             Img(
#                 src="/assets/illu_no_data.svg",
#                 className="img-fluid",
#                 alt="Responsive image",
#             ),
#             Div(
#                 "Données insuffisantes pour affichage",
#                 className="small-text",
#                 style={"color": "#9e9e9e"},
#             ),
#         ],
#         className="d-flex flex-column align-items-center",
#     )


# def SubstanceDiv(selected_med: str, spe_dataframe: pd.DataFrame) -> Component:
#     return Div(
#         Div(
#             Div(
#                 Div(
#                     [
#                         Div(
#                             I(
#                                 className="bi bi-book d-flex justify-content-center pt-3",
#                                 style={"font-size": "3rem"},
#                             ),
#                             className="position-absolute",
#                         ),
#                         Div(
#                             [
#                                 Div(
#                                     selected_med,
#                                     className="heading-4",
#                                 ),
#                                 Div(
#                                     [
#                                         Div(
#                                             "SUBSTANCE ACTIVE",
#                                             className="caption-text d-inline-block",
#                                         ),
#                                         I(
#                                             className="info-icon bi bi-info-circle d-inline-block",
#                                             id="substance-info-icon",
#                                         ),
#                                         Tooltip(
#                                             "Composant d'une spécialité pharmaceutique reconnu "
#                                             "comme possédant des propriétés thérapeutiques.",
#                                             target="substance-info-icon",
#                                             placement="right",
#                                         ),
#                                     ]
#                                 ),
#                                 Div(
#                                     "Spécialités de médicaments contenant : {}".format(
#                                         selected_med
#                                     ),
#                                     className="medium-text mt-5",
#                                 ),
#                                 Div(
#                                     "{} médicaments identifiés".format(len(spe_dataframe)),
#                                     className="normal-text mt-3",
#                                     style={"color": "#33C2D6"},
#                                 ),
#                                 dash_table.DataTable(
#                                     id="substance-specialite-table",
#                                     columns=[
#                                         {"name": i, "id": i} for i in spe_dataframe.columns
#                                     ],
#                                     data=spe_dataframe.to_dict("records"),
#                                     page_size=10,
#                                     style_as_list_view=True,
#                                     style_table={"overflowX": "auto"},
#                                     style_cell={
#                                         "height": "40px",
#                                     },
#                                     style_data={
#                                         "fontSize": "12px",
#                                         "fontWeight": "400",
#                                         "font-family": "Roboto",
#                                         "lineHeight": "16px",
#                                         "textAlign": "left",
#                                     },
#                                     style_header={"display": "none"},
#                                 ),
#                             ],
#                             className="pr-5",
#                             style={"padding-left": "70px"},
#                         ),
#                     ],
#                     className="description",
#                 ),
#                 className="col-md-12",
#             ),
#         className="row"),
#     className="col-12"
#     )
