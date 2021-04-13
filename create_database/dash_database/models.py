import os

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    String,
    Float,
    ForeignKeyConstraint,
)
from sqlalchemy.dialects.mysql import LONGTEXT, VARCHAR
from sqlalchemy.ext.declarative import declarative_base

# load environment variables
HOSTNAME = "localhost"
DBNAME = "dash_database"
UNAME = "root"
MYSQL_PWD = os.environ.get("MYSQL_PWD")


def connect_db():
    # create db create_engine
    return create_engine(
        "mysql+pymysql://{user}:{pw}@{host}/{db}".format(
            host=HOSTNAME, db=DBNAME, user=UNAME, pw=MYSQL_PWD
        ),
        echo=False,
    )


Base = declarative_base()


class Specialite(Base):
    __tablename__ = "specialite"

    cis = Column(String(120), primary_key=True)
    name = Column(LONGTEXT, nullable=True)
    forme_pharma = Column(LONGTEXT, nullable=True)
    voie_admin = Column(LONGTEXT, nullable=True)
    atc = Column(String(120), nullable=True)
    nom_atc = Column(LONGTEXT, nullable=True)
    type_amm = Column(LONGTEXT, nullable=True)
    etat_commercialisation = Column(LONGTEXT, nullable=True)


class Substance(Base):
    __tablename__ = "substance"

    code = Column(String(255), primary_key=True)
    name = Column(String(255), nullable=False)


class SpecialiteSubstance(Base):
    __tablename__ = "specialite_substance"
    __table_args__ = (
        ForeignKeyConstraint(["cis"], ["specialite.cis"]),
        ForeignKeyConstraint(["code_substance"], ["substance.code"]),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(String(120), nullable=False)
    code_substance = Column(Integer, nullable=False)
    elem_pharma = Column(LONGTEXT, nullable=False)
    dosage = Column(LONGTEXT, nullable=True)
    ref_dosage = Column(LONGTEXT, nullable=True)


class Notice(Base):
    __tablename__ = "notice"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cis = Column(String(120), primary_key=True)
    specialite = Column(VARCHAR(255), nullable=False)
    notice = Column(LONGTEXT, nullable=True)


class Presentation(Base):
    __tablename__ = "presentation"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cip13 = Column(String(13), primary_key=True)
    nom = Column(LONGTEXT, nullable=False)
    cis = Column(String(8), nullable=False)
    taux_remboursement = Column(String(13), nullable=True)


class SpecialiteOrdei(Base):
    __tablename__ = "specialite_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cis = Column(String(120), primary_key=True)
    conso = Column(Integer, nullable=True)


class SpecialitePatientSexeOrdei(Base):
    __tablename__ = "specialite_patient_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(String(120), nullable=False)
    sexe = Column(String(120), nullable=False)
    conso = Column(Integer, nullable=False)
    pourcentage_patients = Column(Float, nullable=False)


class SpecialitePatientAgeOrdei(Base):
    __tablename__ = "specialite_patient_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(String(120), nullable=False)
    age = Column(String(120), nullable=False)
    conso = Column(Integer, nullable=False)
    pourcentage_patients = Column(Float, nullable=False)


class SubstanceOrdei(Base):
    __tablename__ = "substance_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    conso = Column(Integer, nullable=False)
    cas = Column(Integer, nullable=True)
    taux_cas = Column(Float, nullable=True)
    annee = Column(Integer, nullable=False)
    conso_annee = Column(Integer, nullable=True)
    cas_annee = Column(Integer, nullable=True)


class SubstancePatientSexeOrdei(Base):
    __tablename__ = "substance_patient_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    sexe = Column(String(120), nullable=False)
    pourcentage_patients = Column(Float, nullable=True)


class SubstancePatientAgeOrdei(Base):
    __tablename__ = "substance_patient_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    age = Column(String(120), nullable=False)
    pourcentage_patients = Column(Float, nullable=True)


class SubstanceCasSexeOrdei(Base):
    __tablename__ = "substance_cas_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    sexe = Column(String(120), nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


class SubstanceCasAgeOrdei(Base):
    __tablename__ = "substance_cas_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    age = Column(String(120), nullable=False)
    pourcentage_cas = Column(Float, nullable=False)


class SubstanceNotifOrdei(Base):
    __tablename__ = "substance_notif_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    notificateur = Column(LONGTEXT, nullable=False)
    pourcentage_notif = Column(Float, nullable=True)


class SubstanceSoclongOrdei(Base):
    __tablename__ = "substance_soclong_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    soc_long = Column(LONGTEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


class SubstanceHltOrdei(Base):
    __tablename__ = "substance_soclong_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(String(120), nullable=False)
    soc_long = Column(LONGTEXT, nullable=False)
    effet_hlt = Column(LONGTEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


engine = connect_db()
Specialite.__table__.create(bind=engine, checkfirst=True)
Substance.__table__.create(bind=engine, checkfirst=True)
SpecialiteSubstance.__table__.create(bind=engine, checkfirst=True)
Notice.__table__.create(bind=engine, checkfirst=True)
Presentation.__table__.create(bind=engine, checkfirst=True)
