# 🏨 Système de Gestion Hôtelière

> Application web full-stack développée dans le cadre d'un projet de fin d'études, permettant de gérer les réservations, les chambres, les clients et les opérations internes d'un hôtel.

---

## 📋 Table des matières

- [Aperçu du projet](#aperçu-du-projet)
- [Fonctionnalités](#fonctionnalités)
- [Technologies utilisées](#technologies-utilisées)
- [Architecture du projet](#architecture-du-projet)
- [Installation](#installation)
- [Variables d'environnement](#variables-denvironnement)
- [Utilisation](#utilisation)
- [Rôles et permissions](#rôles-et-permissions)
- [Scénario principal](#scénario-principal)
- [API Endpoints](#api-endpoints)
- [Schéma de la base de données](#schéma-de-la-base-de-données)

---

## 📌 Aperçu du projet

Ce projet répond aux problématiques rencontrées par de nombreux hôtels utilisant des méthodes manuelles ou des systèmes peu optimisés :

- Erreurs de réservation
- Mauvaise gestion des chambres
- Manque de suivi des clients
- Perte de temps pour les employés

La solution proposée est une **application centralisée et automatisée** couvrant l'ensemble du cycle de vie d'une réservation, du check-in au check-out, avec génération de factures PDF.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription et connexion sécurisée
- Gestion des rôles (Admin / Employé / Client)
- Protection des routes selon le rôle

### 🛏️ Gestion des chambres
- Ajouter, modifier, supprimer une chambre
- Définir le type et le prix
- Suivi de l'état en temps réel :
  - ✅ **Disponible**
  - 🔴 **Occupée**
  - 🧹 **À nettoyer**
- Cycle automatique des états :
  ```
  Check-in → Occupée → Check-out → À nettoyer → Nettoyage terminé → Disponible
  ```

### 📅 Gestion des réservations
- Réservation de chambre (disponibles uniquement)
- Vérification de disponibilité selon les dates
- Modification et annulation
- Historique des réservations
- Statuts : `en attente` → `confirmée` → `check-in` → `check-out`

### 👥 Gestion des clients
- Création de compte et connexion
- Consultation de l'historique des séjours
- Gestion des informations personnelles

### 💳 Gestion des paiements
- Simulation de paiement en ligne
- Génération automatique de facture
- Téléchargement de la facture en **format PDF**

### 📊 Statistiques (Admin)
- Nombre total de réservations
- Revenus générés
- Taux d'occupation des chambres

---

## 🛠️ Technologies utilisées

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React.js, CSS / Tailwind, Axios |
| **Backend** | Node.js, Express.js |
| **Base de données** | MongoDB, Mongoose |
| **Authentification** | JWT (JSON Web Tokens), bcrypt |
| **Génération PDF** | jsPDF / PDFKit |
| **Gestion de l'état** | Redux / Context API |

---

## 🗂️ Architecture du projet

```
hotel-management/
├── client/                     # Frontend React
│   ├── public/
│   └── src/
│       ├── components/         # Composants réutilisables
│       ├── pages/              # Pages principales
│       │   ├── Home.jsx
│       │   ├── Rooms.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── Reservation.jsx
│       │   ├── Dashboard/
│       │   │   ├── AdminDashboard.jsx
│       │   │   ├── EmployeeDashboard.jsx
│       │   │   └── ClientDashboard.jsx
│       ├── context/            # Auth Context / Redux
│       ├── services/           # Appels API (Axios)
│       └── utils/
│
└── server/                     # Backend Node.js / Express
    ├── config/
    │   └── db.js               # Connexion MongoDB
    ├── controllers/
    │   ├── authController.js
    │   ├── roomController.js
    │   ├── reservationController.js
    │   ├── clientController.js
    │   └── paymentController.js
    ├── middleware/
    │   ├── authMiddleware.js    # Vérification JWT
    │   └── roleMiddleware.js    # Contrôle d'accès par rôle
    ├── models/
    │   ├── User.js
    │   ├── Room.js
    │   ├── Reservation.js
    │   └── Payment.js
    ├── routes/
    │   ├── authRoutes.js
    │   ├── roomRoutes.js
    │   ├── reservationRoutes.js
    │   └── paymentRoutes.js
    └── server.js
```

---

## ⚙️ Installation

### Prérequis

- [Node.js](https://nodejs.org/) v18+
- [MongoDB](https://www.mongodb.com/) (local ou Atlas)
- npm ou yarn

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-username/hotel-management.git
cd hotel-management

# 2. Installer les dépendances du backend
cd server
npm install

# 3. Installer les dépendances du frontend
cd ../client
npm install

# 4. Lancer le backend (depuis /server)
cd ../server
npm run dev

# 5. Lancer le frontend (depuis /client)
cd ../client
npm start
```

L'application sera accessible sur `http://localhost:3000`  
L'API backend tourne sur `http://localhost:5000`

---

## 🔑 Variables d'environnement

Créez un fichier `.env` dans le dossier `server/` :

```env
PORT=5000
MONGO_URI=mongodb://localhost:27017/hotel_db
JWT_SECRET=votre_secret_jwt
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 🚀 Utilisation

### Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| Admin | admin@hotel.com | admin123 |
| Employé | employe@hotel.com | employe123 |
| Client | client@hotel.com | client123 |

---

## 👤 Rôles et permissions

### 🟡 Administrateur
- Gestion complète du système
- Accès aux statistiques et tableaux de bord
- Gestion des chambres, clients et employés
- Consultation de tous les historiques

### 🟢 Employé (Réception)
- Gestion des réservations
- Effectuer check-in / check-out
- Consulter et mettre à jour l'état des chambres
- Consultation des chambres à nettoyer

### 🔵 Client
- Consultation des chambres, prix et disponibilités (sans connexion)
- Inscription et connexion
- Réservation d'une chambre
- Consultation de ses réservations
- Effectuer un paiement
- Télécharger sa facture PDF

---

## 🔄 Scénario principal

```
1.  Le client visite le site (sans connexion)
2.  Il consulte les chambres disponibles et les prix
3.  Il clique sur "Réserver"
4.  Le système demande une connexion / inscription
5.  Le client se connecte
6.  Le système vérifie la disponibilité selon les dates
7.  Une réservation est créée → statut : "en attente"
8.  Le client effectue le paiement (simulation)
9.  La réservation est confirmée → facture PDF générée
10. L'employé valide la réservation
11. Le client arrive → Check-in → chambre : "Occupée"
12. Le client quitte → Check-out → chambre : "À nettoyer"
13. L'employé consulte les chambres à nettoyer
14. L'employé met à jour l'état → chambre : "Disponible"
```

---

## 📡 API Endpoints

### Auth
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/auth/register` | Inscription | Public |
| POST | `/api/auth/login` | Connexion | Public |
| GET | `/api/auth/me` | Profil connecté | Authentifié |

### Chambres
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/rooms` | Lister toutes les chambres | Public |
| GET | `/api/rooms/:id` | Détail d'une chambre | Public |
| POST | `/api/rooms` | Ajouter une chambre | Admin |
| PUT | `/api/rooms/:id` | Modifier une chambre | Admin |
| DELETE | `/api/rooms/:id` | Supprimer une chambre | Admin |
| PATCH | `/api/rooms/:id/status` | Mettre à jour l'état | Employé / Admin |

### Réservations
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/reservations` | Toutes les réservations | Admin / Employé |
| GET | `/api/reservations/my` | Mes réservations | Client |
| POST | `/api/reservations` | Créer une réservation | Client |
| PUT | `/api/reservations/:id` | Modifier une réservation | Client / Admin |
| DELETE | `/api/reservations/:id` | Annuler une réservation | Client / Admin |
| PATCH | `/api/reservations/:id/checkin` | Check-in | Employé / Admin |
| PATCH | `/api/reservations/:id/checkout` | Check-out | Employé / Admin |

### Paiements
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| POST | `/api/payments` | Simuler un paiement | Client |
| GET | `/api/payments/:id/invoice` | Télécharger facture PDF | Client |

### Statistiques
| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| GET | `/api/stats` | Statistiques générales | Admin |

---

## 🗄️ Schéma de la base de données

### User
```js
{
  name: String,
  email: String (unique),
  password: String (hashé),
  role: { type: String, enum: ['admin', 'employe', 'client'] },
  createdAt: Date
}
```

### Room
```js
{
  number: String,
  type: String,        // simple, double, suite...
  price: Number,
  status: { type: String, enum: ['disponible', 'occupée', 'à nettoyer'] },
  description: String,
  images: [String]
}
```

### Reservation
```js
{
  client: { type: ObjectId, ref: 'User' },
  room: { type: ObjectId, ref: 'Room' },
  checkIn: Date,
  checkOut: Date,
  status: { type: String, enum: ['en attente', 'confirmée', 'annulée', 'terminée'] },
  totalPrice: Number,
  createdAt: Date
}
```

### Payment
```js
{
  reservation: { type: ObjectId, ref: 'Reservation' },
  client: { type: ObjectId, ref: 'User' },
  amount: Number,
  method: String,
  status: { type: String, enum: ['en attente', 'payé', 'échoué'] },
  invoiceUrl: String,
  paidAt: Date
}
```

---

## 👨‍💻 Auteurs

Projet de fin d'études — [Votre établissement]

---

## 📄 Licence

Ce projet est réalisé à des fins académiques.
