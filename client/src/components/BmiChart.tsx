import { BmiEntry } from "@shared/schema";
import { Card } from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Cell,
  ReferenceLine,
} from "recharts";
import { format } from "date-fns";

interface BmiChartProps {
  entries: BmiEntry[];
}

export function BmiChart({ entries }: BmiChartProps) {
  if (entries.length === 0) {
    return null;
  }

  const chartData = entries
    .slice(0, 10)
    .reverse()
    .map((entry) => ({
      date: format(entry.timestamp, "MMM d"),
      bmi: entry.bmi,
      category: entry.category,
    }));

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "underweight":
        return "hsl(var(--bmi-underweight))";
      case "normal":
        return "hsl(var(--bmi-normal))";
      case "overweight":
        return "hsl(var(--bmi-overweight))";
      case "obese":
        return "hsl(var(--bmi-obese))";
      default:
        return "hsl(var(--muted))";
    }
  };

  return (
    <Card className="p-6 space-y-4">
      <h3 className="text-lg font-bold text-foreground">BMI History</h3>
      <div className="h-64">
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={chartData} margin={{ top: 10, right: 10, left: -20, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
            <XAxis
              dataKey="date"
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <YAxis
              domain={[15, 35]}
              tick={{ fill: "hsl(var(--muted-foreground))", fontSize: 12 }}
              axisLine={{ stroke: "hsl(var(--border))" }}
            />
            <Tooltip
              contentStyle={{
                backgroundColor: "hsl(var(--card))",
                border: "1px solid hsl(var(--border))",
                borderRadius: "8px",
                padding: "8px 12px",
              }}
              labelStyle={{ color: "hsl(var(--foreground))", fontWeight: "bold" }}
              itemStyle={{ color: "hsl(var(--foreground))" }}
            />
            <ReferenceLine y={18.5} stroke="hsl(var(--bmi-underweight))" strokeDasharray="3 3" />
            <ReferenceLine y={25} stroke="hsl(var(--bmi-overweight))" strokeDasharray="3 3" />
            <ReferenceLine y={30} stroke="hsl(var(--bmi-obese))" strokeDasharray="3 3" />
            <Bar dataKey="bmi" radius={[8, 8, 0, 0]}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={getCategoryColor(entry.category)} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
      <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--bmi-underweight))]" />
          <span>&lt; 18.5 Underweight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--bmi-normal))]" />
          <span>18.5 - 24.9 Normal</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--bmi-overweight))]" />
          <span>25 - 29.9 Overweight</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[hsl(var(--bmi-obese))]" />
          <span>≥ 30 Obese</span>
        </div>
      </div>
    </Card>
  );
}
