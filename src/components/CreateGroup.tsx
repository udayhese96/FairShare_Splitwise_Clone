
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import { Plus, Trash2, Users } from 'lucide-react';
import { getDatabaseConnection } from '@/utils/databaseService';
import { GroupData } from '@/types/group';

export function CreateGroup() {
  const navigate = useNavigate();
  const [groupName, setGroupName] = useState("");
  const [description, setDescription] = useState("");
  const [newMember, setNewMember] = useState("");
  const [members, setMembers] = useState<string[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const addMember = () => {
    if (newMember.trim() && !members.includes(newMember.trim())) {
      setMembers([...members, newMember.trim()]);
      setNewMember("");
    } else if (members.includes(newMember.trim())) {
      toast.error("This member is already in the group");
    }
  };

  const removeMember = (index: number) => {
    setMembers(members.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!groupName.trim()) {
      toast.error("Group name is required");
      return;
    }
    
    if (members.length < 2) {
      toast.error("At least 2 members are required to split expenses");
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const groupId = Date.now().toString(36) + Math.random().toString(36).substr(2);
      
      const groupData: GroupData = {
        id: groupId,
        name: groupName.trim(),
        description: description.trim(),
        members,
        expenses: [],
        settlements: [],
        createdAt: new Date()
      };
      
      const dbConnection = await getDatabaseConnection();
      const savedGroups = await dbConnection.getData();
      await dbConnection.saveData([...savedGroups, groupData]);
      
      toast.success("Group created successfully!");
      
      setTimeout(() => {
        setIsSubmitting(false);
        navigate('/groups');
      }, 500);
    } catch (error) {
      console.error("Error creating group:", error);
      toast.error("Failed to create group");
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-lg mx-auto">
      <Card className="shadow-subtle border border-border/60 animate-scale-in">
        <CardHeader>
          <CardTitle className="text-2xl font-medium">Create a New Group</CardTitle>
          <CardDescription>
            Set up a group to start tracking and splitting expenses with friends, family, or colleagues.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="group-name">Group Name</Label>
            <Input
              id="group-name"
              placeholder="Weekend Trip, Roommates, Team Lunch..."
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
              className="transition-all duration-200"
              required
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="description">Description (Optional)</Label>
            <Input
              id="description"
              placeholder="Brief description of the group"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="transition-all duration-200"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="members">Members</Label>
            <div className="flex gap-2">
              <Input
                id="members"
                placeholder="Enter a name and press Add"
                value={newMember}
                onChange={(e) => setNewMember(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addMember())}
                className="transition-all duration-200"
              />
              <Button 
                type="button" 
                onClick={addMember}
                variant="outline"
                className="shrink-0 button-transition"
              >
                <Plus className="h-4 w-4 mr-1" />
                Add
              </Button>
            </div>
            
            {members.length > 0 && (
              <div className="mt-4 space-y-2">
                <div className="text-sm font-medium flex items-center gap-1.5 text-muted-foreground">
                  <Users className="h-4 w-4" />
                  <span>Group members ({members.length})</span>
                </div>
                <ul className="space-y-2 mt-2">
                  {members.map((member, index) => (
                    <li 
                      key={index}
                      className="flex items-center justify-between px-3 py-2 bg-secondary/50 rounded-md animate-slide-in"
                      style={{ animationDelay: `${index * 0.05}s` }}
                    >
                      <span className="text-sm">{member}</span>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeMember(index)}
                        className="h-8 w-8 p-0 text-muted-foreground hover:text-destructive"
                      >
                        <Trash2 className="h-4 w-4" />
                        <span className="sr-only">Remove {member}</span>
                      </Button>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter>
          <Button 
            type="submit" 
            className="w-full button-transition"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Creating..." : "Create Group"}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
}

export default CreateGroup;
