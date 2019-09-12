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
2. Installer les dépendences node - `npm install`
3. Compiler - `npm run build`
4. Lancer serveur de développement - `npm start`
5. Lancer les tests (pas besoin de lancer le serveur d'abord) - `npm test`

## Exécution des test
npm run test -- -g "nom ou partie du nom d'un test"
npm run test
npm run coverage

## Couplage souhaitable entre la couche Présentation et la couche Domaine

Dans un bon design (selon Larman), on évite que la couche Présentation ait la responsabilité de gérer les évènements système (opérations système). Larman présente dans son livre un exemple avec un JFrame (en Java Swing) à la figure F16.24. On l'adapte ici au contexte d'un service Web dans le framework Express (Node.js):

![Diagramme de séparation des couches avec une opération système envoyée au contrôleur GRASP](http://www.plantuml.com/plantuml/proxy?fmt=svg&src=https://bitbucket.org/yvanross/log210-systeme-gestion-bordereau-node-express-ts/raw/master/docs/figure-f16.24-web.puml?cacheinc=5)

Dans la figure ci-dessus, l'objet `:JeuDeDes` (qui est un objet en dehors de la couche présentation) reçoit l'opération système `demarrerJeu(nom)` selon le principe GRASP Contrôleur. Ce squelette respecte cette séparation.

## Artefacts d'analyse et de conception

### Cas d'utilisation

### Diagramme de cas d’utilisation

![Diagramme de cas d'utilisation](http://www.plantuml.com/plantuml/proxy?fmt=svg&src=https://bitbucket.org/yvanross/log210-systeme-gestion-bordereau-node-express-ts/raw/master/docs/dcu.puml?cacheinc=5)

### Modèle du domaine

![Diagramme de classe du Modèle du domaine](http://www.plantuml.com/plantuml/proxy?fmt=svg&src=https://bitbucket.org/yvanross/log210-systeme-gestion-bordereau-node-express-ts/raw/master/docs/mdd.puml?cacheinc=5)

