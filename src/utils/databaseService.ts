
// The DatabaseService manages data storage for the application.
// It currently uses localStorage, but could be extended to use other storage options.

import { v4 as uuidv4 } from 'uuid';
import { GroupData } from '@/types/group';

// This is a simple database service that uses localStorage
// In a real app, this would be replaced with a proper backend

export enum DatabaseType {
  LOCAL = 'local',
  GOOGLE_SHEETS = 'google_sheets',
  MYSQL = 'mysql',
}

export interface DatabaseConnection {
  getData: () => Promise<GroupData[]>;
  saveData: (data: GroupData[]) => Promise<void>;
}

// LocalStorage Database Implementation
class LocalStorageDB implements DatabaseConnection {
  private storageKey: string;

  constructor(storageKey: string = 'splitwise_data') {
    this.storageKey = storageKey;
  }

  async getData(): Promise<GroupData[]> {
    try {
      const data = localStorage.getItem(this.storageKey);
      
      if (!data) {
        return [];
      }
      
      return JSON.parse(data);
    } catch (error) {
      console.error('Error retrieving data from localStorage:', error);
      return [];
    }
  }

  async saveData(data: GroupData[]): Promise<void> {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(data));
    } catch (error) {
      console.error('Error saving data to localStorage:', error);
      throw error;
    }
  }
}

// Factory function to get the appropriate database connection
export async function getDatabaseConnection(
  type: DatabaseType = DatabaseType.LOCAL,
  config: any = {}
): Promise<DatabaseConnection> {
  // Check if data exists in localStorage
  const existingData = localStorage.getItem('splitwise_data');
  if (!existingData) {
    // If no data exists, initialize with sample data
    await initializeSampleData();
  }

  // For now, we only support localStorage
  if (type === DatabaseType.LOCAL) {
    return new LocalStorageDB(config.storageKey);
  }
  
  // Future implementations could include:
  if (type === DatabaseType.GOOGLE_SHEETS) {
    // return new GoogleSheetsDB(config);
    console.warn('Google Sheets DB not implemented yet, using localStorage instead');
    return new LocalStorageDB(config.storageKey);
  }
  
  if (type === DatabaseType.MYSQL) {
    // return new MySQLDB(config);
    console.warn('MySQL DB not implemented yet, using localStorage instead');
    return new LocalStorageDB(config.storageKey);
  }

  // Default fallback
  return new LocalStorageDB(config.storageKey);
}

// Initialize sample data for demonstration purposes
async function initializeSampleData() {
  const sampleGroupId = uuidv4();
  const now = new Date();
  const yesterday = new Date(now);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const sampleExpenseId1 = uuidv4();
  const sampleExpenseId2 = uuidv4();

  const sampleData: GroupData[] = [
    {
      id: sampleGroupId,
      name: 'Weekend Trip',
      description: 'Goa beach vacation with friends',
      members: ['Alice', 'Bob', 'Charlie', 'Diana'],
      expenses: [
        {
          id: sampleExpenseId1,
          description: 'Hotel Booking',
          amount: 8000,
          paidBy: 'Alice',
          date: yesterday,
          splits: [
            { memberId: 'Alice', amount: 2000, percentage: 25, isEqual: true },
            { memberId: 'Bob', amount: 2000, percentage: 25, isEqual: true },
            { memberId: 'Charlie', amount: 2000, percentage: 25, isEqual: true },
            { memberId: 'Diana', amount: 2000, percentage: 25, isEqual: true }
          ]
        },
        {
          id: sampleExpenseId2,
          description: 'Dinner',
          amount: 2400,
          paidBy: 'Bob',
          date: now,
          splits: [
            { memberId: 'Alice', amount: 600, percentage: 25, isEqual: true },
            { memberId: 'Bob', amount: 600, percentage: 25, isEqual: true },
            { memberId: 'Charlie', amount: 600, percentage: 25, isEqual: true },
            { memberId: 'Diana', amount: 600, percentage: 25, isEqual: true }
          ]
        }
      ],
      settlements: [],
      createdAt: new Date(now.setDate(now.getDate() - 3))
    }
  ];

  localStorage.setItem('splitwise_data', JSON.stringify(sampleData));
}
