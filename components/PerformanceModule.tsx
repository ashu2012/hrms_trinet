
import React, { useState } from 'react';
import type { User, Goal } from '../types';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';

interface PerformanceModuleProps {
  user: User;
  usersById: Map<string, User>;
}

const PerformanceModule: React.FC<PerformanceModuleProps> = ({ user, usersById }) => {
    const [activeTab, setActiveTab] = useState<'goals' | 'checkins' | 'appraisals'>('goals');
    
    // Goals State
    const [goals, setGoals] = useState<Goal[]>([
        { id: 'G1', userId: user.id, title: 'Complete React Certification', description: 'Finish the advanced course.', status: 'In Progress', dueDate: '2024-12-31', progress: 60 }
    ]);
    const [newGoalTitle, setNewGoalTitle] = useState('');

    const handleAddGoal = (e: React.FormEvent) => {
        e.preventDefault();
        setGoals([...goals, { 
            id: `G-${Date.now()}`, userId: user.id, title: newGoalTitle, description: '', status: 'Not Started', dueDate: '2024-12-31', progress: 0 
        }]);
        setNewGoalTitle('');
    };

    const renderGoals = () => (
        <div className="space-y-6">
            <Card title="My Goals / OKRs">
                <form onSubmit={handleAddGoal} className="flex gap-2 mb-6">
                    <input 
                        type="text" 
                        value={newGoalTitle} 
                        onChange={(e) => setNewGoalTitle(e.target.value)} 
                        placeholder="Add a new goal..." 
                        className="flex-1 p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        required
                    />
                    <button type="submit" className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700"><PlusIcon className="h-5 w-5" /></button>
                </form>
                <div className="space-y-4">
                    {goals.map(goal => (
                        <div key={goal.id} className="p-4 border rounded-lg dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                            <div className="flex justify-between items-center mb-2">
                                <h4 className="font-semibold text-gray-800 dark:text-gray-200">{goal.title}</h4>
                                <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded-full">{goal.status}</span>
                            </div>
                            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div className="bg-indigo-600 h-2.5 rounded-full" style={{ width: `${goal.progress}%` }}></div>
                            </div>
                            <div className="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                                <span>Progress: {goal.progress}%</span>
                                <span>Due: {goal.dueDate}</span>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    );

    const renderCheckins = () => (
        <Card title="Weekly Check-in">
            <div className="text-center py-10">
                <CheckCircleIcon className="h-12 w-12 text-green-500 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">You're all caught up!</h3>
                <p className="text-gray-500 dark:text-gray-400">You submitted your check-in for this week on Monday.</p>
            </div>
        </Card>
    );

    const renderAppraisals = () => (
        <Card title="Performance Appraisal">
            <div className="border-l-4 border-yellow-400 bg-yellow-50 dark:bg-yellow-900/20 p-4 mb-4">
                <div className="flex">
                    <div className="ml-3">
                        <p className="text-sm text-yellow-700 dark:text-yellow-200">
                            Annual Review Period is Open. Please submit your self-assessment by Oct 30th.
                        </p>
                    </div>
                </div>
            </div>
            <div className="space-y-4">
                 <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Self Assessment</label>
                    <textarea rows={4} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" placeholder="Describe your achievements this year..."></textarea>
                 </div>
                 <button className="px-4 py-2 bg-indigo-600 text-white rounded hover:bg-indigo-700">Save Draft</button>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
             <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('goals')} className={`${activeTab === 'goals' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Goals & OKRs</button>
                    <button onClick={() => setActiveTab('checkins')} className={`${activeTab === 'checkins' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Check-ins</button>
                    <button onClick={() => setActiveTab('appraisals')} className={`${activeTab === 'appraisals' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Appraisals</button>
                </nav>
            </div>
            {activeTab === 'goals' && renderGoals()}
            {activeTab === 'checkins' && renderCheckins()}
            {activeTab === 'appraisals' && renderAppraisals()}
        </div>
    );
};

export default PerformanceModule;
