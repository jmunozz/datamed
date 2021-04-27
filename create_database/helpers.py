from os import walk
from pathlib import Path
from typing import List
from urllib.request import urlretrieve

import pandas as pd

import settings


def remove_file(path):
    Path(path).unlink()


def download_file_from_url(url, fpath):
    urlretrieve(url, fpath)
    return fpath


def list_files(dirpath, pattern="*"):
    _, _, filenames = next(walk(dirpath))
    files = [
        Path(dirpath).joinpath(filename)
        for filename in filenames
        if Path(dirpath).joinpath(filename).match(pattern)
    ]
    files.sort(key=(lambda x: -x.stat().st_mtime))
    return files

def find_file(folder, pattern): 
    return list_files(folder, pattern)[0]



def serie_to_lowercase(df: pd.DataFrame, cols: List[str]):
    for col in cols:
        df[col] = df[col].apply(
            lambda x: x.lower().strip() if isinstance(x, str) else x
        )


def find_file(folder, pattern):
    return list_files(folder, pattern)[0]


def get_exposition_level(nb, **kwargs):
    type = kwargs["type"]
    return (
        max(settings.EXPOSITION[type].items(), key=lambda y: nb <= y[0])[1]
        if nb <= list(settings.EXPOSITION[type])[-1]
        else 5
    )


def print_row(x):
    print(x)

def mapSexeToCode(x): 
    m = { "Hommes": 1, "Femmes": 2}
    return m[x]

def load_excel_to_df(_settings, path=None):
    fpath = find_file(settings.DATA_FOLDER, _settings["source"]["pattern"]) if path is None else path
    # fix bug in pandas when setting type for index (see https://github.com/pandas-dev/pandas/issues/35816)
    read_excel_settings = _settings["read_excel"]
    index_col = read_excel_settings.get("index_col")
    dtype = read_excel_settings.get("dtype")
    cast_str_index = False
    if index_col and dtype and dtype[index_col] == str:
        cast_str_index = True
    if cast_str_index:
        del read_excel_settings["index_col"]
    args = {**{ "io": fpath}, **read_excel_settings}
    df = pd.read_excel(**args)
    if cast_str_index:
        df.set_index(index_col, drop=True, inplace=True)
    return df

def load_csv_to_df(_settings, path=None):
    fpath = find_file(settings.DATA_FOLDER, _settings["source"]["pattern"]) if path is None else path
    # fix bug in pandas when setting type for index (see https://github.com/pandas-dev/pandas/issues/35816)
    read_csv_settings = _settings["read_csv"]
    index_col = read_csv_settings.get("index_col")
    dtype = read_csv_settings.get("dtype")
    cast_str_index = False
    if index_col and dtype and dtype[index_col] == str:
        cast_str_index = True
    if cast_str_index:
        del read_csv_settings["index_col"]
    args = {**{ "filepath_or_buffer": fpath}, **read_csv_settings}
    df = pd.read_csv(**args)
    if cast_str_index:
        df.set_index(index_col, drop=True, inplace=True)
    return df

def filter_row_low_value(row, **kwargs):
    cols = kwargs["cols"]
    for col in cols:
        if row[col] < settings.FILTER_THREESHOLD: 
            row[col] = None
    return row
    
def filter_df_on_low_values(df, cols): 
    return df.apply(axis=1, func=filter_row_low_value, cols=cols)

def filter_serie_on_low_values(serie): 
    return serie.transform(lambda x: x if x >= settings.FILTER_THREESHOLD else None)

def get_total_exposition_level(serie, type):
    return get_exposition_level(serie.sum() / serie.size, type=type)
