import { Badge } from "@/components/ui/badge"

interface StatusBadgeProps {
  status: string
  statusMap: Record<string, { text: string; variant: "success" | "warning" | "info" | "error" | "default" }>
}

export function StatusBadge({ status, statusMap }: StatusBadgeProps) {
  const { text, variant } = statusMap[status] || { text: status, variant: "default" }
  return <Badge variant={variant}>{text}</Badge>
} 