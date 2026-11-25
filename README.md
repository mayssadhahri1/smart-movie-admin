# 🎬 Smart Movie Platform — Dashboard d'administration (Angular)

> Interface web d'administration de la plateforme **Smart Movie** : statistiques en temps réel, gestion des utilisateurs, ajout de films avec upload vidéo et supervision de l'activité.
> Réalisée pendant mon **stage d'été 2025 chez Cyber Kairouan**, connectée à l'API **Spring Boot** de la plateforme.

![Angular](https://img.shields.io/badge/Angular-17-DD0031?logo=angular&logoColor=white)
![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)
![Angular Material](https://img.shields.io/badge/Angular%20Material-757575?logo=angular&logoColor=white)
![Chart.js](https://img.shields.io/badge/Chart.js-4-FF6384?logo=chartdotjs&logoColor=white)
![RxJS](https://img.shields.io/badge/RxJS-B7178C?logo=reactivex&logoColor=white)
![JWT](https://img.shields.io/badge/Auth-JWT-000000?logo=jsonwebtokens&logoColor=white)

---

## 🧩 La plateforme Smart Movie

Smart Movie est une plateforme de découverte et de streaming de films, composée de trois applications :

| Partie | Technologie | Rôle | Dépôt |
|---|---|---|---|
| **API back-end** | Spring Boot, MySQL, JWT | Catalogue TMDB, recommandations, streaming, administration | [smart-movie-recommendation](https://github.com/mayssadhahri1/smart-movie-recommendation) |
| **Dashboard admin** | Angular 17 | Pilotage de la plateforme par l'administrateur | *ce dépôt* |
| **Application mobile** | Flutter | Expérience client : catalogue, favoris, recommandations, lecture vidéo | à venir |

```
 Administrateur ──► Dashboard Angular ─┐
                                       ├──► API REST Spring Boot ──► MySQL
 Client ─────────► Application Flutter ┘           │
                                                   ├──► API TMDB
                                                   └──► Stockage des vidéos
```

## ✨ Fonctionnalités

### 🔐 Connexion sécurisée
- Authentification par **JWT** auprès de l'API Spring Boot
- Accès réservé au rôle **`ROLE_ADMIN`** : un compte client est refusé dès la connexion
- **Intercepteur HTTP** qui ajoute automatiquement le jeton à chaque requête
- **Guard** de navigation qui protège toutes les pages et redirige vers la connexion

### 📊 Tableau de bord
- Indicateurs clés : nombre d'utilisateurs, films consultés, favoris, état de l'API TMDB
- **Graphiques Chart.js** : inscriptions par semaine (barres), genres populaires (anneau), top 5 des films les plus aimés (barres horizontales)
- Tableau des films les plus aimés avec affiche, nombre de favoris et de vues
- Dernières connexions des utilisateurs

### 👥 Gestion des utilisateurs
- Liste complète avec **recherche instantanée**
- **Activation / désactivation** d'un compte en un clic
- Modification et suppression d'un utilisateur

### 🎞️ Gestion des films
- Trois onglets : **top des films consultés**, **top des films favoris** et **catalogue de la plateforme**
- Grille d'affiches avec recherche instantanée et panneau de détail
- **Ajout d'un film** dans une fenêtre modale : titre, synopsis, note, durée, date de sortie, genres, affiche (avec aperçu) et **upload de la vidéo par glisser-déposer**
- Modification (vidéo remplaçable ou conservée) et suppression avec confirmation
- **Lecture de la vidéo en streaming** directement dans le panneau de détail
- Notifications (toasts) de succès ou d'erreur, fermeture de la modale avec `Échap`

### 🛰️ Surveillance
- **Activité récente** sur la plateforme, avec l'utilisateur concerné et la date
- **Dernières connexions** des utilisateurs
- **État de l'API TMDB** (disponible ou non) pour détecter rapidement une panne du fournisseur de données

## 🏗️ Architecture du projet

Application Angular 17 en **composants standalone** (sans `NgModule`), avec un service par domaine et une séparation claire pages / composants partagés.

```
src/app/
├── pages/
│   ├── login/            # Connexion administrateur
│   ├── dashboard/        # Indicateurs et graphiques
│   ├── users/            # Gestion des utilisateurs
│   ├── films/            # Catalogue, ajout et upload vidéo
│   └── surveillance/     # Activité, connexions, état TMDB
├── components/
│   ├── navbar/           # Barre supérieure
│   └── sidebar/          # Menu de navigation
├── services/
│   ├── auth.service.ts   # Connexion, jeton, rôle
│   └── admin.service.ts  # Appels à l'API d'administration
├── guards/auth.guard.ts           # Protection des routes
├── interceptors/auth.interceptor.ts  # Ajout du jeton JWT
├── app.routes.ts         # Routage
└── app.config.ts         # Configuration (router, HttpClient, animations)
```

| Route | Page | Protégée |
|---|---|---|
| `/login` | Connexion | — |
| `/dashboard` | Tableau de bord | ✅ |
| `/users` | Utilisateurs | ✅ |
| `/films` | Films de la plateforme | ✅ |
| `/surveillance` | Surveillance | ✅ |

## 🚀 Lancer le projet

**Prérequis** : Node.js 18+, et l'[API Spring Boot](https://github.com/mayssadhahri1/smart-movie-recommendation) démarrée sur le port `8081`.

```bash
git clone https://github.com/mayssadhahri1/smart-movie-admin.git
cd smart-movie-admin
npm install
npm start            # http://localhost:4200
```

Connexion avec un compte qui a le rôle `ADMIN` dans la base de l'API.

```bash
npm run build        # build de production dans dist/
```

## 🛠️ Stack technique

| Domaine | Outils |
|---|---|
| Framework | Angular 17 (standalone components, nouveau système de routage) |
| Langage | TypeScript 5.4 |
| UI | Angular Material, CSS personnalisé |
| Graphiques | Chart.js 4 + ng2-charts |
| Réseau | HttpClient, intercepteur fonctionnel, RxJS |
| Sécurité | JWT, guard de route, contrôle du rôle |
| CI | GitHub Actions (build de production à chaque push) |

## 📚 Ce que j'ai appris pendant ce stage

- Structurer une application Angular moderne en composants standalone
- Sécuriser une interface d'administration : jeton JWT, intercepteur, guard et contrôle du rôle
- Consommer une API REST Spring Boot et gérer les états de chargement et d'erreur avec RxJS
- Construire des tableaux de bord lisibles avec Chart.js
- Envoyer des fichiers volumineux (vidéos) en `multipart/form-data`
- Concevoir une interface qui s'intègre dans une plateforme découpée en back-end, web et mobile

---

👩‍💻 **Mayssa Dhahri** — Élève-ingénieure en Génie Logiciel, École Polytechnique de Sousse
[LinkedIn](https://www.linkedin.com/in/mayssa-dhahri/) · [GitHub](https://github.com/mayssadhahri1)
