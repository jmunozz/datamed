from os import walk
from pathlib import Path
from typing import List
from urllib.request import urlretrieve

import pandas as pd


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
    files.sort(key=(lambda x: -x.stat().st_mtime))
    return files


def serie_to_lowercase(df: pd.DataFrame, cols: List[str]):
    for col in cols:
        df[col] = df[col].apply(
            lambda x: x.lower().strip() if isinstance(x, str) else x
        )
