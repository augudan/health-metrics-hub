import { BmiEntry } from "@shared/schema";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Trash2, Calendar } from "lucide-react";
import { format } from "date-fns";
import { motion, AnimatePresence } from "framer-motion";

interface HistoryListProps {
  entries: BmiEntry[];
  unitSystem: "metric" | "imperial";
  onDelete: (id: string) => void;
}

export function HistoryList({
  entries,
  unitSystem,
  onDelete,
}: HistoryListProps) {
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

  if (entries.length === 0) {
    return (
      <Card className="p-8 text-center">
        <div className="space-y-3">
          <div className="w-16 h-16 mx-auto rounded-full bg-secondary flex items-center justify-center">
            <Calendar className="w-8 h-8 text-muted-foreground" />
          </div>
          <p className="text-muted-foreground">
            No history yet. Calculate and save your first BMI result!
          </p>
        </div>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <AnimatePresence>
        {entries.map((entry, index) => (
          <motion.div
            key={entry.id}
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ delay: index * 0.05 }}
          >
            <Card className="p-6 hover:shadow-lg transition-all duration-200 border-2 hover:border-primary/30">
              <div className="flex items-center justify-between gap-4">
                <div className="flex-1 space-y-2">
                  <div className="flex items-center gap-3">
                    <Badge
                      className={`${getCategoryColor(
                        entry.category
                      )} px-3 py-1 text-sm font-semibold rounded-full`}
                    >
                      BMI: {entry.bmi}
                    </Badge>
                    <Badge variant="outline" className="text-xs">
                      {entry.category.charAt(0).toUpperCase() +
                        entry.category.slice(1)}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-4 h-4" />
                      {format(entry.timestamp, "MMM d, yyyy 'at' h:mm a")}
                    </span>
                  </div>
                  <div className="flex items-center gap-4 text-sm">
                    <span className="font-medium">
                      {unitSystem === "metric"
                        ? `${entry.heightCm.toFixed(0)} cm`
                        : `${Math.floor(entry.heightCm / 30.48)}' ${Math.round(
                            (entry.heightCm / 2.54) % 12
                          )}"`}
                    </span>
                    <span className="text-muted-foreground">•</span>
                    <span className="font-medium">
                      {unitSystem === "metric"
                        ? `${entry.weightKg.toFixed(1)} kg`
                        : `${(entry.weightKg * 2.20462).toFixed(1)} lb`}
                    </span>
                    {entry.waistCm && (
                      <>
                        <span className="text-muted-foreground">•</span>
                        <span className="font-medium">
                          Waist:{" "}
                          {unitSystem === "metric"
                            ? `${entry.waistCm.toFixed(0)} cm`
                            : `${(entry.waistCm / 2.54).toFixed(0)} in`}
                        </span>
                      </>
                    )}
                  </div>
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onDelete(entry.id)}
                  className="hover:bg-destructive/10 hover:text-destructive transition-colors"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
            </Card>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
