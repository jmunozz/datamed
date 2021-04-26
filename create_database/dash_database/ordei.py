import pandas as pd
from sqlalchemy.types import Integer, Text, Float

import paths
from create_tables import push_to_table

EXPOSITION = {
    "spécialité": {1000: 1, 5000: 2, 15000: 3, 50000: 4},
    "substance": {5000: 1, 25000: 2, 100000: 3, 500000: 4},
}


class Ordei:
    @staticmethod
    def compute_percentage(
        df: pd.DataFrame, substance: pd.Series, key: str, field: str
    ) -> float:
        return substance[field] / df[df[key] == substance[key]][field].sum() * 100

    @staticmethod
    def get_substance_dataframe() -> pd.DataFrame:
        df = pd.read_csv(
            paths.P_ORDEI_SUBSTANCE,
            encoding="ISO-8859-1",
            sep=";",
            dtype={"codeSubstance": str},
        )
        df = df.drop("Unnamed: 0", axis=1)

        return df.rename(
            columns={
                "ANNEE": "annee",
                "SEXE": "sexe",
                "AGE": "age",
                "SUBSTANCE_CODEX_UNIQUE": "substance",
                "codeSubstance": "code",
                "n_conso": "conso",
                "n_cas": "cas",
            }
        )

    @staticmethod
    def get_substance_soclong_dataframe() -> pd.DataFrame:
        df = pd.read_csv(
            paths.P_ORDEI_SOCLONG,
            encoding="ISO-8859-1",
            sep=";",
            dtype={"codeSubstance": str},
        )
        df = df.drop("Unnamed: 0", axis=1)

        df = df.rename(
            columns={
                "SEXE": "sexe",
                "AGE": "age",
                "SOC_LONG": "soc_long",
                "SUBSTANCE_CODEX_UNIQUE": "substance_active",
                "codeSubstance": "code",
            }
        )

        temp = (
            df.groupby(["code", "soc_long"]).agg({"n_decla_eff": "sum"}).reset_index()
        )
        temp2 = (
            df.drop_duplicates(subset=["code", "age", "sexe", "n_cas"])
            .groupby("code")
            .agg({"n_cas": "sum"})
            .reset_index()
        )

        return temp.merge(temp2, on="code", how="left")

    def get_spe_ordei_dataframe(self) -> pd.DataFrame:
        df = pd.read_csv(
            paths.P_ORDEI_SPECIALITE,
            sep=";",
            dtype={"codeCIS": str},
        )
        df = df.drop(["Unnamed: 0", "sexe"], axis=1)
        return df.rename(
            columns={
                "codeCIS": "cis",
                "AGE": "age",
                "n_conso_14_18": "conso",
                "SEXE": "sexe",
            }
        )

    def create_spe_conso_ordei_table(self):
        df = self.get_spe_ordei_dataframe()

        df = df.groupby("cis")["conso"].sum().reset_index()
        df["exposition"] = df.conso.apply(
            lambda x: max(EXPOSITION["spécialité"].items(), key=lambda y: x / 5 <= y[0])[1]
            if x <= 50000
            else 5
        )
        df = df.drop(columns=["conso"])

        push_to_table(
            df,
            "specialite_ordei",
            {
                "cis": Text,
                "exposition": Integer,
            },
        )

    def create_spe_patients_sexe_table(self):
        df = self.get_spe_ordei_dataframe()

        df_sexe = df.groupby(["cis", "sexe"]).agg({"conso": "sum"}).reset_index()

        df_sexe["pourcentage_patients"] = df_sexe.apply(
            lambda x: self.compute_percentage(df_sexe, x, "cis", "conso")
            if x.conso >= 10
            else None,
            axis=1,
        )

        df_sexe = df_sexe.drop(columns=["conso"])

        push_to_table(
            df_sexe,
            "specialite_patient_sexe_ordei",
            {
                "cis": Text,
                "sexe": Text,
                "pourcentage_patients": Float,
            },
        )

    def create_spe_patients_age_table(self):
        df = self.get_spe_ordei_dataframe()

        df_age = df.groupby(["cis", "age"]).agg({"conso": "sum"}).reset_index()

        df_age["pourcentage_patients"] = df_age.apply(
            lambda x: self.compute_percentage(df_age, x, "cis", "conso")
            if x.conso >= 10
            else None,
            axis=1,
        )

        df_age = df_age.drop(columns=["conso"])

        push_to_table(
            df_age,
            "specialite_patient_age_ordei",
            {
                "cis": Text,
                "age": Text,
                "pourcentage_patients": Float,
            },
        )

    def create_substance_ordei_table(self):
        df_sa_patients = self.get_substance_dataframe()

        df_annee = (
            df_sa_patients.groupby(["code", "annee"])
            .agg({"conso": "sum", "cas": "sum"})
            .reset_index()
        )

        df_annee["conso_annee"] = df_annee.conso.apply(lambda x: x if x >= 10 else None)
        df_annee["cas_annee"] = df_annee.cas.apply(lambda x: x if x >= 10 else None)
        df_annee = df_annee.drop(["conso", "cas"], axis=1)

        df = (
            df_sa_patients.groupby(["code", "annee"])
            .agg({"conso": "sum", "cas": "sum"})
            .groupby("code")
            .agg({"conso": "sum", "cas": "sum"})
            .reset_index()
        )
        df["exposition"] = df.conso.apply(
            lambda x: max(EXPOSITION["substance"].items(), key=lambda y: x / 5 <= y[0])[1]
            if x <= 500000
            else 5
        )

        df.cas = df.cas.apply(lambda x: x if x >= 10 else None)
        df["taux_cas"] = df.apply(
            lambda x: x.cas * 100000 / x.conso if x.cas >= 10 else None, axis=1
        )

        df = df.merge(df_annee, on="code", how="left")
        df = df.drop(columns=["conso"])

        push_to_table(
            df,
            "substance_ordei",
            {
                "code": Text,
                "exposition": Integer,
                "cas": Integer,
                "taux_cas": Float,
                "annee": Integer,
                "conso_annee": Integer,
                "cas_annee": Integer,
            },
        )

    def create_substance_patients_sexe_table(self):
        df = self.get_substance_dataframe()

        df_sexe = df.groupby(["code", "sexe"]).agg({"conso": "sum"}).reset_index()

        df_sexe["pourcentage_patients"] = df_sexe.apply(
            lambda x: self.compute_percentage(df_sexe, x, "code", "conso")
            if x.conso >= 10
            else None,
            axis=1,
        )

        df_sexe = df_sexe[["code", "sexe", "pourcentage_patients"]]

        push_to_table(
            df_sexe,
            "substance_patient_sexe_ordei",
            {
                "code": Text,
                "sexe": Text,
                "pourcentage_patients": Float,
            },
        )

    def create_substance_patients_age_table(self):
        df = self.get_substance_dataframe()

        df_age = df.groupby(["code", "age"]).agg({"conso": "sum"}).reset_index()

        df_age["pourcentage_patients"] = df_age.apply(
            lambda x: self.compute_percentage(df_age, x, "code", "conso")
            if x.conso >= 10
            else None,
            axis=1,
        )

        df_age = df_age[["code", "age", "pourcentage_patients"]]

        push_to_table(
            df_age,
            "substance_patient_age_ordei",
            {
                "code": Text,
                "age": Text,
                "pourcentage_patients": Float,
            },
        )

    def create_substance_cas_sexe_table(self):
        df = self.get_substance_dataframe()

        df_sexe = df.groupby(["code", "sexe"]).agg({"cas": "sum"}).reset_index()

        df_sexe["pourcentage_cas"] = df_sexe.apply(
            lambda x: self.compute_percentage(df_sexe, x, "code", "cas")
            if x.cas >= 10
            else None,
            axis=1,
        )

        df_sexe = df_sexe[["code", "sexe", "pourcentage_cas"]]

        push_to_table(
            df_sexe,
            "substance_cas_sexe_ordei",
            {
                "code": Text,
                "sexe": Text,
                "cas": Integer,
                "pourcentage_cas": Float,
            },
        )

    def create_substance_cas_age_table(self):
        df = self.get_substance_dataframe()

        df_age = df.groupby(["code", "age"]).agg({"cas": "sum"}).reset_index()

        df_age["pourcentage_cas"] = df_age.apply(
            lambda x: self.compute_percentage(df_age, x, "code", "cas")
            if x.cas >= 10
            else None,
            axis=1,
        )
        df_age = df_age[["code", "age", "pourcentage_cas"]]

        push_to_table(
            df_age,
            "substance_cas_age_ordei",
            {
                "code": Text,
                "age": Text,
                "cas": Integer,
                "pourcentage_cas": Float,
            },
        )

    def create_notificateurs_table(self):
        df = pd.read_csv(
            paths.P_ORDEI_NOTIF,
            encoding="ISO-8859-1",
            sep=";",
            dtype={"codeSubstance": str},
        )
        df = df.drop("Unnamed: 0", axis=1)

        df = df.rename(
            columns={
                "TYP_NOTIF": "notificateur",
                "SEXE": "sexe",
                "AGE": "age",
                "SUBSTANCE_CODEX_UNIQUE": "substance_active",
                "codeSubstance": "code",
            }
        )

        df_notif = (
            df.groupby(["code", "notificateur"]).agg({"n_decla": "sum"}).reset_index()
        )
        df_notif["pourcentage_notif"] = df_notif.apply(
            lambda x: self.compute_percentage(df_notif, x, "code", "n_decla")
            if x.n_decla >= 10
            else None,
            axis=1,
        )
        df_notif = df_notif[["code", "notificateur", "pourcentage_notif"]]

        push_to_table(
            df_notif,
            "substance_notif_ordei",
            {
                "code": Text,
                "notificateur": Text,
                "pourcentage_notif": Float,
            },
        )

    def create_substance_soclong_table(self):
        df = self.get_substance_soclong_dataframe()
        df["pourcentage_cas"] = (df.n_decla_eff / df.n_cas) * 100
        df.pourcentage_cas = df.apply(
            lambda x: x.pourcentage_cas if x.n_decla_eff >= 10 else None, axis=1
        )
        df = df[["code", "soc_long", "pourcentage_cas"]].sort_values(by=["code"])

        push_to_table(
            df,
            "substance_soclong_ordei",
            {
                "code": Text,
                "soc_long": Text,
                "pourcentage_cas": Float,
            },
        )

    def create_hlt_table(self):
        df_soclong = self.get_substance_soclong_dataframe()

        df = pd.read_csv(
            paths.P_ORDEI_HLT,
            encoding="ISO-8859-1",
            sep=";",
            dtype={"codeSubstance": str},
        )
        df = df.drop("Unnamed: 0", axis=1)

        df = df.rename(
            columns={
                "SEXE": "sexe",
                "AGE": "age",
                "EFFET_HLT": "effet_hlt",
                "SOC_LONG": "soc_long",
                "SUBSTANCE_CODEX_UNIQUE": "substance_active",
                "codeSubstance": "code",
            }
        )

        df = (
            df.groupby(["code", "effet_hlt", "soc_long"])
            .agg({"n_decla_eff_hlt": "sum"})
            .reset_index()
            .sort_values(by="n_decla_eff_hlt", ascending=False)
        )
        df = df.merge(
            df_soclong[["code", "soc_long", "n_decla_eff"]],
            on=["code", "soc_long"],
            how="left",
        )

        # Compute the total number of EI declarations for each substance and each soclong
        df_soclong_total = df.groupby(["code", "soc_long"]).n_decla_eff_hlt.sum().reset_index()
        df_soclong_total = df_soclong_total.rename(columns={"n_decla_eff_hlt": "n_decla_eff_soclong"})
        df = df.merge(df_soclong_total, on=["code", "soc_long"], how="left")

        # Compute percentage of HLT EI belonging to the soclong
        # nb_cas(HLT) / nb_cas(SOC_LONG)
        df["pourcentage_cas"] = (df.n_decla_eff_hlt / df.n_decla_eff_soclong) * 100
        df.pourcentage_cas = df.apply(
            lambda x: x.pourcentage_cas if x.n_decla_eff_hlt >= 10 else None, axis=1
        )

        df = df[["code", "soc_long", "effet_hlt", "pourcentage_cas"]]

        push_to_table(
            df,
            "substance_hlt_ordei",
            {
                "code": Text,
                "soc_long": Text,
                "effet_hlt": Text,
                "pourcentage_cas": Float,
            },
        )

    def create_ordei_tables(self):
        self.create_spe_conso_ordei_table()
        self.create_spe_patients_sexe_table()
        self.create_spe_patients_age_table()
        self.create_substance_ordei_table()
        self.create_substance_patients_sexe_table()
        self.create_substance_patients_age_table()
        self.create_substance_cas_sexe_table()
        self.create_substance_cas_age_table()
        self.create_notificateurs_table()
        self.create_substance_soclong_table()
        self.create_hlt_table()
