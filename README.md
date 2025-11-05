# 🎨 CMU Portfolio Shell

A structured, multi-page portfolio project built as part of the **HTML & CSS Lab** series.  
This project demonstrates foundational web structure, styling, and Git workflow best practices.

---

## 📁 Project Structure

```bash
portfolio-shell/
│
├── index.html
├── about.html
├── contact.html
│
├── css/
│   └── styles.css
│
├── js/
│   └── main.js
│
├── README.md
└── .gitignore
```

Each page shares a consistent header/navigation bar, CMU-themed color palette, and responsive typography.

---

## 🧩 Tech Overview

| Technology | Purpose |
|-------------|----------|
| **HTML5** | Semantic markup and accessible structure |
| **CSS3** | Responsive layout and theming |
| **Google Fonts** | Custom font pairing — *Inter* and *Playfair Display* |
| **Git + GitHub** | Version control and remote collaboration |
| **VS Code + Live Server** | Local preview and iteration |

---

## 🎯 Lab Progress Log

### **Level 1 – The Single Page**

- Created `index.html` with an `<h1>` element.
- Verified it opens in a browser.

### **Level 2 – Structured Project**

- Added `css/` and `js/` subfolders.
- Created `styles.css` and linked it in all HTML files.
- Added project boilerplate and a consistent header layout.

### **Level 3 – Multi-Page Site + Git**

- Added `about.html` and `contact.html`.
- Initialized Git repository and made first commit.
- Ensured pages link correctly through navigation.

### **Level 4 – Themed Design**

- Implemented **CMU color palette** (`#C41230` primary, with accessible shades).
- Imported **Inter** and **Playfair Display** from Google Fonts.
- Applied consistent typography, margins, and layout spacing.
- Committed styling updates with clear, descriptive messages.

### **Level 5 – Advanced Selectors & Dev Tools Debugging**

- Added pseudo-class interactivity (`:hover`, `:active`, `:not()`).
- Intentionally introduced and resolved a spacing bug using browser DevTools.
- Finalized theme polish and committed from `develop` branch.

---

## 🎨 Design Theme (CMU Inspired)

| Element | Color | Purpose |
|----------|--------|----------|
| **Primary (CMU Red)** | `#C41230` | Branding & headers |
| **Dark Accent** | `#A50F28` / `#8C0D22` | Hover & focus states |
| **Background** | `#F7F7F8` | Page background |
| **Text** | `#0F172A` | High contrast readability |
| **Muted Text** | `#5B6770` | Secondary text / captions |

Typography pairing:

- Headings → *Playfair Display*
- Body → *Inter*

---

## 🚀 Workflow Summary

1. Work done on the `develop` branch.
2. Pushed to GitHub for backup and version tracking.
3. Merged back into `main` after successful testing.

```bash
git checkout develop
git add .
git commit -m "style: add advanced selectors and debug spacing issue"
git push
git checkout main
git merge develop
git push
```

---

## ✅ Current Status

All **five lab steps** (HTML + CSS foundations) are complete!  
The project now represents a professional, CMU-branded static portfolio shell ready for future enhancements such as responsive layouts, images, and projects sections.

---

© 2025 Matthew Schardt — Schardt Industries  
Built for **CMU HTML & CSS Project**
