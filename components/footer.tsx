import Link from "next/link"
import { FileText } from "lucide-react"

const footerLinks = {
  Product: [
    { name: "Features", href: "/#features" },
    { name: "Pricing", href: "/#pricing" },
  ],
  Company: [
    { name: "About", href: "/about" },
    { name: "Blog", href: "/blog" },
  ],
  Resources: [
    { name: "Documentation", href: "/docs" },
    { name: "Contact", href: "/contact" },
  ],
  Legal: [
    { name: "Privacy", href: "/privacy" },
    { name: "Terms", href: "/terms" },
  ],
}

export function Footer() {
  return (
    <footer className="border-t border-border py-16 px-4 sm:px-6 lg:px-8">
      <div className="mx-auto max-w-7xl">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <FileText className="h-6 w-6 text-foreground" />
              <span className="text-lg font-semibold text-foreground">PaperSight AI</span>
            </div>
            <p className="text-sm text-muted-foreground">AI-powered document summarization for modern teams.</p>
          </div>

          {Object.entries(footerLinks).map(([category, links]) => (
            <div key={category}>
              <h4 className="font-semibold text-foreground mb-4">{category}</h4>
              <ul className="space-y-2">
                {links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-16 pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-muted-foreground">© 2025 PaperSight AI. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link href="https://x.com/FazlulKarim_fk" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              Twitter
            </Link>
            <Link href="https://www.linkedin.com/in/fazlul0127" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              LinkedIn
            </Link>
            <Link href="https://github.com/FazlulKarimC" target="_blank" rel="noopener noreferrer" className="text-sm text-muted-foreground hover:text-foreground">
              GitHub
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
