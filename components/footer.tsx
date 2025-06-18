import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Twitter, Linkedin, Github } from "lucide-react"

export function Footer() {
  return (
    <footer className="border-t py-12 md:py-16">
      <div className="container grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-8">
        <div className="col-span-2 lg:col-span-2">
          <Link href="/" className="inline-flex items-center gap-2 mb-4">
            <div className="relative w-8 h-8 bg-gradient-to-br from-purple-600 to-cyan-400 rounded-lg overflow-hidden">
              <div className="absolute inset-0.5 bg-background rounded-md flex items-center justify-center">
                <span className="font-bold text-transparent bg-clip-text bg-gradient-to-br from-purple-600 to-cyan-400">
                  P
                </span>
              </div>
            </div>
            <span className="font-bold text-xl">PLANIT</span>
          </Link>
          <p className="text-muted-foreground mb-4 max-w-xs">
            PLANIT is the ultimate AI-powered task manager for teams and individuals.
          </p>
          <div className="flex gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="Twitter">
                <Twitter className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="LinkedIn">
                <Linkedin className="h-5 w-5" />
              </Link>
            </Button>
            <Button variant="ghost" size="icon" asChild>
              <Link href="#" aria-label="GitHub">
                <Github className="h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>

        <div>
          <h3 className="font-medium mb-4">Product</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Features
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Pricing
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Integrations
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Changelog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4">Resources</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Documentation
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Guides
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                API
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Blog
              </Link>
            </li>
          </ul>
        </div>

        <div>
          <h3 className="font-medium mb-4">Company</h3>
          <ul className="space-y-2">
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                About
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Careers
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Contact
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Privacy
              </Link>
            </li>
            <li>
              <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                Terms
              </Link>
            </li>
          </ul>
        </div>
      </div>

      <div className="container mt-12 pt-8 border-t">
        <div className="flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">© {new Date().getFullYear()} PLANIT. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Privacy Policy
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Terms of Service
            </Link>
            <Link href="#" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}
