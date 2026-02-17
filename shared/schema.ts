import { z } from "zod";

export const bmiEntrySchema = z.object({
  id: z.string(),
  timestamp: z.number(),
  unitSystem: z.enum(["metric", "imperial"]),
  heightCm: z.number(),
  weightKg: z.number(),
  waistCm: z.number().optional(),
  bmi: z.number(),
  category: z.enum(["underweight", "normal", "overweight", "obese"]),
  waistToHeightRatio: z.number().optional(),
});

export type BmiEntry = z.infer<typeof bmiEntrySchema>;

export interface BmiCalculation {
  bmi: number;
  category: "underweight" | "normal" | "overweight" | "obese";
  healthyWeightRange: {
    min: number;
    max: number;
  };
  waistToHeightRatio?: number;
  waistToHeightInterpretation?: string;
}
