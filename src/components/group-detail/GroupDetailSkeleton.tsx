
import { Button } from "@/components/ui/button";
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const GroupDetailSkeleton = () => {
  const navigate = useNavigate();
  
  return (
    <div className="app-container">
      <Button 
        variant="ghost" 
        onClick={() => navigate('/groups')}
        className="mb-6"
      >
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Groups
      </Button>
      <div className="text-center py-12">Loading group details...</div>
    </div>
  );
};

export default GroupDetailSkeleton;
