# 📋 PLAN D'IMPLÉMENTATION i18n - Guide Détaillé

## 🎯 Objectif
Traduire tous les 120+ textes hardcodés identifiés dans l'audit i18n

---

## 📍 PHASE 1 : AJOUTER LES CLÉS AUX FICHIERS DE TRADUCTION

### Étape 1.1 : Ajouter les clés à `src/locales/fr.json`

Copier-coller l'entièreté du contenu du fichier `i18n_MISSING_KEYS_REFERENCE.json` dans la section appropriée de `src/locales/fr.json` (ou fusionner les objets).

**Exemple structure:**
```json
{
  "gateway": { ... },
  "hero": { ... },
  "experiences": { ... },
  "footer": { ... },
  "navbar": { ... },
  "auth": {
    "login": "Se connecter",
    "logout": "Se déconnecter",
    ...
  },
  "form": { ... },
  "pages": { ... },
  ...
}
```

### Étape 1.2 : Ajouter les traductions anglaises à `src/locales/en.json`

Traduire chaque clé du fichier de référence en anglais:

```json
{
  "auth": {
    "login": "Log in",
    "logout": "Log out",
    "register": "Sign up",
    "registering": "Signing up...",
    "logging": "Logging in...",
    ...
  },
  ...
}
```

---

## 🔧 PHASE 2 : REMPLACER LE TEXTE HARDCODÉ

### Fichiers par ordre de PRIORITÉ CRITIQUE

#### 🔴 PRIORITÉ 1 : FICHIERS CRITIQUES (À traiter IMMÉDIATEMENT)

---

### 📄 **File 1 : src/components/connexion_components/LoginForm.jsx**

**Localisation du code à modifier:**
```jsx
// AVANT (Ligne ~75)
<p className="form-note">Tous les champs sont obligatoires</p>

// APRÈS
<p className="form-note">{t('form.required')}</p>
```

```jsx
// AVANT (Ligne ~90)
<ButtonValidation
  text={isLoading ? 'Connexion...' : 'Se connecter'}
/>

// APRÈS
<ButtonValidation
  text={isLoading ? t('auth.logging') : t('auth.login')}
/>
```

---

### 📄 **File 2 : src/components/connexion_components/AuthPrompt.jsx**

```jsx
// AVANT (Ligne ~11)
const DEFAULT_MESSAGE = 'Vous devez être connecté pour réserver';
  ...
<p className="auth-prompt__desc">
  Connectez-vous ou créez un compte pour poursuivre.
</p>
<button onClick={() => navigate('/login')}>Se connecter</button>
<button onClick={() => navigate('/register')}>S'inscrire</button>

// APRÈS
const DEFAULT_MESSAGE = t('auth.requiresLogin');
  ...
<p className="auth-prompt__desc">
  {t('auth.loginOrRegister')}
</p>
<button onClick={() => navigate('/login')}>{t('auth.login')}</button>
<button onClick={() => navigate('/register')}>{t('auth.register')}</button>
```

**Important:** Ajouter les imports en haut du fichier:
```jsx
import { useTranslation } from 'react-i18next';

export default function AuthPrompt({ message }) {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 3 : src/pages/connexion_pages/Login.jsx**

```jsx
// AVANT
<h1 className="login-card__title">Connexion</h1>
<p><Link to="/reset-password">Mot de passe oublié ?</Link></p>
<p><Link to="/register">Pas de compte ? S'inscrire</Link></p>

// APRÈS
<h1 className="login-card__title">{t('pages.login.title')}</h1>
<p><Link to="/reset-password">{t('auth.forgotPassword')}</Link></p>
<p><Link to="/register">{t('auth.noAccount')}</Link></p>
```

**Imports à ajouter:**
```jsx
import { useTranslation } from 'react-i18next';

function Login({ setUser }) {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 4 : src/pages/inscriptions_pages/Register.jsx**

```jsx
// AVANT
<h1 className="register-card__title">Inscription</h1>
<p className="register-card__login-link">
  <Link to="/login">Déjà un compte ? Se connecter</Link>
</p>

// APRÈS
<h1 className="register-card__title">{t('pages.register.title')}</h1>
<p className="register-card__login-link">
  <Link to="/login">{t('auth.hasAccount')}</Link>
</p>
```

**Imports:**
```jsx
import { useTranslation } from 'react-i18next';

function Register() {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 5 : src/pages/inscriptions_pages/RegisterSent.jsx**

```jsx
// AVANT
<h2>Inscription réussie</h2>
<p>Votre compte a été créé avec succès. Vous pouvez maintenant vous connecter.</p>
<p><Link to="/login">Aller à la page de connexion</Link></p>

// APRÈS
<h2>{t('pages.registerSent.title')}</h2>
<p>{t('pages.registerSent.message')}</p>
<p><Link to="/login">{t('pages.registerSent.link')}</Link></p>
```

**Imports:**
```jsx
import { useTranslation } from 'react-i18next';

export default function RegisterSent() {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 6 : src/pages/inscriptions_pages/Activate.jsx**

```jsx
// AVANT
<h2>Activation de compte</h2>
{status === 'loading' && <p>Validation en cours...</p>}
{status === 'success' && (
  <p className="activate-message activate-message--success">
    {message} — redirection vers la page de connexion...
  </p>
)}
{status === 'error' && (
  <p className="activate-message activate-message--error">{message}</p>
)}

// APRÈS
<h2>{t('pages.activate.title')}</h2>
{status === 'loading' && <p>{t('pages.activate.validating')}</p>}
{status === 'success' && (
  <p className="activate-message activate-message--success">
    {message} — {t('pages.activate.redirecting')}
  </p>
)}
{status === 'error' && (
  <p className="activate-message activate-message--error">{message}</p>
)}

// AVANT (Dans les setMessage)
setMessage('Token manquant');
setMessage(data.message || 'Une erreur est survenue');

// APRÈS
setMessage(t('pages.activate.tokenMissing'));
setMessage(data.message || t('pages.activate.error'));
```

**Imports:**
```jsx
import { useTranslation } from 'react-i18next';

const Activate = () => {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 7 : src/components/inscription_components/RegisterForm.jsx**

```jsx
// AVANT (Ligne ~150)
<ButtonValidation
  text={isLoading ? "Inscription en cours..." : "S'inscrire"}
/>

// APRÈS
<ButtonValidation
  text={isLoading ? t('auth.registering') : t('auth.register')}
/>
```

---

#### 🟠 PRIORITÉ 2 : FICHIERS HAUTE-PRIORITÉ

---

### 📄 **File 8 : src/pages/connexion_pages/UserProfile.jsx**

**Nombreux textes à remplacer - Suivre le même pattern:**

```jsx
// AVANT
setSuccessMessage('Profil mis à jour avec succès.');
setErrorMessage('Erreur lors de la mise à jour.');
setToastMessage('Réservation supprimée.');
setErrorMessage('Erreur lors de la suppression.');
setErrorMessage('Erreur réseau, veuillez réessayer.');
if (isLoading) return <div className="user-profile__loading">Chargement...</div>;
if (!user) return <div className="user-profile__error">Utilisateur non connecté.</div>;
<h2>Mon profil</h2>
<button type="button" className="btn btn-danger" onClick={handleLogout}>Se déconnecter</button>
<label className="user-label" htmlFor="user-firstname">Prénom</label>
<label className="user-label" htmlFor="user-lastname">Nom</label>
<label className="user-label" htmlFor="user-password">Nouveau mot de passe (laisser vide pour ne pas changer)</label>
<button type="button" className="user-profile__password-toggle">{showPassword ? 'Cacher' : 'Voir'}</button>
<button type="button" className="btn btn-primary" onClick={handleSave}>Enregistrer</button>
<h3 className="user-profile__section-title">Mes réservations</h3>
<p>Aucune réservation pour le moment.</p>

// APRÈS
setSuccessMessage(t('profile.updateSuccess'));
setErrorMessage(t('profile.updateError'));
setToastMessage(t('profile.reservationDeleted'));
setErrorMessage(t('profile.deleteError'));
setErrorMessage(t('common.networkError'));
if (isLoading) return <div className="user-profile__loading">{t('common.loading')}</div>;
if (!user) return <div className="user-profile__error">{t('pages.profile.notLoggedIn')}</div>;
<h2>{t('pages.profile.title')}</h2>
<button type="button" className="btn btn-danger" onClick={handleLogout}>{t('auth.logout')}</button>
<label className="user-label" htmlFor="user-firstname">{t('form.firstName')}</label>
<label className="user-label" htmlFor="user-lastname">{t('form.lastName')}</label>
<label className="user-label" htmlFor="user-password">{t('form.newPasswordOptional')}</label>
<button type="button" className="user-profile__password-toggle">{showPassword ? t('form.hidePassword') : t('form.showPassword')}</button>
<button type="button" className="btn btn-primary" onClick={handleSave}>{t('common.save')}</button>
<h3 className="user-profile__section-title">{t('pages.profile.myReservations')}</h3>
<p>{t('pages.profile.noReservations')}</p>
```

**Imports:**
```jsx
import { useTranslation } from 'react-i18next';

export default function UserProfile({ user: propUser = null, setUser: propSetUser = null }) {
  const { t } = useTranslation();
  // ...
```

---

### 📄 **File 9 : src/components/practical_info_components/Map.jsx**

```jsx
// AVANT
<Popup>
  Lieu de l'exposition "Au-delà de l'humain".<br /> Venez nous rendre visite !
</Popup>

// APRÈS
// Note: Map component doesn't directly use useTranslation, so we need to pass the translation as a prop
// Option 1: Use a wrapper component or pass via props
// Option 2: Store directly in the component with i18n
import { useTranslation } from 'react-i18next';

const Map = () => {
  const { t } = useTranslation();
  // ...
  <Popup>
    {t('map.locationPopup')}
  </Popup>
```

---

### 📄 **File 10 : src/components/practical_info_components/ContactSection.jsx**

```jsx
// AVANT
const ContactSection = ({ phone, email, website, websiteLang = 'fr' }) => (
  <div className="contact-section">
    <h2>Contact</h2>
    <ul className="contact-list">
      <li>
        <strong>Téléphone :</strong>
        ...
      <li>
        <strong>Email :</strong>
        ...
      <li>
        <strong>Site web :</strong>
        ...

// APRÈS
import { useTranslation } from 'react-i18next';

const ContactSection = ({ phone, email, website, websiteLang = 'fr' }) => {
  const { t } = useTranslation();
  return (
  <div className="contact-section">
    <h2>{t('contact.title')}</h2>
    <ul className="contact-list">
      <li>
        <strong>{t('contact.phone')}</strong>
        ...
      <li>
        <strong>{t('contact.email')}</strong>
        ...
      <li>
        <strong>{t('contact.website')}</strong>
        ...
```

---

### 📄 **File 11 : src/components/book_components/Form_reservation.jsx**

**TRÈS PRIORITAIRE - Beaucoup de textes:**

```jsx
// AVANT
const VALID_PROMO_CODE = 'HUMAIN5';  // Garder tel quel

// DANS LE JSX:
<h1 className="reservation-intro__title">Au-delà de l'Humain</h1>
<p className="reservation-intro__subtitle">Exposition immersive</p>
<p className="reservation-intro__description">Réservez vos places pour une visite inoubliable</p>
<h2 className="form-reservation__title">Sélectionner la date</h2>
<label className="form-reservation__label">Heure <span className="required">*</span></label>
<label className="form-reservation__label" htmlFor="res-language">Langue de la visite</label>
<option value="fr">Français</option>
<option value="en">Anglais</option>

// FONCTION handleApplyPromo
setPromoError('Code invalide');

// DANS LES VALIDATIONS (goNext)
setStep1Error('Veuillez sélectionner une date');
setStep1Error('Veuillez sélectionner un créneau horaire');
setStep1Error('Veuillez sélectionner au moins un billet');

// DANS handleSubmit
setSubmitError(data?.message || 'Erreur lors de la réservation.');
setSubmitError('Erreur réseau, veuillez réessayer.');

// APRÈS
import { useTranslation } from 'react-i18next';

const FormReservation = () => {
  const { t } = useTranslation();
  
  // ...
  
  <h1 className="reservation-intro__title">{t('reservation.title')}</h1>
  <p className="reservation-intro__subtitle">{t('reservation.subtitle')}</p>
  <p className="reservation-intro__description">{t('reservation.description')}</p>
  <h2 className="form-reservation__title">{t('reservation.selectDate')}</h2>
  <label className="form-reservation__label">{t('reservation.time')} <span className="required">*</span></label>
  <label className="form-reservation__label" htmlFor="res-language">{t('reservation.language')}</label>
  <option value="fr">{t('gateway.french')}</option>
  <option value="en">{t('gateway.english')}</option>
  
  const handleApplyPromo = () => {
    // ...
    setPromoError(t('reservation.invalidCode'));
  };
  
  const goNext = () => {
    // ...
    if (!date) setStep1Error(t('reservation.selectDateRequired'));
    else if (!time) setStep1Error(t('reservation.selectTimeRequired'));
    else if (totalTickets === 0) setStep1Error(t('reservation.selectTicketsRequired'));
  };
  
  const handleSubmit = () => {
    // ...
    setSubmitError(data?.message || t('reservation.error'));
    setSubmitError(t('common.networkError'));
  };
```

**Note:** Voir la section Form_reservation.jsx pour les options de tickets - utiliser les clés existantes ou ajouter:
```json
"reservation": {
  "fullPrice": "Entrée plein tarif",
  "reducedPrice": "Entrée tarif réduit", 
  "free": "Entrée gratuite"
}
```

---

### 📄 **File 12 : src/pages/book_pages/ReservationDetails.jsx**

```jsx
// AVANT
setPromoError('Code invalide');
const jwt = ...; if (!jwt) return <div style={{ padding: 24 }}><p>Connectez-vous pour réserver votre visite.</p></div>;

// APRÈS
import { useTranslation } from 'react-i18next';

const ReservationDetails = () => {
  const { t } = useTranslation();
  
  // ...
  setPromoError(t('reservation.invalidCode'));
  if (!jwt) return <div style={{ padding: 24 }}><p>{t('auth.requiresLogin')}</p></div>;
```

---

### 📄 **File 13 : src/components/book_components/Validation.jsx**

```jsx
// AVANT
<h2>Votre commande a bien été enregistrée</h2>
<p>Numéro de commande : <strong>{orderNumber}</strong></p>
<p>Bonjour {data.prenom} {data.nom},</p>
{data.total && <p>Montant total : <strong>{data.total}€</strong></p>}
{formattedDate && <p>Date : {formattedDate}</p>}
{data.time && <p>Heure : {data.time}</p>}
<p>Conservez bien ce numéro pour toute correspondance. Un récapitulatif vous a été envoyé par e-mail si l'adresse fournie est valide.</p>
<Link to="/" className="home-link">Retour à l'accueil</Link>

// APRÈS
import { useTranslation } from 'react-i18next';

const Validation = () => {
  const { t } = useTranslation();
  
  // ...
  
  <h2>{t('pages.validation.title')}</h2>
  <p>{t('pages.validation.orderNumber')} <strong>{orderNumber}</strong></p>
  <p>Bonjour {data.prenom} {data.nom},</p>
  {data.total && <p>{t('pages.validation.total')} <strong>{data.total}€</strong></p>}
  {formattedDate && <p>{t('pages.validation.date')} {formattedDate}</p>}
  {data.time && <p>{t('pages.validation.time')} {data.time}</p>}
  <p>{t('pages.validation.keepNumber')}</p>
  <Link to="/" className="home-link">{t('pages.validation.backHome')}</Link>
```

---

### 📄 **File 14 : src/pages/backoffice_pages/backoffice/Backoffice.jsx**

```jsx
// AVANT
if (!token) {
  return (
    <div className="backoffice-access-denied">
      <div className="access-denied-card">
        <h1>Zone Admin</h1>
        <p>Connecte-toi en tant qu'admin pour continuer et accéder à cette page.</p>
        <a href="/login" className="access-denied-button">Se connecter →</a>
      </div>
    </div>
  );
}

if (isAdmin === null) {
  return (
    <div className="backoffice-access-denied">
      <div className="access-denied-card loading">
        <div className="access-denied-spinner"></div>
        <p>Vérification des droits d'accès...</p>
      </div>
    </div>
  );
}

if (isAdmin === false) {
  return (
    <div className="backoffice-access-denied">
      <div className="access-denied-card denied">
        <h1>Pas d'Accès</h1>
        <p>Tu n'as pas les permissions pour accéder à cette zone.</p>
        <div style={{...}}>
          <a href="/" className="access-denied-button secondary">Retour à l'accueil →</a>
          <a href="/login" className="access-denied-button" onClick={...}>Changer de compte →</a>
        </div>
      </div>
    </div>
  );
}

// MAIN UI:
<h1 className="backoffice-title">Dashboard Admin</h1>
<button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>Stats</button>
<button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>Utilisateurs</button>
<button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>Réservations</button>
{loading && <div className="muted loading">Chargement...</div>}
if (!confirm('Supprimer cet utilisateur ?')) return;
if (!confirm('Supprimer cette réservation ?')) return;

// APRÈS
import { useTranslation } from 'react-i18next';

const Backoffice = () => {
  const { t } = useTranslation();
  
  // ...
  
  if (!token) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card">
          <h1>{t('backoffice.adminZone')}</h1>
          <p>{t('backoffice.requiresAdmin')}</p>
          <a href="/login" className="access-denied-button">{t('auth.login')} →</a>
        </div>
      </div>
    );
  }

  if (isAdmin === null) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card loading">
          <div className="access-denied-spinner"></div>
          <p>{t('backoffice.verifying')}</p>
        </div>
      </div>
    );
  }

  if (isAdmin === false) {
    return (
      <div className="backoffice-access-denied">
        <div className="access-denied-card denied">
          <h1>{t('backoffice.accessDenied')}</h1>
          <p>{t('backoffice.noPermissions')}</p>
          <div style={{...}}>
            <a href="/">{t('common.backHome')} →</a>
            <a href="/login" onClick={...}>{t('auth.logout')} →</a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="backoffice">
      <div className="backoffice-header">
        <h1 className="backoffice-title">{t('backoffice.dashboard')}</h1>
        <div className="backoffice-nav">
          <button className={tab === 'stats' ? 'active' : ''} onClick={() => setTab('stats')}>{t('backoffice.stats')}</button>
          <button className={tab === 'users' ? 'active' : ''} onClick={() => setTab('users')}>{t('backoffice.users')}</button>
          <button className={tab === 'reservations' ? 'active' : ''} onClick={() => setTab('reservations')}>{t('backoffice.reservations')}</button>
        </div>
      </div>

      {loading && <div className="muted loading">{t('common.loading')}</div>}
      
      // Dans deleteUser:
      if (!confirm(t('backoffice.confirmDeleteUser'))) return;
      
      // Dans deleteReservation:
      if (!confirm(t('backoffice.confirmDeleteReservation'))) return;
```

---

### 📄 **File 15 : src/components/backoffice_components/Stats.jsx**

```jsx
// AVANT
if (!reservations) return <div>Chargement...</div>;
if (dayLabels.length === 0) return <p className="muted">Aucune réservation enregistrée.</p>;
if (dayLabels.length > MAX_BAR_COLUMNS) {
  return (
    <div>
      <h4>Réservations par jour (liste)</h4>
      ...
    </div>
  );
}
<h4>Réservations par jour</h4>
...
<h4>Réservations par créneau</h4>
...
<h3>Statistiques</h3>
<div className="stat-item">
  <h4>Total</h4>
  <p>{reservations.length} réservations</p>
</div>
<div className="stat-item">
  <h4>Jours recensés</h4>
  <p>{dayLabels.length}</p>
</div>
<div className="stat-item">
  <h4>Créneaux</h4>
  <p>{slotLabels.length}</p>
</div>

// APRÈS
import { useTranslation } from 'react-i18next';

const Stats = ({ reservations = [] }) => {
  const { t } = useTranslation();
  
  if (!reservations) return <div>{t('common.loading')}</div>;
  if (dayLabels.length === 0) return <p className="muted">{t('backoffice.noReservations')}</p>;
  if (dayLabels.length > MAX_BAR_COLUMNS) {
    return (
      <div>
        <h4>{t('backoffice.reservationsByDay')}</h4>
        ...
      </div>
    );
  }
  <h4>{t('backoffice.reservationsByDayChart')}</h4>
  ...
  <h4>{t('backoffice.reservationsBySlot')}</h4>
  ...
  <h3>{t('backoffice.statistics')}</h3>
  <div className="stat-item">
    <h4>{t('common.total')}</h4>
    <p>{reservations.length} {t('backoffice.reservationsLabel')}</p>
  </div>
  <div className="stat-item">
    <h4>{t('backoffice.daysRecorded')}</h4>
    <p>{dayLabels.length}</p>
  </div>
  <div className="stat-item">
    <h4>{t('backoffice.timeSlots')}</h4>
    <p>{slotLabels.length}</p>
  </div>
```

---

### 📄 **File 16 : src/components/backoffice_components/UsersTable.jsx**

```jsx
// AVANT
const UsersTable = ({ users, onDelete, onChangeRole }) => (
  <div>
    <h3>Utilisateurs</h3>
    <table className="bo-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Email</th>
          <th>Nom</th>
          <th>Rôle</th>
          <th>Actions</th>
        </tr>
      </thead>
      ...
      <option value="user">Utilisateur</option>
      <option value="admin">Administrateur</option>
      ...
      <button type="button" className="delete" onClick={() => onDelete(user.id)}>
        Supprimer
      </button>

// APRÈS
import { useTranslation } from 'react-i18next';

const UsersTable = ({ users, onDelete, onChangeRole }) => {
  const { t } = useTranslation();
  
  return (
  <div>
    <h3>{t('backoffice.users')}</h3>
    <table className="bo-table">
      <thead>
        <tr>
          <th>{t('common.id')}</th>
          <th>{t('form.email')}</th>
          <th>{t('form.lastName')}</th>
          <th>{t('user.role')}</th>
          <th>{t('common.actions')}</th>
        </tr>
      </thead>
      ...
      <option value="user">{t('user.userRole')}</option>
      <option value="admin">{t('user.adminRole')}</option>
      ...
      <button type="button" className="delete" onClick={() => onDelete(user.id)}>
        {t('common.delete')}
      </button>
```

---

### 📄 **File 17 : src/components/backoffice_components/ReservationsTable.jsx**

```jsx
// AVANT
const ReservationsTable = ({ reservations, onDelete }) => (
  <div>
    <h3>Réservations</h3>
    <table className="bo-table">
      <thead>
        <tr>
          <th>ID</th>
          <th>Référence</th>
          <th>Date</th>
          <th>Contact</th>
          <th>Actions</th>
        </tr>
      </thead>
      ...
      <button type="button" className="delete" onClick={() => onDelete(r.id)}>
        Supprimer
      </button>

// APRÈS
import { useTranslation } from 'react-i18next';

const ReservationsTable = ({ reservations, onDelete }) => {
  const { t } = useTranslation();
  
  return (
  <div>
    <h3>{t('backoffice.reservations')}</h3>
    <table className="bo-table">
      <thead>
        <tr>
          <th>{t('common.id')}</th>
          <th>{t('profile.reference')}</th>
          <th>{t('profile.date')}</th>
          <th>{t('common.contact')}</th>
          <th>{t('common.actions')}</th>
        </tr>
      </thead>
      ...
      <button type="button" className="delete" onClick={() => onDelete(r.id)}>
        {t('common.delete')}
      </button>
```

---

### 📄 **File 18 : src/components/global_components/Navbar.jsx**

```jsx
// AVANT
<Link to="/profile" className="cursor-target">Mon compte</Link>

// APRÈS
import { useTranslation } from 'react-i18next';

const Navbar = ({ user, setUser }) => {
  const { t, i18n } = useTranslation();
  
  // ...
  
  <Link to="/profile" className="cursor-target">{t('navbar.myAccount')}</Link>
```

---

### 📄 **File 19 : src/components/homepage_components/TransitionSection.jsx**

```jsx
// AVANT
<div ref={dataLineRef} className="ts-data-line">
  SYS://EXPOSITION.INIT — AKIRA × GHOST_IN_THE_SHELL — PARIS_2025
</div>

// APRÈS
import { useTranslation } from 'react-i18next';

export default function ImmersionGateway() {
  const { t } = useTranslation();
  
  // ...
  
  <div ref={dataLineRef} className="ts-data-line">
    {t('transition.dataLine')}
  </div>
```

---

## 🧪 PHASE 3: TESTS

### Test 1: Vérifier les pages en Français
1. Aller sur chaque page modifiée
2. Vérifier que le texte s'affiche correctement en français
3. Prendre des screenshots de comparaison

### Test 2: Changer la langue en anglais
1. Utiliser le sélecteur de langue
2. Vérifier que tout le texte se change en anglais
3. Vérifier qu'aucun texte français ne reste visible

### Test 3: Tester les messages d'erreur
1. Remplir les formulaires avec des données incorrectes
2. Vérifier que les messages d'erreur s'affichent dans la bonne langue
3. Tester la traduction en changeant la langue

### Test 4: Test du localStorage
1. Changer la langue et rafraîchir la page
2. Vérifier que la langue est conservée

---

## 📝 CHECKLIST D'IMPLÉMENTATION

- [ ] Ajouter toutes les clés à `src/locales/fr.json`
- [ ] Ajouter toutes les clés à `src/locales/en.json`
- [ ] Modifier LoginForm.jsx
- [ ] Modifier AuthPrompt.jsx
- [ ] Modifier Login.jsx
- [ ] Modifier Register.jsx
- [ ] Modifier RegisterSent.jsx
- [ ] Modifier Activate.jsx
- [ ] Modifier RegisterForm.jsx
- [ ] Modifier UserProfile.jsx
- [ ] Modifier Map.jsx
- [ ] Modifier ContactSection.jsx
- [ ] Modifier Form_reservation.jsx
- [ ] Modifier ReservationDetails.jsx
- [ ] Modifier Validation.jsx
- [ ] Modifier Backoffice.jsx
- [ ] Modifier Stats.jsx
- [ ] Modifier UsersTable.jsx
- [ ] Modifier ReservationsTable.jsx
- [ ] Modifier Navbar.jsx
- [ ] Modifier TransitionSection.jsx
- [ ] Tests de traduction FR
- [ ] Tests de traduction EN
- [ ] Tests des messages d'erreur
- [ ] Tests du localStorage de langue

---

## 🚀 ÉTAPES DE DÉPLOIEMENT

1. Créer une branche: `git checkout -b feature/complete-i18n-translations`
2. Implémenter les changements phase par phase
3. Tester après chaque fichier modifié
4. Créer un Pull Request avec description détaillée
5. Merger après approbation

---

**Estimé**: ~6-8 heures de travail  
**Complexité**: Moyenne (répétitif mais simple)  
**Impact**: ✅ Très important pour l'expérience utilisateur
