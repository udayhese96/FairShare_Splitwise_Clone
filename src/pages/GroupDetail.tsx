
import { useParams } from 'react-router-dom';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import GroupDetailContent from '@/components/group-detail/GroupDetailContent';
import GroupDetailSkeleton from '@/components/group-detail/GroupDetailSkeleton';
import GroupDetailNotFound from '@/components/group-detail/GroupDetailNotFound';
import { useGroupData } from '@/hooks/useGroupData';

const GroupDetail = () => {
  const { groupId } = useParams();
  
  const { 
    group, 
    loading, 
    addExpense,
    removeExpense,
    addSettlement,
    removeSettlement,
    calculateBalances,
    getTotalExpenses,
    deleteGroup
  } = useGroupData(groupId);

  return (
    <div className="min-h-screen w-full flex flex-col">
      <Header />
      
      <main className="flex-1 pt-24 pb-16">
        {loading ? (
          <GroupDetailSkeleton />
        ) : !group ? (
          <GroupDetailNotFound />
        ) : (
          <GroupDetailContent 
            group={group}
            totalExpenses={getTotalExpenses()}
            balances={calculateBalances()}
            addExpense={addExpense}
            removeExpense={removeExpense}
            deleteGroup={deleteGroup}
            addSettlement={addSettlement}
            removeSettlement={removeSettlement}
          />
        )}
      </main>
      
      <Footer />
    </div>
  );
};

export default GroupDetail;
