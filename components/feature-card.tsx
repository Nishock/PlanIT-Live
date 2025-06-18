import type { ReactNode } from "react"
import { Card, CardContent } from "@/components/ui/card"
import { cn } from "@/lib/utils"

interface FeatureCardProps {
  icon: ReactNode
  title: string
  description: string
  className?: string
}

export function FeatureCard({ icon, title, description, className }: FeatureCardProps) {
  return (
    <Card
      className={cn(
        "group relative overflow-hidden border-0 bg-gradient-to-br from-gray-900/50 to-gray-800/50 backdrop-blur-sm hover:from-gray-800/60 hover:to-gray-700/60 transition-all duration-500",
        className,
      )}
    >
      <CardContent className="p-8">
        <div className="flex flex-col items-start space-y-4">
          <div className="p-3 rounded-xl bg-gradient-to-br from-white/10 to-white/5 group-hover:from-white/20 group-hover:to-white/10 transition-all duration-300">
            {icon}
          </div>
          <h3 className="text-xl font-bold text-white group-hover:text-transparent group-hover:bg-clip-text group-hover:bg-gradient-to-r group-hover:from-purple-400 group-hover:to-cyan-400 transition-all duration-300">
            {title}
          </h3>
          <p className="text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-300">
            {description}
          </p>
        </div>
      </CardContent>
    </Card>
  )
}
