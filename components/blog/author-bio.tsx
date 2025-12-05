import Image from "next/image"

interface AuthorBioProps {
    name: string
    avatar?: string
}

export function AuthorBio({ name, avatar }: AuthorBioProps) {
    return (
        <div className="mt-12 pt-8 border-t border-border">
            <div className="flex items-center gap-4">
                <div className="relative h-14 w-14 rounded-full overflow-hidden bg-secondary flex items-center justify-center">
                    {avatar ? (
                        <Image
                            src={avatar}
                            alt={name}
                            fill
                            className="object-cover"
                        />
                    ) : (
                        <span className="text-xl font-semibold text-accent">
                            {name.split(" ").map(n => n[0]).join("")}
                        </span>
                    )}
                </div>
                <div>
                    <p className="text-sm text-muted-foreground uppercase tracking-wider">
                        Written by
                    </p>
                    <p className="font-semibold text-foreground">{name}</p>
                </div>
            </div>
        </div>
    )
}
