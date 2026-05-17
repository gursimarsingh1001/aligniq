import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

type NotificationStatusBadgeProps = {
  isRead: boolean;
};

export function NotificationStatusBadge({
  isRead
}: NotificationStatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "border-transparent px-2.5 py-0.5 text-xs font-semibold",
        isRead
          ? "bg-slate-100 text-slate-600"
          : "bg-blue-600 text-white shadow-subtle"
      )}
    >
      {isRead ? "Read" : "Unread"}
    </Badge>
  );
}
