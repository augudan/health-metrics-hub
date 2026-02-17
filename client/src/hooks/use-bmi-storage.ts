import { useState, useEffect } from "react";
import { BmiEntry, BmiCalculation } from "@shared/schema";

const STORAGE_KEY = "bmi-history";

export function useBmiStorage() {
  const [entries, setEntries] = useState<BmiEntry[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        setEntries(Array.isArray(parsed) ? parsed : []);
      }
    } catch (error) {
      console.error("Failed to load BMI history:", error);
      setEntries([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  const saveEntry = (entry: BmiEntry) => {
    const updated = [entry, ...entries];
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to save BMI entry:", error);
    }
  };

  const deleteEntry = (id: string) => {
    const updated = entries.filter((entry) => entry.id !== id);
    setEntries(updated);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(updated));
    } catch (error) {
      console.error("Failed to delete BMI entry:", error);
    }
  };

  const clearHistory = () => {
    setEntries([]);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch (error) {
      console.error("Failed to clear BMI history:", error);
    }
  };

  return {
    entries,
    isLoading,
    saveEntry,
    deleteEntry,
    clearHistory,
  };
}

export function calculateBmi(
  heightCm: number,
  weightKg: number,
  waistCm?: number
): BmiCalculation {
  const heightM = heightCm / 100;
  const bmi = weightKg / (heightM * heightM);

  let category: BmiCalculation["category"];
  if (bmi < 18.5) {
    category = "underweight";
  } else if (bmi < 25) {
    category = "normal";
  } else if (bmi < 30) {
    category = "overweight";
  } else {
    category = "obese";
  }

  const healthyWeightRange = {
    min: Math.round(18.5 * heightM * heightM * 10) / 10,
    max: Math.round(24.9 * heightM * heightM * 10) / 10,
  };

  let waistToHeightRatio: number | undefined;
  let waistToHeightInterpretation: string | undefined;

  if (waistCm) {
    waistToHeightRatio = waistCm / heightCm;
    waistToHeightInterpretation =
      waistToHeightRatio < 0.5
        ? "Healthy - Low health risk"
        : waistToHeightRatio < 0.6
        ? "Increased health risk"
        : "High health risk";
  }

  return {
    bmi: Math.round(bmi * 10) / 10,
    category,
    healthyWeightRange,
    waistToHeightRatio:
      waistToHeightRatio !== undefined
        ? Math.round(waistToHeightRatio * 100) / 100
        : undefined,
    waistToHeightInterpretation,
  };
}

export function convertUnits(
  value: number,
  from: "metric" | "imperial",
  type: "height" | "weight" | "waist"
): number {
  if (type === "height") {
    return from === "metric" ? value / 2.54 : value * 2.54;
  } else if (type === "weight") {
    return from === "metric" ? value * 2.20462 : value / 2.20462;
  } else {
    return from === "metric" ? value / 2.54 : value * 2.54;
  }
}
