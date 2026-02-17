import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { UnitToggle } from "@/components/UnitToggle";
import { BmiInputs } from "@/components/BmiInputs";
import { BmiResultCard } from "@/components/BmiResultCard";
import { HistoryList } from "@/components/HistoryList";
import { BmiChart } from "@/components/BmiChart";
import {
  useBmiStorage,
  calculateBmi,
} from "@/hooks/use-bmi-storage";
import { BmiEntry, BmiCalculation } from "@shared/schema";
import { Save, Trash2, Activity } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

export default function Home() {
  const [unitSystem, setUnitSystem] = useState<"metric" | "imperial">("metric");
  const [heightCm, setHeightCm] = useState(170);
  const [weightKg, setWeightKg] = useState(70);
  const [waistCm, setWaistCm] = useState(85);
  const [calculation, setCalculation] = useState<BmiCalculation | null>(null);

  const { entries, isLoading, saveEntry, deleteEntry, clearHistory } =
    useBmiStorage();
  const { toast } = useToast();

  useEffect(() => {
    if (heightCm > 0 && weightKg > 0) {
      const result = calculateBmi(heightCm, weightKg, waistCm || undefined);
      setCalculation(result);
    } else {
      setCalculation(null);
    }
  }, [heightCm, weightKg, waistCm]);

  const handleSave = () => {
    if (!calculation) return;

    const entry: BmiEntry = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: Date.now(),
      unitSystem,
      heightCm,
      weightKg,
      waistCm: waistCm || undefined,
      bmi: calculation.bmi,
      category: calculation.category,
      waistToHeightRatio: calculation.waistToHeightRatio,
    };

    saveEntry(entry);
    toast({
      title: "Result Saved",
      description: "Your BMI calculation has been saved to history.",
    });
  };

  const handleDelete = (id: string) => {
    deleteEntry(id);
    toast({
      title: "Entry Deleted",
      description: "The entry has been removed from history.",
    });
  };

  const handleClearHistory = () => {
    clearHistory();
    toast({
      title: "History Cleared",
      description: "All entries have been removed from history.",
    });
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center gap-3">
          <Activity className="w-12 h-12 text-primary animate-spin" />
          <p className="text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-secondary/20 to-background">
      <div className="container mx-auto px-4 py-8 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8 space-y-4 animate-fade-in">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-primary/10 mb-4">
            <Activity className="w-8 h-8 text-primary" />
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-foreground">
            Smart BMI Calculator
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Calculate your Body Mass Index and track your health journey with
            comprehensive insights
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8 mb-12">
          {/* Calculator Card */}
          <div className="space-y-6 animate-slide-up">
            <div className="bg-card border-2 border-border rounded-2xl p-8 shadow-xl">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-foreground">
                  Calculate BMI
                </h2>
                <UnitToggle unitSystem={unitSystem} onChange={setUnitSystem} />
              </div>

              <BmiInputs
                unitSystem={unitSystem}
                heightCm={heightCm}
                weightKg={weightKg}
                waistCm={waistCm}
                onHeightChange={setHeightCm}
                onWeightChange={setWeightKg}
                onWaistChange={setWaistCm}
              />

              {calculation && (
                <Button
                  onClick={handleSave}
                  className="w-full mt-6 h-14 text-lg font-semibold bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl transition-all duration-200"
                >
                  <Save className="w-5 h-5 mr-2" />
                  Save Result
                </Button>
              )}
            </div>
          </div>

          {/* Result Card */}
          <div className="space-y-6">
            {calculation ? (
              <BmiResultCard calculation={calculation} unitSystem={unitSystem} />
            ) : (
              <div className="bg-card border-2 border-dashed border-border rounded-2xl p-12 text-center">
                <Activity className="w-16 h-16 mx-auto text-muted-foreground/50 mb-4" />
                <p className="text-muted-foreground text-lg">
                  Enter your measurements to calculate BMI
                </p>
              </div>
            )}
          </div>
        </div>

        {/* History Section */}
        {entries.length > 0 && (
          <div className="space-y-6 animate-fade-in">
            <div className="flex items-center justify-between">
              <h2 className="text-3xl font-bold text-foreground">
                Your History
              </h2>
              <AlertDialog>
                <AlertDialogTrigger asChild>
                  <Button
                    variant="outline"
                    size="sm"
                    className="border-2 hover:border-destructive hover:text-destructive"
                  >
                    <Trash2 className="w-4 h-4 mr-2" />
                    Clear All
                  </Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                  <AlertDialogHeader>
                    <AlertDialogTitle>Clear History?</AlertDialogTitle>
                    <AlertDialogDescription>
                      This will permanently delete all your saved BMI entries.
                      This action cannot be undone.
                    </AlertDialogDescription>
                  </AlertDialogHeader>
                  <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                      onClick={handleClearHistory}
                      className="bg-destructive hover:bg-destructive/90"
                    >
                      Clear All
                    </AlertDialogAction>
                  </AlertDialogFooter>
                </AlertDialogContent>
              </AlertDialog>
            </div>

            <BmiChart entries={entries} />
            <HistoryList
              entries={entries}
              unitSystem={unitSystem}
              onDelete={handleDelete}
            />
          </div>
        )}
      </div>
    </div>
  );
}
