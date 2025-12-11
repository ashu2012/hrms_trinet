import React, { useState, useMemo } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import Card from './common/Card';

interface AdminPanelProps {
  users: User[];
  currentUser: User;
  onUpdateUserRole: (userId: string, newRole: Role) => void;
}

const AdminPanel: React.FC<AdminPanelProps> = ({ users, currentUser, onUpdateUserRole }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const filteredUsers = useMemo(() => {
    return users.filter(user =>
      user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [users, searchTerm]);

  return (
    <Card title="Admin Panel: User Role Management">
      <div className="space-y-4">
        <input
          type="search"
          placeholder="Search employees by name or email..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full px-3 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
        />
        <div className="border rounded-lg dark:border-gray-700 max-h-[60vh] overflow-y-auto">
          <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
            <thead className="bg-gray-50 dark:bg-gray-700 sticky top-0">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Name</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Role</th>
              </tr>
            </thead>
            <tbody className="bg-brand-surface dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
              {filteredUsers.map(user => (
                <tr key={user.id}>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900 dark:text-gray-200">{user.name}</div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {user.id === currentUser.id ? (
                      <span className="text-sm text-gray-500 dark:text-gray-400 font-semibold">{user.role} (You)</span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => onUpdateUserRole(user.id, e.target.value as Role)}
                        className="pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"
                      >
                        {Object.values(Role).map(role => (
                          <option key={role} value={role}>{role}</option>
                        ))}
                      </select>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {filteredUsers.length === 0 && <p className="text-center text-gray-500 dark:text-gray-400 py-4">No users found.</p>}
      </div>
    </Card>
  );
};

export default AdminPanel;