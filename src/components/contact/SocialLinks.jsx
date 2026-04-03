import React, { useEffect, useRef, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

const socialProtocols = [
    {
        id: 1,
        name: 'linkedin',
        command: '--connect',
        url: 'https://www.linkedin.com/in/kvnrs23',
        description: 'Professional Network Protocol'
    },
    {
        id: 2,
        name: 'github',
        command: '--view-repos',
        url: 'https://github.com/kvnrajasekhar',
        description: 'Source Code Repository'
    },
    {
        id: 3,
        name: 'leetcode',
        command: '--check-stats',
        url: 'https://leetcode.com/u/vnrajasekhar',
        description: 'Algorithm Performance Stats'
    },
    {
        id: 4,
        name: 'medium',
        command: '--read-insights',
        url: 'https://medium.com/@kanagalavnrajasekhar',
        description: 'Technical Articles Database'
    },
    {
        id: 5,
        name: 'geeksforgeeks',
        command: '--check-stats',
        url: 'https://www.geeksforgeeks.org/profile/vnrajasekhar',
        description: 'Learning Progress Metrics'
    }
];

function Typewriter({ text, onComplete, speed = 50 }) {
    const [displayedText, setDisplayedText] = useState('');
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (currentIndex < text.length) {
            const timeout = setTimeout(() => {
                setDisplayedText(prev => prev + text[currentIndex]);
                setCurrentIndex(prev => prev + 1);
            }, speed);
            return () => clearTimeout(timeout);
        } else if (onComplete) {
            onComplete();
        }
    }, [currentIndex, text, onComplete, speed]);

    return <span>{displayedText}</span>;
}

function BlinkingCursor() {
    return (
        <motion.span
            animate={{ opacity: [1, 0, 1] }}
            transition={{ duration: 1, repeat: Infinity }}
            className="text-green-400 font-mono"
        >
            _
        </motion.span>
    );
}

export default function SocialLinks() {
    const [bootSequence, setBootSequence] = useState('handshake');
    const [currentLine, setCurrentLine] = useState(0);
    const [inputValue, setInputValue] = useState('');
    const [terminalHistory, setTerminalHistory] = useState([]);
    const [commandHistory, setCommandHistory] = useState([]);
    const [isConnecting, setIsConnecting] = useState(false);
    const [selectedProtocol, setSelectedProtocol] = useState(null);
    const [currentDirectory] = useState('social-links');
    const terminalRef = useRef(null);
    const inputRef = useRef(null);

    const bootLines = [
        { text: '> establishing_handshake...', status: 'processing' },
        { text: '> establishing_handshake...', status: 'success' },
        { text: '> fetching_social_protocols...', status: 'processing' },
        { text: '> fetching_social_protocols...', status: 'success' },
        { text: '> [5 FOUND]', status: 'info' },
        { text: '', status: 'space' },
        { text: 'RAJ SECURE TERMINAL v2.0.1', status: 'header' },
        { text: 'Type "raj --help" for available commands', status: 'info' },
        { text: '', status: 'space' }
    ];

    useEffect(() => {
        if (bootSequence === 'handshake' && currentLine < bootLines.length) {
            const timer = setTimeout(() => {
                setTerminalHistory(prev => [...prev, { ...bootLines[currentLine], id: Date.now() }]);
                setCurrentLine(prev => prev + 1);
            }, currentLine === 0 ? 500 : 300);
            return () => clearTimeout(timer);
        } else if (currentLine >= bootLines.length && bootSequence === 'handshake') {
            setBootSequence('protocols');
        }
    }, [currentLine, bootSequence, bootLines.length]);

    useEffect(() => {
        if (bootSequence === 'protocols' && terminalRef.current) {
            terminalRef.current.scrollTop = terminalRef.current.scrollHeight;
        }
    }, [terminalHistory, bootSequence]);

    const handleProtocolClick = useCallback((protocol) => {
        if (isConnecting) return;

        setSelectedProtocol(protocol);
        setIsConnecting(true);

        setTerminalHistory(prev => [
            ...prev,
            { text: `> connect ${protocol.id}`, status: 'command', id: Date.now() },
            { text: `Initializing connection to ${protocol.name}...`, status: 'processing', id: Date.now() + 1 }
        ]);

        setTimeout(() => {
            setTerminalHistory(prev => [
                ...prev,
                { text: `Authenticating with ${protocol.name}.local...`, status: 'processing', id: Date.now() + 2 },
                { text: 'Secure tunnel established.', status: 'success', id: Date.now() + 3 },
                { text: `Redirecting to Secure_Node: ${protocol.name.toUpperCase()}.local...`, status: 'info', id: Date.now() + 4 }
            ]);

            setTimeout(() => {
                window.open(protocol.url, '_blank', 'noopener,noreferrer');
                setTerminalHistory(prev => [
                    ...prev,
                    { text: `Connection to ${protocol.name} established successfully.`, status: 'success', id: Date.now() + 5 },
                    { text: '', status: 'space', id: Date.now() + 6 }
                ]);
                setIsConnecting(false);
                setSelectedProtocol(null);
            }, 2000);
        }, 1500);
    }, [isConnecting]);

    const handleInputSubmit = useCallback((e) => {
        e.preventDefault();
        if (isConnecting || !inputValue.trim()) return;

        const command = inputValue.trim().toLowerCase();
        setTerminalHistory(prev => [...prev, { text: `> ${command}`, status: 'command', id: Date.now() }]);
        setCommandHistory(prev => [...prev, command]);

        if (command.startsWith('raj ')) {
            const rajCommand = command.substring(4);

            if (rajCommand === '--help') {
                setTerminalHistory(prev => [
                    ...prev,
                    { text: '', status: 'space', id: Date.now() + 1 },
                    { text: 'RAJ SECURE TERMINAL - Available Commands:', status: 'header', id: Date.now() + 2 },
                    { text: '  raj --help              Show this help message', status: 'info', id: Date.now() + 3 },
                    { text: '  raj --log               Show command history', status: 'info', id: Date.now() + 4 },
                    { text: '  raj --desc <protocol>    Show protocol description', status: 'info', id: Date.now() + 5 },
                    { text: '  raj --status            Show system status', status: 'info', id: Date.now() + 6 },
                    { text: '  raj --clear             Clear terminal screen', status: 'info', id: Date.now() + 7 },
                    { text: '  raj --about             About this terminal', status: 'info', id: Date.now() + 8 },
                    { text: '  connect <num>           Connect to social protocol', status: 'info', id: Date.now() + 9 },
                    { text: '', status: 'space', id: Date.now() + 10 }
                ]);
            } else if (rajCommand === '--log') {
                if (commandHistory.length === 0) {
                    setTerminalHistory(prev => [
                        ...prev,
                        { text: 'No command history available.', status: 'info', id: Date.now() + 1 }
                    ]);
                } else {
                    setTerminalHistory(prev => [
                        ...prev,
                        { text: '', status: 'space', id: Date.now() + 1 },
                        { text: 'Command History:', status: 'header', id: Date.now() + 2 },
                        ...commandHistory.slice(-10).map((cmd, index) => ({
                            text: `  ${index + 1}. ${cmd}`,
                            status: 'info',
                            id: Date.now() + 3 + index
                        })),
                        { text: '', status: 'space', id: Date.now() + 20 }
                    ]);
                }
            } else if (rajCommand.startsWith('--desc ')) {
                const protocolName = rajCommand.substring(7);
                const protocol = socialProtocols.find(p => p.name === protocolName);

                if (protocol) {
                    setTerminalHistory(prev => [
                        ...prev,
                        { text: '', status: 'space', id: Date.now() + 1 },
                        { text: `Protocol: ${protocol.name.toUpperCase()}`, status: 'header', id: Date.now() + 2 },
                        { text: `Description: ${protocol.description}`, status: 'info', id: Date.now() + 3 },
                        { text: `Command: ${protocol.command}`, status: 'info', id: Date.now() + 4 },
                        { text: `Status: Active`, status: 'success', id: Date.now() + 5 },
                        { text: `Connection: Secure`, status: 'success', id: Date.now() + 6 },
                        { text: '', status: 'space', id: Date.now() + 7 }
                    ]);
                } else {
                    setTerminalHistory(prev => [
                        ...prev,
                        { text: `Error: Protocol '${protocolName}' not found.`, status: 'error', id: Date.now() + 1 },
                        { text: `Available protocols: ${socialProtocols.map(p => p.name).join(', ')}`, status: 'info', id: Date.now() + 2 }
                    ]);
                }
            } else if (rajCommand === '--status') {
                setTerminalHistory(prev => [
                    ...prev,
                    { text: '', status: 'space', id: Date.now() + 1 },
                    { text: 'SYSTEM STATUS:', status: 'header', id: Date.now() + 2 },
                    { text: `  Terminal: v2.0.1 - Operational`, status: 'success', id: Date.now() + 3 },
                    { text: `  Protocols: ${socialProtocols.length} - Active`, status: 'success', id: Date.now() + 4 },
                    { text: `  Security: ENCRYPTED`, status: 'success', id: Date.now() + 5 },
                    { text: `  Connections: ${commandHistory.filter(c => c.startsWith('connect')).length}`, status: 'info', id: Date.now() + 6 },
                    { text: `  Uptime: ${Math.floor(Date.now() / 1000)}s`, status: 'info', id: Date.now() + 7 },
                    { text: '', status: 'space', id: Date.now() + 8 }
                ]);
            } else if (rajCommand === '--clear') {
                setTerminalHistory([]);
            } else if (rajCommand === '--about') {
                setTerminalHistory(prev => [
                    ...prev,
                    { text: '', status: 'space', id: Date.now() + 1 },
                    { text: 'RAJ SECURE TERMINAL v2.0.1', status: 'header', id: Date.now() + 2 },
                    { text: 'A secure terminal interface for social protocol connections.', status: 'info', id: Date.now() + 3 },
                    { text: 'Designed for developers who appreciate the command line.', status: 'info', id: Date.now() + 4 },
                    { text: '', status: 'space', id: Date.now() + 5 },
                    { text: 'Features:', status: 'header', id: Date.now() + 6 },
                    { text: '  • Secure protocol connections', status: 'info', id: Date.now() + 7 },
                    { text: '  • Command history tracking', status: 'info', id: Date.now() + 8 },
                    { text: '  • Real-time authentication', status: 'info', id: Date.now() + 9 },
                    { text: '  • Encrypted communications', status: 'info', id: Date.now() + 10 },
                    { text: '', status: 'space', id: Date.now() + 11 }
                ]);
            } else {
                setTerminalHistory(prev => [
                    ...prev,
                    { text: `Error: Unknown raj command '${rajCommand}'. Type 'raj --help' for available commands.`, status: 'error', id: Date.now() + 1 }
                ]);
            }
        } else {
            const connectMatch = command.match(/^connect\s+(\d+)$/);
            if (connectMatch) {
                const protocolId = parseInt(connectMatch[1]);
                const protocol = socialProtocols.find(p => p.id === protocolId);

                if (protocol) {
                    handleProtocolClick(protocol);
                } else {
                    setTerminalHistory(prev => [
                        ...prev,
                        { text: `Error: Protocol ${protocolId} not found. Available protocols: 1-${socialProtocols.length}`, status: 'error', id: Date.now() + 1 }
                    ]);
                }
            } else {
                setTerminalHistory(prev => [
                    ...prev,
                    { text: `Error: Unknown command '${command}'. Type 'raj --help' for available commands.`, status: 'error', id: Date.now() + 1 }
                ]);
            }
        }

        setInputValue('');
    }, [inputValue, isConnecting, handleProtocolClick, commandHistory, socialProtocols]);

    const getStatusColor = (status) => {
        switch (status) {
            case 'success': return 'text-green-500 dark:text-green-400';
            case 'error': return 'text-red-500 dark:text-red-400';
            case 'processing': return 'text-yellow-500 dark:text-yellow-400';
            case 'info': return 'text-blue-500 dark:text-blue-400';
            case 'command': return 'text-green-500 dark:text-green-400';
            case 'header': return 'text-gray-500 dark:text-gray-400';
            default: return 'text-gray-600 dark:text-gray-300';
        }
    };

    const formatProtocolLine = (protocol) => {
        const isSelected = selectedProtocol?.id === protocol.id;
        return (
            <motion.div
                key={protocol.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: protocol.id * 0.1 }}
                className={`font-mono text-sm cursor-pointer transition-all duration-200 ${isSelected ? 'text-cyan-300 bg-gray-900 px-2 py-1 rounded' : 'text-gray-300 hover:text-cyan-400'
                    } ${isConnecting ? 'pointer-events-none opacity-50' : ''}`}
                onClick={() => handleProtocolClick(protocol)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
            >
                <span className="text-gray-500">[{protocol.id}]</span>
                <span className="ml-2">{protocol.name}</span>
                <span className="text-gray-500 dark:text-gray-500 ml-2 text-xs"># {protocol.description}</span>
            </motion.div>
        );
    };

    return (
        <div className="min-h-screen bg-white dark:bg-black text-gray-800 dark:text-green-400 font-mono overflow-hidden">
            {/* Terminal Header */}
            <div className="border-b border-gray-300 dark:border-gray-800 px-4 py-2 mt-24">
                <div className="flex items-center space-x-2">
                    <div className="w-3 h-3 rounded-full bg-red-500"></div>
                    <div className="w-3 h-3 rounded-full bg-yellow-500"></div>
                    <div className="w-3 h-3 rounded-full bg-green-500"></div>
                    <span className="ml-4 text-gray-500 dark:text-gray-500 text-xs">bash --secure-mode</span>
                </div>
            </div>

            {/* Terminal Content */}
            <div
                ref={terminalRef}
                className="h-screen overflow-y-auto p-4 pb-32 scrollbar-hide"
                onClick={() => inputRef.current?.focus()}
                style={{
                    scrollbarWidth: 'none',
                    msOverflowStyle: 'none',
                    scrollbarColor: 'transparent'
                }}
            >
                <AnimatePresence>
                    {terminalHistory.map((line) => (
                        <motion.div
                            key={line.id}
                            initial={{ opacity: 0, y: 10 }}
                            animate={{ opacity: 1, y: 0 }}
                            exit={{ opacity: 0, y: -10 }}
                            transition={{ duration: 0.2 }}
                            className={`${getStatusColor(line.status)} mb-1 leading-relaxed`}
                        >
                            {line.status === 'processing' && (
                                <Typewriter
                                    text={line.text}
                                    speed={30}
                                    onComplete={() => {
                                        if (line.text.includes('handshake') || line.text.includes('fetching')) {
                                            setTimeout(() => {
                                                setTerminalHistory(prev =>
                                                    prev.map(h => h.id === line.id
                                                        ? { ...h, text: line.text + ' [OK]', status: 'success' }
                                                        : h
                                                    )
                                                );
                                            }, 500);
                                        }
                                    }}
                                />
                            )}
                            {line.status !== 'processing' && line.text}
                        </motion.div>
                    ))}
                </AnimatePresence>

                {/* Protocol List */}
                {bootSequence === 'protocols' && (
                    <div className="mt-4 space-y-2">
                        <div className="text-gray-500 dark:text-gray-400 text-sm">
                            Available Social Protocols:
                        </div>
                        {socialProtocols.map(formatProtocolLine)}
                        <div className="mt-6 text-gray-500 dark:text-gray-500 text-sm">
                            <Typewriter
                                text="type 'connect <num>' or click a protocol to initialize."
                                speed={40}
                            />
                            <br />
                            <Typewriter
                                text="type 'raj --help' for more information"
                                speed={40}
                            />
                            <BlinkingCursor />
                        </div>
                    </div>
                )}

                {/* Input Line */}
                {bootSequence === 'protocols' && (
                    <div className="mt-4">
                        <form onSubmit={handleInputSubmit} className="flex items-center">
                            <span className="text-gray-600 dark:text-green-400 mr-2">C:/sociallinks $</span>
                            <input
                                ref={inputRef}
                                type="text"
                                value={inputValue}
                                onChange={(e) => setInputValue(e.target.value)}
                                disabled={isConnecting}
                                className="flex-1 bg-transparent outline-none text-gray-800 dark:text-green-400 placeholder-gray-500 dark:placeholder-gray-600"
                                placeholder={isConnecting ? 'connecting...' : 'connect <num>'}
                                autoFocus
                            />
                            {!isConnecting && <BlinkingCursor />}
                        </form>
                    </div>
                )}
            </div>

            {/* Terminal Footer */}
            <div className="fixed bottom-0 left-0 right-0 border-t border-gray-300 dark:border-gray-800 px-4 py-2 bg-white/90 dark:bg-black/90 backdrop-blur">
                <div className="flex justify-between items-center text-xs text-gray-500 dark:text-gray-600">
                    <span>SECURE TERMINAL v2.0.1</span>
                    <span>ENCRYPTED CONNECTION | 5 PROTOCOLS ACTIVE</span>
                </div>
            </div>

            {/* Custom Scrollbar Styles */}
            <style jsx>{`
            .scrollbar-hide::-webkit-scrollbar {
                display: none;
            }
            .scrollbar-hide {
                -ms-overflow-style: none;
                scrollbar-width: none;
            }
            .scrollbar-hide::-webkit-scrollbar-track {
                background: transparent;
            }
            .scrollbar-hide::-webkit-scrollbar-thumb {
                background: transparent;
            }
        `}</style>
        </div>
    );
}
