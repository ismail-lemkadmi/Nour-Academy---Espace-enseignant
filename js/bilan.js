import { eleves, groupes } from "./data.js";

const titreBilan = document.querySelector("#titre-bilan");
const moyenneBilan = document.querySelector("#bilan-moyenne");
const absencesBilan = document.querySelector("#bilan-absences");
const alertesBilan = document.querySelector("#bilan-alertes");
const listeParents = document.querySelector("#liste-parents");
const messageAucuneAlerte = document.querySelector("#aucune-alerte");

function creerContact(eleve) {
    const contact = document.createElement("li");

    contact.classList.add(
        "min-w-0", "break-words", "rounded-xl", "bg-card",
        "px-3", "py-2", "ring-1", "ring-line"
    );

    contact.textContent =
        eleve.prenom + " " + eleve.nom + " — " + eleve.telephoneParent;

    return contact;
}

export function actualiserBilan(groupeChoisi, calculerMoyenne) {
    // Tous les élèves de la sélection de groupe
    const membres = eleves.filter(function (eleve) {
        return (
            groupeChoisi === "" ||
            String(eleve.groupeId) === String(groupeChoisi)
        );
    });

    if (groupeChoisi === "") {
        titreBilan.textContent = "Bilan de tous les groupes";
    } else {
        const groupe = groupes.find(function (element) {
            return String(element.id) === String(groupeChoisi);
        });

        titreBilan.textContent = groupe
            ? "Bilan de " + groupe.nom
            : "Bilan du groupe";
    }

    // Moyenne et total des absences avec reduce
    const statistiques = membres.reduce(function (total, eleve) {
        total.absences += eleve.absences;

        const moyenne = calculerMoyenne(eleve.notes);

        if (moyenne !== null) {
            total.sommeMoyennes += moyenne;
            total.nombreElevesAvecNotes += 1;
        }

        return total;
    }, {
        absences: 0,
        sommeMoyennes: 0,
        nombreElevesAvecNotes: 0
    });

    if (statistiques.nombreElevesAvecNotes === 0) {
        moyenneBilan.textContent = "—";
    } else {
        const moyenneGroupe =
            statistiques.sommeMoyennes /
            statistiques.nombreElevesAvecNotes;

        moyenneBilan.textContent = moyenneGroupe.toLocaleString(
            "fr-FR",
            { maximumFractionDigits: 1 }
        );
    }

    absencesBilan.textContent = statistiques.absences;

    // Élèves ayant au moins 3 absences
    const elevesEnAlerte = membres.filter(function (eleve) {
        return eleve.absences >= 3;
    });

    alertesBilan.textContent = elevesEnAlerte.length;

    // Liste des parents avec filter puis map
    const contacts = elevesEnAlerte.map(creerContact);

    listeParents.replaceChildren();
    listeParents.append(...contacts);

    // Message confirmé avec every
    const aucuneAlerte = membres.every(function (eleve) {
        return eleve.absences < 3;
    });

    messageAucuneAlerte.hidden = !aucuneAlerte;
}