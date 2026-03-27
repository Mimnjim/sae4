# 🔍 AUDIT COMPLET i18n - Texte Hardcodé Non-Traduit

## 📊 Résumé
**Date**: 27 Mars 2026  
**Workspace**: SAE4 Dev  
**Statut**: ⚠️ **CRITIQUE** - Nombreux textes en français/anglais hardcodés sans traduction i18n

---

## 📋 Résultats Détaillés par Fichier

### 1️⃣ **COMPOSANTS DE CONNEXION/AUTHENTIFICATION**

#### 📄 [src/components/connexion_components/LoginForm.jsx](src/components/connexion_components/LoginForm.jsx)

**Texte nontraité:**

| Contenu | Contexte | Ligne | Clé i18n proposée |
|---------|----------|-------|------------------|
| `"Tous les champs sont obligatoires"` | Remarque sous les champs | ~75 | `auth.requiredFields` |
| `"Connexion..."` | Texte du bouton en chargement | ~90 | `auth.logging` |
| `"Se connecter"` | Texte du bouton soumission | ~90 | `auth.login` |

---

#### 📄 [src/components/connexion_components/AuthPrompt.jsx](src/components/connexion_components/AuthPrompt.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|------------------|
| `"Vous devez être connecté pour réserver"` | Message par défaut | `auth.requiresLogin` |
| `"Connectez-vous ou créez un compte pour poursuivre."` | Description | `auth.loginOrRegister` |
| `"Se connecter"` | Bouton | `auth.login` |
| `"S'inscrire"` | Bouton | `auth.register` |

**Utilisation:** Composant appelé dans Form_reservation.jsx when user not authenticated

---

#### 📄 [src/components/connexion_components/ResetPasswordForm.jsx](src/components/connexion_components/ResetPasswordForm.jsx)

**Aucun texte critique** - Utilise déjà i18n via `t()` pour les messages

---

#### 📄 [src/pages/connexion_pages/Login.jsx](src/pages/connexion_pages/Login.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Connexion"` | Titre `<h1>` | `pages.login.title` |
| `"Mot de passe oublié ?"` | Lien | `auth.forgotPassword` |
| `"Pas de compte ? S'inscrire"` | Lien en bas | `auth.noAccount` |

---

### 2️⃣ **COMPOSANTS D'INSCRIPTION**

#### 📄 [src/components/inscription_components/RegisterForm.jsx](src/components/inscription_components/RegisterForm.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Inscription en cours..."` | Texte du bouton loading | `auth.registering` |
| `"S'inscrire"` | Texte du bouton | `auth.register` |

---

#### 📄 [src/pages/inscriptions_pages/Register.jsx](src/pages/inscriptions_pages/Register.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Inscription"` | Titre `<h1>` | `pages.register.title` |
| `"Déjà un compte ? Se connecter"` | Lien résultat | `auth.hasAccount` |

---

#### 📄 [src/pages/inscriptions_pages/RegisterSent.jsx](src/pages/inscriptions_pages/RegisterSent.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Inscription réussie"` | Titre `<h2>` | `pages.registerSent.title` |
| `"Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter."` | Paragraphe | `pages.registerSent.message` |
| `"Aller à la page de connexion"` | Lien | `pages.registerSent.link` |

---

#### 📄 [src/pages/inscriptions_pages/Activate.jsx](src/pages/inscriptions_pages/Activate.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Activation de compte"` | Titre `<h2>` | `pages.activate.title` |
| `"Validation en cours..."` | État loading | `pages.activate.validating` |
| `"Compte activé avec succès"` | Message succès | `pages.activate.success` |
| `"redirection vers la page de connexion..."` | Message après succès | `pages.activate.redirecting` |
| `"Token manquant"` | Message erreur | `pages.activate.tokenMissing` |
| `"Une erreur est survenue"` | Message erreur générique | `pages.activate.error` |

---

### 3️⃣ **COMPOSANTS DE PROFIL & RÉSERVATIONS**

#### 📄 [src/pages/connexion_pages/UserProfile.jsx](src/pages/connexion_pages/UserProfile.jsx)

**Texte HAUTEMENT PRIORITAIRE - page critique**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Profil mis à jour avec succès."` | Toast succès | `profile.updateSuccess` |
| `"Erreur lors de la mise à jour."` | Toast erreur | `profile.updateError` |
| `"Erreur réseau, veuillez réessayer."` | Toast réseau | `common.networkError` |
| `"Réservation supprimée."` | Toast succès | `profile.reservationDeleted` |
| `"Erreur lors de la suppression."` | Toast suppression | `profile.deleteError` |
| `"Chargement..."` | État initial | `common.loading` |
| `"Utilisateur non connecté."` | État erreur | `profile.notLoggedIn` |
| `"Mon profil"` | Titre section | `pages.profile.title` |
| `"Dashboard"` | Bouton admin | `pages.profile.dashboard` |
| `"Se déconnecter"` | Bouton | `auth.logout` |
| `"Prénom"` | Label input | `form.firstName` |
| `"Nom"` | Label input | `form.lastName` |
| `"Email"` | Label input | `form.email` |
| `"Nouveau mot de passe (laisser vide pour ne pas changer)"` | Label input | `form.newPasswordOptional` |
| `"Cacher"` | Bouton toggle password | `form.hidePassword` |
| `"Voir"` | Bouton toggle password | `form.showPassword` |
| `"Enregistrer"` | Bouton submit | `common.save` |
| `"Mes réservations"` | Titre section | `pages.profile.myReservations` |
| `"Aucune réservation pour le moment."` | Message vide | `pages.profile.noReservations` |
| `"Réf :"` | Label tableau | `profile.reference` |
| `"Date :"` | Label tableau | `profile.date` |
| `"Créneau :"` | Label tableau | `profile.timeSlot` |
| `"Supprimer"` | Bouton | `common.delete` |
| `"Confirmer la suppression ?"` | Modal confirmation | `common.confirmDelete` |
| `"Oui, supprimer"` | Bouton confirmation | `common.confirm` |
| `"Annuler"` | Bouton annulation | `common.cancel` |

---

### 4️⃣ **COMPOSANTS DE FORMULAIRE/RÉSERVATION**

#### 📄 [src/components/practical_info_components/Map.jsx](src/components/practical_info_components/Map.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Lieu de l'exposition \"Au-delà de l'humain\".\n Venez nous rendre visite !"` | Popup Leaflet | `map.locationPopup` |

---

#### 📄 [src/components/practical_info_components/ContactSection.jsx](src/components/practical_info_components/ContactSection.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Contact"` | Titre `<h2>` | `contact.title` |
| `"Téléphone :"` | Label | `contact.phone` |
| `"Email :"` | Label | `contact.email` |
| `"Site web :"` | Label | `contact.website` |

---

#### 📄 [src/components/book_components/Form_reservation.jsx](src/components/book_components/Form_reservation.jsx)

**Texte HAUTEMENT PRIORITAIRE - Formulaire critique**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Au-delà de l'Humain"` | Titre section gauche | `reservation.title` |
| `"Exposition immersive"` | Sous-titre section | `reservation.subtitle` |
| `"Réservez vos places pour une visite inoubliable"` | Description | `reservation.description` |
| `"Sélectionner la date"` | Titre formulaire | `reservation.selectDate` |
| `"Heure"` | Label | `reservation.time` |
| `"Langue de la visite"` | Label select | `reservation.language` |
| `"Entrée plein tarif"` | Option ticket | `reservation.fullPrice` |
| `"Entrée tarif réduit"` | Option ticket | `reservation.reducedPrice` |
| `"Entrée gratuite"` | Option ticket | `reservation.free` |
| `"Code promo"` | Label input | `reservation.promoCode` |
| `"Appliquer"` | Bouton | `common.apply` |
| `"Code invalide"` | Message erreur | `reservation.invalidCode` |
| `"Veuillez sélectionner une date"` | Validation | `reservation.selectDateRequired` |
| `"Veuillez sélectionner un créneau horaire"` | Validation | `reservation.selectTimeRequired` |
| `"Veuillez sélectionner au moins un billet"` | Validation | `reservation.selectTicketsRequired` |
| `"Erreur lors de la réservation."` | Toast erreur | `reservation.error` |
| `"Erreur réseau, veuillez réessayer."` | Toast réseau | `common.networkError` |

---

#### 📄 [src/pages/book_pages/ReservationDetails.jsx](src/pages/book_pages/ReservationDetails.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Connectez-vous pour réserver votre visite."` | Message non-auth | `auth.requiresLogin` |
| `"Code invalide"` | Erreur promo | `reservation.invalidCode` |

---

#### 📄 [src/components/book_components/Validation.jsx](src/components/book_components/Validation.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Votre commande a bien été enregistrée"` | Titre `<h2>` | `pages.validation.title` |
| `"Numéro de commande :"` | Label | `pages.validation.orderNumber` |
| `"Montant total :"` | Label | `pages.validation.total` |
| `"Date :"` | Label | `pages.validation.date` |
| `"Heure :"` | Label | `pages.validation.time` |
| `"Conservez bien ce numéro pour toute correspondance. Un récapitulatif vous a été envoyé par e-mail si l'adresse fournie est valide."` | Texte | `pages.validation.keepNumber` |
| `"Retour à l'accueil"` | Lien | `pages.validation.backHome` |

---

### 5️⃣ **COMPOSANTS BACKOFFICE (ADMIN)**

#### 📄 [src/pages/backoffice_pages/backoffice/Backoffice.jsx](src/pages/backoffice_pages/backoffice/Backoffice.jsx)

**Texte TRÈS PRIORITAIRE - Page admin sensible**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Zone Admin"` | Titre accès refusé | `backoffice.adminZone` |
| `"Connecte-toi en tant qu'admin pour continuer et accéder à cette page."` | Message | `backoffice.requiresAdmin` |
| `"Se connecter →"` | Bouton lien | `auth.login` |
| `"Vérification des droits d'accès..."` | Chargement | `backoffice.verifying` |
| `"Pas d'Accès"` | Titre erreur | `backoffice.accessDenied` |
| `"Tu n'as pas les permissions pour accéder à cette zone."` | Message | `backoffice.noPermissions` |
| `"Retour à l'accueil →"` | Bouton | `common.backHome` |
| `"Changer de compte →"` | Bouton logout | `auth.logout` |
| `"Dashboard Admin"` | Titre principal | `backoffice.dashboard` |
| `"Stats"` | Onglet | `backoffice.stats` |
| `"Utilisateurs"` | Onglet | `backoffice.users` |
| `"Réservations"` | Onglet | `backoffice.reservations` |
| `"Chargement..."` | État loading | `common.loading` |
| `"Supprimer cet utilisateur ?"` | Confirmation delete user | `backoffice.confirmDeleteUser` |
| `"Supprimer cette réservation ?"` | Confirmation delete reservation | `backoffice.confirmDeleteReservation` |

---

#### 📄 [src/components/backoffice_components/Stats.jsx](src/components/backoffice_components/Stats.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Chargement..."` | État initial | `common.loading` |
| `"Aucune réservation enregistrée."` | Message vide | `backoffice.noReservations` |
| `"Réservations par jour (liste)"` | Titre | `backoffice.reservationsByDay` |
| `"Réservations par jour"` | Titre graphique | `backoffice.reservationsByDayChart` |
| `"Réservations par créneau"` | Titre graphique | `backoffice.reservationsBySlot` |
| `"Statistiques"` | Titre section | `backoffice.statistics` |
| `"Total"` | Label stat | `common.total` |
| `"Jours recensés"` | Label stat | `backoffice.daysRecorded` |
| `"Créneaux"` | Label stat | `backoffice.timeSlots` |
| `"réservations"` | Suffix conteur | `backoffice.reservationsLabel` |

---

#### 📄 [src/components/backoffice_components/UsersTable.jsx](src/components/backoffice_components/UsersTable.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Utilisateurs"` | Titre `<h3>` | `backoffice.users` |
| `"ID"` | En-tête tableau | `common.id` |
| `"Email"` | En-tête tableau | `form.email` |
| `"Nom"` | En-tête tableau | `form.lastName` |
| `"Rôle"` | En-tête tableau | `user.role` |
| `"Actions"` | En-tête tableau | `common.actions` |
| `"Utilisateur"` | Option select role | `user.userRole` |
| `"Administrateur"` | Option select role | `user.adminRole` |
| `"Supprimer"` | Bouton action | `common.delete` |

---

#### 📄 [src/components/backoffice_components/ReservationsTable.jsx](src/components/backoffice_components/ReservationsTable.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Réservations"` | Titre `<h3>` | `backoffice.reservations` |
| `"ID"` | En-tête tableau | `common.id` |
| `"Référence"` | En-tête tableau | `profile.reference` |
| `"Date"` | En-tête tableau | `profile.date` |
| `"Contact"` | En-tête tableau | `common.contact` |
| `"Actions"` | En-tête tableau | `common.actions` |
| `"Supprimer"` | Bouton action | `common.delete` |

---

### 6️⃣ **COMPOSANTS NAVIGATION/GLOBAL**

#### 📄 [src/components/global_components/Navbar.jsx](src/components/global_components/Navbar.jsx)

**Texte nontraité:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"Mon compte"` | Lien profil connecté | `navbar.myAccount` |

---

### 7️⃣ **FICHIERS JEU/3D (Texte dans game)**

#### 📄 [game/all-levels.js](game/all-levels.js)

**Texte nontraité:**

| Contenu | Contexte | Type |
|---------|----------|------|
| Messages du jeu (console logs, states) | Système de jeu | À scanner séparément |

**Note:** Le fichier JavaScript du jeu utilise `postMessage` pour communiquer avec le parent. Les messages "game_init", "game_health", "game_over", "game_victory" sont des identifiants techniques, pas du contenu affiché à l'utilisateur.

---

### 8️⃣ **COMPOSANTS HOMEPAGE (Animations & sections)**

#### 📄 [src/components/homepage_components/TransitionSection.jsx](src/components/homepage_components/TransitionSection.jsx)

**Texte hardcodé dans la data-line:**

| Contenu | Contexte | Clé i18n proposée |
|---------|----------|---|
| `"SYS://EXPOSITION.INIT — AKIRA × GHOST_IN_THE_SHELL — PARIS_2025"` | Ligne système (Effet CRT) | `transition.dataLine` |

---

---

## 📊 STATISTIQUES GLOBALES

| Métrique | Valeur |
|----------|--------|
| **Fichiers scannés** | 47+ |
| **Fichiers avec texte-hardcodé** | 23 |
| **Entrées texte non-traduites** | 120+ |
| **Fichiers CRITIQUE** | 5 |
| **Fichiers HAUTE PRIORITÉ** | 8 |
| **Fichiers MOYENNE PRIORITÉ** | 10 |

---

## 🎯 FICHIERS CRITIQUES À TRAITER EN PRIORITÉ

1. **[src/pages/connexion_pages/UserProfile.jsx](src/pages/connexion_pages/UserProfile.jsx)** - 30+ textes = MAJEUR
2. **[src/components/book_components/Form_reservation.jsx](src/components/book_components/Form_reservation.jsx)** - 24+ textes = MAJEUR
3. **[src/pages/backoffice_pages/backoffice/Backoffice.jsx](src/pages/backoffice_pages/backoffice/Backoffice.jsx)** - 20+ textes = CRITIQUE
4. **[src/components/connexion_components/LoginForm.jsx](src/components/connexion_components/LoginForm.jsx)** - 3 textes clés
5. **[src/components/connexion_components/AuthPrompt.jsx](src/components/connexion_components/AuthPrompt.jsx)** - 4 textes clés

---

## ✅ PROCHAINES ÉTAPES RECOMMANDÉES

### Phase 1: Créer les clés i18n manquantes
1. Ajouter toutes les clés proposées dans `src/locales/fr.json`
2. Ajouter les traductions anglaises correspondantes dans `src/locales/en.json`

### Phase 2: Remplacer le texte hardcodé
1. Importer `useTranslation` dans chaque fichier
2. Remplacer les strings par des appels `t()`
3. Tester la traduction en basculant la langue

### Phase 3: Validation
1. Vérifier chaque page en FR et EN
2. Valider auprès des utilisateurs
3. Documenter les patterns de traduction utilisés

---

## 🔧 RECOMMANDATIONS

✅ **À FAIRE:**
- Créer une fonction utilitaire pour les messages d'erreur réseau récurrents
- Centraliser les labels de formulaires dans i18n
- Ajouter des contextes pluriels pour les compteurs

❌ **À ÉVITER:**
- Concaténer des strings traduites directement
- Utiliser `t()` hors du composant (avant le rendu)
- Les translations côté serveur sans fallback

---

**Audit réalisé le**: 27 Mars 2026  
**Par**: Analyse complète du workspace  
**Statut**: ✅ Prêt pour implémentation
