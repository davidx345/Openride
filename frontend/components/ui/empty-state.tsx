"use client"

import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { FileQuestion, RefreshCw } from "lucide-react"

interface EmptyStateProps {
  icon?: React.ReactNode
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

export default function EmptyState({ icon, title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <Card className="p-12 text-center border-dashed">
      <div className="flex flex-col items-center gap-4">
        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center">
          {icon || <FileQuestion className="w-8 h-8 text-muted-foreground" />}
        </div>
        <div>
          <h3 className="text-lg font-semibold mb-1">{title}</h3>
          <p className="text-sm text-muted-foreground max-w-md">{description}</p>
        </div>
        {actionLabel && onAction && (
          <Button onClick={onAction} variant="outline" className="gap-2">
            <RefreshCw className="w-4 h-4" />
            {actionLabel}
          </Button>
        )}
      </div>
    </Card>
  )
}
