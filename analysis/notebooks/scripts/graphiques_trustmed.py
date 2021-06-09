#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime as dt
import unidecode

# import locale
# locale.setlocale(locale.LC_TIME, 'fr_FR') # this sets the date time formats to fr_FR

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/datamed_dash/')
from db import fetch_data


# In[2]:


BAR_CHART_COLORS = [
    "#009640",
    "#66C08C",
    "#99D5B3",
    "#CCEAD9",
    "#AFCA0B",
    "#DFEA9D",
    "#EFF4CE",
    "#CFDF6D",
    "#33C2D6",
    "#66D1E0",
    "#99E1EB",
    "#CCF0F5",
    "#B35AA1",
    "#C683B8"
]


# ## Table ruptures

# In[3]:


df = fetch_data.fetch_table("ruptures", "numero").reset_index()
df.head(2)


# # Nombre de signalements / an

# In[4]:


"{} signalements / an".format(round(len(df) / len(range(2014, dt.now().year + 1))))


# # Signalements par an par classe ATC

# In[5]:


annee = 2019


# In[6]:


df_sig = fetch_data.fetch_table("signalements", "annee")


# In[7]:


df_sig.loc[annee].head(10)


# In[8]:


# set up plotly figure
fig = make_subplots(
    specs=[[{"secondary_y": True}]],
)

# add first bar trace at row = 1, col = 1
fig.add_trace(
    go.Bar(
        x=df_sig.loc[annee].head(10).label,
        y=df_sig.loc[annee].head(10).nb_signalements,
        #orientation="h",
        marker=dict(color=BAR_CHART_COLORS),
        name="Nombre de signalements"
    ),
    secondary_y=False,
)

# add first scatter trace at row = 1, col = 1
fig.add_trace(
    go.Scatter(
        x=df_sig.loc[annee].head(10).label,
        y=df_sig.loc[annee].head(10).nb_presentations,
        line={
            "shape": "spline",
            "smoothing": 1,
            "width": 4,
            "color": "#00B3CC",
        },
        mode="lines",
        name='Nombre de présentations'
    ),
    secondary_y=True,
)

fig.update_layout(
    xaxis=dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
    ),
    yaxis=dict(
        showgrid=False,
        showline=False,
        showticklabels=True,
        zeroline=False,
        ticks="outside", 
        tickcolor='white',
        ticklen=1
    ),
    plot_bgcolor='rgba(0,0,0,0)',
    margin=dict(l=0, r=0, t=0, b=0),
    barmode='group',
    bargap=0.10,
    bargroupgap=0.0,
    font={'size': 12},
    hovermode="x unified",
    hoverlabel={"namelength": -1},
)

#fig.update_xaxes(tickangle=60)
fig.update_yaxes(autorange="reversed")

fig.show()


# # Signalements / an / catégorie

# In[9]:


def SingleCurve(x: pd.Series, y: pd.Series, name: str, color: str) -> go.Scatter:
    return go.Scatter(
        x=x,
        y=y,
        mode="lines",
        name=name,
        line={
            "shape": "spline",
            "smoothing": 1,
            "width": 4,
            "color": color,
        },
    )


# In[10]:


COLORS = ["#009640", "#00B3CC"]

CURVE_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FFF",
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel":{"namelength": -1},
}


# In[11]:


df_annee = df.groupby(['annee', 'classification']).numero.count().reset_index()
df_annee = df_annee.rename(columns={'numero': 'nb_signalements'})


# In[12]:


df_annee.head()


# In[13]:


fig = make_subplots()

for idx, status in enumerate(["rupture", "risque de rupture"]):
    df_status = df_annee[df_annee.classification == status]
    fig.add_trace(
        SingleCurve(df_status.annee, df_status.nb_signalements, status, COLORS[idx])
    )

fig.update_layout(CURVE_LAYOUT)

fig.show()


# # Statut des dossiers circuit ville / hôpital

# In[14]:


circuit = "hôpital"


# In[15]:


COLORS = ["#5E2A7E", "#009640"]


# In[16]:


import locale
locale.setlocale(locale.LC_ALL, 'fr_FR')

import calendar
calendar.month_name[df.iloc[0].date.month].capitalize()


# In[17]:


df_circuit = df[(df.circuit == circuit) & (df.date >= '2021-05-04')]
df_circuit.date = df_circuit.date.apply(lambda x: dt(x.year, x.month, 1))
df_circuit = df_circuit.groupby(["date", "etat"]).numero.count().reset_index()
df_circuit = df_circuit.rename(columns={'numero': 'nombre'})
df_circuit.head()


# In[18]:


type(df_circuit.date)


# In[19]:


fig = make_subplots()

for idx, e in enumerate(["ouvert", "clôturé"]):
    df_etat = df_circuit[df_circuit.etat == e]
    fig.add_trace(
        SingleCurve(df_etat.date, df_etat.nombre, e, COLORS[idx])
    )

fig.update_layout({
        "xaxis": {"tickmode": "array", "tickvals": df_circuit.date},
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FFF",
        "paper_bgcolor": "#FFF",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
        "hoverlabel": {"namelength": -1},
    })
fig.update_layout(showlegend=True)

fig.show()


# # Évolution des ruptures circuit ville / hôpital

# In[20]:


df_rupture_circuit = df[
    (df.circuit == circuit) & (df.classification == "rupture")
].groupby("annee").numero.count().reset_index()
df_rupture_circuit = df_rupture_circuit.rename(columns={'numero': 'nombre_ruptures'})
df_rupture_circuit.head(2)


# In[21]:


fig = go.Figure(
    SingleCurve(df_rupture_circuit.annee, df_rupture_circuit.nombre_ruptures, "", "#00B3CC")
)

fig.update_layout(CURVE_LAYOUT)

fig.show()


# # Motifs de rupture

# In[22]:


df_cause = df.groupby(["annee", "cause"]).numero.count().reset_index()
df_cause.numero = df_cause.apply(lambda x: x.numero / len(df_cause[df_cause.annee == x.annee]), axis=1)
df_cause = df_cause.rename(columns={"numero": "nombre_signalements"}).set_index("annee")


# In[23]:


df_cause.head()


# In[24]:


df_cause.loc[2019].sort_values(by="nombre_signalements", ascending=False).head(10)


# In[25]:


fig = px.treemap(
        df_cause.loc[2019].sort_values(by="nombre_signalements", ascending=False).head(10),
        path=["cause"],
        values="nombre_signalements",
        #color_discrete_sequence=TREE_COLORS,
        hover_name="cause",
    )

fig.update_layout(
    {
        "xaxis_showgrid": False,
        "yaxis_showgrid": False,
        "hovermode": "x unified",
        "plot_bgcolor": "#FAFAFA",
        "paper_bgcolor": "#FAFAFA",
        "margin": dict(t=0, b=0, l=0, r=0),
        "font": {"size": 12, "color": "black"},
        "legend": dict(
            orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1
        ),
    }
)
fig.update_traces(
    texttemplate="%{label}<br>%{value:.0f}%",
    textposition="middle center",
    textfont_size=18,
    hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
)

fig.show()


# # Test recherche spécialité

# In[26]:


cis = "69766923"


# In[27]:


df_spe = fetch_data.fetch_table("specialite", "cis")


# In[28]:


specialite = df_spe.loc[cis].nom


# In[29]:


produit = specialite.split()[0]
forme = specialite.split()[-1]


# In[30]:


df_spe.head(1)


# In[31]:


df = df.merge(df_spe.reset_index()[["cis", "nom"]], on="nom", how="left")


# ### Présentation

# In[32]:


df_pres = fetch_data.fetch_table("presentation", "cip13").reset_index()


# In[33]:


df_pres.head(1)


# In[34]:


df = df.merge(df_pres[["cip13", "cis"]], on="cip13", how="left")


# # Mesures

# In[35]:


dfm = fetch_data.fetch_table("mesures", "index").reset_index()
dfm.head(2)


# In[36]:


df_mesure = dfm.groupby("mesure").numero.count().reset_index()
df_mesure = df_mesure.rename(columns={"numero": "nombre"})
df_mesure.head()


# In[37]:


PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FFF",
    #"hovermode": False,
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# In[38]:


fig = go.Figure(
    go.Pie(
        labels=df_mesure.mesure,
        values=df_mesure.nombre,
        marker_colors=PIE_COLORS,    #px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# In[ ]:




