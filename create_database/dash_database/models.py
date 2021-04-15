import os

from sqlalchemy import (
    create_engine,
    Column,
    Integer,
    Float,
    ForeignKeyConstraint,
)
from sqlalchemy.dialects.mysql import TEXT, LONGTEXT
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

    cis = Column(TEXT, primary_key=True)
    nom = Column(TEXT, nullable=False)
    forme_pharma = Column(TEXT, nullable=False)
    voie_admin = Column(TEXT, nullable=True)
    atc = Column(TEXT, nullable=True)
    nom_atc = Column(TEXT, nullable=True)
    statut_amm = Column(TEXT, nullable=False)
    type_amm = Column(TEXT, nullable=False)
    etat_commercialisation = Column(TEXT, nullable=False)


class Substance(Base):
    __tablename__ = "substance"

    code = Column(TEXT, primary_key=True)
    name = Column(TEXT, nullable=False)


class SpecialiteSubstance(Base):
    __tablename__ = "specialite_substance"
    __table_args__ = (
        ForeignKeyConstraint(["cis"], ["specialite.cis"]),
        ForeignKeyConstraint(["code_substance"], ["substance.code"]),
    )

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(TEXT, nullable=False)
    code_substance = Column(Integer, nullable=False)
    elem_pharma = Column(TEXT, nullable=False)
    dosage = Column(TEXT, nullable=True)
    ref_dosage = Column(TEXT, nullable=True)


class Description(Base):
    __tablename__ = "description"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cis = Column(TEXT, primary_key=True)
    description = Column(LONGTEXT, nullable=True)


class Presentation(Base):
    __tablename__ = "presentation"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cip13 = Column(TEXT, primary_key=True)
    nom = Column(TEXT, nullable=False)
    cis = Column(TEXT, nullable=False)
    taux_remboursement = Column(TEXT, nullable=True)


class SpecialiteOrdei(Base):
    __tablename__ = "specialite_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    cis = Column(TEXT, primary_key=True)
    exposition = Column(Integer, nullable=False)


class SpecialitePatientSexeOrdei(Base):
    __tablename__ = "specialite_patient_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(TEXT, nullable=False)
    sexe = Column(TEXT, nullable=False)
    conso = Column(Integer, nullable=False)
    pourcentage_patients = Column(Float, nullable=False)


class SpecialitePatientAgeOrdei(Base):
    __tablename__ = "specialite_patient_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["cis"], ["specialite.cis"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    cis = Column(TEXT, nullable=False)
    age = Column(TEXT, nullable=False)
    conso = Column(Integer, nullable=False)
    pourcentage_patients = Column(Float, nullable=False)


class SubstanceOrdei(Base):
    __tablename__ = "substance_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    exposition = Column(Integer, nullable=False)
    cas = Column(Integer, nullable=True)
    taux_cas = Column(Float, nullable=True)
    annee = Column(Integer, nullable=False)
    conso_annee = Column(Integer, nullable=True)
    cas_annee = Column(Integer, nullable=True)


class SubstancePatientSexeOrdei(Base):
    __tablename__ = "substance_patient_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    sexe = Column(TEXT, nullable=False)
    pourcentage_patients = Column(Float, nullable=True)


class SubstancePatientAgeOrdei(Base):
    __tablename__ = "substance_patient_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    age = Column(TEXT, nullable=False)
    pourcentage_patients = Column(Float, nullable=True)


class SubstanceCasSexeOrdei(Base):
    __tablename__ = "substance_cas_sexe_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    sexe = Column(TEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


class SubstanceCasAgeOrdei(Base):
    __tablename__ = "substance_cas_age_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    age = Column(TEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=False)


class SubstanceNotifOrdei(Base):
    __tablename__ = "substance_notif_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    notificateur = Column(TEXT, nullable=False)
    pourcentage_notif = Column(Float, nullable=True)


class SubstanceSoclongOrdei(Base):
    __tablename__ = "substance_soclong_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    soc_long = Column(TEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


class SubstanceHltOrdei(Base):
    __tablename__ = "substance_hlt_ordei"
    __table_args__ = (ForeignKeyConstraint(["code"], ["substance.code"]),)

    id = Column(Integer, primary_key=True, autoincrement=True)
    code = Column(TEXT, nullable=False)
    soc_long = Column(TEXT, nullable=False)
    effet_hlt = Column(TEXT, nullable=False)
    pourcentage_cas = Column(Float, nullable=True)


engine = connect_db()
Specialite.__table__.create(bind=engine, checkfirst=True)
Substance.__table__.create(bind=engine, checkfirst=True)
SpecialiteSubstance.__table__.create(bind=engine, checkfirst=True)
Presentation.__table__.create(bind=engine, checkfirst=True)
Description.__table__.create(bind=engine, checkfirst=True)
SpecialiteOrdei.__table__.create(bind=engine, checkfirst=True)
SpecialitePatientSexeOrdei.__table__.create(bind=engine, checkfirst=True)
SpecialitePatientAgeOrdei.__table__.create(bind=engine, checkfirst=True)
SubstancePatientSexeOrdei.__table__.create(bind=engine, checkfirst=True)
SubstancePatientAgeOrdei.__table__.create(bind=engine, checkfirst=True)
SubstanceCasSexeOrdei.__table__.create(bind=engine, checkfirst=True)
SubstanceCasAgeOrdei.__table__.create(bind=engine, checkfirst=True)
SubstanceNotifOrdei.__table__.create(bind=engine, checkfirst=True)
SubstanceSoclongOrdei.__table__.create(bind=engine, checkfirst=True)
SubstanceHltOrdei.__table__.create(bind=engine, checkfirst=True)
