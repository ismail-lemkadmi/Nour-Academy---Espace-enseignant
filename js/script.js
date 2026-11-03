import { eleves } from "./data.js";

const listeEleves = document.querySelector("#liste-eleves");
const compteurEleves = document.querySelector("#compteur");

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



 function afficherEleves() {
    const lignes = eleves.map(creerLigne);

    listeEleves.replaceChildren();
    listeEleves.append(...lignes);

    const unite = eleves.length === 1 ? " élève" : " élèves";
    compteurEleves  .textContent = eleves.length + unite;
}
afficherEleves();