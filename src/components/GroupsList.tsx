
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { CalendarDays, Plus, Users } from 'lucide-react';
import { format } from 'date-fns';
import { getDatabaseConnection } from '@/utils/databaseService';

interface GroupData {
  id: string;
  name: string;
  description: string;
  members: string[];
  createdAt: string | Date;
}

export function GroupsList() {
  const [groups, setGroups] = useState<GroupData[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchGroups = async () => {
      setIsLoading(true);
      try {
        // Connect to the configured database
        const dbConnection = await getDatabaseConnection();
        const savedGroups = await dbConnection.getData();
        
        // Convert date strings back to Date objects
        const processedGroups = savedGroups.map((group: GroupData) => ({
          ...group,
          createdAt: new Date(group.createdAt)
        }));
        
        // Sort by most recently created
        processedGroups.sort((a: GroupData, b: GroupData) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
        
        setGroups(processedGroups);
      } catch (error) {
        console.error("Error fetching groups:", error);
      } finally {
        setIsLoading(false);
      }
    };

    // Add a small delay to make the loading state visible
    setTimeout(() => {
      fetchGroups();
    }, 300);
  }, []);

  if (isLoading) {
    return (
      <div className="py-12 flex justify-center">
        <div className="w-12 h-12 rounded-full border-4 border-primary/30 border-t-primary animate-spin"></div>
      </div>
    );
  }

  if (groups.length === 0) {
    return (
      <div className="py-12 text-center">
        <div className="bg-muted/50 rounded-xl p-8 max-w-md mx-auto">
          <h3 className="text-xl font-medium mb-2">No Groups Yet</h3>
          <p className="text-muted-foreground mb-6">
            Create your first expense group to start splitting costs with others.
          </p>
          <Button asChild className="button-transition">
            <Link to="/create">
              <Plus className="h-4 w-4 mr-2" />
              Create Group
            </Link>
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-medium">Your Groups</h2>
        <Button asChild className="button-transition">
          <Link to="/create">
            <Plus className="h-4 w-4 mr-2" />
            New Group
          </Link>
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group, index) => (
          <Card 
            key={group.id}
            className="shadow-subtle hover:shadow-hover transition-shadow duration-300 border border-border/60 overflow-hidden group animate-scale-in"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-medium group-hover:text-primary transition-colors duration-200">
                {group.name}
              </CardTitle>
              {group.description && (
                <CardDescription className="line-clamp-2">
                  {group.description}
                </CardDescription>
              )}
            </CardHeader>
            <CardContent className="pb-6 space-y-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Users className="h-4 w-4" />
                <span>{group.members.length} members</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Created {format(new Date(group.createdAt), 'MMM d, yyyy')}</span>
              </div>
            </CardContent>
            <CardFooter className="pt-0">
              <Button asChild variant="outline" className="w-full button-transition">
                <Link to={`/groups/${group.id}`}>
                  View Group
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default GroupsList;
