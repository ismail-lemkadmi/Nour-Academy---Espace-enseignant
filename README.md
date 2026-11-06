# Nour Academy — Espace enseignant

Application réalisée dans le cadre du Brief 5 à YouCode Nador. Elle permet de faire l’appel, ajouter des notes et suivre les élèves de trois groupes.

## Liens

- [Dépôt GitHub](https://github.com/ismail-lemkadmi/Nour-Academy---Espace-enseignant)
- [Board Jira](https://ismaillemkadmi.atlassian.net/jira/software/projects/NAEE/boards/68)
- [Adresse GitHub Pages prévue après publication](https://ismail-lemkadmi.github.io/Nour-Academy---Espace-enseignant/)

## Contexte

Les enseignants de Nour Academy souhaitent remplacer leur suivi papier par une interface permettant de gérer les absences et les notes.

Le projet utilise des données fictives et fonctionne dans le navigateur.

## Fonctionnalités

| User story | Fonctionnalité |
| --- | --- |
| US1 | Affichage dynamique des élèves, de leurs absences, de leur moyenne et du compteur. |
| US2 | Recherche par prénom ou nom et filtrage par groupe. |
| US3 | Ajout d’une absence ou d’une note avec mise à jour de la ligne concernée. |
| US4 | Ajout d’un élève avec validation du formulaire. |
| US5 | Calcul du bilan et affichage des parents à appeler. |

À partir de trois absences, la ligne affiche une alerte et le badge « Prévenir les parents ».

Une note doit être comprise entre 0 et 20. Une moyenne de zéro est affichée ; un élève sans note affiche `—`.

## Technologies

- HTML pour la structure.
- Tailwind CSS v4 pour les couleurs, les espacements et le responsive.
- JavaScript natif pour les données, les événements et le DOM.
- Vite pour le développement et la construction du site.
- Git et GitHub pour le suivi du code.
- Jira pour l’organisation des user stories.

Tailwind reprend la charte de la maquette fournie. Les états des éléments sont modifiés avec `classList`.

## Installation

Prérequis : Node.js 24 et npm.

```bash
git clone https://github.com/ismail-lemkadmi/Nour-Academy---Espace-enseignant.git
cd Nour-Academy---Espace-enseignant
npm ci
npx vite
```

Ouvrir l’adresse affichée dans le terminal.

Pour construire la version de production puis la consulter :

```bash
npx vite build
npx vite preview
```

Les fichiers construits se trouvent dans `dist/`.

## Organisation du code

```text
index.html
js/
  data.js
  script.js
  ajout-eleve.js
  bilan.js
package.json
package-lock.json
vite.config.mjs
.gitignore
README.md
```

- `data.js` contient les trois groupes et les quinze élèves de départ.
- `script.js` gère les lignes, la recherche, les absences et les notes.
- `ajout-eleve.js` gère la validation et l’ajout des élèves.
- `bilan.js` calcule et affiche les statistiques.

## Méthodes de tableau utilisées

| Besoin | Méthode |
| --- | --- |
| Créer les lignes des élèves | `map(creerLigne)` |
| Combiner groupe et recherche | `filter` |
| Retrouver l’élève après un clic | `find` |
| Détecter un doublon dans un groupe | `some` |
| Vérifier tous les résultats de validation | `every` |
| Additionner les notes et les absences | `reduce` |
| Compter les élèves d’un groupe | `reduce` |
| Sélectionner les élèves en alerte | `filter` |
| Créer les contacts des parents | `filter` puis `map` |
| Confirmer l’absence d’alertes | `every` |
| Ajouter les options de groupe au DOM | `forEach` |

Les éléments sont créés avec `createElement`, remplis avec `textContent` et insérés avec `append`.

## Gestion des événements

Un seul écouteur sur le conteneur des élèves gère les boutons « Absent » et « Ajouter la note ».

`closest` retrouve le bouton et la ligne. L’attribut `data-id` permet ensuite de retrouver l’élève avec `find`.

Cette délégation fonctionne après une recherche, un changement de groupe ou l’ajout d’un élève.

## Validation du formulaire

Les champs sont contrôlés pendant la saisie. Chaque champ possède un message associé et une bordure indiquant son état.

| Champ | Règle | Exemple valide | Exemple invalide |
| --- | --- | --- | --- |
| Prénom et nom | Deux caractères minimum, lettres, espaces ou tirets | `Élodie`, `Jean-Luc` | `A`, `Ali3`, `--` |
| Groupe | Groupe présent dans les données | Un groupe proposé | Choix vide |
| Email | Adresse avec un nom, un domaine et une extension | `parent@example.test` | `parent@` |
| Téléphone | Mobile marocain national ou international | `0612345678`, `+212612345678` | `0512345678` |
| Code provisoire | Huit caractères minimum, une majuscule, un chiffre et un caractère spécial | `Nour2026!` | `nour2026!`, `N1!` |

Les exemples sont fictifs.

Les noms sont normalisés et les espaces superflus sont retirés. Les espaces du téléphone sont retirés en conservant sa valeur sous forme de chaîne.

L’ajout est refusé si un champ est invalide, si le même élève existe dans le même groupe ou si le groupe compte déjà quinze élèves. Le focus va au premier champ en erreur.

Après un ajout réussi, le formulaire est vidé et le groupe du nouvel élève est affiché.

## Calcul du bilan

Le bilan utilise tous les élèves du groupe sélectionné. Le choix « Tous les groupes » utilise l’ensemble des élèves.

La recherche modifie les lignes affichées et leur compteur. Le bilan conserve le périmètre de la sélection de groupe.

La moyenne du groupe est calculée à partir des moyennes individuelles non arrondies. Chaque élève ayant des notes possède le même poids. Une moyenne égale à zéro est prise en compte.

Le bilan est recalculé après chaque absence, note ou ajout.

## Vérifications

| Test | Résultat attendu |
| --- | --- |
| Chargement initial | 15 élèves, moyenne générale de 12,5, 19 absences et 3 alertes |
| Choix d’un groupe | 5 élèves dans chaque groupe de départ |
| Recherche `SARA` | Sara Alaoui est affichée |
| Recherche Sara dans le groupe 2 | Aucun résultat |
| Note vide, négative ou supérieure à 20 | Message d’erreur et ajout refusé |
| Note égale à 0 ou 20 | Ajout accepté |
| Passage de deux à trois absences | Apparition de l’alerte et du contact du parent |
| Modification après filtrage | Mise à jour du bon élève |
| Ajout d’un doublon dans le même groupe | Refus |
| Groupe passant de 14 à 15 élèves | Ajout accepté |
| Tentative d’ajout dans un groupe de 15 élèves | Refus |
| Groupe sans alerte | Message « Aucun élève en alerte » |

Les fonctionnalités ont été vérifiées en navigateur dans un environnement de test. Les revues d’interface ont couvert les largeurs 360, 768 et 1440 px.

## Difficulté rencontrée

Pendant le calcul de la moyenne, les lignes de calcul avaient été placées dans le bloc `if`, après `return null`.

Le calcul était inaccessible dans ce bloc et les élèves ayant des notes ne recevaient aucun résultat.

La correction ferme le `if` après `return null`, puis calcule la somme et la moyenne dans le reste de la fonction.

## Données

Les identités et coordonnées utilisées pour les essais sont fictives.

Les changements sont conservés dans la mémoire de la page. Un rechargement rétablit les données initiales de `data.js`.

Le code provisoire sert au contrôle du formulaire et est effacé après l’ajout. L’objet élève conserve les informations de suivi, le groupe et les coordonnées du parent.

## Finalisation avant remise

- Terminer la compilation locale de Tailwind avec Vite et retirer le CDN.
- Ajouter au dépôt les captures mobile et desktop.
- Publier la version de production sur GitHub Pages.
- Vérifier le lien public et le fonctionnement du site publié.


