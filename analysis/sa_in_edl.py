import pandas as pd

SA_LIST = [
    "calcium",
    "lanthane",
    "praséodyme",
    "néodyme",
    "samarium",
    "carbonate",
    "europium",
    "gadolinium",
    "terbium",
    "dysprosium",
    "holmium",
    "erbium",
    "thulium",
    "ytterbium",
    "lutétium",
    "yttrium",
    "inositol",
    "phénylènediamine",
    "phénylbutazone",
    "malonylurée",
    "vitamine b1",
    "dihydrostreptomycine",
    "tétraborate",
    "borax",
    "deutérium",
    "hydrogène",
    "diisobutirate",
    "glande",
    "pseudoéphédrine",
    "cyclohexanol",
    "phénol",
    "étidronique",
    "dextrométhorphane",
    "pseudoéphédrine",
    "diaminotoluène",
    "thiamine",
    "riboflavine",
    "nicotinamide",
    "panthothénique",
    "pyridoxine",
    "cobalamine",
]


def main():
    df = get_excels_df()

    frames = []
    for substance in SA_LIST:
        frame = df[df.substance_active.str.contains(substance)]
        frames.append(frame)

    df2 = pd.concat(frames)
    df2.to_csv(
        "/Users/linerahal/Desktop/cae_substances_check.csv", sep=";", index=False
    )
