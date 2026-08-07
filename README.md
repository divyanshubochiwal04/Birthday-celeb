# 👑 Birthday Tribute – Laxman Sir

An interactive, premium, and visually stunning tribute web application built to celebrate the birthday of **Mr. Laxman Yadav**—a visionary leader guiding multiple companies and teams.

This project is a storytelling digital experience featuring smooth cinematic transitions, dynamic micro-animations, and interactive components.

---

## ✨ Features

- **Interactive Canvas Particles:** Custom canvas-based floating particles on the landing screen.
- **Cinematic Countdown Overlay:** A timed overlay countdown (`3` ➔ `2` ➔ `1`) animated using **GSAP** scale/bounce logic, concluding with a custom confetti explosion.
- **Auto-Scrolling Storyboard:** Smooth automated scrolling flow once the experience begins.
- **Parallax & Float Effects:** Immersive multi-layered backgrounds and floating abstract doodles.
- **Stunning Photo Showcase:** A beautifully laid-out grid presenting memorable portraits and team highlights.
- **Animate On Scroll (AOS):** Smooth reveal animations for text, quotes, and showcase cards.
- **Premium Aesthetics:** Curated modern typography, sleek gradients, custom glassmorphism design tokens, and a dark-theme transition.

---

## 🛠️ Technology Stack

- **Frontend Core:** HTML5, Vanilla CSS3 (Custom Variables & Gradients), Modern ES6 JavaScript.
- **Animations:** 
  - [GreenSock Animation Platform (GSAP)](https://greensock.com/gsap/) (Core, ScrollTrigger, & ScrollToPlugin)
  - [Animate On Scroll (AOS)](https://michalsnik.github.io/aos/)
- **Visuals:** Custom JavaScript 2D Canvas Particles, SVG Doodles.

---

## 🚀 How to Run Locally

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed.

### Installation
1. Clone the repository:
   ```bash
   git clone https://github.com/divyanshubochiwal04/Birthday-celeb.git
   cd Birthday-celeb
   ```
2. Install dependencies (AOS & GSAP):
   ```bash
   npm install
   ```

### Running on Localhost
You can run a quick local HTTP server using `npx`:

```bash
npx http-server
```
*Open **`http://localhost:8080`** in your browser to view the project.*

---

## 📁 Project Structure

```text
├── assets/             # Images, portraits, and branding logos
├── gradient.css        # Background gradient styling
├── style.css           # Premium layout and responsive typography
├── index.html          # Main HTML entry point
├── particles.js        # Canvas particle configuration and rendering
├── script.js           # Core GSAP timelines, triggers, and events
└── package.json        # Dependencies configurations (GSAP & AOS)
```

---

## 🤝 Tribute From
Made with respect, admiration, and gratitude by **The Team**.
