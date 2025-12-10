
import React, { useState, useMemo } from 'react';
import type { User, HolidayCalendar, AppSettings } from '../types';
import { Role, EmployeeType } from '../types';
import PolicyEngine from './PolicyEngine';
import Card from './common/Card';
import { useTheme } from '../contexts/ThemeContext';
import SunIcon from './icons/SunIcon';
import MoonIcon from './icons/MoonIcon';
import HolidayAssignment from './HolidayAssignment';
import AdminPanel from './AdminPanel';
import SettingsPanel from './SettingsPanel';
import PayrollModule from './PayrollModule';
import PerformanceModule from './PerformanceModule';
import OnboardingModule from './OnboardingModule';
import WorkforceModule from './WorkforceModule';

// Icons
import HomeIcon from './icons/HomeIcon';
import BriefcaseIcon from './icons/BriefcaseIcon';
import CurrencyDollarIcon from './icons/CurrencyDollarIcon';
import ChartBarIcon from './icons/ChartBarIcon';
import UserPlusIcon from './icons/UserPlusIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import CogIcon from './icons/CogIcon';

// Mock Data
const MOCK_CALENDARS: HolidayCalendar[] = [
    { id: 'CAL-IND', name: 'India Office Holidays' },
    { id: 'CAL-US', name: 'US Office Holidays' },
];

const MOCK_USERS: User[] = [
    { id: 'USR-EMP-01', name: 'Alice (Employee)', email: 'alice@example.com', role: Role.EMPLOYEE, employeeType: EmployeeType.FULL_TIME, leaveBalance: { paid: 12, unpaid: 10 }, managerId: 'USR-MGR-01', holidayCalendarId: 'CAL-IND' },
    { id: 'USR-EMP-02', name: 'Bob (Contract)', email: 'bob@example.com', role: Role.EMPLOYEE, employeeType: EmployeeType.CONTRACT, leaveBalance: { paid: 0, unpaid: 15 }, managerId: 'USR-MGR-01', holidayCalendarId: 'CAL-US' },
    { id: 'USR-MGR-01', name: 'Charlie (Manager)', email: 'charlie@example.com', role: Role.MANAGER, employeeType: EmployeeType.FULL_TIME, leaveBalance: { paid: 20, unpaid: 10 }, teamMemberIds: ['USR-EMP-01', 'USR-EMP-02'], holidayCalendarId: 'CAL-IND' },
    { id: 'USR-HR-01', name: 'Diana (HR Manager)', email: 'diana@example.com', role: Role.HR_MANAGER, employeeType: EmployeeType.FULL_TIME, leaveBalance: { paid: 25, unpaid: 10 }, teamMemberIds: ['USR-MGR-01'], holidayCalendarId: 'CAL-IND' },
    { id: 'USR-ADM-01', name: 'Ethan (Admin)', email: 'ethan@example.com', role: Role.ADMIN, employeeType: EmployeeType.FULL_TIME, leaveBalance: { paid: 30, unpaid: 10 }, holidayCalendarId: 'CAL-IND' },
];

type ModuleType = 'dashboard' | 'workforce' | 'payroll' | 'performance' | 'onboarding' | 'admin';

interface NavItem {
    id: ModuleType;
    label: string;
    icon: React.FC<{ className?: string }>;
    allowedRoles: Role[];
}

const NAV_ITEMS: NavItem[] = [
    { id: 'dashboard', label: 'Dashboard', icon: HomeIcon, allowedRoles: [Role.EMPLOYEE, Role.MANAGER, Role.HR_MANAGER, Role.ADMIN] },
    { id: 'workforce', label: 'Workforce', icon: BriefcaseIcon, allowedRoles: [Role.EMPLOYEE, Role.MANAGER, Role.HR_MANAGER, Role.ADMIN] },
    { id: 'payroll', label: 'Payroll', icon: CurrencyDollarIcon, allowedRoles: [Role.EMPLOYEE, Role.MANAGER, Role.HR_MANAGER, Role.ADMIN] },
    { id: 'performance', label: 'Performance', icon: ChartBarIcon, allowedRoles: [Role.EMPLOYEE, Role.MANAGER, Role.HR_MANAGER, Role.ADMIN] },
    { id: 'onboarding', label: 'Onboarding', icon: UserPlusIcon, allowedRoles: [Role.EMPLOYEE, Role.MANAGER, Role.HR_MANAGER, Role.ADMIN] },
    { id: 'admin', label: 'Admin Console', icon: UserGroupIcon, allowedRoles: [Role.HR_MANAGER, Role.ADMIN] },
];

const Dashboard: React.FC = () => {
    const [users, setUsers] = useState<User[]>(MOCK_USERS);
    const [user, setUser] = useState<User>(users.find(u => u.role === Role.EMPLOYEE)!);
    const [appSettings, setAppSettings] = useState<AppSettings>({
        companyName: 'Gemini HRMS',
        logoUrl: null
    });
    
    // Navigation State
    const [activeModule, setActiveModule] = useState<ModuleType>('dashboard');
    const [activeSubTab, setActiveSubTab] = useState('overview'); 

    const { theme, toggleTheme } = useTheme();
    
    // Shared State that might be needed across modules (moved most specific logic to modules)
    const [holidayCalendars, setHolidayCalendars] = useState<HolidayCalendar[]>(MOCK_CALENDARS);

    const usersById = useMemo(() => new Map(users.map(u => [u.id, u])), [users]);

    const handleRoleChange = (newRole: Role) => {
        const newUser = users.find(u => u.role === newRole);
        if (newUser) {
            setUser(newUser);
            setActiveModule('dashboard');
            setActiveSubTab('overview');
        }
    };

    const handleAssignUsersToCalendar = (userIds: string[], calendarId: string) => {
        setUsers(prev => prev.map(u => userIds.includes(u.id) ? { ...u, holidayCalendarId: calendarId } : u));
        alert(`${userIds.length} user(s) assigned.`);
    };

    const handleUpdateUserRole = (userId: string, newRole: Role) => {
        setUsers(prev => prev.map(u => u.id === userId ? { ...u, role: newRole } : u));
    };

    const renderDashboardOverview = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="My Profile">
                <div className="space-y-2 text-gray-700 dark:text-gray-300">
                    <p><strong>Name:</strong> {user.name}</p>
                    <p><strong>Role:</strong> {user.role}</p>
                    <p><strong>Type:</strong> {user.employeeType}</p>
                </div>
            </Card>
            <Card title="Quick Leave Balance">
                <div className="flex gap-4">
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-green-600 dark:text-green-500">{user.leaveBalance.paid}</span>
                        <span className="text-xs text-gray-500">Paid</span>
                    </div>
                    <div className="text-center">
                        <span className="block text-2xl font-bold text-orange-600 dark:text-orange-500">{user.leaveBalance.unpaid}</span>
                        <span className="text-xs text-gray-500">Unpaid</span>
                    </div>
                </div>
            </Card>
            <Card title="Notifications">
                <p className="text-sm text-gray-500 dark:text-gray-400">No new notifications.</p>
            </Card>
        </div>
    );

    return (
        <div className="min-h-screen flex bg-gray-50 dark:bg-gray-900 transition-colors duration-200">
            {/* SIDEBAR */}
            <aside className="w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 flex flex-col fixed h-full z-10">
                <div className="p-6 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
                    <span className="text-xl font-bold text-indigo-600 dark:text-indigo-400 truncate">{appSettings.companyName}</span>
                </div>
                
                <nav className="flex-1 p-4 space-y-1 overflow-y-auto">
                    {NAV_ITEMS.filter(item => item.allowedRoles.includes(user.role)).map((item) => {
                        const Icon = item.icon;
                        return (
                            <button 
                                key={item.id}
                                onClick={() => { setActiveModule(item.id); setActiveSubTab('overview'); }} 
                                className={`w-full flex items-center px-4 py-3 text-sm font-medium rounded-md ${activeModule === item.id ? 'bg-indigo-50 text-indigo-700 dark:bg-indigo-900/50 dark:text-indigo-300' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700'}`}
                            >
                                <Icon className="mr-3 h-5 w-5" /> {item.label}
                            </button>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex items-center space-x-3 mb-4">
                         <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-700 dark:text-indigo-300 font-bold flex-shrink-0">
                            {user.name.charAt(0)}
                        </div>
                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{user.name}</p>
                            <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{user.role}</p>
                        </div>
                    </div>
                     <button onClick={toggleTheme} className="w-full flex items-center justify-center p-2 rounded-md bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600">
                        {theme === 'light' ? <><MoonIcon className="h-4 w-4 mr-2" /> Dark Mode</> : <><SunIcon className="h-4 w-4 mr-2" /> Light Mode</>}
                    </button>
                    
                    {/* Role Switcher for Demo */}
                    <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                         <label className="text-xs font-semibold text-gray-400 uppercase tracking-wider block mb-2">Switch View</label>
                         <select 
                            value={user.role} 
                            onChange={(e) => handleRoleChange(e.target.value as Role)}
                            className="w-full text-xs p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
                        >
                            {Object.values(Role).map(r => <option key={r} value={r}>{r}</option>)}
                         </select>
                    </div>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 ml-64 p-8 overflow-y-auto relative">
                <header className="mb-8 flex justify-between items-start">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100 capitalize">
                             {NAV_ITEMS.find(i => i.id === activeModule)?.label || 'Dashboard'}
                        </h1>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Manage your {activeModule} tasks and settings.</p>
                    </div>
                    {appSettings.logoUrl && (
                        <div className="bg-white dark:bg-gray-800 p-2 rounded-lg shadow-sm">
                            <img src={appSettings.logoUrl} alt="Company Logo" className="h-12 w-auto object-contain" />
                        </div>
                    )}
                </header>

                {activeModule === 'dashboard' && renderDashboardOverview()}
                
                {activeModule === 'workforce' && <WorkforceModule user={user} usersById={usersById} theme={theme} />}
                
                {activeModule === 'payroll' && <PayrollModule user={user} />}
                
                {activeModule === 'performance' && <PerformanceModule user={user} usersById={usersById} />}
                
                {activeModule === 'onboarding' && <OnboardingModule user={user} />}

                {activeModule === 'admin' && [Role.HR_MANAGER, Role.ADMIN].includes(user.role) && (
                    <div className="space-y-6">
                        <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                            <nav className="-mb-px flex space-x-8">
                                <button onClick={() => setActiveSubTab('policy')} className={`${activeSubTab === 'policy' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Policy Engine</button>
                                <button onClick={() => setActiveSubTab('assignments')} className={`${activeSubTab === 'assignments' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Assignments</button>
                                {user.role === Role.ADMIN && (
                                    <>
                                        <button onClick={() => setActiveSubTab('users')} className={`${activeSubTab === 'users' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>User Roles</button>
                                        <button onClick={() => setActiveSubTab('settings')} className={`${activeSubTab === 'settings' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm flex items-center gap-2`}><CogIcon className="h-4 w-4"/>Settings</button>
                                    </>
                                )}
                            </nav>
                        </div>
                        {activeSubTab === 'policy' && <PolicyEngine />}
                        {activeSubTab === 'assignments' && <HolidayAssignment users={users} calendars={holidayCalendars} onAssignUsers={handleAssignUsersToCalendar} />}
                        {activeSubTab === 'users' && <AdminPanel users={users} currentUser={user} onUpdateUserRole={handleUpdateUserRole} />}
                        {activeSubTab === 'settings' && <SettingsPanel settings={appSettings} onUpdateSettings={setAppSettings} />}
                    </div>
                )}
            </main>
        </div>
    );
};

export default Dashboard;
