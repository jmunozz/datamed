#!/usr/bin/env python
# coding: utf-8

# In[145]:


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


# In[146]:


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

df = df.where(pd.notnull(df), None)
df.nom = df.nom.str.lower()
df.age = df.age.apply(lambda x: x.replace(" A", ""))


# In[147]:


mes = df.to_dict(orient="records")


# In[148]:


m = mes[101]
m


# In[139]:


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
        mes.append({
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
    a.remove(mes)


# In[37]:


def separate_str(x):
    return [s.replace("s ", "") for s in x.split("\n") if s.startswith("s ")]


# In[38]:


def split_str(x):
    if isinstance(x, str):
        return x.split("\n")
    else:
        return x


# In[ ]:


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


# In[9]:


for col_name in tqdm(col_names[:2]):
    print(col_name)
    if col_name == "nom":
        s = df[col_name].apply(separate_str).apply(pd.Series, 1).stack()
    else:
        s = df[col_name].apply(split_str).apply(pd.Series, 1).stack()
        print("1")
    s.index = s.index.droplevel(-1) # to line up with df's index
    print("2")
    s.name = col_name
    print("3")
    del df[col_name]
    print("4")
    df = df.join(s)
    del s
    print("done")
    print("---------------------------------")


# In[8]:


col_names = ["nom", "debut_ei", "fin_ei", "debut_traitement", "fin_traitement", "voie",
             "hlt", "hlgt", "soc_long", "evolution", "indication"]
#df = format_rows(df, col_names)


# In[ ]:


df.iloc[103]


# In[ ]:


df.head(2)


# # Récupérer le code CIS

# In[ ]:


df_spe = fetch_data.fetch_table("specialite", "cis").reset_index()


# In[ ]:


df_spe.head()


# In[ ]:


df = df.merge(df_spe[["cis", "nom"]], on="nom", how="left")


# In[ ]:


df2 = df[["cas_crpv", "cis", "nom"]]


# In[ ]:


df2[df2.cis.notnull()]


# # Sexe

# In[ ]:


df_sexe = df[["sexe", "cas_crpv"]].groupby("sexe").cas_crpv.count().reset_index()


# In[ ]:


df_sexe


# In[ ]:


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




