# 📄 PDF Talker — Interface Front-End

**PDF Talker** est une application web moderne et réactive construite avec **Next.js (App Router)** et **Tailwind CSS**. Elle permet d'importer des fichiers PDF, de configurer leur indexation via un backend IA (Gemini Cloud ou Ollama Local), et d'interagir en direct avec les documents grâce au *streaming* de réponses SSE (Server-Sent Events).

## 🚀 Fonctionnalités Principales

* **Landing Page moderne** : Présentation du projet avec appel à l'action et mise en avant des caractéristiques principales.

* **Interface Dashboard réactive** :

  * **Drag & Drop de PDF** : Zone de dépôt ergonomique avec aperçu du fichier sélectionné (nom, taille).

  * **Gestion de l'indexation** : Choix du provider d'IA (Gemini pour la rapidité Cloud, Ollama pour le traitement Local privé).

  * **Suivi en temps réel** : Polling automatique de l'état d'indexation avec barre de progression interactive.

* **Chat interactif en temps réel** :

  * Réception des réponses via flux **SSE (Server-Sent Events)** pour un rendu mot à mot (*token-by-token*).

  * Référencement dynamique des **pages sources** utilisées par le modèle pour générer ses réponses.

  * Défilement automatique (*auto-scroll*) vers le dernier message envoyé/reçu.

* **Design Sombre & Moderne** : Palette de couleurs soignée (Gradients Indigo/Violet), prise en charge intégrale des thèmes sombres et composants stylisés avec Tailwind CSS.

## 🛠️ Stack Technique

* **Framework** : [Next.js 15+](https://nextjs.org/) (React 19, JavaScript ES6+)

* **Style** : [Tailwind CSS v3/v4](https://tailwindcss.com/)

* **Polices** : `Geist` & `Geist Mono` (`next/font`)

* **Protocole de communication** : Fetch API / Streaming ReadableStream (SSE)

## 📁 Structure du Projet Front-End

```
src/
├── app/
│   ├── page.js                 # Landing Page (Présentation du produit)
│   ├── app/
│   │   └── page.js             # Dashboard / Interface applicative principale
│   ├── layout.js               # Root Layout avec configuration de la police et Navbar
│   └── globals.css             # Directives et styles globaux Tailwind CSS
├── components/
│   ├── Navbar.js               # Barre de navigation globale
│   ├── Dropzone.js             # Zone de glisser-déposer pour les fichiers PDF
│   ├── IndexationConfig.js     # Panneau de choix du provider & progression
│   └── Chat.js                 # Fenêtre de messagerie interactive & SSE
└── lib/
    └── api.js                  # Helper centralisé pour les requêtes HTTP (Fetch)

```

## 🧩 Référence des Composants & Fichiers

### 1. `src/lib/api.js` (Gestionnaire d'API)

Contient la fonction utilitaire `api()` qui centralise les appels au backend FastAPI / Python. Elle gère la concaténation de l'URL de base et l'extraction formattée des erreurs backend.

### 2. `src/components/Navbar.js`

Barre de navigation supérieure comprenant :

* Le logo et titre de l'application.

* Les liens de navigation réactifs vers la **Présentation** (`/`) et **L'Application** (`/app`).

### 3. `src/components/Dropzone.js`

Gestionnaire de téléversement de document PDF :

* Support de l'interaction native **Drag & Drop**.

* Validation visuelle du fichier chargé (affichage du nom et de la taille en Mo).

* Bouton de confirmation avec indicateur d'état pendant l'envoi (`busy`).

### 4. `src/components/IndexationConfig.js`

Composant de configuration de l'indexation :

* Résumé du document reçu (nombre de pages, découpage en morceaux/chunks).

* Sélecteur à boutons pour définir le moteur d'embedding/indexation (`gemini` ou `ollama`).

* Barre de progression dynamique s'actualisant pendant la phase d'indexation.

### 5. `src/components/Chat.js`

Fenêtre de conversation en direct :

* Sélecteur de modèle pour la génération de texte (`Gemini` ou `Ollama`).

* Moteur de lecture du flux réseau SSE via `ReadableStream` et `TextDecoder`.

* Affichage progressif du texte généré (*tokens*).

* Bloc déroulant d'affichage des **Sources** indiquant les numéros de page et extraits cités.

### 6. `src/app/app/page.js` (Dashboard principal)

Page combinant l'ensemble de la logique métier :

* Gestion des états locaux React (`doc`, `status`, `provider`, `error`).

* Horloge/Intervalle de polling (interroge `/status` toutes les 1.5s pendant l'indexation).

* Disposition en grille sur deux colonnes (Panneau de configuration à gauche, Chat à droite).

## ⚙️ Configuration & Installation

### Préréquis

* **Node.js** : v18.17.0 ou supérieur

* **npm**, **pnpm** ou **yarn**

* Le backend API (FastAPI) en cours d'exécution (par défaut sur `http://127.0.0.1:8000`).

### 1. Installation des dépendances

```
npm install

```

### 2. Variables d'environnement

Créez un fichier `.env.local` à la racine du projet front-end :

```
NEXT_PUBLIC_API_URL=http://127.0.0.1:8000

```

### 3. Lancer le serveur de développement

```
npm run dev

```

Ouvrez ensuite <http://localhost:3000> dans votre navigateur.

## 🔄 Flux de Données & Routes Backend Utilisées

Le front-end communique avec les points de terminaison (*endpoints*) backend suivants :

| **Méthode** | **Endpoint** | **Description** | 
| `POST` | `/documents` | Envoie le fichier PDF (Multipart Form) | 
| `POST` | `/documents/{id}/index?provider={p}` | Démarre l'indexation du document | 
| `GET` | `/documents/{id}/status` | Interroge l'état de progression de l'indexation | 
| `POST` | `/chat/stream` | Ouvre le flux SSE pour recevoir la réponse du Chat | 
