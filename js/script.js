import { eleves, groupes } from "./data.js";
import { initialiserAjoutEleve } from "./ajout-eleve.js";
import { actualiserBilan } from "./bilan.js";


const listeEleves = document.querySelector("#liste-eleves");
const compteurEleves = document.querySelector("#compteur");
const filtreGroupe = document.querySelector("#filtre-groupe");
const champRecherche = document.querySelector("#recherche");
const messageAucunResultat = document.querySelector("#aucun-resultat");

// US2 : création des options du menu
groupes.forEach(function (groupe) {
    const option = document.createElement("option");
    option.value = groupe.id;
    option.textContent = groupe.nom;
    filtreGroupe.append(option);
});

// US1 : calcul de la moyenne
function additionner(somme, note) {
    return somme + note;
}

function calculerMoyenne(notes) {
    if (notes.length === 0) {
        return null;
    }

    const sommeNotes = notes.reduce(additionner, 0);
    return sommeNotes / notes.length;
}

// US1 et US3 : création d'une ligne et de ses commandes
function creerLigne(eleve) {
    const ligne = document.createElement("li");
    ligne.dataset.id = eleve.id;
    ligne.classList.add(
        "flex", "flex-col", "gap-3", "rounded-2xl", "border", "p-4"
    );

    const entete = document.createElement("div");
    entete.classList.add(
        "flex", "flex-col", "gap-3",
        "sm:flex-row", "sm:items-center", "sm:justify-between"
    );

    const informations = document.createElement("div");
    informations.classList.add("min-w-0");

    const nomEleve = document.createElement("h2");
    nomEleve.classList.add("break-words", "font-semibold");
    nomEleve.textContent = eleve.prenom + " " + eleve.nom;

    const absencesEleve = document.createElement("p");
    absencesEleve.classList.add("mt-1", "text-sm", "text-muted");
    absencesEleve.textContent = "Absences : " + eleve.absences;

    informations.append(nomEleve, absencesEleve);

    if (eleve.absences >= 3) {
        ligne.classList.add("alerte", "border-alert", "bg-alert-soft");

        const badge = document.createElement("span");
        badge.classList.add(
            "mt-2", "inline-block", "rounded-full",
            "bg-alert", "px-3", "py-1", "text-xs", "text-white"
        );
        badge.textContent = "Prévenir les parents";
        informations.append(badge);
    } else {
        ligne.classList.add("border-line", "bg-card");
    }

    const moyenne = calculerMoyenne(eleve.notes);
    const moyenneEleve = document.createElement("p");
    moyenneEleve.classList.add(
        "shrink-0", "font-serif", "text-xl", "text-brand"
    );

    if (moyenne === null) {
        moyenneEleve.textContent = "Moyenne : —";
    } else {
        const moyenneFormatee = moyenne.toLocaleString("fr-FR", {
            maximumFractionDigits: 1
        });

        moyenneEleve.textContent =
            "Moyenne : " + moyenneFormatee + " / 20";
    }

    entete.append(informations, moyenneEleve);

    const actions = document.createElement("div");
    actions.classList.add(
        "flex", "flex-wrap", "items-center", "gap-2"
    );

    const boutonAbsent = document.createElement("button");
    boutonAbsent.type = "button";
    boutonAbsent.dataset.action = "absence";
    boutonAbsent.classList.add(
        "h-11", "rounded-full", "border", "border-line",
        "bg-card", "px-4", "text-sm", "font-medium"
    );
    boutonAbsent.textContent = "Absent";

    const champNote = document.createElement("input");
    champNote.type = "number";
    champNote.id = "note-" + eleve.id;
    champNote.dataset.role = "note";
    champNote.min = "0";
    champNote.max = "20";
    champNote.step = "any";
    champNote.inputMode = "decimal";
    champNote.placeholder = "Note";
    champNote.setAttribute(
        "aria-describedby",
        "note-message-" + eleve.id
    );
    champNote.setAttribute("aria-invalid", "false");
    champNote.classList.add(
        "h-11", "w-24", "rounded-full",
        "border", "border-line", "bg-card", "px-3", "text-sm"
    );

    const labelNote = document.createElement("label");
    labelNote.htmlFor = champNote.id;
    labelNote.classList.add("sr-only");
    labelNote.textContent =
        "Note de " + eleve.prenom + " " + eleve.nom;

    const boutonNote = document.createElement("button");
    boutonNote.type = "button";
    boutonNote.dataset.action = "note";
    boutonNote.classList.add(
        "h-11", "rounded-full", "bg-brand",
        "px-4", "text-sm", "font-medium", "text-white"
    );
    boutonNote.textContent = "Ajouter la note";

    const messageNote = document.createElement("p");
    messageNote.id = "note-message-" + eleve.id;
    messageNote.dataset.role = "message-note";
    messageNote.setAttribute("role", "alert");
    messageNote.classList.add("text-sm", "text-alert");
    messageNote.hidden = true;

    actions.append(
        boutonAbsent,
        labelNote,
        champNote,
        boutonNote
    );

    ligne.append(entete, actions, messageNote);

    return ligne;
}

// US1 et US2 : affichage et nombre de résultats
function afficherEleves(elevesAAfficher = eleves) {
    const lignes = elevesAAfficher.map(creerLigne);

    listeEleves.replaceChildren();
    listeEleves.append(...lignes);

    const unite = elevesAAfficher.length === 1 ? " élève" : " élèves";
    compteurEleves.textContent = elevesAAfficher.length + unite;
    messageAucunResultat.hidden = elevesAAfficher.length > 0;
}

// US2 : combinaison du groupe et de la recherche
function filtrerEleves() {
    const groupeChoisi = filtreGroupe.value;
    const recherche = champRecherche.value.trim().toLowerCase();

    const resultats = eleves.filter(function (eleve) {
        const correspondAuGroupe =
            groupeChoisi === "" ||
            String(eleve.groupeId) === groupeChoisi;

        const nomComplet =
            (eleve.prenom + " " + eleve.nom).toLowerCase();

        const correspondALaRecherche =
            nomComplet.includes(recherche);

        return correspondAuGroupe && correspondALaRecherche;
    });

    afficherEleves(resultats);
    actualiserBilan(groupeChoisi, calculerMoyenne);
}

// US3 : remplacement de la seule ligne concernée
function actualiserLigne(ligne, eleve, action) {
    const nouvelleLigne = creerLigne(eleve);
    ligne.replaceWith(nouvelleLigne);

    const bouton = nouvelleLigne.querySelector(
        'button[data-action="' + action + '"]'
    );

    bouton.focus();

    actualiserBilan(filtreGroupe.value, calculerMoyenne);
}

// US3 : un seul écouteur pour les boutons des élèves
listeEleves.addEventListener("click", function (event) {
    if (!(event.target instanceof Element)) {
        return;
    }

    const bouton = event.target.closest("button[data-action]");

    if (!bouton) {
        return;
    }

    const ligne = bouton.closest("li[data-id]");

    if (!ligne) {
        return;
    }

    const eleve = eleves.find(function (candidat) {
        return String(candidat.id) === ligne.dataset.id;
    });

    if (!eleve) {
        return;
    }

    if (bouton.dataset.action === "absence") {
        eleve.absences += 1;
        actualiserLigne(ligne, eleve, "absence");
        return;
    }

    if (bouton.dataset.action === "note") {
        const champNote = ligne.querySelector(
            'input[data-role="note"]'
        );

        const messageNote = ligne.querySelector(
            '[data-role="message-note"]'
        );

        const note = champNote.valueAsNumber;

        if (
            champNote.value.trim() === "" ||
            !Number.isFinite(note) ||
            note < 0 ||
            note > 20
        ) {
            champNote.setAttribute("aria-invalid", "true");
            champNote.classList.remove("border-line");
            champNote.classList.add("border-alert");

            messageNote.textContent =
                "La note doit être un nombre entre 0 et 20.";

            messageNote.hidden = false;
            champNote.focus();
            return;
        }

        eleve.notes.push(note);
        actualiserLigne(ligne, eleve, "note");
    }
});

filtreGroupe.addEventListener("change", filtrerEleves);
champRecherche.addEventListener("input", filtrerEleves);

filtrerEleves();

initialiserAjoutEleve(function (nouvelEleve) {
    filtreGroupe.value = String(nouvelEleve.groupeId);
    champRecherche.value = "";
    filtrerEleves();
});