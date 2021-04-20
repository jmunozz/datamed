#!/usr/bin/env python
# coding: utf-8

# In[1]:


import pandas as pd
from collections import defaultdict
from os import path
import string
import unidecode
from nltk.corpus import stopwords
from tqdm import tqdm

STOPWORDS = stopwords.words("french")

P_ROOT = "~/Documents/GitHub/datamed/create_database/data/"


# In[2]:


df = pd.read_excel("../data/RqHackathon_20190911.xlsx")


# In[27]:


df = df.rename(columns={
    'codeATC': 'atc', 
    'DCI': 'dci', 
    'causeErreur': 'cause_erreur', 
    'natureErreur': 'nature_erreur',
    'populationErreur': 'population_erreur',
    'qualifErreur': 'qualif_erreur',
    'lieuErreur': 'lieu_erreur',
    'initialErreur': 'initial_erreur',
    'EI': 'effet_indesirable',
    'graviteConsequence': 'gravite'
})
df = df[
    ['id', 'denomination', 'dci', 'atc', 'cause_erreur', 'nature_erreur', 'population_erreur', 'qualif_erreur',
     'lieu_erreur', 'initial_erreur', 'effet_indesirable', 'gravite']
]
df = df[~df.denomination.isna()]
df.denomination = df.denomination.apply(lambda x: x.lower().strip() if x else None)
df = df.where(pd.notnull(df), None)
df.head(2)


# # Spécialité

# In[4]:


P_CIS_BDPM = path.join(P_ROOT, "BDPM/CIS_bdpm.txt")


# In[6]:


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


def upload_cis_from_bdpm(path: str) -> pd.DataFrame:
    """
    Upload RSP CIS table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read CIS_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "nom",
        "forme_pharma",
        "voie_admin",
        "statut_amm",
        "type_amm",
        "etat_commercialisation",
        "date_amm",
        "statut_bdpm",
        "num_autorisation",
        "titulaires",
        "surveillance_renforcee"
    ]
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str},
    )
    # Put substance_active field in lower case
    df = clean_columns(df, "nom")
    return df


# In[10]:


df_cis = upload_cis_from_bdpm(P_CIS_BDPM)
df_cis = df_cis.where(pd.notnull(df_cis), None)
df_cis = df_cis[['cis', 'nom']]

df_cis.head(3)


# # Similarité spécialité

# In[ ]:


from collections import Counter
from math import sqrt
from typing import Tuple


class WordsSimilarity:

    def __init__(self, word_tuple: Tuple):
        self.word1 = word_tuple[0]
        self.word2 = word_tuple[1]

        # Count the number of characters in each word
        self.char_counter_1 = Counter(self.word1)
        self.char_counter_2 = Counter(self.word2)
        # Get the set of characters
        self.char_set_1 = set(self.char_counter_1)
        self.char_set_2 = set(self.char_counter_2)
        # Compute vectors lengths
        self.char_len_1 = sqrt(sum(c * c for c in self.char_counter_1.values()))
        self.char_len_2 = sqrt(sum(c * c for c in self.char_counter_2.values()))

    def cosine_similarity(self, ndigits: int) -> float:
        # Get the common characters between the two character sets
        common_characters = self.char_set_1.intersection(self.char_set_2)
        # Sum of the product of each intersection character
        product_summation = sum(self.char_counter_1[character] * self.char_counter_2[character]
                                for character in common_characters)
        # Compute product of vectors lengths
        length = self.char_len_1 * self.char_len_2
        # Compute cosine similarity and rounds the value to ndigits decimal places
        if length == 0:
            # Set value to 0 if word is empty
            return 0
        else:
            return round(product_summation / length, ndigits)


def get_similarity(api_tuple: Tuple, ndigits: int) -> float:
    """
    Compute cosine similarity between a tuple of api
    """
    ws = WordsSimilarity(api_tuple)
    return ws.cosine_similarity(ndigits)


def clean_string(text: str) -> str:
    text = "".join([word for word in text if word not in string.punctuation])
    text = text.lower()
    text = " ".join([word for word in text.split() if word not in STOPWORDS])
    text = unidecode.unidecode(text)
    return text


# In[ ]:


spe_list = df_cis.nom.unique()
denom_list = [denom for denom in df.denomination.unique() if denom]


# In[ ]:


len(spe_list)


# In[ ]:


spe_denom_sim_dict = defaultdict(dict)
for spe in tqdm(spe_list):
    for denom in denom_list:
        spe_tuple = (spe, denom)
        # Clean the words in api_tuple
        cleaned_spe_tuple = tuple(map(clean_string, spe_tuple))
        spe_denom_sim_dict[spe][denom] = get_similarity(cleaned_spe_tuple, 2)


# In[ ]:


import json

with open('spe_denom_similarities.json', 'w') as outfile:
    json.dump(spe_denom_sim_dict, outfile)
    
with open('spe_denom_similarities.json', 'r') as f:
    spe_denom_sim_dict = json.load(f)


# In[ ]:


spe_denom_similarities = {
    denom:{
        "spe": max(spe_dict, key=spe_dict.get, default=None),
        "cos_sim": spe_dict[
            max(spe_dict, key=spe_dict.get, default=None)
        ]
    }
    for denom, spe_dict in spe_denom_sim_dict.items()
}


# In[ ]:


spe_denom_similarities["triméthoprime/sulfaméthoxazole"]
#api_sim_dict["triméthoprime/sulfaméthoxazole"]


# In[ ]:


bad_denom = []
for denom, spe_dict in spe_denom_similarities.items():
    if spe_dict['cos_sim'] <= 0.97:
        bad_denom.append(denom)


# In[ ]:


# df_api[df_api.nom.str.contains('codéine')]


# In[ ]:


count = 0
for denom in bad_denom:
    print(denom)
    print(spe_denom_similarities[denom])
    count += 1
    print('---------------------')
    if count >= 10:
        break


# In[ ]:


df.denom.unique()[:10]


# In[ ]:


spe_denom_similarities['']


# # On retrouve la substance active liée à la dci

# In[ ]:


df['specialite'] = df.dci.apply(lambda x: spe_denom_similarities[x]['spe'] if x in spe_denom_similarities else None)


# In[ ]:


df = df.merge(df_api, left_on='specialite', right_on='nom', how='left')


# In[ ]:


df.head()


# # Graphiques

# In[ ]:


import plotly.graph_objects as go
import plotly.express as px

PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# ## Choix substance

# In[ ]:


specialite = "paracétamol"


# # Cause erreur

# In[ ]:


df_cause = df.groupby(['specialite', 'cause_erreur'])['id'].count().reset_index()
df_cause.head()


# In[ ]:


df_cause[df_cause.specialite == specialite]


# In[ ]:


df.cause_erreur.unique()


# In[ ]:


fig = go.Figure(
    go.Pie(
        labels=df_cause[df_cause.specialite == specialite].cause_erreur,
        values=df_cause[df_cause.specialite == specialite].id,
        name="",
        marker_colors=px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Nature erreur

# In[ ]:


df_nature = df.groupby(['specialite', 'nature_erreur'])['id'].count().reset_index()
df_nature[df_nature.specialite == specialite].head()


# In[ ]:


fig = go.Figure(
    go.Pie(
        labels=df_nature[df_nature.specialite == specialite].nature_erreur,
        values=df_nature[df_nature.specialite == specialite].id,
        name="",
        marker_colors=px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Erreur initiale

# In[ ]:


df_init = df.groupby(['specialite', 'initial_erreur'])['id'].count().reset_index()
df_init[df_init.specialite == specialite].head()


# In[ ]:


fig = go.Figure(
    go.Pie(
        labels=df_init[df_init.specialite == specialite].initial_erreur,
        values=df_init[df_init.specialite == specialite].id,
        name="",
        marker_colors=px.colors.qualitative.Set3,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# In[ ]:




