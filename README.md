# High Performance Code Editor

## 📌 Project Overview
This project is a browser-based code editor built using React.  
It supports advanced keyboard shortcuts similar to VS Code, event logging, undo/redo history, and performance optimization using debouncing.

## 🚀 Features
- Keyboard shortcut handling (Ctrl/Cmd based)
- Undo and redo functionality
- Tab indentation and outdent
- Comment toggle shortcut
- Multi-key chord shortcut
- Event debugging dashboard
- Debounced syntax highlighting simulation
- Docker containerized setup

## 🛠 Technologies Used
- React JS
- JavaScript
- HTML & CSS
- Docker & Docker Compose

## ▶️ Running Locally

```bash
npm install
npm start
````

App runs at:

```
http://localhost:3000
```

## 🐳 Running With Docker

```bash
docker-compose up --build
```

Then open:

```
http://localhost:3000
```

## ⌨ Keyboard Shortcuts

| Shortcut                       | Action         |
| ------------------------------ | -------------- |
| Ctrl/Cmd + S                   | Save action    |
| Ctrl/Cmd + Z                   | Undo           |
| Ctrl/Cmd + Shift + Z           | Redo           |
| Tab                            | Indent         |
| Shift + Tab                    | Outdent        |
| Ctrl/Cmd + /                   | Toggle comment |
| Ctrl/Cmd + K then Ctrl/Cmd + C | Chord success  |

## 📊 Exposed Functions

* `window.getEditorState()` → Returns editor content and history size.
* `window.getHighlightCallCount()` → Returns syntax highlight call count.

## 🐳 Containerization

The project includes:

* Dockerfile
* docker-compose.yml
* .env.example

Run using a single command:

```
docker-compose up
```
✅ UI improvement tips  
✅ Final code review  

Just tell 👍
```
