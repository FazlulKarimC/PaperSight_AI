import { cn } from "@/lib/utils"
import { Info, AlertTriangle, Lightbulb, AlertCircle } from "lucide-react"

type CalloutType = "info" | "warning" | "tip" | "danger"

interface CalloutProps {
    type?: CalloutType
    title?: string
    children: React.ReactNode
}

const calloutStyles: Record<CalloutType, { icon: React.ElementType; className: string }> = {
    info: {
        icon: Info,
        className: "bg-blue-500/10 border-blue-500/30 text-blue-200",
    },
    warning: {
        icon: AlertTriangle,
        className: "bg-yellow-500/10 border-yellow-500/30 text-yellow-200",
    },
    tip: {
        icon: Lightbulb,
        className: "bg-accent/10 border-accent/30 text-accent",
    },
    danger: {
        icon: AlertCircle,
        className: "bg-destructive/10 border-destructive/30 text-destructive",
    },
}

export function Callout({ type = "info", title, children }: CalloutProps) {
    const { icon: Icon, className } = calloutStyles[type]

    return (
        <div
            className={cn(
                "my-6 flex gap-4 rounded-lg border p-4",
                className
            )}
        >
            <Icon className="h-5 w-5 mt-0.5 shrink-0" />
            <div className="flex-1">
                {title && (
                    <p className="font-semibold mb-1">{title}</p>
                )}
                <div className="text-sm [&>p]:mb-0 [&>p]:text-current">{children}</div>
            </div>
        </div>
    )
}
