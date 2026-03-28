# 🏛️ Musée API

API REST en PHP pour la gestion des réservations du musée.

**Base URL** : `https://apimusee.tomdelavigne.fr`

---

## Structure des fichiers

```
/
├── config.php          # Connexion à la base de données
├── JWT-en-PHP-main/    # Bibliothèque JWT (fournie par le prof)
└── api/
    ├── login.php
    ├── register.php
    ├── users.php
    └── reservations.php
```

---

## Authentification

Les routes protégées nécessitent un token JWT dans le header :

```
Authorization: Bearer <token>
```

Le token est obtenu via la route `/api/login.php`.

---

## Endpoints

### 👤 Authentification

#### `POST /api/register.php` — Inscription
```json
{
  "email": "jean@example.com",
  "password": "monmotdepasse",
  "firstname": "Jean",
  "lastname": "Dupont"
}
```

#### `POST /api/login.php` — Connexion
```json
{
  "email": "jean@example.com",
  "password": "monmotdepasse"
}
```
Retourne un `token` JWT à utiliser pour les requêtes suivantes.

---

### 👥 Utilisateurs — `/api/users.php`
> 🔒 Toutes les routes nécessitent un token JWT.

| Méthode | Paramètres | Description |
|---------|-----------|-------------|
| `GET` | — | Retourne le profil de l'utilisateur connecté |
| `GET` | `?all=1` | Retourne tous les utilisateurs *(admin uniquement)* |
| `PUT` | — | Modifie le profil de l'utilisateur connecté |
| `PUT` | `?id=X` | Modifie un utilisateur spécifique *(admin uniquement)* |
| `DELETE` | `?id=X` | Supprime un utilisateur *(admin uniquement)* |

**Exemple body PUT :**
```json
{
  "firstname": "Jean",
  "lastname": "Dupont",
  "email": "nouveau@email.com",
  "password": "nouveaumotdepasse"
}
```

---

### 📅 Réservations — `/api/reservations.php`
> 🔒 POST, PUT et DELETE nécessitent un token JWT.

| Méthode | Paramètres | Description |
|---------|-----------|-------------|
| `GET` | — | Retourne toutes les réservations |
| `GET` | `?id=X` | Retourne une réservation |
| `GET` | `?user_id=X` | Retourne les réservations d'un utilisateur |
| `POST` | — | Crée une réservation |
| `PUT` | `?id=X` | Modifie une réservation *(admin uniquement)* |
| `DELETE` | `?id=X` | Supprime une réservation |

**Exemple body POST :**
```json
{
  "contact_firstname": "Jean",
  "contact_lastname": "Dupont",
  "contact_email": "jean@example.com",
  "reservation_date": "2025-06-15",
  "time_slot": "10h00 - 12h00",
  "language": "fr",
  "reservation_type": "standard",
  "promo_code": "ETE2025",
  "tickets": [
    { "ticket_type": "adulte", "unit_price": 12.00, "quantity": 2 },
    { "ticket_type": "enfant", "unit_price": 6.00,  "quantity": 1 }
  ]
}
```

---

## Codes de réponse

| Code | Signification |
|------|--------------|
| `200` | Succès |
| `201` | Ressource créée |
| `400` | Données manquantes ou invalides |
| `401` | Non authentifié |
| `403` | Non autorisé |
| `404` | Ressource introuvable |
| `405` | Méthode non supportée |
| `409` | Conflit (ex : email déjà utilisé) |
