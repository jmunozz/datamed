#!/usr/bin/env python
# coding: utf-8

# In[2]:


import pandas as pd

pd.set_option('display.max_rows', None)


# # Exposition

# In[17]:


expo_dict = {
    'spécialité': {1000: 1, 5000: 2, 15000: 3, 50000: 4},
    'substance': {5000: 1, 25000: 2, 100000: 3, 500000: 4}
}


# # Nombre de patients / an

# ## Spécialité

# In[31]:


df_spe = pd.read_csv("../data/open_medic2014_2018_cis_agg.csv", sep=";")
df_spe = df_spe.drop(['Unnamed: 0', 'sexe'], axis=1)
df_spe = df_spe.rename(columns={'codeCIS': 'cis', 'AGE': 'age', 'n_conso_14_18': 'n_conso', 'SEXE': 'sexe'})

df_spe['exposition'] = df_spe.n_conso_an.apply(
    lambda x: min([v for (k, v) in expo_dict['spécialité'].items() if x < k], default=5)
)


# In[32]:


df_spe.head()


# In[ ]:




