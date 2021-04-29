#!/usr/bin/env python
# coding: utf-8

# In[95]:


import pandas as pd
from collections import defaultdict
from os import path
import string
import unidecode
from nltk.corpus import stopwords

STOPWORDS = stopwords.words("french")

P_ROOT = "~/Documents/GitHub/datamed/create_database/data/"


# In[45]:


df = pd.read_excel("../data/RqHackathon_20190911.xlsx")


# In[71]:


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
df = df.where(pd.notnull(df), None)
df.head(2)


# In[99]:


dci_list = df.dci.unique()
dci_list = [dci for dci in dci_list if dci]


# # Substance active

# In[20]:


P_COMPO_RSP = path.join(P_ROOT, "RSP/COMPO_RSP.txt")


# In[23]:


def clean_columns(df: pd.DataFrame, col_name: str) -> pd.DataFrame:
    """
    Put column fields in lower case
    """
    df[col_name] = df[col_name].apply(lambda x: x.lower().strip())
    return df


# In[21]:


def upload_compo_from_rsp(path: str) -> pd.DataFrame:
    """
    Upload RSP COMPO table
    In http://agence-prd.ansm.sante.fr/php/ecodex/telecharger/telecharger.php
    :return: dataframe
    """
    # Read COMPO_RSP.txt file and put in dataframe
    col_names = [
        "cis",
        "elem_pharma",
        "code",
        "substance_active",
        "dosage",
        "ref_dosage",
        "nature_composant",
        "num_lien",
        "v",
    ]
    df = pd.read_csv(
        path,
        sep="\t",
        encoding="latin1",
        names=col_names,
        header=None,
        dtype={"cis": str, "code": str},
    )
    df = df[~df.substance_active.isna()]
    # Put substance_active field in lower case
    df = clean_columns(df, "substance_active")
    return df


# In[100]:


df_api = upload_compo_from_rsp(P_COMPO_RSP)
df_api = df_api[df_api.nature_composant == "SA"]
df_api = df_api.rename(columns={"substance_active": "nom"})
df_api = df_api[["code", "nom"]]
df_api = df_api.drop_duplicates(["code"], keep="last")

api_list = [api for api in df_api.nom.unique() if api]


# # Similarité substance active

# In[92]:


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


# In[101]:


api_sim_dict = defaultdict(dict)
for dci in dci_list:
    for api in api_list:
        api_tuple = (dci, api)
        # Clean the words in api_tuple
        cleaned_api_tuple = tuple(map(clean_string, api_tuple))
        api_sim_dict[dci][api] = get_similarity(cleaned_api_tuple, 2)


# In[113]:


api_similarities = {
    dci:{
        "api": max(api_dict, key=api_dict.get, default=None),
        "cos_sim": api_dict[
            max(api_dict, key=api_dict.get, default=None)
        ]
    }
    for dci, api_dict in api_sim_dict.items()
}


# In[128]:


api_similarities["triméthoprime/sulfaméthoxazole"]
#api_sim_dict["triméthoprime/sulfaméthoxazole"]


# # On retrouve la substance active liée à la dci

# In[123]:


df['substance'] = df.dci.apply(lambda x: api_similarities[x]['api'] if x in api_similarities else None)


# In[132]:


df = df.merge(df_api, left_on='substance', right_on='nom', how='left')


# In[133]:


df.head()


# # Graphiques

# In[165]:


import plotly.graph_objects as go

PIE_COLORS = ["#DFD4E5", "#BFAACB", "#5E2A7E"]

PIE_LAYOUT = {
    "plot_bgcolor": "#FAFAFA",
    "paper_bgcolor": "#FAFAFA",
    "margin": dict(t=0, b=0, l=0, r=0),
    "legend": dict(orientation="h", yanchor="bottom", y=1.02, xanchor="right", x=1),
}


# # Cause erreur

# In[166]:


df_cause = df.groupby(['substance', 'cause_erreur'])['id'].count().reset_index()
df_cause.head()


# In[167]:


df_cause[df_cause.substance == "paracétamol"]


# In[168]:


df.cause_erreur.unique()


# In[169]:


fig = go.Figure(
    go.Pie(
        labels=df_cause[df_cause.substance == "paracétamol"].cause_erreur,
        values=df_cause[df_cause.substance == "paracétamol"].id,
        name="Répartition par des patients traités",
        marker_colors=PIE_COLORS,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Nature erreur

# In[170]:


df_nature = df.groupby(['substance', 'nature_erreur'])['id'].count().reset_index()
df_nature[df_nature.substance == "paracétamol"].head()


# In[171]:


fig = go.Figure(
    go.Pie(
        labels=df_nature[df_nature.substance == "paracétamol"].nature_erreur,
        values=df_nature[df_nature.substance == "paracétamol"].id,
        name="Répartition par des patients traités",
        marker_colors=PIE_COLORS,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# ## Erreur initiale

# In[172]:


df_init = df.groupby(['substance', 'initial_erreur'])['id'].count().reset_index()
df_init[df_init.substance == "paracétamol"].head()


# In[173]:


fig = go.Figure(
    go.Pie(
        labels=df_init[df_init.substance == "paracétamol"].initial_erreur,
        values=df_init[df_init.substance == "paracétamol"].id,
        name="Répartition par des patients traités",
        marker_colors=PIE_COLORS,
    )
).update_layout(PIE_LAYOUT)

fig.show()


# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:





# In[ ]:




