import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Pie, PieChart, Cell, ResponsiveContainer, Legend } from "recharts";

interface Invoice {
  id: string;
  amount: number;
  category: string;
}

interface ExpensePieChartProps {
  invoices: Invoice[];
}

const COLORS = [
  "hsl(var(--primary))",
  "hsl(var(--secondary))",
  "hsl(var(--accent))",
  "hsl(var(--muted))",
  "hsl(var(--chart-1))",
  "hsl(var(--chart-2))",
  "hsl(var(--chart-3))",
  "hsl(var(--chart-4))",
  "hsl(var(--chart-5))",
];

export const ExpensePieChart = ({ invoices }: ExpensePieChartProps) => {
  // Group by category
  const categoryData = invoices.reduce((acc, invoice) => {
    const category = invoice.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = { name: category, value: 0 };
    }
    acc[category].value += Number(invoice.amount);
    return acc;
  }, {} as Record<string, { name: string; value: number }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.value - a.value);

  const chartConfig = {
    value: {
      label: "Amount",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Distribution</CardTitle>
        <CardDescription>Percentage breakdown by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={chartData}
                cx="50%"
                cy="50%"
                labelLine={false}
                label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                outerRadius={80}
                fill="var(--color-value)"
                dataKey="value"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
