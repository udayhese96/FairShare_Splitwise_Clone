
import { Button } from "@/components/ui/button";
import { useNavigate } from 'react-router-dom';

const GroupDetailNotFound = () => {
  const navigate = useNavigate();
  
  return (
    <div className="app-container">
      <div className="text-center py-12">Group not found</div>
      <div className="flex justify-center">
        <Button onClick={() => navigate('/groups')}>
          Back to Groups
        </Button>
      </div>
    </div>
  );
};

export default GroupDetailNotFound;
