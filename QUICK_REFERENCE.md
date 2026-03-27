# ⚡ QUICK REFERENCE - Fichiers à Traduire

## 🔴 IMMÉDIAT (Traiter d'abord)

| Fichier | Textes | Priorité | Status |
|---------|--------|----------|--------|
| src/components/connexion_components/LoginForm.jsx | 3 | CRITIQUE | ❌ |
| src/components/connexion_components/AuthPrompt.jsx | 4 | CRITIQUE | ❌ |
| src/pages/inscriptions_pages/Register.jsx | 2 | CRITIQUE | ❌ |

## 🟠 PRIORITAIRE (Semaine 1)

| Fichier | Textes | Priorité | Status |
|---------|--------|----------|--------|
| src/pages/connexion_pages/Login.jsx | 3 | HAUTE | ❌ |
| src/pages/connexion_pages/UserProfile.jsx | 30+ | HAUTE | ❌ |
| src/components/book_components/Form_reservation.jsx | 24+ | HAUTE | ❌ |
| src/pages/book_pages/ReservationDetails.jsx | 2 | HAUTE | ❌ |
| src/components/book_components/Validation.jsx | 9 | HAUTE | ❌ |
| src/pages/backoffice_pages/backoffice/Backoffice.jsx | 20+ | HAUTE | ❌ |
| src/pages/inscriptions_pages/RegisterSent.jsx | 3 | HAUTE | ❌ |
| src/pages/inscriptions_pages/Activate.jsx | 6 | HAUTE | ❌ |

## 🟡 SECONDAIRE (Semaine 2)

| Fichier | Textes | Priorité | Status |
|---------|--------|----------|--------|
| src/components/inscription_components/RegisterForm.jsx | 2 | MOYENNE | ❌ |
| src/components/practical_info_components/Map.jsx | 1 | MOYENNE | ❌ |
| src/components/practical_info_components/ContactSection.jsx | 4 | MOYENNE | ❌ |
| src/components/backoffice_components/Stats.jsx | 11 | MOYENNE | ❌ |
| src/components/backoffice_components/UsersTable.jsx | 8 | MOYENNE | ❌ |
| src/components/backoffice_components/ReservationsTable.jsx | 7 | MOYENNE | ❌ |
| src/components/global_components/Navbar.jsx | 1 | MOYENNE | ❌ |
| src/components/homepage_components/TransitionSection.jsx | 1 | MOYENNE | ❌ |

## 📊 TOTAUX

- **Fichiers à modifier**: 19
- **Total textes**: 120+
- **Clés i18n à ajouter**: ~100
- **Effort estimé**: 6-8 heures

## 📋 FICHIERS DE SUPPORT

1. **RESUME_EXECUTIF.md** ← START HERE
2. **AUDIT_i18n_COMPLET.md** - Audit détaillé
3. **i18n_MISSING_KEYS_REFERENCE.json** - Toutes les clés
4. **IMPLEMENTATION_GUIDE.md** - Guide étape-par-étape

## 🎯 COMMANDES RAPIDES

```bash
# Chercher le texte hardcodé à changer
grep -r "Connexion" src/components/connexion_components/

# Tester la traduction
npm run dev  # puis changer la langue dans l'UI
```

## ✅ CHECKLIST MINIMUM

- [ ] Lire le RESUME_EXECUTIF.md
- [ ] Ajouter clés i18n à fr.json et en.json
- [ ] Modifier les 3 fichiers CRITIQUES
- [ ] Tester en FR et EN
- [ ] Tester messages d'erreur
- [ ] Modifier les 8 fichiers HAUTE PRIORITÉ
- [ ] Tests complets
- [ ] Commit et merge

## 📞 SUPPORT

- Audit complet: AUDIT_i18n_COMPLET.md
- Code exemple: IMPLEMENTATION_GUIDE.md
- Clés manquantes: i18n_MISSING_KEYS_REFERENCE.json
