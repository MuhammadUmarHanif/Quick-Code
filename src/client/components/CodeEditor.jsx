import React, { useEffect, useRef, useState } from 'react';
import Codemirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/theme/dracula.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/mode/python/python';
import 'codemirror/mode/clike/clike';
import 'codemirror/mode/go/go';
import 'codemirror/mode/ruby/ruby';
import 'codemirror/mode/rust/rust';
import 'codemirror/addon/edit/closetag';
import 'codemirror/addon/edit/closebrackets';
import 'codemirror/addon/fold/foldcode';
import 'codemirror/addon/fold/foldgutter';
import 'codemirror/addon/fold/brace-fold';
import 'codemirror/addon/fold/indent-fold';
import 'codemirror/addon/fold/foldgutter.css';
import ACTIONS from '../Actions';
import { JUDGE0_CONFIG, LANGUAGE_OPTIONS, JUDGE0_STATUS } from '../config/judge0';
import './codeEditor.css';


const CodeEditor = ({ socketRef, roomId, onCodeChange }) => {
    const editorRef = useRef(null);
    const [selectedLanguage, setSelectedLanguage] = useState(LANGUAGE_OPTIONS[0]);
    const [input, setInput] = useState('');
    const [output, setOutput] = useState('');
    const [isExecuting, setIsExecuting] = useState(false);
    const [executionTime, setExecutionTime] = useState(null);
    const [executionStatus, setExecutionStatus] = useState(null);
    const username = localStorage.getItem('username') || 'User';

    useEffect(() => {
        let editor;
        function init() {
            if (!editorRef.current) {
                editor = Codemirror.fromTextArea(
                    document.getElementById('realtimeEditor'),
                    {
                        mode: selectedLanguage.mode,
                        theme: 'dracula',
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
                editor.setSize(null, '100%');
                editor.setValue(selectedLanguage.template);
                editor.on('change', (instance, changes) => {
                    const { origin } = changes;
                    const code = instance.getValue();
                    onCodeChange(code);
                    if (origin !== 'setValue') {
                        socketRef.current.emit(ACTIONS.CODE_CHANGE, {
                            roomId,
                            code,
                        });
                    }
                });
            }
        }
        init();
        return () => {
            if (editorRef.current) {
                editorRef.current.toTextArea();
                editorRef.current = null;
            }
        };
    }, [onCodeChange, socketRef.current, roomId, selectedLanguage]);

    useEffect(() => {
        if (editorRef.current) {
            editorRef.current.setOption('mode', selectedLanguage.mode);
            const currentValue = editorRef.current.getValue();
            const isDefaultTemplate = LANGUAGE_OPTIONS.some(lang => 
                lang.template === currentValue
            );
            if (isDefaultTemplate || !currentValue.trim()) {
                editorRef.current.setValue(selectedLanguage.template);
            }
        }
    }, [selectedLanguage]);

    useEffect(() => {
        if (socketRef.current) {
            socketRef.current.on(ACTIONS.CODE_CHANGE, ({ code }) => {
                if (code !== null && editorRef.current) {
                    editorRef.current.setValue(code);
                }
            });

            socketRef.current.on(ACTIONS.INPUT_CHANGE, ({ input }) => {
                setInput(input);
            });

            socketRef.current.on(ACTIONS.LANGUAGE_CHANGE, ({ language }) => {
                setSelectedLanguage(language);
                if (editorRef.current) {
                    editorRef.current.setOption('mode', language.mode);
                    // Only set template if editor is empty or has default template
                    const currentValue = editorRef.current.getValue();
                    const isDefaultTemplate = LANGUAGE_OPTIONS.some(lang => 
                        lang.template === currentValue
                    );
                    if (isDefaultTemplate || !currentValue.trim()) {
                        editorRef.current.setValue(language.template);
                    }
                }
            });

            // IMPORTANT: This ensures that when ANY user clicks 'Run Code',
            // the output is broadcast to all users and everyone's output panel updates automatically.
            socketRef.current.on(ACTIONS.CODE_OUTPUT, ({ output, executionTime, status }) => {
                setOutput(output);
                setExecutionTime(executionTime);
                setExecutionStatus(status);
                setIsExecuting(false);
            });
        }

        return () => {
            if (socketRef.current) {
                socketRef.current.off(ACTIONS.CODE_CHANGE);
                socketRef.current.off(ACTIONS.INPUT_CHANGE);
                socketRef.current.off(ACTIONS.LANGUAGE_CHANGE);
                socketRef.current.off(ACTIONS.CODE_OUTPUT);
            }
        };
    }, [socketRef.current, roomId]); // Include dependencies to ensure proper re-initialization

    const handleLanguageChange = (language) => {
        setSelectedLanguage(language);
        if (editorRef.current) {
            editorRef.current.setOption('mode', language.mode);
            // Only set template if editor is empty or has default template
            const currentValue = editorRef.current.getValue();
            const isDefaultTemplate = LANGUAGE_OPTIONS.some(lang => 
                lang.template === currentValue
            );
            if (isDefaultTemplate || !currentValue.trim()) {
                editorRef.current.setValue(language.template);
            }
        }
        socketRef.current.emit(ACTIONS.LANGUAGE_CHANGE, {
            roomId,
            language,
        });
    };

    const handleInputChange = (e) => {
        const newInput = e.target.value;
        setInput(newInput);
        socketRef.current.emit(ACTIONS.INPUT_CHANGE, {
            roomId,
            input: newInput,
        });
    };

    const getStatusMessage = (statusId) => {
        switch (statusId) {
            case JUDGE0_STATUS.ACCEPTED:
                return '✓ Execution successful';
            case JUDGE0_STATUS.COMPILATION_ERROR:
                return '✗ Compilation error';
            case JUDGE0_STATUS.RUNTIME_ERROR:
                return '✗ Runtime error';
            case JUDGE0_STATUS.TIME_LIMIT_EXCEEDED:
                return '⏱ Time limit exceeded';
            case JUDGE0_STATUS.MEMORY_LIMIT_EXCEEDED:
                return '💾 Memory limit exceeded';
            case JUDGE0_STATUS.WRONG_ANSWER:
                return '❌ Wrong answer';
            default:
                return 'Execution completed';
        }
    };

    const executeCode = async () => {
        if (!editorRef.current) return;

        setIsExecuting(true);
        setOutput('Executing...');
        setExecutionTime(null);
        setExecutionStatus(null);

        const code = editorRef.current.getValue();
        const startTime = Date.now();

        try {
            const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'X-RapidAPI-Key': JUDGE0_CONFIG.RAPIDAPI_KEY,
                    'X-RapidAPI-Host': JUDGE0_CONFIG.RAPIDAPI_HOST
                },
                body: JSON.stringify({
                    language_id: selectedLanguage.id,
                    source_code: code,
                    stdin: input
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            if (data.token) {
                // Poll for results
                const result = await pollForResult(data.token);
                const executionTime = Date.now() - startTime;
                
                let outputText = '';
                let status = JUDGE0_STATUS.ACCEPTED;

                if (result.stderr) {
                    outputText = result.stderr;
                    status = result.status?.id || JUDGE0_STATUS.RUNTIME_ERROR;
                } else if (result.stdout) {
                    outputText = result.stdout;
                } else {
                    outputText = 'No output';
                }

                setOutput(outputText);
                setExecutionTime(executionTime);
                setExecutionStatus(status);
                setIsExecuting(false);

                // Emit output to other users
                socketRef.current.emit(ACTIONS.CODE_OUTPUT, {
                    roomId,
                    output: outputText,
                    executionTime,
                    status,
                });
            } else {
                throw new Error('No token received from Judge0 API');
            }
        } catch (error) {
            console.error('Execution error:', error);
            setOutput(`Error: ${error.message}`);
            setExecutionStatus(JUDGE0_STATUS.INTERNAL_ERROR);
            setIsExecuting(false);
        }
    };

    const pollForResult = async (token) => {
        let attempts = 0;

        while (attempts < JUDGE0_CONFIG.MAX_POLLING_ATTEMPTS) {
            try {
                const response = await fetch(`${JUDGE0_CONFIG.API_URL}/submissions/${token}`, {
                    headers: {
                        'X-RapidAPI-Key': JUDGE0_CONFIG.RAPIDAPI_KEY,
                        'X-RapidAPI-Host': JUDGE0_CONFIG.RAPIDAPI_HOST
                    }
                });

                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }

                const data = await response.json();

                if (data.status && data.status.id > 2) {
                    return data;
                }

                await new Promise(resolve => setTimeout(resolve, JUDGE0_CONFIG.POLLING_INTERVAL));
                attempts++;
            } catch (error) {
                console.error('Polling error:', error);
                attempts++;
            }
        }

        throw new Error('Execution timeout');
    };

    return (
        <div className="editor-container">
            <div className="editor-header">
                <div className="language-selector">
                    <label htmlFor="language-select">Language: </label>
                    <select
                        id="language-select"
                        value={selectedLanguage.id}
                        onChange={(e) => {
                            const language = LANGUAGE_OPTIONS.find(lang => lang.id === parseInt(e.target.value));
                            handleLanguageChange(language);
                        }}
                    >
                        {LANGUAGE_OPTIONS.map(lang => (
                            <option key={lang.id} value={lang.id}>
                                {lang.name}
                            </option>
                        ))}
                    </select>
                </div>
                <div className="button-group">
                    <button 
                        className="run-button"
                        onClick={executeCode}
                        disabled={isExecuting}
                    >
                        {isExecuting ? 'Running...' : 'Run Code'}
                    </button>
                </div>
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
                                <span className="execution-time">
                                    ({executionTime}ms)
                                </span>
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