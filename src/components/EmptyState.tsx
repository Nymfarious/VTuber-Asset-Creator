import { BunnyMascot } from "./BunnyMascot";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";

interface EmptyStateProps {
  title: string;
  description: string;
  actionLabel?: string;
  onAction?: () => void;
  icon?: React.ReactNode;
  className?: string;
}

export const EmptyState = ({
  title,
  description,
  actionLabel,
  onAction,
  icon,
  className,
}: EmptyStateProps) => {
  return (
    <div className={cn("flex flex-col items-center justify-center py-16 px-6 text-center", className)}>
      <div className="mb-6">
        {icon || <BunnyMascot size="xl" />}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-muted-foreground max-w-sm mb-6">{description}</p>
      {actionLabel && onAction && (
        <Button onClick={onAction} className="hover-bounce">
          {actionLabel}
        </Button>
      )}
    </div>
  );
};
