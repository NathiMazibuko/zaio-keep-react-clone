# Google Keep Clone (React + Vite)

A responsive, feature-packed Google Keep clone built with React 18 and Vite. Features full CRUD capability, manual state-driven note pinning, AI-assisted productivity tools, and local storage persistence.

---

## 🔗 Live Links

- **Live Demo (Netlify):** [Insert your Netlify URL here]
- **GitHub Repository:** [Insert your GitHub repo URL here]
- **Loom Walkthrough:** [Insert your Loom video URL here]

---

## 🚀 Features & Assignment Rubric Breakdown

### 1. Base Application (40 Marks)
- **Core UI & Sticky Header:** Header with search input, theme toggle, view toggle, and an elevated drop shadow on scroll.
- **Collapsible Sidebar:** Mini-rail on desktop that expands to an elevated drawer on hover; full slide-out drawer on mobile screens.
- **Dynamic Note Creator:** Collapsed "Take a note..." bar that expands to title, multiline auto-resizing textarea, and action controls.
- **CRUD & Modal Dialog:** Create, Read, Update via a centered edit modal with dark backdrop, and Soft Delete to trash.
- **Full Responsiveness:** Fluid CSS Grid (`auto-fit`, `minmax`) and CSS `clamp()` for seamless scaling from 320px mobile to wide desktop.

### 2. Manual Custom Feature (No AI - 15 Marks)
- **📌 Note Pinning:**
  - Hand-coded immutable state updates using JavaScript `.map()`.
  - Derived rendering with `.filter()` separating notes into dynamic **"PINNED"** and **"OTHERS"** sections without duplicate state.

### 3. AI-Assisted Custom Features (Cursor - 20 Marks)
- **🎨 Note Color-Coding (Feature #1):**
  - Integrated 8-swatch pastel palette popover.
  - Dynamically updates note color and persists background tint across card views and modal editors.
- **🗂️ Category Labels & Tag Filtering (Feature #2):**
  - Custom tag assignment (`Personal`, `Work`, `Inspiration`).
  - Interactive label chips on cards and instant sidebar tag filtering.

---

## 🛠️ Tech Stack

- **Framework:** React 18+ (Hooks: `useState`, `useEffect`, `useMemo`)
- **Build Tool:** Vite
- **Styling:** Modern CSS (Flexbox, CSS Grid, Custom Properties, `clamp()`)
- **Icons & Fonts:** Google Material Symbols Outlined, Google Sans, Roboto
- **Storage:** Browser `localStorage` API

---

## 📂 Project Structure

```text
src/
├── components/
│   ├── Header.jsx          # Search, layout, and theme toggles
│   ├── Sidebar.jsx         # Navigation rail and drawer
│   ├── NoteCreator.jsx     # Expandable creation form
│   ├── NoteCard.jsx        # Individual card with actions and pin trigger
│   ├── EditModal.jsx       # Backdrop edit dialog
│   └── Icon.jsx            # Material Symbols helper
├── styles/
│   └── App.css             # Theme variables and responsive layout rules
├── App.jsx                 # Central state management & derived filtering
└── main.jsx                # React root mount
```

## 💻 Getting Started Locally

- **Clone the repository:**

git clone <your-repo-url>
cd <project-folder>

- **Install dependencies:**

npm install

- **Run local development server:**
- 
npm run dev

- **Build for production:**

npm run build
