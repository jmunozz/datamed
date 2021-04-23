from os import walk
from pathlib import Path
from typing import List
from urllib.request import urlretrieve

import pandas as pd

import settings

def remove_file(path):
    Path(path).unlink()


def download_file_from_url(url, path):
    urlretrieve(url, path)


def list_files(dirpath, pattern="*"):
    _, _, filenames = next(walk(dirpath))
    files = [
        Path(dirpath).joinpath(filename)
        for filename in filenames
        if Path(dirpath).joinpath(filename).match(pattern)
    ]
    files.sort(key=(lambda x: -(x.stat().st_mtime)))
    return files


def serie_to_lowercase(df: pd.DataFrame, cols: List[str]):
    for col in cols: 
        df[col] = df[col].apply(lambda x: x.lower().strip() if isinstance(x, str) else x)


def find_file(folder, pattern):
    return list_files(folder, pattern)[0]


def get_exposition_level(nb, **kwargs): 
    type=kwargs["type"]
    return max(settings.EXPOSITION[type].items(), key=lambda y: nb <= y[0])[1] if nb <= list(settings.EXPOSITION[type])[-1] else 5

def print_row(x): 
    print(x)
