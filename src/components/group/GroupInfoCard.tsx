
import { Users, Plus, Wallet } from 'lucide-react';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { GroupData } from '@/types/group';
import { Badge } from "@/components/ui/badge";

interface GroupInfoCardProps {
  group: GroupData;
  showAddExpense: boolean;
  toggleAddExpense: () => void;
}

const GroupInfoCard = ({ group, showAddExpense, toggleAddExpense }: GroupInfoCardProps) => {
  // Safeguard against undefined group
  if (!group) {
    return (
      <Card className="lg:col-span-1 shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
        <CardContent className="pt-6">
          <div className="text-center text-muted-foreground">
            Group data not available
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="lg:col-span-1 shadow-lg border border-border/60 bg-card/95 backdrop-blur-sm">
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-2">
          <Wallet className="h-5 w-5 text-primary" />
          <CardTitle className="text-xl font-semibold">{group.name}</CardTitle>
        </div>
        {group.description && (
          <CardDescription className="mt-2 text-sm">{group.description}</CardDescription>
        )}
      </CardHeader>
      
      <CardContent>
        <div className="space-y-4">
          <div className="text-sm font-medium flex items-center gap-1.5 text-foreground mb-2">
            <Users className="h-4 w-4 text-primary" />
            <span>Group members ({group.members?.length || 0})</span>
          </div>
          
          {group.members && group.members.length > 0 ? (
            <div className="grid grid-cols-1 gap-2">
              {group.members.map((member, index) => (
                <div 
                  key={index}
                  className="flex items-center px-3 py-2.5 bg-secondary/40 hover:bg-secondary/60 rounded-md border border-border/30 transition-colors"
                >
                  <div className="h-6 w-6 rounded-full bg-primary/10 text-primary flex items-center justify-center text-xs font-medium mr-2.5">
                    {member.charAt(0).toUpperCase()}
                  </div>
                  <span className="text-sm font-medium">{member}</span>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-3 text-muted-foreground">
              No members added yet
            </div>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex flex-col space-y-4 pt-2">
        <Button 
          onClick={toggleAddExpense} 
          variant={showAddExpense ? "outline" : "default"}
          className="w-full button-transition shadow-sm"
        >
          {showAddExpense ? "Cancel" : (
            <>
              <Plus className="mr-2 h-4 w-4" />
              Add Expense
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default GroupInfoCard;
