import { eleves, groupes } from "./data.js";

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

// US1 : création d'une ligne
function creerLigne(eleve) {
    const ligne = document.createElement("li");
    ligne.classList.add(
        "flex", "flex-col", "gap-3", "rounded-2xl",
        "border", "border-line", "bg-card", "p-4",
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

    informations.append(nomEleve, absencesEleve);
    ligne.append(informations, moyenneEleve);

    return ligne;
}

// Affichage des résultats et mise à jour du compteur
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
            groupeChoisi === "" || String(eleve.groupeId) === groupeChoisi;

        const nomComplet = (eleve.prenom + " " + eleve.nom).toLowerCase();
        const correspondALaRecherche = nomComplet.includes(recherche);

        return correspondAuGroupe && correspondALaRecherche;
    });

    afficherEleves(resultats);
}

filtreGroupe.addEventListener("change", filtrerEleves);
champRecherche.addEventListener("input", filtrerEleves);

filtrerEleves();