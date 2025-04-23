import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash2, IndianRupee, Calendar, User } from 'lucide-react';
import { Expense } from '@/types/group';
import { Badge } from "@/components/ui/badge";

interface ExpensesListProps {
  expenses: Expense[];
  totalExpenses: number;
  onRemoveExpense: (expenseId: string) => Promise<boolean>;
}

const ExpensesList = ({ expenses, totalExpenses, onRemoveExpense }: ExpensesListProps) => {
  // Format currency to show whole numbers without decimal for even amounts
  const formatCurrency = (amount: number) => {
    return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  };

  // Format date to a human-readable format
  const formatDate = (date: Date) => {
    if (!date) return '';
    const d = new Date(date);
    return d.toLocaleDateString('en-IN', { 
      day: 'numeric', 
      month: 'short', 
      year: 'numeric' 
    });
  };

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex justify-between items-center">
          <CardTitle className="text-xl font-semibold flex items-center gap-2">
            <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10">
              <IndianRupee className="h-4 w-4 text-primary" />
            </span>
            Expenses
          </CardTitle>
          {expenses.length > 0 && (
            <Badge variant="secondary" className="text-xs font-medium px-2.5 py-1">
              Total: ₹{formatCurrency(totalExpenses)}
            </Badge>
          )}
        </div>
      </CardHeader>
      
      <CardContent>
        {expenses.length === 0 ? (
          <div className="text-center py-10 px-4">
            <div className="h-12 w-12 rounded-full bg-secondary/60 mx-auto flex items-center justify-center mb-3">
              <IndianRupee className="h-6 w-6 text-muted-foreground" />
            </div>
            <p className="text-muted-foreground font-medium">No expenses added yet</p>
            <p className="text-sm text-muted-foreground mt-1">Add your first expense to start tracking</p>
          </div>
        ) : (
          <div className="space-y-3">
            {expenses.map((expense) => (
              <div 
                key={expense.id} 
                className="py-4 px-4 bg-secondary/40 rounded-md border border-border/30 hover:bg-secondary/60 transition-colors"
              >
                <div className="flex justify-between">
                  <div>
                    <div className="font-medium text-base">{expense.description}</div>
                    <div className="flex flex-wrap gap-x-3 gap-y-1 mt-2">
                      <div className="flex items-center text-xs text-muted-foreground">
                        <User className="h-3 w-3 mr-1" />
                        {expense.paidBy}
                      </div>
                      <div className="flex items-center text-xs text-muted-foreground">
                        <Calendar className="h-3 w-3 mr-1" />
                        {formatDate(expense.date)}
                      </div>
                    </div>
                    {expense.splits && expense.splits.some(s => !s.isEqual) && (
                      <div className="mt-2">
                        <Badge variant="outline" className="text-xs bg-primary/5">
                          Unequal split
                        </Badge>
                      </div>
                    )}
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="font-medium text-base flex items-center">
                      <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                      {formatCurrency(expense.amount)}
                    </div>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => onRemoveExpense(expense.id)}
                      className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive rounded-full"
                    >
                      <Trash2 className="h-4 w-4" />
                      <span className="sr-only">Remove expense</span>
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ExpensesList;
