import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer } from "recharts";

interface Invoice {
  id: string;
  amount: number;
  category: string;
}

interface ExpenseBreakdownProps {
  invoices: Invoice[];
}

export const ExpenseBreakdown = ({ invoices }: ExpenseBreakdownProps) => {
  // Group by category
  const categoryData = invoices.reduce((acc, invoice) => {
    const category = invoice.category || "Uncategorized";
    if (!acc[category]) {
      acc[category] = { category, total: 0 };
    }
    acc[category].total += Number(invoice.amount);
    return acc;
  }, {} as Record<string, { category: string; total: number }>);

  const chartData = Object.values(categoryData).sort((a, b) => b.total - a.total);

  const chartConfig = {
    total: {
      label: "Amount",
      color: "hsl(var(--secondary))",
    },
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown by Category</CardTitle>
        <CardDescription>View expenses organized by category</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="category" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Bar dataKey="total" fill="var(--color-total)" />
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
