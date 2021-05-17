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

sys.path.append('/Users/linerahal/Documents/GitHub/datamed/datamed_dash/')
from db import fetch_data


# In[2]:


cols = ['Cas CRPV', 'Mode Recueil', 'Typ Décl', 'Typ Cas', 'Typ Notif', 'Cadre Notif', 'Sex', 'Age',
        'Grave', 'Décès', 'Notif', 'Médicaments', 'Voie', 'Début TT', 'Fin TT', 'Durée',
        'Début EI', 'Fin EI', 'HLT', 'HLGT', 'SOC long', 'Evolution']
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
    "Sex": "sexe",
    "Age": "age",
    "Médicaments": "nom",
    "Indication": "indication",
    "Voie": "voie",
    "Type": "type",
    "Evolution": "evolution"}
             )

df.nom = df.nom.str.lower()
df.age = df.age.apply(lambda x: x.replace(" A", ""))
#df.nom = df.nom.apply(lambda x: [s.replace("s ", "") for s in x.split(", ") if s.startswith("s")])
for col in df.columns:
    df[col] = df[col].apply(lambda x: x.replace("\n", ", ") if isinstance(x, str) else x)


# In[3]:


def separate_str(x):
    return [s.replace("s ", "") for s in x.split(", ") if s.startswith("s")]


# In[4]:


def format_rows(df, col_name):
    s = df[col_name].apply(separate_str).apply(pd.Series, 1).stack()
    s.index = s.index.droplevel(-1) # to line up with df's index
    s.name = col_name
    del df[col_name]
    df = df.join(s)
    return df


# In[5]:


df = format_rows(df, "nom")
#format_rows(df, "Début EI")
#format_rows(df, "Fin EI")
#df = format_rows(df, "HLT")
#df = format_rows(df, "HLGT")
#df = format_rows(df, "SOC long")
#format_rows(df, "evolution")


# In[6]:


df.iloc[103]


# In[7]:


df.head(2)


# # Récupérer le code CIS

# In[8]:


df_spe = fetch_data.fetch_table("specialite", "cis").reset_index()


# In[9]:


df_spe.head()


# In[10]:


df = df.merge(df_spe[["cis", "nom"]], on="nom", how="left")


# In[11]:


df2 = df[["cas_crpv", "cis", "nom"]]


# In[12]:


df2[df2.cis.notnull()]


# # Sexe

# In[13]:


df_sexe = df[["sexe", "cas_crpv"]].groupby("sexe").cas_crpv.count().reset_index()


# In[14]:


df_sexe


# In[15]:


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




