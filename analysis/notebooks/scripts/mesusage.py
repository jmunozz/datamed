#!/usr/bin/env python
# coding: utf-8

# In[1]:


import sys
import math
from tqdm import tqdm

import pandas as pd
import plotly.express as px
import plotly.graph_objects as go
from plotly.subplots import make_subplots
from datetime import datetime as dt
import unidecode

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/datamed_dash/')
from db import fetch_data


# In[2]:


def format_age(age_str: str):
    try:
        return int(age_str.replace(" A", ""))
    except ValueError:
        return None


# In[3]:


cols = ['Cas CRPV', 'Mode Recueil', 'Typ Décl', 'Typ Cas', 'Typ Notif', 'Cadre Notif', 'Sex', 'Age',
        'Grave', 'Décès', 'Notif', 'Médicaments', 'Voie', 'Début TT', 'Fin TT', 'Durée',
        'Début EI', 'Fin EI', 'HLT', 'HLGT', 'SOC long', 'Evolution', 'Indication']
df = pd.read_excel(
    "../data/20210104 - YAuffray - Mésusages depuis 2015.xlsx",
    sheet_name="Complet",
    usecols=cols
)

df = df.rename(columns={
    "Cas CRPV": "cas_crpv",
    'Mode Recueil': "mode_recueil", 
    'Typ Décl': "type_decla", 
    'Typ Cas': "type_cas", 
    'Typ Notif': "type_notif", 
    'Cadre Notif': "cadre_notif",
    "Durée": "duree",
    "Début EI": "debut_ei",
    "Fin EI": "fin_ei",
    "Sex": "sexe",
    "Age": "age",
    "Médicaments": "nom",
    "Indication": "indication",
    "Voie": "voie",
    "Type": "type",
    "Evolution": "evolution",
    "HLT": "hlt",
    "HLGT": "hlgt",
    "SOC long": "soc_long",
    "Début TT": "debut_traitement",
    "Fin TT": "fin_traitement",
    "Grave": "grave",
    "Décès": "deces",
    "Notif": "date_notif"}
             )

type_notif_dict = {
    "Infirmière": "Infirmier",
    "Consommateur/autre non professionnel de santé": "Patient"
}

df = df.where(pd.notnull(df), None)
df.nom = df.nom.str.lower()
df.age = df.age.apply(format_age)
df.duree = df.duree.apply(lambda x: x.replace(" Jour", ""))
df.type_notif = df.type_notif.apply(lambda x: type_notif_dict.get(x, x))


# In[4]:


mes = df.to_dict(orient="records")
len(mes)


# In[5]:


def separate_str(x):
    return [s.replace("s ", "") for s in x.split("\n") if s.startswith("s ")]


# In[6]:


def split_str(x):
    if isinstance(x, str):
        return x.split("\n")
    else:
        return x


# In[7]:


def format_rows(df, col_names):
    for col_name in tqdm(col_names):
        print(col_name)
        if col_name == "nom":
            s = df[col_name].apply(separate_str).apply(pd.Series, 1).stack()
        else:
            s = df[col_name].apply(split_str).apply(pd.Series, 1).stack()
        s.index = s.index.droplevel(-1) # to line up with df's index
        s.name = col_name
        del df[col_name]
        df = df.join(s)
        print("done")
        print("---------------------------------")
    return df


# In[8]:


mesusages = []
for m in tqdm(mes):
    noms = separate_str(m["nom"])
    voies = split_str(m["voie"])
    duree = split_str(m["duree"])
    debut_tt = split_str(m["debut_traitement"])
    fin_tt = split_str(m["fin_traitement"])
    debut_ei = split_str(m["debut_ei"])
    fin_ei = split_str(m["fin_ei"])
    hlt = split_str(m["hlt"])
    hlgt = split_str(m["hlgt"])
    soc_long = split_str(m["soc_long"])
    evolution = split_str(m["evolution"])
    indications = split_str(m["indication"])
    for i in range(len(noms)):
        mesusages.append({
            'cas_crpv': m["cas_crpv"],
            'mode_recueil': m["mode_recueil"],
            'type_decla': m["type_decla"],
            'type_cas': m["type_cas"],
            'type_notif': m["type_notif"],
            'cadre_notif': m["cadre_notif"],
            'sexe': m["sexe"],
            'age': m["age"],
            'grave': m["grave"],
            'deces': m["deces"],
            'date_notif': m["date_notif"],
            'nom': noms[i],
            'voie':  voies[i] if voies and i + 1 <= len(voies) else None,
            'debut_traitement': debut_tt[i] if debut_tt and i + 1 <= len(debut_tt) else None,
            'fin_traitement': fin_tt[i] if fin_tt and i + 1 <= len(fin_tt) else None,
            'duree': duree[i] if duree and i + 1 <= len(duree) else None,
            'debut_ei': debut_ei[i] if debut_ei and i + 1 <= len(debut_ei) else None,
            'fin_ei': fin_ei[i] if fin_ei and i + 1 <= len(fin_ei) else None,
            'hlt': hlt[i] if hlt and i + 1 <= len(hlt) else None,
            'hlgt': hlgt[i] if hlgt and i + 1 <= len(hlgt) else None,
            'soc_long': soc_long[i] if soc_long and i + 1 <= len(soc_long) else None,
            'evolution': evolution[i] if evolution and i + 1 <= len(evolution) else None,
            'indication': indications[i] if indications and i + 1 <= len(indications) else None

        })

len(mesusages)


# In[9]:


def parse_date(date_str: str):
    if date_str:
        try:
            return dt.strptime(date_str, "%d/%m/%Y")
        except ValueError:
            return None
    else:
        return None


# In[10]:


def categorize_age(age: int) -> str:
    if age <= 16:
        return "0-16 ans"
    elif 17 <= age <= 64:
        return "17-64 ans"
    elif age >= 65:
        return "65 ans et plus"


# In[11]:


df.columns


# In[12]:


df = pd.DataFrame(mesusages)

df.debut_ei = df.debut_ei.apply(parse_date)
df.fin_ei = df.fin_ei.apply(parse_date)
df.debut_traitement = df.debut_traitement.apply(parse_date)
df.fin_traitement = df.fin_traitement.apply(parse_date)
df.date_notif = df.date_notif.apply(parse_date)

df.age = df.age.apply(categorize_age)

df.head(1)


# # Récupérer le code CIS

# In[13]:


df_spe = fetch_data.fetch_table("specialite", "cis").reset_index()

df_spe.head(1)


# In[14]:


df = df.merge(df_spe[["cis", "nom"]], on="nom", how="left")

df = df[[
    'cas_crpv',
    'cis',
    'nom',
    'sexe',
    'age',
    'date_notif',
    'debut_traitement',
    'fin_traitement',
    'duree',
    'debut_ei',
    'fin_ei',
    'mode_recueil',
    'type_decla',
    'type_cas',
    'type_notif',
    'cadre_notif',
    'grave',
    'deces',
    'hlt',
    'hlgt',
    'soc_long',
    'evolution',
    'indication',
    'voie'
]]


# In[15]:


len(df[df.cis.notnull()]) / len(df) * 100


# # Page générale mésusage

# ## Sexe

# In[16]:


df_sexe = df[["sexe", "cas_crpv"]].groupby("sexe").cas_crpv.count().reset_index()

df_sexe


# In[17]:


PIE_COLORS = ["#F599B5", "#FACCDA", "#EF6690"]

PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=df_sexe.sexe,
        values=df_sexe.cas_crpv,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Tranches d'âge

# In[18]:


df_age = df[["age", "cas_crpv"]].groupby("age").cas_crpv.count().reset_index()

df_age


# In[19]:


PIE_COLORS = ["#F599B5", "#FACCDA", "#EF6690"]

PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=df_age.age,
        values=df_age.cas_crpv,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Gravité

# In[20]:


df_grave = df[["grave", "cas_crpv"]].groupby("grave").cas_crpv.count().reset_index()

df_grave


# In[21]:


PIE_COLORS = ["#F599B5", "#FACCDA", "#EF6690"]

PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=df_grave.grave,
        values=df_grave.cas_crpv,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Déclarant

# In[22]:


df_decla = df[["type_notif", "cas_crpv"]].groupby("type_notif").cas_crpv.count().reset_index()
df_decla = df_decla[df_decla.cas_crpv >= 10]

df_decla


# In[23]:


PIE_COLORS = ["#FACCDA", "#F599B5", "#EF6690", "#EA336B", "#E50046",
              "#DFD4E5", "#BFAACB", "#5E2A7E", "#9E7FB2", "#7E5598"]

PIE_LAYOUT = {
    "paper_bgcolor": "#FFFFFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1)
}

fig = go.Figure(
    go.Pie(
        labels=df_decla.type_notif,
        values=df_decla.cas_crpv,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Déclarations au cours du temps

# In[24]:


df["annee_notif"] = df.date_notif.apply(lambda x: x.year)
df_annee = df[["annee_notif", "cas_crpv"]].groupby("annee_notif").cas_crpv.count().reset_index()
df_annee = df_annee[df_annee.cas_crpv >= 10]

df_annee


# In[25]:


CURVE_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "plot_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
    "hoverlabel": {"namelength": -1},
}

fig = go.Figure(
    go.Scatter(
        x=df_annee.annee_notif,
        y=df_annee.cas_crpv,
        mode="lines",
        name="Déclarations de mésusages",
        line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
        hoverlabel={"namelength" :-1},
        hovertemplate="%{y:int}",
    )
)

fig.update_yaxes(title_text="Déclarations de mésusages",
                 color="#EA336B")
fig.update_xaxes(title_text="Années")
fig.update_xaxes(nticks=len(df_annee))
fig.update_layout(CURVE_LAYOUT)
fig.show()


# In[26]:


pv_dict = [
    {"annee": 2014, "cas": 42444},
    {"annee": 2015, "cas": 42396},
    {"annee": 2016, "cas": 45515},
    {"annee": 2017, "cas": 72687},
    {"annee": 2018, "cas": 58425},
    {"annee": 2019, "cas": 48147},
    {"annee": 2020, "cas": 45015},
    {"annee": 2021, "cas": 55774},
]

df_pv = pd.DataFrame(pv_dict)
df_pv.head()


# In[27]:


fig = make_subplots(specs=[[{"secondary_y": True}]])

fig.add_trace(
    go.Scatter(
        x=df_annee.annee_notif,
        y=df_annee.cas_crpv,
        mode="lines",
        name="Déclarations d'effets indésirables liés au mésusage",
        line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#F599B5"},
    ),
    secondary_y=False,
)

fig.add_trace(
    go.Scatter(
        x=df_pv.annee,
        y=df_pv.cas,
        mode="lines",
        name="Cas de pharmacovigilance",
        line={"shape": "spline", "smoothing": 1, "width": 4, "color": "#EA336B"},
        hoverlabel={"namelength" :-1},
        hovertemplate="%{y:int}",
    ),
    secondary_y=True,
)

fig.update_yaxes(title_text="Déclarations d'effets indésirables liés au mésusage",
                 color="#F599B5",
                 secondary_y=False)
fig.update_yaxes(title_text="Cas de pharmacovigilance", color="#EA336B", secondary_y=True)
fig.update_xaxes(title_text="Années")
#fig.update_xaxes(nticks=len(df_decla.loc[code]))
fig.update_layout(CURVE_LAYOUT)
fig.show()


# # Par spécialité

# In[28]:


cis = "60234100"


# In[29]:


df[df.cis == cis].head(2)


# In[30]:


df_cis = df[df.cis == cis]


# ## SOC

# In[31]:


df_soc = df_cis[["soc_long", "cas_crpv"]].groupby("soc_long").cas_crpv.count().reset_index()
df_soc = df_soc[df_soc.cas_crpv >= 10]

df_soc


# In[32]:


TREE_COLORS = ["#5E2A7E", "#7E5598", "#9E7FB2", "#BFAACB", "#DFD4E5",
               "#ECD6E7", "#D9ADD0", "#C683B8", "#B35AA1", "#A03189"]

TREEMAP_LAYOUT = {
    "xaxis_showgrid": False,
    "yaxis_showgrid": False,
    "hovermode": "x unified",
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "font": {"size": 12, "color": "black"},
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

path = "soc_long"
values = "cas_crpv"
fig = px.treemap(
    df_soc.sort_values(by=values, ascending=False).head(10),
    path=[path],
    values=values,
    color_discrete_sequence=TREE_COLORS,
    hover_name=path,
)

fig.update_layout(TREEMAP_LAYOUT)
fig.update_traces(
    texttemplate="%{label}<br>%{value:.0f}%",
    textposition="middle center",
    textfont_size=18,
    hovertemplate="<b>%{label}</b> <br> %{value:.0f}%",
)

fig.show()


# ## Sexe

# In[33]:


df_sexe = df_cis[["sexe", "cas_crpv"]].groupby("sexe").cas_crpv.count().reset_index()

df_sexe


# In[34]:


PIE_COLORS = ["#F599B5", "#FACCDA", "#EF6690"]

PIE_LAYOUT = {
    "paper_bgcolor": "#FFF",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}

fig = go.Figure(
    go.Pie(
        labels=df_sexe.sexe,
        values=df_sexe.cas_crpv,
        marker_colors=PIE_COLORS,
        hovertemplate="<b>%{label}</b> <br> <br>Proportion : <b>%{percent}</b> <extra></extra>",
    )
).update_layout(PIE_LAYOUT)

fig.show()


# In[ ]:




