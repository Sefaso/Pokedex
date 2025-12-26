# Pokédex

A responsive Pokédex web app built with **React** and **Redux**.  
This project lets users browse Pokémon entries, view their stats, types, cries, and descriptions in a clean, scroll‑snap interface.

## Live version's link:
http://sefasopokedex.netlify.app/

---

## 🚀 Features
- Browse Pokémon entries with **infinite scroll** and snap‑to‑screen navigation.
- Individual Pokémon pages with:
  - Image and cry audio
  - Description
  - Height, weight, types (with colored bubbles)
  - Base stats
- Responsive design for desktop and mobile.
- Accessibility fixes and semantic HTML structure.

---

## 🛠️ Tech Stack
- **React** (functional components, hooks)
- **Redux Toolkit** (state management, async thunks)
- **React Router** (navigation and layout)
- **CSS** (flexbox, media queries, scroll‑snap)

---

## 📂 Project Structure
- AppLayout.js → Fixed nav bar and layout wrapper
- Pokédex.js → Scrollable list of Pokémon
- Pokémon.js → Detailed Pokémon entry
- PokémonSlice.js → Redux slice for fetching and storing Pokémon data
- *.css → Component‑specific styles

---

## ⚙️ Setup & Installation
1. Clone the repo:
   git clone https://github.com/sefaso/pokedex.git
   cd pokedex

2. Install dependencies:
   npm install

3. Start the development server:
   npm start

4. Open http://localhost:3000 in your browser.

---

## 📱 Responsiveness
- Desktop: large images, wide layout
- Mobile (<800px): stacked layout, smaller fonts and images

---

## 🌟 Future Improvements
- Search bar for Pokémon by name
- Filters by type and region
  
---

## 📜 License
This project is open source. Feel free to fork and adapt it for your own learning.
