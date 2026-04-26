# 🎮 Pokémon Game V1 (Deluge RPG Inspired)

A browser-based Pokémon-style game built with **React + Vite**, featuring a tile-based world, map transitions, and a built-in map editor.

---

## 🚀 Features

### 🗺️ World System

* Multiple connected maps (Realm system)
* Seamless transitions between maps (left/right/up/down gates)
* Camera follows player smoothly

### 🎮 Player Movement

* Keyboard controls (Arrow keys)
* On-screen D-pad controls
* Collision detection (walls, obstacles)

### 🌿 Encounters

* Random encounters in specific tiles (e.g., tall grass)
* Battle screen trigger (basic system implemented)

### 🎨 Map Editor (In-Game)

* Toggle paint mode (`P`)
* Click to paint tiles
* Tile ID selector
* Shift + Click → rectangle fill
* Right-click → erase tile
* Export painted tiles
* Paint logs per map

### 💾 Persistence

* Map edits saved in **localStorage**
* Changes persist after refresh
* No backend required (for now)

---

## 🧱 Tech Stack

* **Frontend:** React (Vite)
* **State Management:** React Hooks
* **Rendering:** CSS Grid + Tile System
* **Storage:** localStorage (temporary persistence)
* **Backend (planned):** Flask

---

## 📁 Project Structure

```bash
pokemon-frontend/
│
├── public/
│   └── assets/        # Images (ignored in Git)
│
├── src/
│   ├── components/
│   │   ├── Game.jsx
│   │   ├── Map.jsx
│   │   ├── Tile.jsx
│   │   └── Battle.jsx
│   │
│   ├── data/
│   │   ├── maps.js
│   │   └── tilesetMeta.js
│   │
│   ├── logic/
│   │   ├── movement.js
│   │   └── encounter.js
│   │
│   ├── App.jsx
│   ├── main.jsx
│   └── styles.css
│
├── .gitignore
├── package.json
└── README.md
```

---

## 🎮 Controls

| Action            | Key           |
| ----------------- | ------------- |
| Move              | Arrow Keys    |
| Toggle Paint Mode | `P`           |
| Increase Tile ID  | `]`           |
| Decrease Tile ID  | `[`           |
| Paint Tile        | Left Click    |
| Fill Area         | Shift + Click |
| Erase Tile        | Right Click   |

---

## 🧠 How Map System Works

* Maps are stored as **2D arrays of tile IDs**
* Each tile corresponds to a sprite in the tileset
* Movement is grid-based
* Transitions occur at specific edge positions (gates)

---

## 💾 Saving System

* All edited maps are saved in:

```bash
localStorage → "pokemon_maps"
```

* On reload:

  * Game loads saved maps
  * Falls back to default maps if none exist

---

## ⚠️ Notes

* Assets (`public/assets/`) are **ignored in Git**
* Map data in localStorage is **not version-controlled**
* Use "Export" in editor to copy map changes into code

---

## 🔮 Planned Features

* Player sprite animations
* Better tile palette UI (no manual ID typing)
* Undo / redo system
* Backend save (Flask API)
* Multiplayer / shared maps
* Real Pokémon battle mechanics

---

## 🛠️ Setup

```bash
# Install dependencies
npm install

# Run frontend
npm run dev
```

---

## 📌 Status

🚧 Work in Progress — Core systems functional, UI and gameplay improving.

---

## 👨‍💻 Author

Built as a custom Pokémon-style engine inspired by Deluge RPG.

---

## ⭐ Future Goal

A fully functional online Pokémon world with:

* persistent maps
* multiplayer interaction
* real-time battles
