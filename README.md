# NeoPlay - Web Player 🎧
> **Your sound, reborn.**

NeoPlay is a modern, responsive web-based music player designed for a seamless streaming experience. It features a stylish "Neo-Glow" interface, curated playlists for various moods (Hindi, Bengali, Chill, etc.), and advanced audio features like 8D audio simulation.



---

## ✨ Features

### 🎵 Core Audio Experience
* **8D Audio Mode:** A smooth, spatialized audio experience using the Web Audio API ($PannerNode$).
* **Smart Playback:** Supports Shuffle, Repeat, and a dynamic Seekbar with real-time gradient updates.
* **Media Metadata:** Automatically reads ID3 tags (Artist, Title, Lyrics) using `jsmediatags`.
* **Keyboard Shortcuts:** Control your music with `Space` (Play/Pause), `Arrows` (Volume/Seek), and `M` (Mute).

### 🎨 User Interface
* **Responsive Design:** Fully optimized for Desktop, Tablet, and Mobile devices.
* **Interactive Splash Screen:** A high-quality entrance animation with flickering neon text.
* **Dynamic Lyrics:** Line-by-line fade-in animations for a cinematic feel.
* **Glassmorphism & Neon:** A sleek dark-mode UI with cyan and magenta accents.

### 📂 Organization
* **Playlist Management:** Folder-based song loading (ACS, NCS, Bengali, Hindi, etc.).
* **Liked Songs:** Persistent storage using `localStorage` to save your favorite tracks.
* **Search:** Instant filtering of songs within your library with "Not Found" visual feedback.

---

## 🛠️ Technology Stack

* **Frontend:** HTML5, CSS3 (Custom Variables, Keyframe Animations, Media Queries).
* **Logic:** JavaScript (ES6+ Modules).
* **Audio Engine:** Web Audio API for 8D effects and spatialization.
* **Metadata:** [jsmediatags](https://github.com/aadsm/jsmediatags) for reading MP3 tags.

---

## 🚀 Getting Started
⚠️ Important:
This project is meant to run on a local server to play music directly from local folders.
The focus is on demonstrating design, functionality, and core concepts, not online streaming.

### 1. File Structure
Ensure your music directory is structured as follows:
```text
/NeoPlay
├── index.html
├── style.css
├── utility.css
├── engine.js
├── songs/
│   ├── acs/ (Feel-Good)
│   ├── ncs/ (Happy Hits)
│   └── ...
└── img/ (Icons and Logos)
## 🎥 Demo Video

▶️ [Watch NeoPlay Demo](./demo/neoplay8126.mp4)
