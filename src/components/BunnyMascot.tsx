import { cn } from "@/lib/utils";

interface BunnyMascotProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
  animated?: boolean;
}

export const BunnyMascot = ({ size = "md", className, animated = true }: BunnyMascotProps) => {
  const sizeClasses = {
    sm: "w-8 h-8",
    md: "w-12 h-12",
    lg: "w-20 h-20",
    xl: "w-32 h-32",
  };

  return (
    <div className={cn(sizeClasses[size], animated && "animate-bounce-soft", className)}>
      <svg viewBox="0 0 100 100" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-full">
        {/* Ears */}
        <ellipse cx="35" cy="25" rx="10" ry="22" className="fill-pink" />
        <ellipse cx="65" cy="25" rx="10" ry="22" className="fill-pink" />
        <ellipse cx="35" cy="25" rx="6" ry="16" className="fill-accent" />
        <ellipse cx="65" cy="25" rx="6" ry="16" className="fill-accent" />
        
        {/* Head */}
        <circle cx="50" cy="58" r="32" className="fill-card" stroke="hsl(var(--border))" strokeWidth="2" />
        
        {/* Cheeks */}
        <circle cx="30" cy="62" r="8" className="fill-pink/40" />
        <circle cx="70" cy="62" r="8" className="fill-pink/40" />
        
        {/* Eyes */}
        <circle cx="38" cy="52" r="6" className="fill-foreground" />
        <circle cx="62" cy="52" r="6" className="fill-foreground" />
        <circle cx="40" cy="50" r="2" className="fill-card" />
        <circle cx="64" cy="50" r="2" className="fill-card" />
        
        {/* Nose */}
        <ellipse cx="50" cy="64" rx="4" ry="3" className="fill-pink" />
        
        {/* Mouth */}
        <path d="M 44 70 Q 50 76 56 70" stroke="hsl(var(--foreground))" strokeWidth="2" fill="none" strokeLinecap="round" />
        
        {/* Whiskers */}
        <line x1="20" y1="60" x2="32" y2="62" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="20" y1="66" x2="32" y2="66" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="62" x2="80" y2="60" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinecap="round" />
        <line x1="68" y1="66" x2="80" y2="66" className="stroke-muted-foreground" strokeWidth="1.5" strokeLinecap="round" />
      </svg>
    </div>
  );
};
