export function Logos() {
  const logos = ["Acme Corp", "Globex", "Initech", "Umbrella", "Stark Industries", "Wayne Enterprises"]

  return (
    <section className="py-12 border-y border-border">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <p className="text-center text-sm text-muted-foreground mb-8">Trusted by teams at</p>
        <div className="flex flex-wrap items-center justify-center gap-x-12 gap-y-6">
          {logos.map((logo) => (
            <span
              key={logo}
              className="text-lg font-semibold text-muted-foreground/50 hover:text-muted-foreground transition-colors"
            >
              {logo}
            </span>
          ))}
        </div>
      </div>
    </section>
  )
}
