# 🏨 Lumière — Système de Gestion Hôtelière

<div align="center">

![Node.js](https://img.shields.io/badge/Node.js-18+-339933?style=for-the-badge&logo=nodedotjs&logoColor=white)
![Express](https://img.shields.io/badge/Express-4.x-000000?style=for-the-badge&logo=express&logoColor=white)
![MongoDB](https://img.shields.io/badge/MongoDB-7.x-47A248?style=for-the-badge&logo=mongodb&logoColor=white)
![React](https://img.shields.io/badge/React-18-61DAFB?style=for-the-badge&logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind-3.x-06B6D4?style=for-the-badge&logo=tailwindcss&logoColor=white)

*Application full-stack de gestion hôtelière — Projet de Fin d'Études*

</div>

---

## 📋 Table des matières

- [Aperçu](#-aperçu)
- [Fonctionnalités](#-fonctionnalités)
- [Stack technique](#-stack-technique)
- [Architecture](#-architecture-du-projet)
- [Installation](#-installation)
- [Variables d'environnement](#-variables-denvironnement)
- [Comptes de démo](#-comptes-de-démonstration)
- [Rôles & Permissions](#-rôles--permissions)
- [Scénario principal](#-scénario-principal)
- [Modèles MongoDB](#-modèles-mongodb)
- [API Endpoints](#-api-endpoints)

---

## 📌 Aperçu

Système centralisé couvrant l'intégralité du cycle de vie d'une réservation hôtelière — de la consultation des chambres jusqu'à la génération de facture PDF — en remplaçant les processus manuels sources d'erreurs.

---

## ✨ Fonctionnalités

### 🔐 Authentification
- Inscription / connexion sécurisée (JWT + bcrypt)
- Gestion des rôles : `Admin` · `Réception` · `Client`
- Protection des routes selon le rôle

### 🛏️ Gestion des chambres
- CRUD complet (type, prix, superficie, équipements, images)
- Suivi de l'état en temps réel

| Statut | Description |
|--------|-------------|
| ✅ Disponible | Prête à être réservée |
| 🔴 Occupée | Client en séjour |
| 🧹 À nettoyer | Post check-out |
| 🔧 Maintenance | Hors service temporaire |

- Cycle automatique : `Check-in → Occupée → Check-out → À nettoyer → Disponible`

### 📅 Réservations
- Vérification de disponibilité par dates et capacité
- Statuts : `PENDING → CONFIRMED → CHECKIN → CHECKOUT / CANCELLED`
- Historique complet par client
- Calendrier interactif avec dates bloquées

### 💳 Paiements
- Simulation de paiement multi-méthodes
- Génération automatique de facture PDF
- Suivi : `En attente → Partiellement payé → Payé`

### 📊 Statistiques Admin
- Revenus totaux et mensuels
- Taux d'occupation des chambres
- Réservations en attente de validation

---

## 🛠️ Stack technique

| Couche | Technologie |
|--------|-------------|
| **Frontend** | React 18, Tailwind CSS, Axios, React Router |
| **Backend** | Node.js, Express.js |
| **Base de données** | MongoDB, Mongoose |
| **Auth** | JWT, bcrypt |
| **Upload** | Multer |
| **PDF** | jsPDF / PDFKit |
| **État global** | Context API |

---

## 🗂️ Architecture du projet

```
hotel-management/
├── client/                        # Frontend React
│   └── src/
│       ├── components/            # Composants réutilisables
│       │   ├── ChambreCard.jsx
│       │   ├── ModalReservation.jsx
│       │   ├── Navbar.jsx
│       │   ├── Footer.jsx
│       │   └── SidebarReservation.jsx
│       ├── pages/
│       │   ├── HomePage.jsx
│       │   ├── ReservationPage.jsx
│       │   ├── Login.jsx
│       │   ├── Register.jsx
│       │   ├── PayementPage.jsx
│       │   └── Dashboard/
│       │       ├── AdminDashboard.jsx
│       │       ├── EmployeeDashboard.jsx
│       │       └── ClientDashboard.jsx
│       ├── context/
│       │   └── Context.jsx        # AppContext global
│       └── services/              # Appels API Axios
│
└── server/                        # Backend Express
    ├── config/
    │   └── db.js                  # Connexion MongoDB
    ├── controllers/
    │   ├── user.js
    │   ├── chambre.js
    │   ├── reservation.js
    │   └── payment.js
    ├── middleware/
    │   ├── auth.js                # Vérification JWT
    │   ├── isAdmin.js             # Contrôle rôle Admin
    │   └── multer.js              # Upload images
    ├── models/
    │   ├── User.js
    │   ├── Chambre.js
    │   ├── Reservation.js
    │   └── Payment.js
    ├── routes/
    │   ├── userRoutes.js
    │   ├── chambreRoutes.js
    │   ├── reservationRoutes.js
    │   └── paymentRoutes.js
    └── server.js
```

---

## ⚙️ Installation

### Prérequis

- **Node.js** v18+
- **MongoDB** (local ou [Atlas](https://www.mongodb.com/atlas))
- npm ou yarn

### Étapes

```bash
# 1. Cloner le dépôt
git clone https://github.com/votre-username/hotel-management.git
cd hotel-management

# 2. Installer et lancer le backend
cd server
npm install
npm run dev

# 3. Installer et lancer le frontend (nouveau terminal)
cd ../client
npm install
npm start
```

> Frontend : `http://localhost:5173` · API : `http://localhost:3000`

---

## 🔑 Variables d'environnement

Créez un fichier `.env` dans `/server` :

```env
PORT=3000
MONGO_URI=mongodb://localhost:27017/hotel_db
JWT_SECRET=votre_secret_jwt_ici
JWT_EXPIRE=7d
NODE_ENV=development
```

---

## 👤 Comptes de démonstration

| Rôle | Email | Mot de passe |
|------|-------|--------------|
| 🟡 Admin | admin@hotel.com | admin123 |
| 🟢 Employé | employe@hotel.com | employe123 |
| 🔵 Client | client@hotel.com | client123 |

---

## 👥 Rôles & Permissions

### 🟡 Administrateur
- Gestion complète : chambres, clients, employés
- Accès aux statistiques et tableaux de bord
- Consultation de tous les historiques

### 🟢 Employé (Réception)
- Check-in / Check-out
- Mise à jour du statut des chambres
- Consultation des chambres à nettoyer / en maintenance

### 🔵 Client
- Consultation des chambres sans connexion
- Réservation, paiement, téléchargement de facture PDF

---

## 🔄 Scénario principal

```
1.  Client visite le site (sans connexion)
2.  Consulte les chambres disponibles et les prix
3.  Clique sur "Réserver" → redirection vers connexion
4.  Se connecte ou crée un compte
5.  Sélectionne des dates → vérification disponibilité
6.  Réservation créée                     [status: PENDING]
7.  Client effectue le paiement
8.  Réservation confirmée + facture PDF   [status: CONFIRMED / paymentStatus: PAID]
9.  Client arrive → Check-in              [status: CHECKIN  | chambre: Occupée]
10. Client quitte → Check-out             [status: CHECKOUT | chambre: À nettoyer]
11. Employé nettoie la chambre            [chambre: Disponible]
```

---

## 🗄️ Modèles MongoDB

<details>
<summary><strong>User</strong></summary>

```js
{
  name         : String,            // required
  prenom       : String,            // required
  email        : String,            // required, unique, lowercase
  password     : String,            // min 6 caractères, hashé bcrypt
  role         : 'Admin' | 'Réception' | 'Client',   // default: 'Client'
  avatar       : String,
  isActive     : Boolean,           // default: true
  statut       : 'Actif' | 'Inactif',
  lastLogin    : Date,
  reservations : [ObjectId → Reservation]
}
```
</details>

<details>
<summary><strong>Chambre</strong></summary>

```js
{
  numero       : String,            // required
  type         : 'Standard' | 'Supérieure' | 'Deluxe' | 'Suite' | 'Suite Présidentielle',
  etage        : Number,
  capacite     : Number,            // required, min: 1
  superficie   : Number,
  vue          : String,
  prix_nuit    : Number,            // required
  prix_week    : Number,            // required
  statut       : 'Disponible' | 'Occupée' | 'À nettoyer' | 'Maintenance' | 'Inactive',
  images       : [String],
  equipements  : [{ nom: String, disponible: Boolean }],
  reservation_active : [reservationActiveSchema],
  nettoyages   : [nettoyageSchema],
  maintenances : [maintenanceSchema],
  meta         : { note_moyenne, total_avis, total_sejours },
  disponible_reservation : Boolean  // default: true
}
```
</details>

<details>
<summary><strong>Reservation</strong></summary>

```js
{
  user         : ObjectId → User,   // required
  chambre      : ObjectId → Chambre,// required
  arrivee      : Date,              // required
  depart       : Date,              // required
  nuits        : Number,
  prixParNuit  : Number,
  total        : Number,
  status       : 'PENDING' | 'CONFIRMED' | 'CHECKIN' | 'CHECKOUT' | 'CANCELLED',
  paymentStatus: 'UNPAID' | 'PAID',
  paymentMethod: 'Espèces' | 'Carte bancaire' | 'PayPal' | 'Virement bancaire' | 'Stripe',
  cancelledAt  : Date,
  cancelledBy  : ObjectId → User
}
```
</details>

<details>
<summary><strong>Payment</strong></summary>

```js
{
  reservation   : ObjectId → Reservation,  // required
  chambre       : ObjectId → Chambre,       // required
  user          : ObjectId → User,          // required
  montant_total : Number,
  montant_paye  : Number,
  taxe          : Number,
  reduction     : Number,
  methode       : 'Espèces' | 'Carte bancaire' | 'PayPal' | 'Virement bancaire' | 'Stripe',
  statut        : 'En attente' | 'Partiellement payé' | 'Payé' | 'Remboursé' | 'Échoué',
  transaction_id: String,
  date_paiement : Date,
  date_limite   : Date,
  facture       : { numero_facture, url_pdf, genere_le },
  valide_par    : String
}
```
</details>

---

## 📡 API Endpoints

### 🔐 Auth — `/api/auth`

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| `POST` | `/register` | Inscription | Public |
| `POST` | `/login` | Connexion | Public |
| `POST` | `/logout` | Déconnexion | Authentifié |
| `GET` | `/getuserdata` | Profil connecté | Authentifié |
| `GET` | `/users` | Lister tous les users | Admin |
| `POST` | `/users/createuser` | Créer un user | Admin |
| `PUT` | `/users/updateuser/:id` | Modifier un user | Admin |
| `DELETE` | `/users/deleteuser/:id` | Supprimer un user | Admin |

### 🛏️ Chambres — `/api/chambres`

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| `POST` | `/add-room` | Ajouter une chambre | Admin |
| `GET` | `/get-room` | Toutes les chambres | Public |
| `GET` | `/disponibles` | Dispo par dates & capacité | Public |
| `GET` | `/available` | Chambres disponibles | Public |
| `GET` | `/not-available` | Chambres occupées | Admin |
| `GET` | `/to-clean` | Chambres à nettoyer | Employé |
| `GET` | `/cleaned` | Chambres nettoyées | Employé |
| `GET` | `/unavailable-dates/:id` | Dates bloquées d'une chambre | Public |
| `PUT` | `/clean/:id` | Valider le nettoyage | Employé |
| `GET` | `/:id` | Détail d'une chambre | Public |
| `PUT` | `/update-room/:id` | Modifier une chambre | Admin |
| `PATCH` | `/status/:id` | Changer le statut | Employé |
| `DELETE` | `/delete/:id` | Supprimer une chambre | Admin |

### 📅 Réservations — `/api/reservations`

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| `POST` | `/:roomId` | Créer une réservation | Client |
| `GET` | `/getallreservations` | Toutes les réservations | Admin |
| `GET` | `/getreservationsannule` | Réservations annulées | Admin |
| `GET` | `/myreservation` | Mes réservations | Client |
| `GET` | `/monthly-revenue` | Revenus mensuels | Admin |
| `GET` | `/invoice/:id/download` | Télécharger facture PDF | Client |
| `GET` | `/getonereservation/:id` | Détail (public) | Public |
| `GET` | `/reservationbyid/:id` | Détail (auth) | Authentifié |
| `PUT` | `/updatereservation/:id` | Modifier | Client |
| `DELETE` | `/deletereservation/:id` | Supprimer | Admin |
| `PATCH` | `/cancel/:id` | Annuler | Client |
| `PATCH` | `/checkin/:id` | Check-in | Employé |
| `PATCH` | `/checkout/:id` | Check-out | Employé |

### 💳 Paiements — `/api/payments`

| Méthode | Route | Description | Accès |
|---------|-------|-------------|-------|
| `POST` | `/createpayment/:id` | Créer un paiement | Client |
| `GET` | `/getpayments` | Tous les paiements | Admin |
| `GET` | `/total` | Total global | Admin |
| `GET` | `/total-month` | Total du mois | Admin |
| `GET` | `/pending` | En attente ce mois | Admin |

---

## 📄 Licence

Projet réalisé à des fins académiques — Projet de Fin d'Études.