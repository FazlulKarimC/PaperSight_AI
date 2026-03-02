"use client"

import { motion } from "framer-motion"

export function LoadingSkeleton() {
    return (
        <div className="space-y-6 animate-in fade-in duration-300">
            {/* Scan line animation */}
            <div className="relative overflow-hidden rounded-xl border border-border bg-card p-8">
                <div className="absolute inset-0 bg-linear-to-b from-accent/5 via-transparent to-transparent" />
                {/* Animated scan line */}
                <motion.div
                    className="absolute left-0 right-0 h-px bg-linear-to-r from-transparent via-accent/50 to-transparent"
                    initial={{ top: 0 }}
                    animate={{ top: "100%" }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Header skeleton */}
                <div className="space-y-3 mb-8">
                    <div className="h-7 w-3/4 rounded-md bg-secondary animate-pulse" />
                    <div className="h-4 w-1/3 rounded-md bg-secondary/60 animate-pulse" />
                </div>

                {/* Section skeletons */}
                {[1, 2, 3, 4].map((section) => (
                    <div key={section} className="mb-6 space-y-2.5">
                        <div className="h-5 w-2/5 rounded-md bg-secondary animate-pulse" />
                        {[1, 2, 3].map((line) => (
                            <div
                                key={line}
                                className="h-3.5 rounded-md bg-secondary/40 animate-pulse"
                                style={{
                                    width: `${85 - line * 10 + Math.random() * 15}%`,
                                    animationDelay: `${(section * 3 + line) * 100}ms`,
                                }}
                            />
                        ))}
                    </div>
                ))}
            </div>

            {/* Status text */}
            <div className="flex items-center justify-center gap-2 text-sm text-muted-foreground">
                <motion.div
                    className="h-2 w-2 rounded-full bg-accent"
                    animate={{ scale: [1, 1.4, 1], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity }}
                />
                Analyzing document structure...
            </div>
        </div>
    )
}
