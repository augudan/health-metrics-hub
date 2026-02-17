import { Button } from "@/components/ui/button";

interface UnitToggleProps {
  unitSystem: "metric" | "imperial";
  onChange: (system: "metric" | "imperial") => void;
}

export function UnitToggle({ unitSystem, onChange }: UnitToggleProps) {
  return (
    <div className="flex items-center gap-2 p-1 bg-secondary rounded-xl">
      <Button
        size="sm"
        variant={unitSystem === "metric" ? "default" : "ghost"}
        onClick={() => onChange("metric")}
        className={`
          rounded-lg font-semibold transition-all duration-200
          ${
            unitSystem === "metric"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        Metric
      </Button>
      <Button
        size="sm"
        variant={unitSystem === "imperial" ? "default" : "ghost"}
        onClick={() => onChange("imperial")}
        className={`
          rounded-lg font-semibold transition-all duration-200
          ${
            unitSystem === "imperial"
              ? "bg-primary text-primary-foreground shadow-md"
              : "text-muted-foreground hover:text-foreground"
          }
        `}
      >
        Imperial
      </Button>
    </div>
  );
}
