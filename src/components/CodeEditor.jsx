import React, { useEffect, useRef, useState, useCallback } from "react";
import Codemirror from "codemirror";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/dracula.css";
import "codemirror/mode/javascript/javascript";
import "codemirror/mode/python/python";
import "codemirror/mode/clike/clike";
import "codemirror/mode/go/go";
import "codemirror/mode/ruby/ruby";
import "codemirror/mode/rust/rust";
import "codemirror/addon/edit/closetag";
import "codemirror/addon/edit/closebrackets";
import "codemirror/addon/fold/foldcode";
import "codemirror/addon/fold/foldgutter";
import "codemirror/addon/fold/brace-fold";
import "codemirror/addon/fold/indent-fold";
import "codemirror/addon/fold/foldgutter.css";
import ACTIONS from "../Actions";
import {
  JUDGE0_CONFIG,
  LANGUAGE_OPTIONS,
  JUDGE0_STATUS,
} from "../config/judge0";
import "./codeEditor.css";

const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
  const editorRef = useRef(null);
  const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [executionTime, setExecutionTime] = useState(null);
  const [executionStatus, setExecutionStatus] = useState(null);

  // Initialize editor and socket listeners
  useEffect(() => {
    const socket = socketRef.current;
    let editor;

    // Initialize CodeMirror editor
    if (!editorRef.current) {
      editor = Codemirror.fromTextArea(
        document.getElementById("realtimeEditor"),
        {
          mode: selectedLanguage.mode,
          theme: "dracula",
          autoCloseTags: true,
          autoCloseBrackets: true,
          lineNumbers: true,
          lineWrapping: true,
          foldGutter: true,
          matchBrackets: true,
          indentUnit: 4,
          tabSize: 4,
          indentWithTabs: false,
        }
      );
      editorRef.current = editor;
      editor.setValue(selectedLanguage.template || "");

      // Handle local changes
      editor.on("change", (instance, changes) => {
        const { origin } = changes;
        const code = instance.getValue();
        onCodeChange(code);
        if (origin !== "setValue" && socket) {
          socket.emit(ACTIONS.CODE_CHANGE, { roomId, code });
        }
      });
    }

    // Socket event listeners
    if (socket) {
      const handleRemoteCodeChange = ({ code }) => {
        if (
          code !== null &&
          editorRef.current &&
          editorRef.current.getValue() !== code
        ) {
          const cursor = editorRef.current.getCursor();
          editorRef.current.setValue(code);
          editorRef.current.setCursor(cursor);
        }
      };

      const handleInputChange = ({ input }) => {
        setInput(input);
      };

      const handleLanguageChange = ({ language }) => {
        setSelectedLanguage(language);
        if (editorRef.current) {
          editorRef.current.setOption("mode", language.mode);
          const currentValue = editorRef.current.getValue();
          if (
            !currentValue.trim() ||
            LANGUAGE_OPTIONS.some((lang) => lang.template === currentValue)
          ) {
            editorRef.current.setValue(language.template || "");
          }
        }
      };

      const handleCodeOutput = ({ output, executionTime, status }) => {
        setOutput(output);
        setExecutionTime(executionTime);
        setExecutionStatus(status);
        setIsExecuting(false);
      };

      socket.on(ACTIONS.CODE_CHANGE, handleRemoteCodeChange);
      socket.on(ACTIONS.INPUT_CHANGE, handleInputChange);
      socket.on(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
      socket.on(ACTIONS.CODE_OUTPUT, handleCodeOutput);

      return () => {
        socket.off(ACTIONS.CODE_CHANGE, handleRemoteCodeChange);
        socket.off(ACTIONS.INPUT_CHANGE, handleInputChange);
        socket.off(ACTIONS.LANGUAGE_CHANGE, handleLanguageChange);
        socket.off(ACTIONS.CODE_OUTPUT, handleCodeOutput);
      };
    }

    return () => {
      if (editorRef.current) {
        editorRef.current.toTextArea();
        editorRef.current = null;
      }
    };
  }, [
    roomId,
    onCodeChange,
    socketRef,
    selectedLanguage.mode,
    selectedLanguage.template,
  ]); // Added selectedLanguage.template to dependencies

  const handleLanguageChange = useCallback(
    (language) => {
      setSelectedLanguage(language);
      if (editorRef.current) {
        editorRef.current.setOption("mode", language.mode);
        const currentValue = editorRef.current.getValue();
        if (
          !currentValue.trim() ||
          LANGUAGE_OPTIONS.some((lang) => lang.template === currentValue)
        ) {
          editorRef.current.setValue(language.template || "");
        }
      }
      socketRef.current?.emit(ACTIONS.LANGUAGE_CHANGE, { roomId, language });
    },
    [roomId, socketRef]
  );

  const handleInputChange = useCallback(
    (e) => {
      const newInput = e.target.value;
      setInput(newInput);
      socketRef.current?.emit(ACTIONS.INPUT_CHANGE, {
        roomId,
        input: newInput,
      });
    },
    [roomId, socketRef]
  );

  const pollForResult = useCallback(async (token) => {
    for (
      let attempts = 0;
      attempts < JUDGE0_CONFIG.MAX_POLLING_ATTEMPTS;
      attempts++
    ) {
      try {
        const response = await fetch(
          `${JUDGE0_CONFIG.API_URL}/submissions/${token}`,
          {
            headers: {
              "X-RapidAPI-Key": JUDGE0_CONFIG.RAPIDAPI_KEY,
              "X-RapidAPI-Host": JUDGE0_CONFIG.RAPIDAPI_HOST,
            },
          }
        );
        const data = await response.json();
        if (data.status?.id > 2) return data;
        await new Promise((resolve) =>
          setTimeout(resolve, JUDGE0_CONFIG.POLLING_INTERVAL)
        );
      } catch (error) {
        console.error("Polling error:", error);
      }
    }
    throw new Error("Execution timeout");
  }, []);

  const executeCode = useCallback(async () => {
    if (!editorRef.current) return;

    setIsExecuting(true);
    setOutput("Executing...");
    setExecutionTime(null);
    setExecutionStatus(null);

    const code = editorRef.current.getValue();
    const startTime = Date.now();

    try {
      const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-RapidAPI-Key": JUDGE0_CONFIG.RAPIDAPI_KEY,
          "X-RapidAPI-Host": JUDGE0_CONFIG.RAPIDAPI_HOST,
        },
        body: JSON.stringify({
          language_id: selectedLanguage.id,
          source_code: code,
          stdin: input,
        }),
      });

      const data = await response.json();

      if (data.token) {
        const result = await pollForResult(data.token);
        const executionTime = Date.now() - startTime;

        let outputText = result.stderr || result.stdout || "No output";
        let status = result.stderr
          ? result.status?.id || JUDGE0_STATUS.RUNTIME_ERROR
          : JUDGE0_STATUS.ACCEPTED;

        setOutput(outputText);
        setExecutionTime(executionTime);
        setExecutionStatus(status);
        setIsExecuting(false);

        socketRef.current?.emit(ACTIONS.CODE_OUTPUT, {
          roomId,
          output: outputText,
          executionTime,
          status,
        });
      }
    } catch (error) {
      setOutput(`Error: ${error.message}`);
      setExecutionStatus(JUDGE0_STATUS.INTERNAL_ERROR);
      setIsExecuting(false);
    }
  }, [input, roomId, selectedLanguage.id, socketRef, pollForResult]); // Added pollForResult to dependencies

  const getStatusMessage = useCallback((statusId) => {
    const statusMessages = {
      [JUDGE0_STATUS.ACCEPTED]: "✓ Execution successful",
      [JUDGE0_STATUS.COMPILATION_ERROR]: "✗ Compilation error",
      [JUDGE0_STATUS.RUNTIME_ERROR]: "✗ Runtime error",
      [JUDGE0_STATUS.TIME_LIMIT_EXCEEDED]: "⏱ Time limit exceeded",
      [JUDGE0_STATUS.MEMORY_LIMIT_EXCEEDED]: "💾 Memory limit exceeded",
      [JUDGE0_STATUS.WRONG_ANSWER]: "❌ Wrong answer",
    };
    return statusMessages[statusId] || "Execution completed";
  }, []);

  return (
    <div className="editor-container">
      <div className="editor-header">
        <div className="language-selector">
          <label htmlFor="language-select">Language: </label>
          <select
            id="language-select"
            value={selectedLanguage.id}
            onChange={(e) => {
              const language = LANGUAGE_OPTIONS.find(
                (lang) => lang.id === parseInt(e.target.value)
              );
              handleLanguageChange(language);
            }}
          >
            {LANGUAGE_OPTIONS.map((lang) => (
              <option key={lang.id} value={lang.id}>
                {lang.name}
              </option>
            ))}
          </select>
        </div>
        <button
          className="run-button"
          onClick={executeCode}
          disabled={isExecuting}
        >
          {isExecuting ? "Running..." : "Run Code"}
        </button>
      </div>

      <div className="editor-main">
        <div className="code-section">
          <div className="section-header">Code Editor</div>
          <textarea id="realtimeEditor" />
        </div>

        <div className="io-section">
          <div className="input-section">
            <div className="section-header">Input</div>
            <textarea
              value={input}
              onChange={handleInputChange}
              placeholder="Enter your input here..."
              className="input-textarea"
            />
          </div>

          <div className="output-section">
            <div className="section-header">
              Output
              {executionTime && (
                <span className="execution-time">({executionTime}ms)</span>
              )}
            </div>
            <div className="output-display">
              {executionStatus && (
                <div className={`status-message status-${executionStatus}`}>
                  {getStatusMessage(executionStatus)}
                </div>
              )}
              <pre>{output}</pre>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CodeEditor;
