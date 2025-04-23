import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from "sonner";
import { getDatabaseConnection } from '@/utils/databaseService';
import { GroupData, Expense, ExpenseSplit, MemberBalance, Settlement } from '@/types/group';
import { v4 as uuidv4 } from 'uuid';

export const useGroupData = (groupId: string | undefined) => {
  const navigate = useNavigate();
  const [group, setGroup] = useState<GroupData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchGroup = async () => {
      try {
        setLoading(true);
        const dbConnection = await getDatabaseConnection();
        const savedGroups = await dbConnection.getData();
        const foundGroup = savedGroups.find((g: GroupData) => g.id === groupId);
        
        if (foundGroup) {
          if (!foundGroup.expenses) {
            foundGroup.expenses = [];
          }
          
          if (!foundGroup.settlements) {
            foundGroup.settlements = [];
          }
          
          foundGroup.expenses = foundGroup.expenses.map((exp: Expense) => {
            if (!exp.splits) {
              exp.splits = foundGroup.members.map(memberId => ({
                memberId,
                amount: exp.amount / foundGroup.members.length,
                percentage: 100 / foundGroup.members.length,
                isEqual: true
              }));
            }
            return exp;
          });
          
          setGroup(foundGroup);
        } else {
          toast.error("Group not found");
          navigate('/groups');
        }
      } catch (error) {
        console.error("Error fetching group:", error);
        toast.error("Failed to load group data");
      } finally {
        setLoading(false);
      }
    };

    fetchGroup();
  }, [groupId, navigate]);

  const updateGroup = async (updatedGroup: GroupData) => {
    try {
      setGroup(updatedGroup);
      const dbConnection = await getDatabaseConnection();
      const savedGroups = await dbConnection.getData();
      const updatedGroups = savedGroups.map((g: GroupData) => 
        g.id === updatedGroup.id ? updatedGroup : g
      );
      await dbConnection.saveData(updatedGroups);
      return true;
    } catch (error) {
      console.error("Error updating group:", error);
      toast.error("Failed to update group");
      return false;
    }
  };

  const addExpense = async (expenseToAdd: Expense) => {
    if (!group) return false;
    
    try {
      const updatedGroup = {
        ...group,
        expenses: [...group.expenses, expenseToAdd]
      };
      
      const success = await updateGroup(updatedGroup);
      if (success) {
        toast.success("Expense added successfully");
      }
      return success;
    } catch (error) {
      console.error("Error adding expense:", error);
      toast.error("Failed to add expense");
      return false;
    }
  };
  
  const removeExpense = async (expenseId: string) => {
    if (!group) return false;
    
    try {
      const updatedExpenses = group.expenses.filter(expense => expense.id !== expenseId);
      const updatedGroup = {
        ...group,
        expenses: updatedExpenses
      };
      
      const success = await updateGroup(updatedGroup);
      if (success) {
        toast.success("Expense removed");
      }
      return success;
    } catch (error) {
      console.error("Error removing expense:", error);
      toast.error("Failed to remove expense");
      return false;
    }
  };

  const addSettlement = async (settlementData: Omit<Settlement, 'id' | 'date'>) => {
    if (!group) return false;
    
    try {
      const newSettlement: Settlement = {
        ...settlementData,
        id: uuidv4(),
        date: new Date()
      };
      
      const updatedGroup = {
        ...group,
        settlements: [...(group.settlements || []), newSettlement]
      };
      
      const success = await updateGroup(updatedGroup);
      if (success) {
        toast.success("Settlement recorded");
      }
      return success;
    } catch (error) {
      console.error("Error adding settlement:", error);
      toast.error("Failed to record settlement");
      return false;
    }
  };

  const removeSettlement = async (settlementId: string) => {
    if (!group) return false;
    
    try {
      const updatedSettlements = group.settlements.filter(settlement => settlement.id !== settlementId);
      const updatedGroup = {
        ...group,
        settlements: updatedSettlements
      };
      
      const success = await updateGroup(updatedGroup);
      if (success) {
        toast.success("Settlement deleted");
      }
      return success;
    } catch (error) {
      console.error("Error removing settlement:", error);
      toast.error("Failed to delete settlement");
      return false;
    }
  };

  const deleteGroup = async (groupId: string) => {
    try {
      const dbConnection = await getDatabaseConnection();
      const savedGroups = await dbConnection.getData();
      const updatedGroups = savedGroups.filter((g: GroupData) => g.id !== groupId);
      
      await dbConnection.saveData(updatedGroups);
      toast.success("Group deleted successfully");
      return true;
    } catch (error) {
      console.error("Error deleting group:", error);
      toast.error("Failed to delete group");
      return false;
    }
  };
  
  const calculateBalances = (): MemberBalance[] => {
    if (!group || group.members.length === 0 || group.expenses.length === 0) return [];
    
    const balances: Record<string, MemberBalance> = {};
    
    group.members.forEach(member => {
      balances[member] = {
        name: member,
        paid: 0,
        shouldPay: 0,
        balance: 0
      };
    });
    
    group.expenses.forEach(expense => {
      if (balances[expense.paidBy]) {
        balances[expense.paidBy].paid += expense.amount;
      }
      
      if (expense.splits) {
        expense.splits.forEach(split => {
          if (balances[split.memberId]) {
            balances[split.memberId].shouldPay += split.amount;
          }
        });
      } else {
        const equalShare = expense.amount / group.members.length;
        group.members.forEach(member => {
          balances[member].shouldPay += equalShare;
        });
      }
    });
    
    if (group.settlements && group.settlements.length > 0) {
      group.settlements.forEach(settlement => {
        if (balances[settlement.payer]) {
          balances[settlement.payer].paid += settlement.amount;
        }
        
        if (balances[settlement.payee]) {
          balances[settlement.payee].shouldPay += settlement.amount;
        }
      });
    }
    
    Object.keys(balances).forEach(member => {
      balances[member].balance = balances[member].paid - balances[member].shouldPay;
    });
    
    return Object.values(balances);
  };

  const getTotalExpenses = (): number => {
    if (!group) return 0;
    return group.expenses.reduce((sum, expense) => sum + expense.amount, 0);
  };

  return {
    group,
    loading,
    setGroup,
    updateGroup,
    addExpense,
    removeExpense,
    addSettlement,
    removeSettlement,
    deleteGroup,
    calculateBalances,
    getTotalExpenses
  };
};
