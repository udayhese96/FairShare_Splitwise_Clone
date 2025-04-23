import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { MemberBalance } from '@/types/group';
import { IndianRupee, ArrowUp, ArrowDown, CircleDot } from 'lucide-react';

interface BalanceSheetProps {
  balances: MemberBalance[];
}

const BalanceSheet = ({ balances }: BalanceSheetProps) => {
  // Format currency to show whole numbers without decimal for even amounts
  const formatCurrency = (amount: number) => {
    return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  };

  // Separate members who owe money from those who are owed money
  const debtors = balances.filter(b => b.balance < 0);
  const creditors = balances.filter(b => b.balance > 0);
  const settled = balances.filter(b => b.balance === 0);

  return (
    <Card className="shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <CardTitle className="text-xl font-semibold flex items-center gap-2">
          <span className="inline-flex items-center justify-center h-7 w-7 rounded-full bg-primary/10">
            <IndianRupee className="h-4 w-4 text-primary" />
          </span>
          Money Owed Summary
        </CardTitle>
        <CardDescription>
          Quick overview of who owes money in the group
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          {/* People who owe money */}
          {debtors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">People who owe money</h3>
              <div className="space-y-2">
                {debtors.map((debtor, index) => (
                  <div 
                    key={index} 
                    className="py-3 px-4 bg-red-500/10 rounded-md border border-red-500/20 hover:bg-red-500/15 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-base flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-red-500/20 text-red-600 flex items-center justify-center text-sm font-semibold">
                          {debtor.name.charAt(0).toUpperCase()}
                        </div>
                        {debtor.name}
                      </div>
                      <div className="font-semibold text-red-600 dark:text-red-500 flex items-center">
                        <ArrowDown className="h-4 w-4 mr-1" />
                        <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                        {formatCurrency(Math.abs(debtor.balance))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* People who are owed money */}
          {creditors.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">People who are owed money</h3>
              <div className="space-y-2">
                {creditors.map((creditor, index) => (
                  <div 
                    key={index} 
                    className="py-3 px-4 bg-green-500/10 rounded-md border border-green-500/20 hover:bg-green-500/15 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-base flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-green-500/20 text-green-600 flex items-center justify-center text-sm font-semibold">
                          {creditor.name.charAt(0).toUpperCase()}
                        </div>
                        {creditor.name}
                      </div>
                      <div className="font-semibold text-green-600 dark:text-green-500 flex items-center">
                        <ArrowUp className="h-4 w-4 mr-1" />
                        <IndianRupee className="h-3.5 w-3.5 mr-0.5" />
                        {formatCurrency(creditor.balance)}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* Settled members */}
          {settled.length > 0 && (
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-muted-foreground">All settled up</h3>
              <div className="space-y-2">
                {settled.map((member, index) => (
                  <div 
                    key={index} 
                    className="py-3 px-4 bg-secondary/40 rounded-md border border-border/30 hover:bg-secondary/60 transition-colors"
                  >
                    <div className="flex justify-between items-center">
                      <div className="font-medium text-base flex items-center gap-2">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center text-sm font-semibold">
                          {member.name.charAt(0).toUpperCase()}
                        </div>
                        {member.name}
                      </div>
                      <div className="font-medium text-muted-foreground flex items-center">
                        <CircleDot className="h-4 w-4 mr-1" />
                        Settled
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          
          {/* No balances message */}
          {balances.length === 0 && (
            <div className="text-center py-6 px-4">
              <p className="text-muted-foreground">No expenses recorded yet.</p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default BalanceSheet;
