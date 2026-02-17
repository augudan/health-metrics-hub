import { BmiCalculation } from "@shared/schema";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { TrendingUp, TrendingDown, Activity, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

interface BmiResultCardProps {
  calculation: BmiCalculation;
  unitSystem: "metric" | "imperial";
}

export function BmiResultCard({
  calculation,
  unitSystem,
}: BmiResultCardProps) {
  const getCategoryColor = (category: string) => {
    switch (category) {
      case "underweight":
        return "bg-[hsl(var(--bmi-underweight))] text-white";
      case "normal":
        return "bg-[hsl(var(--bmi-normal))] text-white";
      case "overweight":
        return "bg-[hsl(var(--bmi-overweight))] text-white";
      case "obese":
        return "bg-[hsl(var(--bmi-obese))] text-white";
      default:
        return "bg-muted text-muted-foreground";
    }
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case "underweight":
        return <TrendingDown className="w-5 h-5" />;
      case "normal":
        return <Activity className="w-5 h-5" />;
      case "overweight":
        return <TrendingUp className="w-5 h-5" />;
      case "obese":
        return <AlertCircle className="w-5 h-5" />;
      default:
        return null;
    }
  };

  const minWeight =
    unitSystem === "metric"
      ? `${calculation.healthyWeightRange.min.toFixed(1)} kg`
      : `${(calculation.healthyWeightRange.min * 2.20462).toFixed(1)} lb`;

  const maxWeight =
    unitSystem === "metric"
      ? `${calculation.healthyWeightRange.max.toFixed(1)} kg`
      : `${(calculation.healthyWeightRange.max * 2.20462).toFixed(1)} lb`;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card className="p-8 space-y-6 border-2 shadow-xl bg-gradient-to-br from-card to-secondary/20">
        <div className="text-center space-y-4">
          <motion.div
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="inline-flex flex-col items-center gap-2"
          >
            <span className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">
              Your BMI
            </span>
            <div className="text-7xl font-bold text-primary">
              {calculation.bmi}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Badge
              className={`${getCategoryColor(
                calculation.category
              )} px-6 py-2 text-base font-semibold rounded-full shadow-lg inline-flex items-center gap-2`}
            >
              {getCategoryIcon(calculation.category)}
              {calculation.category.charAt(0).toUpperCase() +
                calculation.category.slice(1)}
            </Badge>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.3 }}
          className="pt-6 border-t border-border"
        >
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div>
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Healthy Weight Range
                </p>
                <p className="text-xl font-bold text-foreground mt-1">
                  {minWeight} - {maxWeight}
                </p>
              </div>
            </div>

            {calculation.waistToHeightRatio !== undefined && (
              <div className="pt-4 border-t border-border">
                <p className="text-sm font-semibold text-muted-foreground uppercase tracking-wide">
                  Waist-to-Height Ratio
                </p>
                <div className="flex items-baseline gap-3 mt-1">
                  <span className="text-2xl font-bold text-foreground">
                    {calculation.waistToHeightRatio.toFixed(2)}
                  </span>
                  <Badge
                    variant={
                      calculation.waistToHeightRatio < 0.5
                        ? "default"
                        : "destructive"
                    }
                    className="text-xs"
                  >
                    {calculation.waistToHeightInterpretation}
                  </Badge>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </Card>
    </motion.div>
  );
}
