# Musée API

API en PHP pour la gestion des réservations du musée.

**Base URL DE L'API** : `https://apimusee.tomdelavigne.fr`

---

## Structure des fichiers

```
/
├── config.php          # Connexion à la base de données
├── JWT-en-PHP-main/    # Bibliothèque JWT (fournie par le prof)
└── api/
    ├── activate.php
    ├── login.php
    ├── register.php
    ├── users.php
    └── reservations.php
```

---

## Authentification

Les routes protégées nécessitent un token JWT :

Le token est obtenu via la route `/api/login.php`.

---

## Endpoints

### Authentification

#### `POST /api/register.php` - Inscription
```json
{
  "email": "toto@example.com",
  "password": "monmotdepasse",
  "firstname": "Toto",
  "lastname": "Tutu"
}
```

#### `POST /api/login.php` - Connexion
```json
{
  "email": "toto@example.com",
  "password": "monmotdepasse"
}
```
Retourne un `token` JWT.

---

### Utilisateurs — `/api/users.php`
> Toutes les routes nécessitent un token JWT.

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
  "firstname": "Toto",
  "lastname": "Tutu",
  "email": "nouveau@email.com",
  "password": "nouveaumotdepasse"
}
```

---

### Réservations — `/api/reservations.php`
> POST, PUT et DELETE nécessitent un token JWT.

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
  "contact_firstname": "Toto",
  "contact_lastname": "Tutu",
  "contact_email": "toto@example.com",
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