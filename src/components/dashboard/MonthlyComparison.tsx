import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Bar, BarChart, XAxis, YAxis, CartesianGrid, ResponsiveContainer, Legend } from "recharts";

interface Invoice {
  id: string;
  amount: number;
  invoice_date: string;
  category: string;
}

interface MonthlyComparisonProps {
  invoices: Invoice[];
}

export const MonthlyComparison = ({ invoices }: MonthlyComparisonProps) => {
  // Get top 3 categories
  const categoryTotals = invoices.reduce((acc, invoice) => {
    const category = invoice.category || "Uncategorized";
    acc[category] = (acc[category] || 0) + Number(invoice.amount);
    return acc;
  }, {} as Record<string, number>);

  const topCategories = Object.entries(categoryTotals)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 3)
    .map(([category]) => category);

  // Group invoices by month and category
  const monthlyData = invoices.reduce((acc, invoice) => {
    const date = new Date(invoice.invoice_date);
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const category = invoice.category || "Uncategorized";
    
    if (!acc[monthKey]) {
      acc[monthKey] = { month: monthKey };
      topCategories.forEach(cat => {
        acc[monthKey][cat] = 0;
      });
    }
    
    if (topCategories.includes(category)) {
      acc[monthKey][category] = (acc[monthKey][category] || 0) + Number(invoice.amount);
    }
    
    return acc;
  }, {} as Record<string, any>);

  const chartData = Object.values(monthlyData).sort((a: any, b: any) => a.month.localeCompare(b.month));

  const chartConfig = topCategories.reduce((config, category, index) => {
    config[category] = {
      label: category,
      color: `hsl(var(--chart-${index + 1}))`,
    };
    return config;
  }, {} as Record<string, { label: string; color: string }>);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Category Comparison</CardTitle>
        <CardDescription>Top 3 expense categories over time</CardDescription>
      </CardHeader>
      <CardContent>
        <ChartContainer config={chartConfig} className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey="month" 
                tickFormatter={(value) => {
                  const [year, month] = value.split('-');
                  return `${month}/${year.slice(2)}`;
                }}
              />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {topCategories.map((category) => (
                <Bar 
                  key={category}
                  dataKey={category} 
                  fill={`var(--color-${category})`}
                  stackId="a"
                />
              ))}
            </BarChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  );
};
