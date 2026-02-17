import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Ruler, Weight, Activity } from "lucide-react";

interface BmiInputsProps {
  unitSystem: "metric" | "imperial";
  heightCm: number;
  weightKg: number;
  waistCm: number;
  onHeightChange: (cm: number) => void;
  onWeightChange: (kg: number) => void;
  onWaistChange: (cm: number) => void;
}

export function BmiInputs({
  unitSystem,
  heightCm,
  weightKg,
  waistCm,
  onHeightChange,
  onWeightChange,
  onWaistChange,
}: BmiInputsProps) {
  const heightFeet = Math.floor(heightCm / 30.48);
  const heightInches = Math.round((heightCm / 2.54) % 12);
  const weightLbs = Math.round(weightKg * 2.20462);
  const waistInches = Math.round(waistCm / 2.54);

  const handleHeightFeetChange = (feet: number) => {
    const totalInches = feet * 12 + heightInches;
    onHeightChange(totalInches * 2.54);
  };

  const handleHeightInchesChange = (inches: number) => {
    const totalInches = heightFeet * 12 + inches;
    onHeightChange(totalInches * 2.54);
  };

  return (
    <div className="space-y-6">
      {/* Height Input */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Ruler className="w-5 h-5 text-primary" />
          Height
        </Label>
        {unitSystem === "metric" ? (
          <div className="relative">
            <Input
              type="number"
              value={heightCm || ""}
              onChange={(e) => onHeightChange(Number(e.target.value) || 0)}
              placeholder="170"
              className="pr-12 h-14 text-lg border-2 focus:ring-4 focus:ring-primary/10 transition-all"
              min="0"
              step="0.1"
            />
            <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
              cm
            </span>
          </div>
        ) : (
          <div className="flex gap-3">
            <div className="relative flex-1">
              <Input
                type="number"
                value={heightFeet || ""}
                onChange={(e) =>
                  handleHeightFeetChange(Number(e.target.value) || 0)
                }
                placeholder="5"
                className="pr-10 h-14 text-lg border-2 focus:ring-4 focus:ring-primary/10 transition-all"
                min="0"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                ft
              </span>
            </div>
            <div className="relative flex-1">
              <Input
                type="number"
                value={heightInches || ""}
                onChange={(e) =>
                  handleHeightInchesChange(Number(e.target.value) || 0)
                }
                placeholder="7"
                className="pr-10 h-14 text-lg border-2 focus:ring-4 focus:ring-primary/10 transition-all"
                min="0"
                max="11"
              />
              <span className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
                in
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Weight Input */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Weight className="w-5 h-5 text-primary" />
          Weight
        </Label>
        <div className="relative">
          <Input
            type="number"
            value={
              unitSystem === "metric"
                ? weightKg || ""
                : weightLbs || ""
            }
            onChange={(e) =>
              unitSystem === "metric"
                ? onWeightChange(Number(e.target.value) || 0)
                : onWeightChange((Number(e.target.value) || 0) / 2.20462)
            }
            placeholder={unitSystem === "metric" ? "70" : "154"}
            className="pr-12 h-14 text-lg border-2 focus:ring-4 focus:ring-primary/10 transition-all"
            min="0"
            step="0.1"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {unitSystem === "metric" ? "kg" : "lb"}
          </span>
        </div>
      </div>

      {/* Waist Input */}
      <div className="space-y-3">
        <Label className="flex items-center gap-2 text-base font-semibold text-foreground">
          <Activity className="w-5 h-5 text-primary" />
          Waist Circumference{" "}
          <span className="text-sm font-normal text-muted-foreground">
            (optional)
          </span>
        </Label>
        <div className="relative">
          <Input
            type="number"
            value={
              unitSystem === "metric"
                ? waistCm || ""
                : waistInches || ""
            }
            onChange={(e) =>
              unitSystem === "metric"
                ? onWaistChange(Number(e.target.value) || 0)
                : onWaistChange((Number(e.target.value) || 0) * 2.54)
            }
            placeholder={unitSystem === "metric" ? "85" : "33"}
            className="pr-12 h-14 text-lg border-2 focus:ring-4 focus:ring-primary/10 transition-all"
            min="0"
            step="0.1"
          />
          <span className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground font-medium">
            {unitSystem === "metric" ? "cm" : "in"}
          </span>
        </div>
      </div>
    </div>
  );
}
