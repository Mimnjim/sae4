# PROJET SAE 4. EXPOSITION VIRTUELLE BD

Lien vers le site : https://audeladelhumain.fr

## Sujet : AKIRA X GHOST IN THE SHELL "AU-DELA DE L'HUMAIN

Réinstallation du projet en REACT, pour une mise en production.


# 1. Prérequis

Installer :

Node.js

Ensuite, vérifiez via le terminal si vous avez bien installer Node :

node -v
npm -v


# 2. Installation du projet

Récuperez l'archive du projet, puis ouvez le sur un éditeur de code, utilisez le terminal intégré ou via un terminal du système d'exploitation en vous plaçant à la racine du projet.



Vous devez ensuite installer les différentes dépendances :

npm install

Cette commande installe tout ce qui est nécessaire (React, librairies, etc.)


# 3. Lancer le projet en local
npm run dev

Cette commande permet d'ouvrir le projet en mode développeur et en local, vous devriez pouvoir le voir sur une adresse similaire à :

http://localhost:3000



# 4. Créer la version production

Faites dans le terminal : 

npm run dev

Un dossier sera créé avec une version optimisée du site prête à être déployée.

# 5. Mise en production

Envoyez tout son contenu du dossier nouvellement créé sur votre hébergeur via FTP ou interface web.

Pensez à utiliser la certification SSL afin d'obtenir le HTTPS sur votre site.


# 6. React Router et htaccess

Ce site comporte plusieurs page, il est donc important de créer un .htaccess à la racine permettant de faire en sorte que les routes en REACT fonctionnent

Exemple .htaccess (Apache)
Options -MultiViews
RewriteEngine On
RewriteCond %{REQUEST_FILENAME} !-f
RewriteRule ^ index.html [QSA,L]

# 7. Hébergeur

Concernant l’hébergeur, nous utilisons un hébergement O2Switch, l’offre « cloud ». Cette offre permet de disposer d’un serveur avec 12 vCPU et 48 Go de RAM, ce qui est amplement suffisant pour le projet que nous avons. De plus, cet hébergement doit également supporter une API : la performance est donc importante.

Par ailleurs, un jeu en 3D y est hébergé, avec l’envoi de différentes informations ; il est donc essentiel que celui-ci soit performant.

Nous estimons à une vingtaine le nombre de personnes connectées simultanément.
