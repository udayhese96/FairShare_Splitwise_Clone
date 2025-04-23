import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { AlertDialog, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import GroupInfoCard from '@/components/group/GroupInfoCard';
import ExpenseForm from '@/components/expense/ExpenseForm';
import ExpensesList from '@/components/expense/ExpensesList';
import BalanceSheet from '@/components/expense/BalanceSheet';
import PaymentInstructions from '@/components/expense/PaymentInstructions';
import SettlementHistory from '@/components/expense/SettlementHistory';
import ExpenseAnalytics from '@/components/expense/ExpenseAnalytics';
import { GroupData, MemberBalance, Settlement } from '@/types/group';
import { ArrowLeft, Trash2 } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface GroupDetailContentProps {
  group: GroupData;
  totalExpenses: number;
  balances: MemberBalance[];
  addExpense: any;
  removeExpense: any;
  deleteGroup: (groupId: string) => Promise<boolean>;
  addSettlement: (settlement: Omit<Settlement, 'id' | 'date'>) => Promise<boolean>;
  removeSettlement: (settlementId: string) => Promise<boolean>;
}

const GroupDetailContent = ({ 
  group, 
  totalExpenses, 
  balances, 
  addExpense, 
  removeExpense,
  deleteGroup,
  addSettlement,
  removeSettlement
}: GroupDetailContentProps) => {
  const navigate = useNavigate();
  const [showAddExpense, setShowAddExpense] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  
  const toggleAddExpense = () => setShowAddExpense(!showAddExpense);
  
  const handleDeleteGroup = async () => {
    const success = await deleteGroup(group.id);
    if (success) {
      toast.success("Group has been deleted");
      navigate('/groups');
    } else {
      toast.error("Failed to delete group");
    }
    setIsDeleteDialogOpen(false);
  };
  
  const handleSettleUp = async (payer: string, payee: string, amount: number, method: string, transactionId?: string) => {
    const success = await addSettlement({
      payer,
      payee,
      amount,
      method,
      transactionId,
      status: method.includes('online') ? 'completed' : undefined
    });
    
    if (success) {
      toast.success(`Payment of ₹${amount} recorded successfully`);
    } else {
      toast.error("Failed to record payment");
    }
    
    return success;
  };

  return (
    <div className="app-container">
      <div className="flex justify-between items-center mb-6">
        <Button 
          variant="ghost" 
          onClick={() => navigate('/groups')}
          className="hover:bg-secondary/60"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Groups
        </Button>
        
        <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="shadow-sm">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete Group
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent className="bg-card/95 backdrop-blur-sm">
            <AlertDialogHeader>
              <AlertDialogTitle>Delete Group</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to delete "{group?.name}"? This action cannot be undone.
                All expenses and balances will be permanently deleted.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={handleDeleteGroup}>
                Delete
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <GroupInfoCard 
          group={group} 
          showAddExpense={showAddExpense}
          toggleAddExpense={toggleAddExpense}
        />
        
        <div className="lg:col-span-2 space-y-6">
          {showAddExpense && (
            <div className="animate-fade-in">
              <ExpenseForm 
                group={group}
                onAddExpense={addExpense}
                onCancel={toggleAddExpense}
              />
            </div>
          )}
          
          <ExpensesList 
            expenses={group?.expenses || []}
            totalExpenses={totalExpenses}
            onRemoveExpense={removeExpense}
          />
          
          {group?.expenses && group.expenses.length > 0 && (
            <ExpenseAnalytics 
              group={group}
              totalExpenses={totalExpenses}
              balances={balances}
            />
          )}
          
          {group?.expenses && group.expenses.length > 0 && (
            <>
              <BalanceSheet balances={balances || []} />
              <PaymentInstructions balances={balances || []} onSettleUp={handleSettleUp} />
            </>
          )}
          
          {group?.settlements && group.settlements.length > 0 && (
            <SettlementHistory 
              settlements={group.settlements} 
              onDeleteSettlement={removeSettlement}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default GroupDetailContent;
