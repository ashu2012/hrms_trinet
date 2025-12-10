
import React, { useState, useMemo } from 'react';
import type { User, HolidayCalendar } from '../types';
import Card from './common/Card';

interface HolidayAssignmentProps {
  users: User[];
  calendars: HolidayCalendar[];
  onAssignUsers: (userIds: string[], calendarId: string) => void;
}

const HolidayAssignment: React.FC<HolidayAssignmentProps> = ({ users, calendars, onAssignUsers }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedUserIds, setSelectedUserIds] = useState<string[]>([]);
  const [targetCalendarId, setTargetCalendarId] = useState<string>(calendars[0]?.id || '');
  
  const calendarsById = useMemo(() => new Map(calendars.map(c => [c.id, c])), [calendars]);

  const filteredUsers = useMemo(() => {
    return users.filter(user => 
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);
  
  const handleUserSelect = (userId: string) => {
    setSelectedUserIds(prev => 
      prev.includes(userId) ? prev.filter(id => id !== userId) : [...prev, userId]
    );
  };
  
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedUserIds(filteredUsers.map(u => u.id));
    } else {
      setSelectedUserIds([]);
    }
  };

  const handleSubmit = () => {
    if (selectedUserIds.length === 0 || !targetCalendarId) {
        alert("Please select at least one user and a target calendar.");
        return;
    }
    onAssignUsers(selectedUserIds, targetCalendarId);
    setSelectedUserIds([]);
  };
  
  const isAllSelected = filteredUsers.length > 0 && selectedUserIds.length === filteredUsers.length;

  return (
    <Card title="Assign Users to Holiday Calendars">
      <div className="space-y-4">
        <div className="flex flex-col sm:flex-row gap-4">
          <input
            type="search"
            placeholder="Search employees by name or email..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full sm:flex-grow px-3 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
          />
        </div>

        <div className="border rounded-lg dark:border-gray-700 max-h-96 overflow-y-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
                    <tr>
                        <th scope="col" className="p-4">
                            <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                checked={isAllSelected}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                        <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Current Calendar</th>
                    </tr>
                </thead>
                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {filteredUsers.map(user => (
                        <tr key={user.id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                            <td className="p-4">
                                <input type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                                    checked={selectedUserIds.includes(user.id)}
                                    onChange={() => handleUserSelect(user.id)}
                                />
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name}</div>
                                <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                                {calendarsById.get(user.holidayCalendarId)?.name || 'N/A'}
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
        
        {filteredUsers.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users found.</p>}

        <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="flex items-center gap-2">
                <label htmlFor="targetCalendar" className="text-sm font-medium text-gray-700 dark:text-gray-300">Assign selected ({selectedUserIds.length}) to:</label>
                <select id="targetCalendar" value={targetCalendarId} onChange={e => setTargetCalendarId(e.target.value)} className="pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                    {calendars.map(cal => <option key={cal.id} value={cal.id}>{cal.name}</option>)}
                </select>
            </div>
            <button onClick={handleSubmit} disabled={selectedUserIds.length === 0} className="w-full sm:w-auto inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300">
                Assign Users
            </button>
        </div>

      </div>
    </Card>
  );
};

export default HolidayAssignment;
