
import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { GroupData, MemberBalance } from '@/types/group';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { BarChart, PieChart, Bar, Pie, XAxis, YAxis, Tooltip, Legend, Cell, ResponsiveContainer } from 'recharts';
import { ChartBarIcon, ChartPieIcon, BarChart3Icon } from 'lucide-react';

interface ExpenseAnalyticsProps {
  group: GroupData;
  totalExpenses: number;
  balances: MemberBalance[];
}

// Colors for the charts
const COLORS = [
  '#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', 
  '#00C49F', '#FFBB28', '#FF8042', '#a4de6c', '#d0ed57'
];

const ExpenseAnalytics = ({ group, totalExpenses, balances }: ExpenseAnalyticsProps) => {
  const [activeTab, setActiveTab] = useState("spending-breakdown");

  // Format currency to always show two decimal places
  const formatCurrency = (amount: number) => {
    return amount.toFixed(2);
  };

  // 1. Spending Breakdown - Bar Chart Data
  const getSpendingBreakdownData = () => {
    return balances.map((balance, index) => ({
      name: balance.name,
      paid: balance.paid,
      fill: COLORS[index % COLORS.length]
    }));
  };

  // 2. Share of Total Expenses - Pie Chart Data
  const getExpenseShareData = () => {
    return balances.map((balance, index) => ({
      name: balance.name,
      value: balance.shouldPay,
      fill: COLORS[index % COLORS.length]
    }));
  };

  // 3. Payments vs Amount Owed - Stacked Bar Chart Data
  const getPaymentsVsOwedData = () => {
    return balances.map((balance, index) => ({
      name: balance.name,
      paid: balance.paid,
      shouldPay: balance.shouldPay,
      fill: COLORS[index % COLORS.length]
    }));
  };

  // Function to render the percentage in Pie charts
  const renderPieChartLabel = ({ name, percent }: { name: string; percent: number }) => {
    return `${name}: ${(percent * 100).toFixed(0)}%`;
  };

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <BarChart3Icon className="h-5 w-5 text-primary" />
          Expense Analytics
        </CardTitle>
      </CardHeader>
      
      <CardContent>
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="mb-6 grid grid-cols-3">
            <TabsTrigger value="spending-breakdown" className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              <span className="hidden md:inline">Spending</span>
            </TabsTrigger>
            <TabsTrigger value="expense-share" className="flex items-center gap-2">
              <ChartPieIcon className="h-4 w-4" />
              <span className="hidden md:inline">Share</span>
            </TabsTrigger>
            <TabsTrigger value="payments-vs-owed" className="flex items-center gap-2">
              <BarChart3Icon className="h-4 w-4" />
              <span className="hidden md:inline">Paid vs Owed</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="spending-breakdown" className="mt-0 border-none p-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Spending Breakdown</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{ 
                      series1: { theme: { light: COLORS[0], dark: COLORS[0] } },
                    }}
                  >
                    <BarChart
                      data={getSpendingBreakdownData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Name
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {payload[0].payload.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Amount
                                    </span>
                                    <span className="font-bold text-foreground">
                                      ₹{formatCurrency(payload[0].value as number)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Bar dataKey="paid" name="Amount Paid" fill="#8884d8" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="expense-share" className="mt-0 border-none p-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Share of Total Expenses</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer config={{}}>
                    <PieChart margin={{ top: 20, right: 30, left: 20, bottom: 20 }}>
                      <Pie
                        data={getExpenseShareData()}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={renderPieChartLabel}
                      >
                        {getExpenseShareData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.fill} />
                        ))}
                      </Pie>
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-2 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Name
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {payload[0].payload.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Amount
                                    </span>
                                    <span className="font-bold text-foreground">
                                      ₹{formatCurrency(payload[0].value as number)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                    </PieChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="payments-vs-owed" className="mt-0 border-none p-0">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base font-medium">Payments vs Amount Owed</CardTitle>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="h-80">
                  <ChartContainer
                    config={{
                      paid: { theme: { light: '#82ca9d', dark: '#82ca9d' } },
                      shouldPay: { theme: { light: '#8884d8', dark: '#8884d8' } },
                    }}
                  >
                    <BarChart
                      data={getPaymentsVsOwedData()}
                      margin={{ top: 20, right: 30, left: 20, bottom: 70 }}
                    >
                      <XAxis dataKey="name" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip 
                        content={({ active, payload }) => {
                          if (active && payload && payload.length) {
                            return (
                              <div className="rounded-lg border bg-background p-2 shadow-sm">
                                <div className="grid grid-cols-1 gap-2">
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Name
                                    </span>
                                    <span className="font-bold text-foreground">
                                      {payload[0].payload.name}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Paid
                                    </span>
                                    <span className="font-bold text-green-600">
                                      ₹{formatCurrency(payload[0].payload.paid as number)}
                                    </span>
                                  </div>
                                  <div className="flex flex-col">
                                    <span className="text-[0.70rem] uppercase text-muted-foreground">
                                      Should Pay
                                    </span>
                                    <span className="font-bold text-blue-600">
                                      ₹{formatCurrency(payload[0].payload.shouldPay as number)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                            );
                          }
                          return null;
                        }}
                      />
                      <Legend />
                      <Bar dataKey="paid" name="Amount Paid" fill="#82ca9d" />
                      <Bar dataKey="shouldPay" name="Should Pay" fill="#8884d8" />
                    </BarChart>
                  </ChartContainer>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default ExpenseAnalytics;

