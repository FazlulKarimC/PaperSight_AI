"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useSWR from 'swr';
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { Button } from "@/components/ui/button";
import {
    MessageCircle,
    Send,
    X,
    Bot,
    User,
    Loader2,
    Sparkles,
    Trash2,
    ChevronDown,
    ChevronRight,
    Database,
} from "lucide-react";

// ── Types ─────────────────────────────────────────────────────────

interface RAGSource {
    chunkText: string;
    chunkIndex: number;
    similarity: number;
}

interface ChatMessage {
    id: string;
    role: "user" | "model";
    content: string;
    createdAt?: string;
    sources?: RAGSource[];
}

interface ChatPanelProps {
    summaryId: string;
    summaryTitle: string;
}

// ── RAG Pipeline Stages ───────────────────────────────────────────

const RAG_STAGES = [
    "Retrieving context…",
    "Ranking passages…",
    "Generating response…",
] as const;

function useRAGStageAnimation(isActive: boolean) {
    const [stageIndex, setStageIndex] = useState(0);

    useEffect(() => {
        if (!isActive) {
            setStageIndex(0);
            return;
        }
        const timers = [
            setTimeout(() => setStageIndex(1), 1200),
            setTimeout(() => setStageIndex(2), 2800),
        ];
        return () => timers.forEach(clearTimeout);
    }, [isActive]);

    return isActive ? RAG_STAGES[stageIndex] : null;
}

// ── Markdown Rendering ────────────────────────────────────────────

function renderMessageContent(content: string) {
    return (
        <ReactMarkdown
            remarkPlugins={[remarkGfm]}
            components={{
                h1: ({ children }) => (
                    <h2 className="heading-ui text-base mt-3 mb-1.5">{children}</h2>
                ),
                h2: ({ children }) => (
                    <h3 className="heading-ui text-sm mt-2 mb-1">{children}</h3>
                ),
                h3: ({ children }) => (
                    <h4 className="heading-ui text-sm mt-2 mb-1">{children}</h4>
                ),
                p: ({ children }) => (
                    <p className="text-sm leading-relaxed my-1">{children}</p>
                ),
                ul: ({ children }) => (
                    <ul className="list-disc list-inside space-y-1 my-1">{children}</ul>
                ),
                ol: ({ children }) => (
                    <ol className="list-decimal list-inside space-y-1 my-1">{children}</ol>
                ),
                li: ({ children }) => (
                    <li className="text-sm">{children}</li>
                ),
                strong: ({ children }) => (
                    <strong className="font-semibold">{children}</strong>
                ),
                em: ({ children }) => <em>{children}</em>,
                code: ({ children, className }) => {
                    const isBlock = className?.includes("language-");
                    if (isBlock) {
                        return (
                            <pre className="bg-secondary rounded-lg p-3 my-2 overflow-x-auto">
                                <code className="text-xs font-mono text-accent">{children}</code>
                            </pre>
                        );
                    }
                    return (
                        <code className="px-1.5 py-0.5 rounded bg-secondary text-accent text-xs font-mono">
                            {children}
                        </code>
                    );
                },
                a: ({ href, children }) => (
                    <a href={href} target="_blank" rel="noopener noreferrer" className="text-accent underline underline-offset-2 hover:text-accent/80 transition-colors">
                        {children}
                    </a>
                ),
                blockquote: ({ children }) => (
                    <blockquote className="border-l-2 border-accent/40 pl-3 my-2 text-muted-foreground italic">
                        {children}
                    </blockquote>
                ),
            }}
        >
            {content}
        </ReactMarkdown>
    );
}

// ── Source Citation Card ──────────────────────────────────────────

function SourceCitationCard({ source, index }: { source: RAGSource; index: number }) {
    const excerpt = source.chunkText.length > 180
        ? source.chunkText.slice(0, 180) + "…"
        : source.chunkText;
    const similarityPercent = Math.round(source.similarity * 100);

    return (
        <div
            className="source-card source-card-enter"
            style={{ animationDelay: `${index * 50}ms` }}
        >
            <div className="flex items-center justify-between mb-1.5">
                <span className="mono-label" style={{ fontSize: '10px' }}>
                    Chunk {source.chunkIndex + 1}
                </span>
                <span className="mono-label" style={{ fontSize: '10px', color: 'oklch(0.78 0.16 55)' }}>
                    {similarityPercent}% match
                </span>
            </div>
            <p className="text-xs leading-relaxed text-muted-foreground">
                {excerpt}
            </p>
        </div>
    );
}

// ── Sources Expandable Section ───────────────────────────────────

function SourcesSection({ sources }: { sources: RAGSource[] }) {
    const [isExpanded, setIsExpanded] = useState(false);

    if (!sources || sources.length === 0) return null;

    return (
        <div className="mt-2">
            <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-accent transition-colors duration-150"
            >
                {isExpanded ? (
                    <ChevronDown className="h-3 w-3" />
                ) : (
                    <ChevronRight className="h-3 w-3" />
                )}
                <Database className="h-3 w-3" />
                <span className="font-medium">{sources.length} source{sources.length !== 1 ? 's' : ''} used</span>
            </button>
            <AnimatePresence>
                {isExpanded && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                        className="overflow-hidden"
                    >
                        <div className="space-y-2 mt-2">
                            {sources.map((source, i) => (
                                <SourceCitationCard key={i} source={source} index={i} />
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
}

// ── Chat Panel ─────────────────────────────────────────────────

export function ChatPanel({ summaryId, summaryTitle }: ChatPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [showJumpToBottom, setShowJumpToBottom] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const historyLoadedRef = useRef(false);

    // RAG pipeline stage animation — purely frontend-driven timing
    const [isRetrieving, setIsRetrieving] = useState(false);
    const ragStageText = useRAGStageAnimation(isRetrieving);

    // Auto-scroll to bottom
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

    // Track scroll position for Jump to Bottom button
    useEffect(() => {
        const container = chatContainerRef.current;
        if (!container) return;

        const handleScroll = () => {
            const { scrollTop, scrollHeight, clientHeight } = container;
            setShowJumpToBottom(scrollHeight - scrollTop - clientHeight > 100);
        };

        container.addEventListener("scroll", handleScroll, { passive: true });
        return () => container.removeEventListener("scroll", handleScroll);
    }, [isOpen]);

    const { isLoading: isLoadingHistory } = useSWR(
        (isOpen && !historyLoadedRef.current) ? `/api/chat?summaryId=${summaryId}` : null,
        (url: string) => fetch(url).then(res => res.json()),
        {
            onSuccess: (data: { messages?: Array<{ id: string; role: string; content: string; createdAt: string }> }) => {
                historyLoadedRef.current = true;
                if (data?.messages) {
                    setMessages(
                        data.messages.map((m) => ({
                            ...m,
                            role: m.role as "user" | "model",
                        }))
                    );
                }
            },
            revalidateOnFocus: false,
            revalidateIfStale: false
        }
    );

    // Focus input when panel opens
    useEffect(() => {
        if (isOpen) {
            setTimeout(() => inputRef.current?.focus(), 300);
        }
    }, [isOpen]);

    const handleSend = useCallback(async () => {
        const trimmedInput = input.trim();
        if (!trimmedInput) return;

        let historySnapshot: { role: string; content: string }[] = [];
        setMessages(prev => {
            historySnapshot = prev.slice(-6).map(m => ({ role: m.role, content: m.content }));
            return [...prev, { id: `user-${Date.now()}`, role: 'user' as const, content: trimmedInput }];
        });
        setInput("");
        setIsStreaming(true);
        setIsRetrieving(true);

        const assistantId = `assistant-${Date.now()}`;
        setMessages((prev) => [...prev, { id: assistantId, role: "model" as const, content: "" }]);

        try {
            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summaryId,
                    message: trimmedInput,
                    history: historySnapshot,
                }),
            });

            if (!res.ok) {
                const errorBody = await res.json().catch(() => ({ error: "Chat error" }));
                throw new Error(errorBody.error || `Server error: ${res.status}`);
            }

            const reader = res.body?.getReader();
            if (!reader) throw new Error("No response stream");

            const decoder = new TextDecoder();
            let buffer = "";
            let fullText = "";

            const processEvent = (event: string) => {
                const line = event.trim();
                if (!line.startsWith("data: ")) return;
                let data;
                try { data = JSON.parse(line.slice(6)); } catch { return; }
                switch (data.type) {
                    case "sources":
                        // Store sources on the assistant message
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId ? { ...m, sources: data.sources } : m
                            )
                        );
                        // Once sources arrive, the retrieval phase is done
                        setIsRetrieving(false);
                        break;
                    case "chunk":
                        fullText += data.text;
                        setMessages((prev) =>
                            prev.map((m) =>
                                m.id === assistantId ? { ...m, content: fullText } : m
                            )
                        );
                        break;
                    case "error":
                        throw new Error(data.error);
                    case "done":
                        break;
                }
            };

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split("\n\n");
                buffer = events.pop() ?? "";

                for (const event of events) {
                    processEvent(event);
                }
            }

            if (buffer.trim()) {
                processEvent(buffer);
            }
        } catch (err) {
            const errorMsg =
                err instanceof Error ? err.message : "Something went wrong";
            setMessages((prev) =>
                prev.map((m) =>
                    m.id === assistantId
                        ? { ...m, content: `❌ Error: ${errorMsg}` }
                        : m
                )
            );
        } finally {
            setIsStreaming(false);
            setIsRetrieving(false);
        }
    }, [input, summaryId]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function clearChat() {
        setMessages([]);
    }

    const suggestedQuestions = [
        "What are the key findings?",
        "Summarize the methodology",
        "What are the limitations?",
        "Explain the main conclusions",
    ];

    return (
        <>
            {/* Floating toggle button */}
            <AnimatePresence>
                {!isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50"
                        initial={{ scale: 0, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        exit={{ scale: 0, opacity: 0 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/15 btn-editorial"
                            id="chat-toggle-button"
                        >
                            <MessageCircle className="h-6 w-6" />
                        </Button>
                        {/* Pulse ring */}
                        <span className="absolute inset-0 rounded-full animate-ping bg-accent/20 pointer-events-none" />
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Chat panel */}
            <AnimatePresence>
                {isOpen && (
                    <motion.div
                        className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-3rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl border border-border overflow-hidden"
                        style={{
                            background: "oklch(0.14 0.01 260 / 0.97)",
                            backdropFilter: "blur(20px) saturate(1.3)",
                            WebkitBackdropFilter: "blur(20px) saturate(1.3)",
                            boxShadow:
                                "0 25px 50px -12px oklch(0 0 0 / 0.5), inset 0 1px 0 oklch(1 0 0 / 0.03), 0 0 30px oklch(0.78 0.16 55 / 0.06)",
                        }}
                        initial={{ opacity: 0, y: 20, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: 20, scale: 0.95 }}
                        transition={{ duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                        id="chat-panel"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-linear-to-r from-accent/5 via-transparent to-transparent">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 shrink-0">
                                    <Sparkles className="h-4.5 w-4.5 text-accent" />
                                </div>
                                <div className="min-w-0">
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-sm font-semibold text-foreground truncate">
                                            Chat with Document
                                        </h3>
                                        <span className="rag-badge shrink-0">RAG · Grounded</span>
                                    </div>
                                    <p className="text-xs text-muted-foreground truncate max-w-[200px]">
                                        {summaryTitle}
                                    </p>
                                </div>
                            </div>
                            <div className="flex items-center gap-1">
                                {messages.length > 0 && (
                                    <Button
                                        variant="ghost"
                                        size="icon"
                                        onClick={clearChat}
                                        className="h-8 w-8 text-muted-foreground hover:text-destructive"
                                        title="Clear chat view (messages are still saved)"
                                    >
                                        <Trash2 className="h-3.5 w-3.5" />
                                    </Button>
                                )}
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => setIsOpen(false)}
                                    className="h-8 w-8 text-muted-foreground hover:text-foreground"
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>

                        {/* Messages area */}
                        <div
                            ref={chatContainerRef}
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth relative"
                            style={{
                                scrollbarWidth: "thin",
                                scrollbarColor: "oklch(0.3 0 0) transparent",
                            }}
                        >
                            {isLoadingHistory ? (
                                <div className="flex items-center justify-center h-full">
                                    <Loader2 className="h-6 w-6 text-accent animate-spin" />
                                </div>
                            ) : messages.length === 0 ? (
                                /* Empty state with suggested questions */
                                <div className="flex flex-col items-center justify-center h-full gap-6 px-2">
                                    <div className="flex flex-col items-center gap-3 text-center">
                                        <div className="flex items-center justify-center w-14 h-14 rounded-2xl bg-accent/10 border border-accent/20">
                                            <Bot className="h-7 w-7 text-accent" />
                                        </div>
                                        <div>
                                            <p className="text-sm font-medium text-foreground">
                                                Ask anything about this document
                                            </p>
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Powered by RAG — answers are grounded in your PDF
                                            </p>
                                        </div>
                                    </div>
                                    <div className="grid grid-cols-1 gap-2 w-full">
                                        {suggestedQuestions.map((q, i) => (
                                            <motion.button
                                                key={i}
                                                className="text-left px-4 py-2.5 rounded-xl bg-secondary/50 border border-border/50 text-xs text-muted-foreground hover:text-foreground hover:bg-secondary hover:border-accent/30 transition-all duration-200"
                                                onClick={() => {
                                                    setInput(q);
                                                    inputRef.current?.focus();
                                                }}
                                                initial={{ opacity: 0, y: 8 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                transition={{ delay: 0.1 + i * 0.05, duration: 0.25, ease: [0.4, 0, 0.2, 1] }}
                                            >
                                                {q}
                                            </motion.button>
                                        ))}
                                    </div>
                                </div>
                            ) : (
                                <>
                                    {messages.map((msg) => (
                                        <div key={msg.id} className="chat-bubble">
                                            <ChatBubble message={msg} isCurrentlyStreaming={isStreaming && msg.id === messages[messages.length - 1]?.id && msg.role === "model"} />
                                        </div>
                                    ))}

                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Jump to bottom button */}
                        <AnimatePresence>
                            {showJumpToBottom && (
                                <motion.button
                                    className="absolute bottom-[80px] left-1/2 -translate-x-1/2 z-10 flex items-center gap-1.5 rounded-full bg-secondary border border-border px-3 py-1.5 text-xs text-muted-foreground hover:text-foreground hover:border-accent/30 transition-all duration-150 shadow-lg"
                                    onClick={scrollToBottom}
                                    initial={{ opacity: 0, y: 8 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    exit={{ opacity: 0, y: 8 }}
                                    transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
                                >
                                    <ChevronDown className="h-3 w-3" />
                                    Jump to bottom
                                </motion.button>
                            )}
                        </AnimatePresence>

                        {/* Input area */}
                        <div className="px-4 pb-4 pt-2 border-t border-border/30">
                            {/* RAG pipeline status during retrieval */}
                            <AnimatePresence>
                                {ragStageText && (
                                    <motion.div
                                        className="flex items-center gap-2 mb-2 px-1"
                                        initial={{ opacity: 0, height: 0 }}
                                        animate={{ opacity: 1, height: "auto" }}
                                        exit={{ opacity: 0, height: 0 }}
                                        transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
                                    >
                                        <Database className="h-3 w-3 text-accent animate-pulse" />
                                        <span className="text-xs text-accent font-mono">{ragStageText}</span>
                                    </motion.div>
                                )}
                            </AnimatePresence>

                            <div className="flex items-end gap-2 rounded-xl bg-secondary/50 border border-border/50 px-3 py-2 focus-within:border-accent/40 focus-within:bg-secondary/80 transition-all duration-200">
                                <textarea
                                    ref={inputRef}
                                    value={input}
                                    onChange={(e) => setInput(e.target.value)}
                                    onKeyDown={handleKeyDown}
                                    placeholder="Ask a question…"
                                    className="flex-1 resize-none bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[100px] py-1.5"
                                    rows={1}
                                    disabled={isStreaming}
                                    id="chat-input"
                                    onInput={(e) => {
                                        const target = e.target as HTMLTextAreaElement;
                                        target.style.height = "auto";
                                        target.style.height = `${Math.min(target.scrollHeight, 100)}px`;
                                    }}
                                />
                                <Button
                                    onClick={handleSend}
                                    disabled={!input.trim() || isStreaming}
                                    className="h-8 w-8 shrink-0 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 transition-all font-medium btn-editorial"
                                    size="icon"
                                    id="chat-send-button"
                                >
                                    {isStreaming ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <Send className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                            <p className="mono-label text-center mt-2 normal-case" style={{ fontSize: '10px', letterSpacing: '0.02em' }}>
                                Answers grounded in your document via RAG
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ── Chat Bubble Component ─────────────────────────────────────────

function ChatBubble({ message, isCurrentlyStreaming }: { message: ChatMessage; isCurrentlyStreaming: boolean }) {
    const isUser = message.role === "user";
    const isWaitingForContent = message.role === "model" && message.content === "" && !message.sources;

    return (
        <motion.div
            className={`flex gap-2.5 group ${isUser ? "flex-row-reverse" : "flex-row"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
        >
            {/* Avatar */}
            <div
                className={`flex items-center justify-center w-7 h-7 rounded-lg shrink-0 mt-0.5 ${isUser
                    ? "bg-accent/20 text-accent"
                    : "bg-secondary border border-border/50 text-muted-foreground"
                    }`}
            >
                {isUser ? (
                    <User className="h-3.5 w-3.5" />
                ) : (
                    <Bot className="h-3.5 w-3.5" />
                )}
            </div>

            {/* Message bubble */}
            <div className="max-w-[80%]">
                <div
                    className={`rounded-xl px-3.5 py-2.5 ${isUser
                        ? "bg-accent/15 border border-accent/20 text-foreground"
                        : "bg-secondary/60 border border-border/30 text-foreground"
                        }`}
                >
                    {isWaitingForContent ? (
                        <div className="flex items-center gap-2 py-1">
                            <Loader2 className="h-3.5 w-3.5 text-accent animate-spin" />
                            <span className="text-xs text-muted-foreground font-mono">Reading your document…</span>
                        </div>
                    ) : (
                        <div className="prose-sm">
                            {renderMessageContent(message.content)}
                            {isCurrentlyStreaming && message.content && (
                                <span className="streaming-cursor" />
                            )}
                        </div>
                    )}
                </div>

                {/* Source citations below AI messages */}
                {!isUser && message.sources && message.sources.length > 0 && (
                    <SourcesSection sources={message.sources} />
                )}

                {/* Timestamp on hover */}
                {message.createdAt && (
                    <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-150 mt-1">
                        <span className="text-[10px] text-muted-foreground font-mono">
                            {new Date(message.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                    </div>
                )}
            </div>
        </motion.div>
    );
}
