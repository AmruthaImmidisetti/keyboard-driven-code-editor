import React, { useState, useRef, useEffect } from "react";
import "./App.css";

/* ---------- Debounce highlight function ---------- */
let highlightCount = 0;

const debounce = (fn, delay) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

const highlight = debounce(() => {
  highlightCount++;
}, 200);

window.getHighlightCallCount = () => highlightCount;

function App() {
  const [content, setContent] = useState("");
  const [logs, setLogs] = useState([]);
  const [history, setHistory] = useState([""]);
  const [redoStack, setRedoStack] = useState([]);
  const [chord, setChord] = useState(false);

  const editorRef = useRef(null);

  useEffect(() => {
    window.getEditorState = () => ({
      content,
      historySize: history.length,
    });
  }, [content, history]);

  /* ---------- Update Content Helper ---------- */
  const updateContent = (newText) => {
    setContent(newText);
    setHistory(prev => [...prev, newText]);
    setRedoStack([]);
  };

  /* ---------- Logging ---------- */
  const addLog = (msg) => {
    setLogs(prev => [...prev, msg]);
  };

  /* ---------- Input Handler ---------- */
  const handleInput = (e) => {
    const value = e.target.value;
    updateContent(value);

    addLog("input: " + value.slice(-1));
    highlight();
  };

  /* ---------- Keyboard Handler ---------- */
  const handleKeyDown = (e) => {
    addLog(`keydown: ${e.key}`);

    const isMac = navigator.platform.includes("Mac");
    const modifier = isMac ? e.metaKey : e.ctrlKey;

    /* SAVE */
    if (modifier && e.key.toLowerCase() === "s") {
      e.preventDefault();
      addLog("Action: Save");
    }

    /* UNDO */
    if (modifier && e.key.toLowerCase() === "z" && !e.shiftKey) {
      e.preventDefault();

      setHistory(prevHistory => {
        if (prevHistory.length <= 1) return prevHistory;

        const newHistory = [...prevHistory];
        const last = newHistory.pop();

        setRedoStack(prevRedo => [...prevRedo, last]);
        setContent(newHistory[newHistory.length - 1]);

        return newHistory;
      });
    }

    /* REDO */
    if (modifier && e.shiftKey && e.key.toLowerCase() === "z") {
      e.preventDefault();

      setRedoStack(prevRedo => {
        if (prevRedo.length === 0) return prevRedo;

        const newRedo = [...prevRedo];
        const redoValue = newRedo.pop();

        setContent(redoValue);
        setHistory(prevHistory => [...prevHistory, redoValue]);

        return newRedo;
      });
    }

    /* TAB INDENT */
    if (e.key === "Tab" && !e.shiftKey) {
      e.preventDefault();
      const start = e.target.selectionStart;

      const newText =
        content.substring(0, start) +
        "  " +
        content.substring(start);

      updateContent(newText);
    }

    /* SHIFT+TAB OUTDENT */
    if (e.key === "Tab" && e.shiftKey) {
      e.preventDefault();
      updateContent(content.replace(/^ {2}/, ""));
    }

    /* ENTER KEEP INDENTATION */
    if (e.key === "Enter") {
      e.preventDefault();

      const lines = content.split("\n");
      const lastLine = lines[lines.length - 1];
      const spaces = lastLine.match(/^ */)[0];

      updateContent(content + "\n" + spaces);
    }

    /* COMMENT TOGGLE */
    if (modifier && e.key === "/") {
      e.preventDefault();

      const textarea = editorRef.current;
      const start = textarea.selectionStart;

      const lines = content.split("\n");

      let charCount = 0;
      let lineIndex = 0;

      for (let i = 0; i < lines.length; i++) {
        charCount += lines[i].length + 1;
        if (charCount > start) {
          lineIndex = i;
          break;
        }
      }

      const line = lines[lineIndex];

      if (line.trim().startsWith("//")) {
        lines[lineIndex] = line.replace(/^(\s*)\/\/\s?/, "$1");
      } else {
        lines[lineIndex] = "// " + line;
      }

      updateContent(lines.join("\n"));
    }

    /* CHORD SHORTCUT */
    if (modifier && e.key.toLowerCase() === "k") {
      setChord(true);
      setTimeout(() => setChord(false), 2000);
    }

    if (chord && modifier && e.key.toLowerCase() === "c") {
      addLog("Action: Chord Success");
      setChord(false);
    }
  };

  const handleKeyUp = (e) => {
    addLog(`keyup: ${e.key}`);
  };

  return (
    <div className="container" data-test-id="editor-container">
      <textarea
        ref={editorRef}
        data-test-id="editor-input"
        value={content}
        onChange={handleInput}
        onKeyDown={handleKeyDown}
        onKeyUp={handleKeyUp}
      />

      <div className="dashboard" data-test-id="event-dashboard">
        <h3>Event Logs</h3>
        <div data-test-id="event-log-list">
          {logs.map((log, i) => (
            <div key={i} data-test-id="event-log-entry">
              {log}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
