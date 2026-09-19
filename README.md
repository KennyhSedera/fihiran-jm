# 🎵 Fihiran Jesosy Mamonjy

Application mobile dédiée à la consultation du **Fihiran Jesosy Mamonjy**, développée avec **React Native, Expo et TypeScript**.

L'application permet de consulter les chants, effectuer des recherches, gérer ses favoris et retrouver facilement les derniers chants consultés, le tout avec un fonctionnement **hors ligne**.

## ✨ Fonctionnalités

* 🎵 Consultation des chants
* 🔢 Liste des chants de 1 à 1000
* 🔎 Recherche de chants
* 🗂️ Recherche par catégories / thèmes
* ❤️ Gestion des favoris
* 🕘 Historique des derniers chants consultés
* 📖 Lecture confortable des paroles
* 🔤 Modification de la taille du texte
* 🌙 Mode clair et mode sombre
* 🎨 Personnalisation de la police
* 💾 Sauvegarde locale des préférences
* 📴 Fonctionnement hors connexion
* 📱 Interface optimisée pour Android et iOS

## 🛠️ Technologies

### Application mobile

* React Native
* Expo
* Expo Router
* TypeScript

### Stockage local

* SQLite avec `expo-sqlite`
* Données des chants stockées localement
* Favoris et historique persistants

### Architecture

L'application utilise notamment :

* React Context
* Expo Router
* SQLite
* Hooks React
* Composants réutilisables
* Gestion globale du thème et des préférences

## 📂 Structure du projet

```text
fihiran-jm/
├── app/
│   ├── (tabs)/
│   │   ├── index.tsx
│   │   ├── hymns.tsx
│   │   ├── search.tsx
│   │   ├── favorites.tsx
│   │   └── settings.tsx
│   │
│   ├── hymn/
│   │   └── [id].tsx
│   │
│   └── _layout.tsx
│
├── assets/
│   ├── images/
│   ├── json/
│   │   └── fihirana_jm.json
│   └── fonts/
│
├── components/
│   ├── AppHeader.tsx
│   ├── HymnRow.tsx
│   ├── SearchBar.tsx
│   ├── DraggableFloatingButton.tsx
│   └── ...
│
├── context/
│   ├── app-context.tsx
│   └── db-context.tsx
│
├── database/
│   └── ...
│
├── constants/
│   └── ...
│
├── utils/
│   └── ...
│
├── app.json
├── package.json
├── tsconfig.json
└── README.md
```

## 🚀 Installation

### Prérequis

Installer au préalable :

* Node.js
* npm
* Git
* Android Studio pour le développement Android
* Expo

### Cloner le projet

```bash
git clone <URL_DU_REPOSITORY>
cd fihiran-jm
```

### Installer les dépendances

```bash
npm install
```

## ▶️ Lancer l'application

### Expo

```bash
npm start
```

ou :

```bash
npx expo start
```

### Android

```bash
npm run android
```

ou :

```bash
npx expo run:android
```

### iOS

```bash
npm run ios
```

### Web

```bash
npm run web
```

## 🎵 Données des chants

Les chants sont stockés dans un fichier JSON local :

```text
assets/json/fihirana_jm.json
```

Chaque chant possède des informations permettant notamment d'afficher :

* son numéro
* son titre
* ses paroles
* son année / édition lorsque disponible
* sa catégorie
* ses informations complémentaires

Exemple de structure :

```ts
type Hymn = {
  id: number;
  number: number;
  title: string;
  lyrics: string;
  year?: number;
  category?: string;
};
```

Les données sont embarquées dans l'application afin de permettre la consultation des chants sans connexion Internet.

## 🗄️ Base de données SQLite

L'application utilise une base SQLite locale :

```text
fihirana_jm.db
```

Elle permet notamment de conserver les favoris et l'historique.

### ❤️ Favoris

Les chants ajoutés aux favoris sont enregistrés localement.

Exemple :

```ts
type Favorite = {
  hymn_id: number;
  created_at: string;
};
```

L'utilisateur peut :

* ajouter un chant aux favoris
* retirer un chant des favoris
* consulter uniquement ses chants favoris

### 🕘 Derniers chants consultés

L'application conserve les derniers chants ouverts afin de permettre un accès rapide à l'historique.

L'historique est limité aux **5 derniers chants consultés**.

Exemple :

```ts
type LastReads = {
  hymn_id: number;
  read_at: string;
};
```

Lorsqu'un nouveau chant est consulté, il est placé en première position et les anciennes entrées sont supprimées lorsque la limite est dépassée.

## 🔎 Recherche

La recherche permet de retrouver rapidement un chant à partir de son contenu.

L'utilisateur peut rechercher notamment :

* numéro du chant
* titre
* paroles
* mots-clés

Une section dédiée permet également de retrouver les recherches récentes.

Lorsque aucune recherche n'a encore été effectuée, l'application affiche un état vide.

Exemple :

```text
Tsy misy hira nokarohina
Atombohy amin'ny fitadiavana hira
```

## 🗂️ Catégories

Les chants peuvent être regroupés par catégories ou thèmes.

L'application normalise différentes appellations de catégories afin de présenter une liste cohérente à l'utilisateur.

Exemples de thèmes :

* Fiderana
* Fivavahana
* Finoana
* Fisaorana
* Fitiavana
* Fanantenana
* Fanompoana
* Jesosy
* Fanahy Masina

Les catégories peuvent évoluer selon les données disponibles dans le fichier des chants.

## 📖 Lecture d'un chant

La page de lecture affiche le chant de manière adaptée à la lecture sur mobile.

L'utilisateur peut notamment :

* consulter les paroles
* augmenter ou réduire la taille du texte
* changer la police
* activer le mode sombre
* ajouter ou retirer le chant des favoris

Les préférences de lecture sont conservées localement.

## 🔤 Taille du texte

L'utilisateur peut personnaliser la taille des paroles.

Cette préférence est persistante afin que l'application conserve le réglage choisi lors des prochaines ouvertures.

## 🎨 Police

L'application permet également de choisir une police adaptée à la lecture des paroles.

La police sélectionnée est gérée par le contexte global de l'application.

## 🌙 Mode sombre

Deux principaux thèmes sont disponibles :

### ☀️ Mode clair

```text
Background : #F5F6F8
Card       : #FFFFFF
Text       : #172033
Muted      : #7D8795
```

### 🌙 Mode sombre

```text
Background : #111111
Card       : #17212B
Text       : #FFFFFF
Muted      : #9BA8B4
```

Le thème peut être modifié depuis les paramètres de l'application.

## 📴 Fonctionnement hors ligne

Une des caractéristiques principales de l'application est son fonctionnement hors connexion.

Les données des chants sont intégrées localement dans l'application et les informations utilisateur sont conservées dans SQLite.

Une connexion Internet n'est donc pas nécessaire pour :

* consulter les chants
* rechercher un chant
* consulter les catégories
* gérer les favoris
* consulter l'historique
* lire les paroles

## 📱 Navigation

L'application est organisée autour de plusieurs sections :

```text
Accueil
  │
  ├── Chants
  │     └── Lecture
  │
  ├── Recherche
  │
  ├── Catégories
  │
  ├── Favoris
  │
  └── Paramètres
```

## 🧪 Développement

Vérifier le code :

```bash
npm run lint
```

Démarrer Expo :

```bash
npm start
```

Reconstruire les fichiers natifs :

```bash
npx expo prebuild
```

Lancer Android :

```bash
npx expo run:android
```

## 📦 Build Android

Pour générer une version release Android :

```bash
cd android
gradlew.bat assembleRelease
```

L'APK sera généralement disponible dans :

```text
android/app/build/outputs/apk/release/
```

## 🗺️ Roadmap

### Fonctionnalités disponibles

* [x] Liste des chants
* [x] Lecture des chants
* [x] Recherche
* [x] Catégories
* [x] Favoris
* [x] Historique des derniers chants
* [x] Mode clair
* [x] Mode sombre
* [x] Taille du texte
* [x] Personnalisation de la police
* [x] Fonctionnement hors ligne
* [x] Stockage SQLite

### Évolutions possibles

* [ ] Partage d'un chant
* [ ] Partage d'un extrait
* [ ] Export / sauvegarde des favoris
* [ ] Synchronisation entre appareils
* [ ] Audio des chants
* [ ] Lecture automatique
* [ ] Ajout de notes personnelles
* [ ] Plans de lecture
* [ ] Amélioration de la recherche avancée

## 🤝 Contribution

Les contributions sont les bienvenues.

Créer une branche :

```bash
git checkout -b feature/nouvelle-fonctionnalite
```

Effectuer les modifications puis :

```bash
git add .
git commit -m "feat: ajout d'une nouvelle fonctionnalité"
git push origin feature/nouvelle-fonctionnalite
```

Une Pull Request peut ensuite être créée.

## 📄 Licence

Ce projet est développé pour fournir une expérience mobile pratique de consultation du **Fihiran Jesosy Mamonjy**.

Les textes, chants, données ou ressources provenant de sources externes peuvent être soumis à leurs propres droits et conditions d'utilisation. Vérifiez les droits applicables avant toute redistribution publique.

---

## 👨‍💻 Développé avec

**React Native · Expo · TypeScript · Expo Router · SQLite**

> 🎵 Hira mora tadiavina, vakiana ary ankafizina — na dia tsy misy Internet aza.
