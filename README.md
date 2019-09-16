# Système de gestion des bordereau utilisé dans le cadre du cours de LOG210 et développé avec Node, Express et TypeScript

Ce système doit être utilisé pour obtenir l'information de base à la réalisation de votre laboratoire en LOG210. Il possède les qualités suivantes:

 - il est simple pour les débutants en LOG210
   - il n'y a pas de framework pour le front-end ni pour la persistance, mais ça n'empêche pas d'ajouter ces dimensions.
   - il est seulement [REST niveau 1](https://restfulapi.net/richardson-maturity-model/#level-one), mais ça n'empêche pas de modifier l'API pour qu'il soit [REST niveau 3](https://restfulapi.net/richardson-maturity-model/#level-three). 
 - il est orienté objet (avec TypeScript)
 - il contient des tests pour l'API (avec Mocha)
 - il fait une séparation entre les couches présentation et domaine, selon la méthodologie de conception du cours LOG210 (Larman)

## Voulez-vous utiliser ce serveur?

1. (Créer une fork et) Cloner
2. Installer les dépendences node - ```npm install```
3. Compiler - ```npm run build```
4. Lancer serveur de développement - ```npm start```
5. Lancer les tests (pas besoin de lancer le serveur d'abord) - ```npm test```

## Exécution des test
npm run test -- -g "nom ou partie du nom d'un test"
npm run test
npm run coverage

## définition de l'API

```/api/v1/latency?value=1.1```
#### Ajuster la latence pour modifier la performance du serveur SGB.  
**value:float**, valeur de la latence en secondes.



```/api/v1//notes/clear```
#### Effacter toutes les notes dans le serveur SGB.  Pour vous faciliter la tâche et ne pas avoir à redémarrer le serveur à chaque fois qu'on veut nettoyer les données.  Peut aussi être très utile pour la réalisation des tests automatisées.



```/api/v1/login?email=teacher%2B3%40gmail.com&password=1234```
#### Authentification de l'usager et récupération du token d'authentification
**email:string**, courriel de l'usager.  A vérifier mais vous pouvez surement utiliser teacher3@gmail.com dans nécessairement encoder la valeur numérique et le @ commercial.
password: string, non vérifier. 



```/api/v1/student/note?course=1&type=devoir&type_id=3&note=75.23```
#### Ajout d'une note dans le dossier de l'étudiant
**course:integer**, id du cours
**type:string**,  devoir ou Questionnaire
**type_id:integer**, id du devoir ou du questionnaire
**note:float**, node de l'étudiant à enregistrer



```/api/v1//student/notes```
#### Récupération de toutes les notes d'un étudiant
**token:string** à mettre dans le header pour pouvoir identifier l'enseignant et récupérer les cours.



```/api/v1//courses```
#### Récupération de tous les cours possible
**token:string** à mettre dans le header pour pouvoir identifier l'enseignant et récupérer les cours.



```/api/v1//course/:course/notes```
#### Récupération de toutes les notes d'un étudiant
**token:string** à mettre dans le header pour pouvoir identifier l'édutiant et récupérer ses notes.



```/api/v1//students```
####   Récupération de tous les étudiants possible
**token:string* à mettre dans le header pour pouvoir identifier l'enseignant et récupérer les cours.
