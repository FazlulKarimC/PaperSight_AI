"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import useSWR from 'swr';
import { motion, AnimatePresence } from "framer-motion";
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
} from "lucide-react";

interface ChatMessage {
    id: string;
    role: "user" | "model";
    content: string;
    createdAt?: string;
}

interface ChatPanelProps {
    summaryId: string;
    summaryTitle: string;
}

/**
 * Renders a markdown-lite string with basic formatting:
 * bold, italic, inline code, and line breaks.
 */
function renderMessageContent(content: string) {
    // Split into paragraphs by double newlines
    const paragraphs = content.split(/\n\n+/);

    return paragraphs.map((paragraph, pIdx) => {
        // Handle bullet points
        const lines = paragraph.split("\n");
        const isList = lines.every(
            (l) => l.trim().startsWith("- ") || l.trim().startsWith("* ") || l.trim() === ""
        );

        if (isList && lines.some((l) => l.trim().startsWith("- ") || l.trim().startsWith("* "))) {
            return (
                <ul key={pIdx} className="list-disc list-inside space-y-1 my-1">
                    {lines
                        .filter((l) => l.trim())
                        .map((line, lIdx) => (
                            <li key={lIdx} className="text-sm">
                                {line.replace(/^[\s]*[-*]\s/, "")}
                            </li>
                        ))}
                </ul>
            );
        }

        // Handle headings
        if (paragraph.trim().startsWith("### ")) {
            return (
                <h4 key={pIdx} className="font-semibold text-sm mt-2 mb-1">
                    {paragraph.replace(/^###\s/, "")}
                </h4>
            );
        }
        if (paragraph.trim().startsWith("## ")) {
            return (
                <h3 key={pIdx} className="font-bold text-sm mt-2 mb-1">
                    {paragraph.replace(/^##\s/, "")}
                </h3>
            );
        }

        // Regular paragraph with inline formatting
        return (
            <p key={pIdx} className="text-sm leading-relaxed my-1">
                {paragraph.split("\n").map((line, lIdx) => (
                    <span key={lIdx}>
                        {lIdx > 0 && <br />}
                        {formatInlineText(line)}
                    </span>
                ))}
            </p>
        );
    });
}

function formatInlineText(text: string) {
    // Replace **bold**, *italic*, `code`
    const parts = text.split(/(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`)/g);
    return parts.map((part, i) => {
        if (part.startsWith("**") && part.endsWith("**")) {
            return (
                <strong key={i} className="font-semibold">
                    {part.slice(2, -2)}
                </strong>
            );
        }
        if (part.startsWith("*") && part.endsWith("*")) {
            return <em key={i}>{part.slice(1, -1)}</em>;
        }
        if (part.startsWith("`") && part.endsWith("`")) {
            return (
                <code
                    key={i}
                    className="px-1.5 py-0.5 rounded bg-secondary text-accent text-xs font-mono"
                >
                    {part.slice(1, -1)}
                </code>
            );
        }
        return part;
    });
}

export function ChatPanel({ summaryId, summaryTitle }: ChatPanelProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [input, setInput] = useState("");
    const [isStreaming, setIsStreaming] = useState(false);
    const [isIndexing, setIsIndexing] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLTextAreaElement>(null);
    const chatContainerRef = useRef<HTMLDivElement>(null);
    const historyLoadedRef = useRef(false);

    // Auto-scroll to bottom when new messages arrive
    const scrollToBottom = useCallback(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, []);

    useEffect(() => {
        scrollToBottom();
    }, [messages, scrollToBottom]);

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
        // Capture messages snapshot functionally to avoid stale closure
        let historySnapshot: { role: string; content: string }[] = [];
        setMessages(prev => {
            historySnapshot = prev.slice(-6).map(m => ({ role: m.role, content: m.content }));
            return prev;
        });

        // Read input at call time
        const trimmedInput = inputRef.current?.value?.trim() ?? '';
        if (!trimmedInput) return;
        setMessages((prev) => {
            const trimmed = inputRef.current?.value?.trim() ?? '';
            if (!trimmed) return prev;
            return [...prev, { id: `user-${Date.now()}`, role: 'user' as const, content: trimmed }];
        });
        setInput("");
        setIsStreaming(true);
        setIsIndexing(false);

        const assistantId = `assistant-${Date.now()}`;
        setMessages((prev) => [...prev, { id: assistantId, role: "model" as const, content: "" }]);

        try {
            // Use captured history snapshot for multi-turn context
            const history = historySnapshot;

            const res = await fetch("/api/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    summaryId,
                    message: trimmedInput,
                    history,
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

            while (true) {
                const { done, value } = await reader.read();
                if (done) break;

                buffer += decoder.decode(value, { stream: true });
                const events = buffer.split("\n\n");
                buffer = events.pop() ?? "";

                for (const event of events) {
                    const line = event.trim();
                    if (!line.startsWith("data: ")) continue;

                    const data = JSON.parse(line.slice(6));
                    switch (data.type) {
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
                }
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
        }
    }, [summaryId]);

    function handleKeyDown(e: React.KeyboardEvent<HTMLTextAreaElement>) {
        if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            handleSend();
        }
    }

    function clearChat() {
        setMessages([]);
        historyLoadedRef.current = false;
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
                        transition={{ type: "spring", stiffness: 300, damping: 25 }}
                    >
                        <Button
                            onClick={() => setIsOpen(true)}
                            className="h-14 w-14 rounded-full bg-accent hover:bg-accent/90 text-accent-foreground shadow-lg shadow-accent/15 transition-all hover:scale-105"
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
                        className="fixed bottom-6 right-6 z-50 w-[420px] max-w-[calc(100vw-2rem)] h-[600px] max-h-[calc(100vh-3rem)] flex flex-col rounded-2xl border border-border overflow-hidden"
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
                        transition={{ type: "spring", stiffness: 300, damping: 30 }}
                        id="chat-panel"
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between px-5 py-4 border-b border-border/50 bg-linear-to-r from-accent/5 via-transparent to-transparent">
                            <div className="flex items-center gap-3 min-w-0">
                                <div className="flex items-center justify-center w-9 h-9 rounded-xl bg-accent/15 shrink-0">
                                    <Sparkles className="h-4.5 w-4.5 text-accent" />
                                </div>
                                <div className="min-w-0">
                                    <h3 className="text-sm font-semibold text-foreground truncate">
                                        Chat with Document
                                    </h3>
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
                                        title="Clear chat"
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
                            className="flex-1 overflow-y-auto px-4 py-4 space-y-4 scroll-smooth"
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
                                                transition={{ delay: 0.1 + i * 0.05 }}
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
                                            <ChatBubble message={msg} />
                                        </div>
                                    ))}
                                    {isIndexing && (
                                        <div className="flex items-center gap-2 text-xs text-muted-foreground px-2">
                                            <Loader2 className="h-3 w-3 animate-spin" />
                                            Indexing document for the first time…
                                        </div>
                                    )}
                                </>
                            )}
                            <div ref={messagesEndRef} />
                        </div>

                        {/* Input area */}
                        <div className="px-4 pb-4 pt-2 border-t border-border/30">
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
                                    className="h-8 w-8 shrink-0 rounded-lg bg-accent text-accent-foreground hover:bg-accent/90 disabled:opacity-30 transition-all font-medium"
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
                                Answers are grounded in the document content via RAG
                            </p>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </>
    );
}

// ── Chat Bubble Component ─────────────────────────────────────────

function ChatBubble({ message }: { message: ChatMessage }) {
    const isUser = message.role === "user";
    const isStreaming = message.role === "model" && message.content === "";

    return (
        <motion.div
            className={`flex gap-2.5 ${isUser ? "flex-row-reverse" : "flex-row"}`}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
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
            <div
                className={`max-w-[80%] rounded-xl px-3.5 py-2.5 ${isUser
                    ? "bg-accent/15 border border-accent/20 text-foreground"
                    : "bg-secondary/60 border border-border/30 text-foreground"
                    }`}
            >
                {isStreaming ? (
                    <div className="flex items-center gap-1.5 py-1">
                        <div className="flex gap-1">
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "0ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "150ms" }} />
                            <span className="w-1.5 h-1.5 rounded-full bg-accent/60 animate-bounce" style={{ animationDelay: "300ms" }} />
                        </div>
                    </div>
                ) : (
                    <div className="prose-sm">{renderMessageContent(message.content)}</div>
                )}
            </div>
        </motion.div>
    );
}
