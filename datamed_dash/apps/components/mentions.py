from app import app
from dash.development.base_component import Component
from dash_html_components import Div, Img, A

from .commons import SingleSection


def FirstSection() -> Component:
    return Div(
        [
            SingleSection(
                "Éditeur",
                [
                    Div(
                        "Agence Nationale de Sécurité du Médicament et des produits de santé",
                        className="normal-text-bold",
                    ),
                    Div(
                        "143-147 Boulevard Anatole France",
                    ),
                    Div(
                        "93285 Saint-Denis Cedex",
                    ),
                    Div(
                        "Tél : +33(0)1 55 87 30 00",
                    ),
                    Div(
                        "Fax : +33(0)1 55 87 30 12",
                    ),
                    Div(
                        "Directrice de la publication : Christelle Ratignier-Carbonneil",
                    ),
                    Div(
                        "Pour contacter les webmasters : webmaster@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Hébergeur",
                [
                    A(
                        "ITS Integra",
                        href="https://www.itsintegra.com/",
                        className="ExternalLink",
                    ),
                    Div(
                        "42 rue de Bellevue",
                    ),
                    Div(
                        "92100 Boulogne-Billancourt",
                    ),
                    Div(
                        "Tél : +33(0)1 78 89 35 00",
                    ),
                    Div(
                        "Mail : contact@itsgroup.com",
                    ),
                ],
            ),
            SingleSection(
                "Conception et Développement",
                [
                    A(
                        "Entrepreneurs d'Intérêt Général",
                        href="https://entrepreneur-interet-general.etalab.gouv.fr/",
                        className="ExternalLink",
                    ),
                    Div(
                        "Line Rahal : line.rahal@ansm.sante.fr",
                    ),
                    Div("Joëlle Chong : joelle.chong@ansm.sante.fr", className="mb-3"),
                    A(
                        "Studio 67",
                        href="",
                        className="ExternalLink",
                    ),
                    Div(
                        "Jordan Munoz : jordan@studio67.fr",
                    ),
                ],
            ),
            SingleSection(
                "Utilisation des données et Copyright",
                [
                    Div(
                        "Les données et les informations présentes sur le site Internet "
                        "www.data.ansm.sante.fr sont mises à disposition du public par l'Agence "
                        "Nationale de Sécurité du Médicament et des produits de santé.",
                    ),
                    Div(
                        "Ces informations sont protégées par la Convention de Berne sur la Protection des "
                        "œuvres littéraires et artistiques, par d'autres conventions internationales et par les "
                        "législations nationales sur le droit d'auteur et les droits dérivés. "
                        "L'information et les données contenues sur le site Internet peuvent faire "
                        "l'objet de revues, ou être reproduites ou traduites à des fins de recherche ou "
                        "d'étude personnelle, mais ne peuvent être ni vendues ni utilisées à des fins commerciales.",
                        className="mb-3",
                    ),
                    Div(
                        "Toute utilisation des données ou des informations provenant du site data.ansm doit "
                        "obligatoirement mentionner l'ANSM en tant que source de l'information.",
                        className="normal-text-bold mb-3",
                    ),
                    Div(
                        "La reproduction, la traduction, ou toute utilisation de données ou d’informations "
                        "provenant du site Internet de l’ANSM à des fins autres que personnelles, éducatives "
                        "ou non commerciales, est subordonnée à l'obtention préalable d'une autorisation écrite "
                        "formelle de la directrice générale de l’ANSM.",
                    ),
                ],
            ),
            SingleSection(
                "Établissement de liens",
                [
                    Div(
                        "Tout site public ou privé est autorisé à établir, sans autorisation préalable, "
                        "un lien vers la page d’accueil ou directement vers les informations diffusées "
                        "par le site www.data.ansm.sante.fr.",
                    ),
                    Div(
                        "Mais en aucun cas les pages du site www.data.ansm.sante.fr ne doivent se retrouver "
                        "imbriquées à l'intérieur des pages d'un autre site. Tout doit être fait pour indiquer "
                        "clairement à l’internaute qu’il se trouve sur le site www.data.ansm.sante.fr et lui "
                        "permettre d’y naviguer librement.",
                        className="mb-3",
                    ),
                    Div(
                        "Pour sa part, l’ANSM établit des liens uniquement sur les sites publics et n'est en rien "
                        "responsable de liens qui sont faits vers son site. Cependant, si vous créez un lien vers "
                        "l’ANSM, nous apprécierions d’en être informés par un simple mail à : webmaster@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Avertissement général",
                [
                    Div(
                        "La mention de firmes ou de produits commerciaux n'implique pas que ces "
                        "firmes ou produits commerciaux sont agréés ou recommandés par l'ANSM.",
                    ),
                ],
            ),
            SingleSection(
                "Protection des données à caractère personnel",
                [
                    Div(
                        "Le site data.ansm ne contient aucune donnée à caractère personnel. Les données publiées "
                        "sont issues des bases de données de l'ANSM et ont fait l'objet d'une anonymisation afin "
                        "de garantir la protection de la vie privée des patients. Pour cela, seules des données "
                        "agrégées sont mises en ligne. Lorsqu'un effet indésirable concerne moins de 10 patients, "
                        "le nombre de personnes concernées n'est pas affiché, afin d'éviter toute  réidentification "
                        "possible des patients.",
                    ),
                ],
            ),
        ]
    )


def ProtectionSection() -> Component:
    return Div(
        [
            Div(
                "Protection des données à caractère personnel et politique de confidentialité",
                className="h2 mb-3",
                style={"color": "var(--color-blue)"},
            ),
            SingleSection(
                "Qui est responsable de vos données ?",
                [
                    Div(
                        "Les données à caractère personnel recueillies sur ce site internet sont traitées par "
                        "l'ANSM, en sa qualité de responsable de traitement au sens du Règlement 2016/679 du 27 "
                        "Avril 2016 (règlement général sur la protection des données) et de la Loi n°78-17 "
                        "relative à l’informatique, aux fichiers et aux libertés modifiées.",
                    ),
                ],
            ),
            SingleSection(
                "Pourquoi vos données sont-elles collectées ?",
                [
                    Div(
                        "La collecte de données à caractère personnel à partir du site Internet est réalisée dans "
                        "le cadre des demandes d’inscription à notre Newsletter ou à la veille personnalisée, des "
                        "réponses aux enquêtes en ligne ou des inscriptions à des événements. Elle est également "
                        "réalisée dans le cadre des télé-enregistrements effectués en ligne, afin de répondre à des "
                        "obligations légales.",
                    ),
                ],
            ),
            SingleSection(
                "Comment vos données sont-elles traitées ?",
                [
                    Div(
                        "L’ANSM accorde une importance particulière à la protection de vos données à caractère "
                        "personnel. C’est pourquoi, outre les mesures de sécurité et de confidentialité mises en "
                        "œuvre, l’accès et le traitement de vos données est réservé aux seuls agents habilités par "
                        "l’ANSM, ainsi, le cas échéant, qu’aux prestataires chargés de l’hébergement et de la "
                        "maintenance du site Internet qui en assurent la protection. Nous veillons strictement "
                        "à ce que les données recueillies ne soient jamais détournées ou utilisées à d’autres fins.",
                    ),
                ],
            ),
            SingleSection(
                "Quels sont vos droits sur vos données ?",
                [
                    Div(
                        "- Vous pouvez accéder et obtenir copie des données vous concernant.",
                    ),
                    Div(
                        "- Vous disposez pendant toute la durée du traitement d’un droit d’accès, de rectification, "
                        "de portabilité et d’effacement de vos données ou d’une limitation de leur traitement.",
                    ),
                    Div(
                        "- Vous disposez également d’un droit d’opposition au traitement des données vous concernant "
                        "et du droit de retirer votre consentement, conformément à la législation en vigueur. Ces "
                        "droits ne s’appliquent pas lorsque le traitement est justifié par une obligation légale.",
                    ),
                ],
            ),
            SingleSection(
                "Exercer ses droits",
                [
                    Div(
                        "Vous pouvez exercer ces droits à tout moment auprès de notre Délégué à la protection des "
                        "données, par demande écrite, en y joignant un justificatif d’identité comportant "
                        "votre signature à l’une des adresses suivantes :",
                        className="mb-3",
                    ),
                    Div("ANSM, DAJR", className="normal-text-bold"),
                    Div(
                        "Délégué à la protection des données",
                        className="normal-text-bold",
                    ),
                    Div(
                        "143-147 Boulevard Anatole France",
                    ),
                    Div(
                        "93285 Saint-Denis Cedex",
                    ),
                    Div(
                        "Mail : dpo@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Réclamation (plainte) auprès de la CNIL",
                [
                    Div(
                        "Si vous estimez, après nous avoir contactés, que vos droits sur vos données ne sont pas "
                        "respectés, vous pouvez adresser une réclamation à la CNIL via leur portail ",
                        className="d-inline",
                    ),
                    A(
                        "Plaintes en ligne",
                        href="https://www.cnil.fr/fr/plaintes",
                        className="ExternalLink d-inline",
                    ),
                ],
            ),
        ]
    )


def FormulaireDemande() -> Component:
    return Div(
        [
            Div(
                "Protection des données à caractère personnel et politique de confidentialité - "
                "Formulaire de demande d’information géré par l’accueil des usagers",
                className="h2 mb-3",
                style={"color": "var(--color-blue)"},
            ),
            SingleSection(
                "",
                [
                    Div(
                        "Les internautes ont la possibilité de faire une demande d’information à l’ANSM via le "
                        "formulaire de contact géré par l’accueil des usagers.",
                        className="mb-3",
                    ),
                    Div(
                        "L’accueil des usagers est une cellule mise en place à l’ANSM qui centralise toutes "
                        "les demandes des usagers concernant les sujets cités dans le formulaire. Elle trace "
                        "l’information et répond aux demandes si elle a l’information. Dans le cas contraire, "
                        "elle transmet la demande à une direction experte de l’ANSM qui lui répond dans un délai "
                        "défini. L’Accueil des usagers trace la réponse et la transmet à l’usager.",
                    ),
                ],
            ),
            SingleSection(
                "Objet du traitement de données",
                [
                    Div("Finalités", className="normal-text-bold"),
                    Div(
                        "Le traitement a pour objet la gestion des demandes des usagers. Il permet à l’ANSM :",
                    ),
                    Div(
                        "- de répondre aux demandes des usagers",
                    ),
                    Div(
                        "- d’assurer la traçabilité des demandes",
                    ),
                    Div(
                        "- d’assurer un suivi statistique du service de l’accueil des usagers",
                        className="mb-3",
                    ),
                    Div("Base légale", className="normal-text-bold"),
                    Div(
                        "Article 6 (1) e du règlement général sur la protection des données - RGPD",
                    ),
                    Div(
                        "Ce traitement de données relève de l'exercice de l'autorité publique dont est investie "
                        "l’ANSM en application du règlement général sur la protection des données et de la loi "
                        "Informatique et Libertés modifiée.",
                    ),
                ],
            ),
            SingleSection(
                "Données traitées",
                [
                    Div(
                        "Données traitées dans le cadre de l’accueil des usagers",
                        className="normal-text-bold",
                    ),
                    Div(
                        "- nom et prénom de la personne",
                    ),
                    Div(
                        "En fonction du moyen de communication choisi :",
                    ),
                    Div(
                        "- adresse de courrier électronique (e-mail)",
                    ),
                    Div(
                        "- numéro de téléphone",
                    ),
                    Div(
                        "- adresse postale",
                    ),
                    Div(
                        "- type de profil de l’usager (patient, médecin, journaliste, industriel, autre public, etc.)",
                    ),
                    Div(
                        "- médicament ou substance concernant la demande de l’usager",
                    ),
                    Div(
                        "- thématique concernant la demande de l’usager (exemples : "
                        "disponibilité des produits de santé, déclaration des effets indésirables)",
                        className="mb-3",
                    ),
                    Div("Source des données", className="normal-text-bold"),
                    Div(
                        "Les données sont issues du formulaire renseigné par la personne souhaitant recevoir une "
                        "réponse à sa demande. Le nom et le prénom de la personne, son adresse de courrier "
                        "électronique, son numéro de téléphone ou son adresse postale sont nécessaires pour "
                        "pouvoir répondre à la personne qui a fait une demande d’information.",
                        className="mb-3",
                    ),
                    Div(
                        "Caractère obligatoire du recueil des données",
                        className="normal-text-bold",
                    ),
                    Div(
                        "Le recueil du nom et du prénom, de l’adresse de courrier électronique ou du téléphone ou "
                        "de l'adresse postale est obligatoire pour permettre de répondre à la demande.",
                        className="mb-3",
                    ),
                    Div("Prise de décision automatisée", className="normal-text-bold"),
                    Div(
                        "Le traitement ne prévoit pas de prise de décision automatisée.",
                    ),
                ],
            ),
            SingleSection(
                "Personnes concernées",
                [
                    Div(
                        "Le traitement de données concerne uniquement les personnes qui "
                        "souhaitent recevoir une réponse à une demande d’information.",
                    ),
                ],
            ),
            SingleSection(
                "Destinataires des données",
                [
                    Div("Catégories de destinataires", className="normal-text-bold"),
                    Div(
                        "Sont destinataires des données :",
                    ),
                    Div(
                        "- la cellule Accueil des usagers de l’ANSM",
                    ),
                    Div(
                        "- l’hébergeur du site Internet et l’équipe en charge de la maintenance du site Internet",
                        className="mb-3",
                    ),
                    Div("Transferts des données hors UE", className="normal-text-bold"),
                    Div(
                        "Aucun transfert de données hors de l'Union européenne n'est réalisé.",
                    ),
                ],
            ),
            SingleSection(
                "Durée de conservation des données",
                [
                    Div(
                        "L’ANSM conserve le nom et le prénom, l’adresse de courrier électronique, "
                        "le numéro de téléphone ou l’adresse postale  de la personne pendant deux ans maximum.",
                    ),
                ],
            ),
            SingleSection(
                "Sécurité",
                [
                    Div(
                        "Les mesures de sécurité sont mises en œuvre conformément à la politique de "
                        "sécurité des systèmes d’information (PSSI) de l’ANSM, issue de la PSSI de l’État.",
                    ),
                ],
            ),
            SingleSection(
                "Qui est responsable de vos données ?",
                [
                    Div(
                        "Les données à caractère personnel recueillies sur ce site internet sont traitées par "
                        "l'ANSM, en sa qualité de responsable de traitement au sens du Règlement 2016/679 du 27 "
                        "Avril 2016 (règlement général sur la protection des données) et de la Loi n°78-17 "
                        "relative à l’informatique, aux fichiers et aux libertés modifiées.",
                    ),
                ],
            ),
            SingleSection(
                "Pourquoi vos données sont-elles collectées ?",
                [
                    Div(
                        "La collecte de données à caractère personnel à partir du site Internet est réalisée dans "
                        "le cadre des demandes d’inscription à notre Newsletter ou à la veille personnalisée, des "
                        "réponses aux enquêtes en ligne ou des inscriptions à des événements. Elle est également "
                        "réalisée dans le cadre des télé-enregistrements effectués en ligne, afin de répondre à des "
                        "obligations légales.",
                    ),
                ],
            ),
            SingleSection(
                "Comment vos données sont-elles traitées ?",
                [
                    Div(
                        "L’ANSM accorde une importance particulière à la protection de vos données à caractère "
                        "personnel. C’est pourquoi, outre les mesures de sécurité et de confidentialité mises en "
                        "œuvre, l’accès et le traitement de vos données est réservé aux seuls agents habilités par "
                        "l’ANSM, ainsi, le cas échéant, qu’aux prestataires chargés de l’hébergement et de la "
                        "maintenance du site Internet qui en assurent la protection. Nous veillons strictement "
                        "à ce que les données recueillies ne soient jamais détournées ou utilisées à d’autres fins.",
                    ),
                ],
            ),
            SingleSection(
                "Quels sont vos droits sur vos données ?",
                [
                    Div(
                        "- Vous pouvez accéder et obtenir copie des données vous concernant.",
                    ),
                    Div(
                        "- Vous disposez pendant toute la durée du traitement d’un droit d’accès, de rectification, "
                        "de portabilité et d’effacement de vos données ou d’une limitation de leur traitement.",
                    ),
                    Div(
                        "- Vous disposez également d’un droit d’opposition au traitement des données vous concernant "
                        "et du droit de retirer votre consentement, conformément à la législation en vigueur. Ces "
                        "droits ne s’appliquent pas lorsque le traitement est justifié par une obligation légale.",
                    ),
                ],
            ),
            SingleSection(
                "Exercer ses droits",
                [
                    Div(
                        "Vous pouvez exercer ces droits à tout moment auprès de notre Délégué à la protection des "
                        "données, par demande écrite, en y joignant un justificatif d’identité comportant "
                        "votre signature à l’une des adresses suivantes :",
                        className="mb-3",
                    ),
                    Div("ANSM, DAJR", className="normal-text-bold"),
                    Div(
                        "Délégué à la protection des données",
                        className="normal-text-bold",
                    ),
                    Div(
                        "143-147 Boulevard Anatole France",
                    ),
                    Div(
                        "93285 Saint-Denis Cedex",
                    ),
                    Div(
                        "Mail : dpo@ansm.sante.fr",
                    ),
                ],
            ),
            SingleSection(
                "Réclamation (plainte) auprès de la CNIL",
                [
                    Div(
                        "Si vous estimez, après nous avoir contactés, que vos droits sur vos données ne sont pas "
                        "respectés, vous pouvez adresser une réclamation à la CNIL via leur portail ",
                        className="d-inline",
                    ),
                    A(
                        "Plaintes en ligne",
                        href="https://www.cnil.fr/fr/plaintes",
                        className="ExternalLink d-inline",
                    ),
                ],
            ),
            SingleSection(
                "Cookies",
                [
                    Div(
                        "Vous pouvez à tout moment modifier la gestion des cookies en "
                        "cliquant sur ce lien ou sur le lien disponible en bas de chaque page.",
                    ),
                ],
            ),
        ]
    )


def AllSections() -> Component:
    return Div(
        [FirstSection(), ProtectionSection(), FormulaireDemande()], className="mentions"
    )


def MentionsLegales() -> Component:
    return Div(
        [
            Div(className="header-space"),
            Div(
                [
                    Div(
                        "Mentions Légales",
                        className="fp-section fp-section-1 d-flex justify-content-center h1 mt-5",
                    ),
                    Div(
                        Img(
                            src=app.get_asset_url("frontpage_img_1.svg"),
                        ),
                        className="fp-section fp-section-1 d-flex justify-content-center",
                    ),
                ],
            ),
            AllSections(),
        ],
        className="container-fluid p-0",
    )
