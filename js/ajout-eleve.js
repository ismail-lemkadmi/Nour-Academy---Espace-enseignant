import { eleves, groupes } from "./data.js";

const regexNom = /^(?=.*\p{L})[\p{L}\p{M} -]{2,}$/u;
const regexEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const regexTelephone = /^(?:0[67]\d{8}|\+212[67]\d{8})$/;
const regexCode =
    /^(?=.*\p{Lu})(?=.*\d)(?=.*[^\p{L}\p{N}\s]).{8,}$/u;

function normaliserNom(valeur) {
    return valeur.normalize("NFC").trim().replace(/\s+/g, " ");
}

function normaliserTelephone(valeur) {
    return valeur.replace(/\s+/g, "");
}

export function initialiserAjoutEleve(apresAjout) {
    const formulaire = document.querySelector("#form-eleve");
    const messageSucces = document.querySelector("#form-succes");
    const messageErreur = document.querySelector("#form-erreur");
    const champGroupe = formulaire.querySelector("#groupe");

    formulaire.noValidate = true;

    messageSucces.setAttribute("role", "status");
    messageErreur.setAttribute("role", "alert");

    messageSucces.hidden = true;
    messageErreur.hidden = true;

    // Création des options du formulaire
    groupes.forEach(function (groupe) {
        const option = document.createElement("option");
        option.value = groupe.id;
        option.textContent = groupe.nom;
        champGroupe.append(option);
    });

    // Règles et messages de chaque champ
    const definitions = [
        {
            id: "prenom",
            regex: regexNom,
            aide: "2 caractères minimum : lettres, espaces ou tirets.",
            erreur:
                "Prénom invalide : 2 caractères minimum, lettres, espaces ou tirets uniquement.",
            succes: "Prénom valide."
        },
        {
            id: "nom",
            regex: regexNom,
            aide: "2 caractères minimum : lettres, espaces ou tirets.",
            erreur:
                "Nom invalide : 2 caractères minimum, lettres, espaces ou tirets uniquement.",
            succes: "Nom valide."
        },
        {
            id: "groupe",
            regex: null,
            aide: "Choisissez le groupe de l'élève.",
            erreur: "Choisissez un groupe présent dans la liste.",
            succes: "Groupe valide."
        },
        {
            id: "email",
            regex: regexEmail,
            aide: "Exemple : parent@example.test",
            erreur:
                "Email invalide. Exemple attendu : parent@example.test",
            succes: "Email valide."
        },
        {
            id: "telephone",
            regex: regexTelephone,
            aide: "06 / 07 puis 8 chiffres, ou +212 6 / 7 puis 8 chiffres.",
            erreur:
                "Mobile invalide : 06/07 + 8 chiffres ou +212 6/7 + 8 chiffres.",
            succes: "Téléphone valide."
        },
        {
            id: "code",
            regex: regexCode,
            aide:
                "8 caractères minimum, une majuscule, un chiffre et un caractère spécial.",
            erreur:
                "Code invalide : 8 caractères minimum, une majuscule, un chiffre et un caractère spécial.",
            succes: "Code valide."
        }
    ];

    // Affichage de l'état neutre, valide ou invalide
    function afficherEtat(controle, valide, texte) {
        controle.conteneur.classList.toggle(
            "valide",
            valide === true
        );

        controle.conteneur.classList.toggle(
            "erreur",
            valide === false
        );

        controle.champ.classList.toggle(
            "border-line",
            valide === null
        );

        controle.champ.classList.toggle(
            "border-ok",
            valide === true
        );

        controle.champ.classList.toggle(
            "border-alert",
            valide === false
        );

        controle.champ.setAttribute(
            "aria-invalid",
            valide === false ? "true" : "false"
        );

        controle.message.classList.toggle(
            "text-muted",
            valide === null
        );

        controle.message.classList.toggle(
            "text-ok",
            valide === true
        );

        controle.message.classList.toggle(
            "text-alert",
            valide === false
        );

        controle.message.textContent = texte;
    }

    // Liaison des règles aux éléments du formulaire
    function preparerChamps() {
        return definitions.map(function (definition) {
            const champ = formulaire.querySelector(
                "#" + definition.id
            );

            const message = formulaire.querySelector(
                "#" + definition.id + "-msg"
            );

            const controle = {
                ...definition,
                champ: champ,
                message: message,
                conteneur: champ.closest(".champ")
            };

            champ.required = true;
            champ.classList.remove("focus:border-brand");

            champ.classList.add(
                "focus-visible:ring-2",
                "focus-visible:ring-brand/40"
            );

            champ.setAttribute("aria-describedby", message.id);

            afficherEtat(controle, null, definition.aide);
            message.setAttribute("aria-live", "polite");

            return controle;
        });
    }

    let controles = preparerChamps();

    function lireValeur(controle) {
        if (controle.id === "prenom" || controle.id === "nom") {
            return normaliserNom(controle.champ.value);
        }

        if (controle.id === "telephone") {
            return normaliserTelephone(controle.champ.value);
        }

        if (controle.id === "code") {
            return controle.champ.value;
        }

        return controle.champ.value.trim();
    }

    function validerChamp(controle) {
        const valeur = lireValeur(controle);
        let valide;

        if (controle.id === "groupe") {
            valide = groupes.some(function (groupe) {
                return String(groupe.id) === valeur;
            });
        } else {
            valide = controle.regex.test(valeur);
        }

        const texte = valide ? controle.succes : controle.erreur;

        afficherEtat(controle, valide, texte);

        return valide;
    }

    // Validation en temps réel
    formulaire.addEventListener("input", function (event) {
        const controle = controles.find(function (element) {
            return element.champ === event.target;
        });

        if (controle) {
            messageSucces.hidden = true;
            messageErreur.hidden = true;
            validerChamp(controle);
        }
    });

    // Validation et ajout de l'élève
    formulaire.addEventListener("submit", function (event) {
        event.preventDefault();

        messageSucces.hidden = true;
        messageErreur.hidden = true;

        const validites = controles.map(validerChamp);

        const formulaireValide = validites.every(function (valide) {
            return valide;
        });

        if (!formulaireValide) {
            const premierInvalide = controles.find(
                function (controle, index) {
                    return !validites[index];
                }
            );

            messageErreur.textContent =
                "Corrigez les champs en erreur.";

            messageErreur.hidden = false;
            premierInvalide.champ.focus();
            return;
        }

        const champPrenom = formulaire.querySelector("#prenom");
        const champNom = formulaire.querySelector("#nom");
        const champEmail = formulaire.querySelector("#email");
        const champTelephone = formulaire.querySelector("#telephone");

        const prenom = normaliserNom(champPrenom.value);
        const nom = normaliserNom(champNom.value);
        const groupeChoisi = champGroupe.value;

        // Refus du même élève dans le même groupe
        const existeDeja = eleves.some(function (eleve) {
            return (
                String(eleve.groupeId) === groupeChoisi &&
                normaliserNom(eleve.prenom).toLowerCase() ===
                    prenom.toLowerCase() &&
                normaliserNom(eleve.nom).toLowerCase() ===
                    nom.toLowerCase()
            );
        });

        if (existeDeja) {
            const controlePrenom = controles.find(
                function (controle) {
                    return controle.id === "prenom";
                }
            );

            const texte = "Cet élève existe déjà dans ce groupe.";

            afficherEtat(controlePrenom, false, texte);

            messageErreur.textContent = texte;
            messageErreur.hidden = false;
            champPrenom.focus();
            return;
        }

        // Comptage de tous les élèves du groupe
        const effectifGroupe = eleves.reduce(
            function (total, eleve) {
                if (String(eleve.groupeId) === groupeChoisi) {
                    return total + 1;
                }

                return total;
            },
            0
        );

        if (effectifGroupe >= 15) {
            const controleGroupe = controles.find(
                function (controle) {
                    return controle.id === "groupe";
                }
            );

            const texte =
                "Ce groupe est complet : 15 élèves maximum.";

            afficherEtat(controleGroupe, false, texte);

            messageErreur.textContent = texte;
            messageErreur.hidden = false;
            champGroupe.focus();
            return;
        }

        const groupe = groupes.find(function (element) {
            return String(element.id) === groupeChoisi;
        });

        const prochainId = eleves.reduce(
            function (maximum, eleve) {
                return Math.max(maximum, eleve.id);
            },
            0
        ) + 1;

        // Données conservées pour le nouvel élève
        const nouvelEleve = {
            id: prochainId,
            prenom: prenom,
            nom: nom,
            groupeId: groupe.id,
            emailParent: champEmail.value.trim(),
            telephoneParent: normaliserTelephone(
                champTelephone.value
            ),
            absences: 0,
            notes: []
        };

        eleves.push(nouvelEleve);

        formulaire.reset();
        controles = preparerChamps();

        apresAjout(nouvelEleve);

        messageErreur.hidden = true;
        messageSucces.textContent =
            prenom + " " + nom + " a été ajouté avec succès.";

        messageSucces.hidden = false;
    });
}