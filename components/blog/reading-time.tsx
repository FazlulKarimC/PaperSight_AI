import { Clock } from "lucide-react"

interface ReadingTimeProps {
    minutes: number
}

export function ReadingTime({ minutes }: ReadingTimeProps) {
    return (
        <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {minutes} min read
        </span>
    )
}
