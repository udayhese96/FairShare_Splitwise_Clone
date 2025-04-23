import { useState, useEffect } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Percent, Plus } from 'lucide-react';
import { toast } from 'sonner';
import { GroupData, Expense, ExpenseSplit } from '@/types/group';

interface ExpenseFormProps {
  group: GroupData;
  onAddExpense: (expense: Expense) => Promise<boolean>;
  onCancel: () => void;
}

const ExpenseForm = ({ group, onAddExpense, onCancel }: ExpenseFormProps) => {
  const [splitType, setSplitType] = useState<'equal' | 'unequal'>('equal');
  const [newExpense, setNewExpense] = useState({
    description: '',
    amount: '',
    paidBy: ''
  });
  const [memberSplits, setMemberSplits] = useState<ExpenseSplit[]>([]);

  // Initialize member splits when amount changes
  useEffect(() => {
    if (group && group.members && group.members.length > 0) {
      const expenseAmount = parseFloat(newExpense.amount) || 0;
      const equalSplitAmount = expenseAmount / group.members.length;
      const equalSplitPercentage = 100 / group.members.length;
      
      const splits = group.members.map(memberId => ({
        memberId,
        amount: equalSplitAmount,
        percentage: equalSplitPercentage,
        isEqual: true
      }));
      
      setMemberSplits(splits);
    }
  }, [group, newExpense.amount]);

  // Format currency to show whole numbers without decimal for even amounts
  const formatCurrency = (amount: number) => {
    return Number.isInteger(amount) ? amount.toString() : amount.toFixed(2);
  };

  const updateSplitAmount = (memberId: string, value: string) => {
    const amount = parseFloat(value) || 0;
    const totalExpense = parseFloat(newExpense.amount) || 0;
    
    setMemberSplits(prev => {
      const updatedSplits = prev.map(split => {
        if (split.memberId === memberId) {
          const percentage = totalExpense > 0 ? (amount / totalExpense) * 100 : 0;
          return {
            ...split,
            amount,
            percentage,
            isEqual: false
          };
        }
        return split;
      });
      
      return updatedSplits;
    });
  };

  const updateSplitPercentage = (memberId: string, value: string) => {
    const percentage = parseFloat(value) || 0;
    const totalExpense = parseFloat(newExpense.amount) || 0;
    
    setMemberSplits(prev => {
      const updatedSplits = prev.map(split => {
        if (split.memberId === memberId) {
          const amount = totalExpense * (percentage / 100);
          return {
            ...split,
            amount,
            percentage,
            isEqual: false
          };
        }
        return split;
      });
      
      return updatedSplits;
    });
  };

  const handleEqualSplitToggle = () => {
    if (splitType === 'unequal') {
      // Reset to equal splits
      const expenseAmount = parseFloat(newExpense.amount) || 0;
      const equalSplitAmount = expenseAmount / (group?.members?.length || 1);
      const equalPercentage = 100 / (group?.members?.length || 1);
      
      setMemberSplits(prev => 
        prev.map(split => ({
          ...split,
          amount: equalSplitAmount,
          percentage: equalPercentage,
          isEqual: true
        }))
      );
      setSplitType('equal');
    } else {
      setSplitType('unequal');
    }
  };

  const handleAddExpense = async () => {
    if (!newExpense.description.trim()) {
      toast.error("Please enter a description");
      return;
    }

    if (!newExpense.amount || isNaN(Number(newExpense.amount)) || Number(newExpense.amount) <= 0) {
      toast.error("Please enter a valid amount");
      return;
    }

    if (!newExpense.paidBy.trim()) {
      toast.error("Please select who paid");
      return;
    }

    // Validate splits
    const totalSplitAmount = memberSplits.reduce((sum, split) => sum + split.amount, 0);
    const expenseAmount = parseFloat(newExpense.amount);
    
    // Allow for small floating point differences
    if (Math.abs(totalSplitAmount - expenseAmount) > 0.01) {
      toast.error("Split amounts must equal the total expense amount");
      return;
    }

    const expenseToAdd: Expense = {
      id: Date.now().toString(36) + Math.random().toString(36).substr(2),
      description: newExpense.description.trim(),
      amount: Number(newExpense.amount),
      paidBy: newExpense.paidBy,
      date: new Date(),
      splits: memberSplits
    };

    const success = await onAddExpense(expenseToAdd);
    if (success) {
      // Reset form
      setNewExpense({
        description: '',
        amount: '',
        paidBy: ''
      });
      setSplitType('equal');
      onCancel();
    }
  };

  // Guard against null or undefined group
  if (!group || !group.members) {
    return (
      <Card className="shadow-subtle border border-border/60 animate-scale-in">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Group data not available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="shadow-subtle border border-border/60 animate-scale-in">
      <CardHeader>
        <CardTitle className="text-xl font-medium">Add New Expense</CardTitle>
        <CardDescription>
          Record who paid and how much
        </CardDescription>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="expense-description">Description</Label>
          <Input
            id="expense-description"
            placeholder="Dinner, Gas, Tickets..."
            value={newExpense.description}
            onChange={(e) => setNewExpense({...newExpense, description: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expense-amount">Amount</Label>
          <Input
            id="expense-amount"
            type="number"
            min="0.01"
            step="0.01"
            placeholder="Amount"
            value={newExpense.amount}
            onChange={(e) => setNewExpense({...newExpense, amount: e.target.value})}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="expense-paid-by">Paid By</Label>
          <select
            id="expense-paid-by"
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
            value={newExpense.paidBy}
            onChange={(e) => setNewExpense({...newExpense, paidBy: e.target.value})}
          >
            <option value="">Select a person</option>
            {group.members.map((member, index) => (
              <option key={index} value={member}>{member}</option>
            ))}
          </select>
        </div>
        
        {/* Split type toggle */}
        <div className="space-y-2 pt-4 border-t border-border/40">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="split-type" 
              checked={splitType === 'unequal'}
              onCheckedChange={handleEqualSplitToggle}
            />
            <Label htmlFor="split-type" className="cursor-pointer">
              Split unequally
            </Label>
          </div>
        </div>
        
        {/* Member splits */}
        {newExpense.amount && (
          <div className="space-y-3 pt-2">
            <Label>Split Details</Label>
            {memberSplits.map((split, index) => (
              <div key={index} className="grid grid-cols-12 gap-2 items-center border border-border/40 p-2 rounded-md">
                <span className="text-sm col-span-4">{split.memberId}</span>
                
                {splitType === 'unequal' ? (
                  <>
                    <div className="col-span-4">
                      <Input
                        type="number"
                        min="0"
                        step="0.01"
                        value={split.amount}
                        onChange={(e) => updateSplitAmount(split.memberId, e.target.value)}
                        placeholder="Amount"
                        className="text-sm h-8"
                      />
                    </div>
                    <div className="col-span-4 flex items-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={split.percentage.toFixed(2)}
                        onChange={(e) => updateSplitPercentage(split.memberId, e.target.value)}
                        placeholder="%"
                        className="text-sm h-8"
                      />
                      <Percent className="h-3 w-3 ml-1 text-muted-foreground" />
                    </div>
                  </>
                ) : (
                  <div className="col-span-8 flex justify-between items-center text-sm text-muted-foreground">
                    <span>₹{formatCurrency(split.amount)}</span>
                    <span className="flex items-center">
                      {formatCurrency(split.percentage)}
                      <Percent className="h-3 w-3 ml-0.5" />
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}
      </CardContent>
      
      <CardFooter>
        <Button 
          onClick={handleAddExpense} 
          className="w-full button-transition"
        >
          Save Expense
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ExpenseForm;
