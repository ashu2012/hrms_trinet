
import React, { useState } from 'react';
import type { User, LeaveRequest, Holiday, HolidayCalendar, Project, TimesheetEntry } from '../types';
import { Role, EmployeeType, LeaveStatus } from '../types';
import Card from './common/Card';
import HolidayCalendarAdmin from './HolidayCalendarAdmin';
import { generateSpeech } from '../services/geminiService';
import { playAudio } from '../utils/helpers';
import PlusIcon from './icons/PlusIcon';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';

interface WorkforceModuleProps {
    user: User;
    usersById: Map<string, User>;
    theme: string;
}

// Mock Data moved from Dashboard
const MOCK_CALENDARS: HolidayCalendar[] = [
    { id: 'CAL-IND', name: 'India Office Holidays' },
    { id: 'CAL-US', name: 'US Office Holidays' },
];

const MOCK_INITIAL_HOLIDAYS: Holiday[] = [
    { id: 'H-1', calendarId: 'CAL-IND', date: `${new Date().getFullYear()}-01-26`, name: 'Republic Day', applicableTo: [EmployeeType.FULL_TIME, EmployeeType.CONTRACT] },
    { id: 'H-2', calendarId: 'CAL-IND', date: `${new Date().getFullYear()}-08-15`, name: 'Independence Day', applicableTo: [EmployeeType.FULL_TIME, EmployeeType.CONTRACT] },
    { id: 'H-3', calendarId: 'CAL-IND', date: `${new Date().getFullYear()}-10-31`, name: 'Diwali', applicableTo: [EmployeeType.FULL_TIME] },
    { id: 'H-4', calendarId: 'CAL-US', date: `${new Date().getFullYear()}-07-04`, name: 'Independence Day', applicableTo: [EmployeeType.FULL_TIME, EmployeeType.CONTRACT] },
    { id: 'H-5', calendarId: 'CAL-US', date: `${new Date().getFullYear()}-11-28`, name: 'Thanksgiving', applicableTo: [EmployeeType.FULL_TIME] },
];

const MOCK_INITIAL_LEAVE_REQUESTS: LeaveRequest[] = [
    { id: 'LR-001', userId: 'USR-EMP-01', startDate: '2024-08-10', endDate: '2024-08-12', reason: 'Family vacation.', status: LeaveStatus.APPROVED, leaveType: 'Paid' },
    { id: 'LR-002', userId: 'USR-EMP-02', startDate: '2024-09-01', endDate: '2024-09-05', reason: 'Project break.', status: LeaveStatus.PENDING, leaveType: 'Unpaid' },
];

const MOCK_PROJECTS: Project[] = [
    { id: 'PRJ-001', name: 'Gemini HRMS Development', code: 'GH-DEV', status: 'Active' },
    { id: 'PRJ-002', name: 'Website Redesign', code: 'WEB-RD', status: 'Active' },
    { id: 'PRJ-003', name: 'Legacy Migration', code: 'LEG-MIG', status: 'Completed' },
];

const MOCK_TIMESHEETS: TimesheetEntry[] = [
    { id: 'TS-001', userId: 'USR-EMP-01', projectId: 'PRJ-001', date: '2024-10-21', hours: 8, description: 'Frontend development', status: 'Approved' },
    { id: 'TS-002', userId: 'USR-EMP-01', projectId: 'PRJ-002', date: '2024-10-22', hours: 4, description: 'Meeting with client', status: 'Pending' },
];

const WorkforceModule: React.FC<WorkforceModuleProps> = ({ user, usersById, theme }) => {
    const [activeSubTab, setActiveSubTab] = useState<'leave' | 'holidays' | 'timesheets' | 'team'>('leave');
    
    // --- Leave State ---
    const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(MOCK_INITIAL_LEAVE_REQUESTS);
    const [leaveStartDate, setLeaveStartDate] = useState('');
    const [leaveEndDate, setLeaveEndDate] = useState('');
    const [leaveType, setLeaveType] = useState<'Paid' | 'Unpaid'>('Paid');
    const [leaveReason, setLeaveReason] = useState('');
    const [leaveError, setLeaveError] = useState('');
    const [overlappingHolidays, setOverlappingHolidays] = useState<Holiday[] | null>(null);

    // --- Holiday State ---
    const [holidays, setHolidays] = useState<Holiday[]>(MOCK_INITIAL_HOLIDAYS);
    const [holidayCalendars, setHolidayCalendars] = useState<HolidayCalendar[]>(MOCK_CALENDARS);
    const [holidayFilter, setHolidayFilter] = useState<'All' | EmployeeType>('All');

    // --- Timesheet State ---
    const [timesheets, setTimesheets] = useState<TimesheetEntry[]>(MOCK_TIMESHEETS);
    const [projects] = useState<Project[]>(MOCK_PROJECTS);
    const [tsDate, setTsDate] = useState('');
    const [tsProjectId, setTsProjectId] = useState(MOCK_PROJECTS[0].id);
    const [tsHours, setTsHours] = useState('');
    const [tsDesc, setTsDesc] = useState('');

    // --- Leave Handlers ---
    const handleLeaveSubmit = async (e: React.FormEvent, bypassHolidayCheck = false) => {
        e.preventDefault();
        setLeaveError('');
        if (overlappingHolidays && !bypassHolidayCheck) setOverlappingHolidays(null);

        if (!leaveStartDate || !leaveEndDate || !leaveReason) {
            setLeaveError('Please fill out all fields.'); return;
        }
        if (leaveStartDate > leaveEndDate) {
            setLeaveError('Start date cannot be after the end date.'); return;
        }
        const today = new Date().toISOString().split('T')[0];
        if (leaveStartDate < today) {
            setLeaveError('Start date cannot be in the past.'); return;
        }
        const startDate = new Date(leaveStartDate);
        const endDate = new Date(leaveEndDate);
        const duration = (endDate.getTime() - startDate.getTime()) / (1000 * 60 * 60 * 24) + 1;
        const balance = leaveType === 'Paid' ? user.leaveBalance.paid : user.leaveBalance.unpaid;
        if (duration > balance) {
            setLeaveError(`Duration (${duration} days) exceeds available ${leaveType.toLowerCase()} leave (${balance} days).`); return;
        }
        if (!bypassHolidayCheck) {
            const overlapping: Holiday[] = [];
            for (let d = new Date(startDate); d <= endDate; d.setDate(d.getDate() + 1)) {
                const currentDateString = d.toISOString().split('T')[0];
                const holiday = holidays.find(h => h.date === currentDateString && h.calendarId === user.holidayCalendarId && h.applicableTo.includes(user.employeeType));
                if (holiday) overlapping.push(holiday);
            }
            if (overlapping.length > 0) {
                setOverlappingHolidays(overlapping); return;
            }
        }
        const newRequest: LeaveRequest = { id: `LR-${Date.now()}`, userId: user.id, startDate: leaveStartDate, endDate: leaveEndDate, reason: leaveReason, leaveType: leaveType, status: LeaveStatus.PENDING };
        setLeaveRequests(prev => [newRequest, ...prev]);
        const ttsText = `Your leave request for '${leaveReason.substring(0, 20)}...' has been submitted.`;
        const audioData = await generateSpeech(ttsText);
        if (audioData) playAudio(audioData);
        setLeaveStartDate(''); setLeaveEndDate(''); setLeaveType('Paid'); setLeaveReason(''); setOverlappingHolidays(null);
    };

    const handleUpdateRequestStatus = (requestId: string, status: LeaveStatus) => {
        setLeaveRequests(prev => prev.map(req => req.id === requestId ? { ...req, status } : req));
    };

    // --- Holiday Handlers ---
    const handleAddHoliday = (newHoliday: Omit<Holiday, 'id'>) => {
        const holidayWithId: Holiday = { ...newHoliday, id: `H-${Date.now()}` };
        setHolidays(prev => [...prev, holidayWithId].sort((a, b) => a.date.localeCompare(b.date)));
    };
    const handleUpdateHoliday = (updatedHoliday: Holiday) => setHolidays(prev => prev.map(h => h.id === updatedHoliday.id ? updatedHoliday : h));
    const handleDeleteHoliday = (holidayId: string) => setHolidays(prev => prev.filter(h => h.id !== holidayId));
    const handleAddCalendar = (name: string) => setHolidayCalendars(prev => [...prev, { id: `CAL-${Date.now()}`, name }]);
    const handleUpdateCalendar = (id: string, name: string) => setHolidayCalendars(prev => prev.map(cal => cal.id === id ? { ...cal, name } : cal));
    const handleDeleteCalendar = (id: string) => {
        if (holidayCalendars.length <= 1) return alert("Cannot delete the last holiday calendar.");
        if (window.confirm("Delete this calendar and all its holidays?")) {
            setHolidayCalendars(prev => prev.filter(cal => cal.id !== id));
            setHolidays(prev => prev.filter(h => h.calendarId !== id));
        }
    };

    // --- Timesheet Handlers ---
    const handleTimesheetSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        const newEntry: TimesheetEntry = {
            id: `TS-${Date.now()}`,
            userId: user.id,
            projectId: tsProjectId,
            date: tsDate,
            hours: Number(tsHours),
            description: tsDesc,
            status: 'Pending'
        };
        setTimesheets([newEntry, ...timesheets]);
        setTsDate(''); setTsHours(''); setTsDesc('');
    };

    const handleTimesheetApproval = (tsId: string, status: 'Approved' | 'Rejected') => {
        setTimesheets(prev => prev.map(ts => ts.id === tsId ? { ...ts, status } : ts));
    };

    // --- Render Helpers ---
    const HolidayOverlapWarning = () => (<div className="p-4 rounded-md bg-yellow-50 dark:bg-yellow-900/50 border border-yellow-200 dark:border-yellow-700/50 my-4"><h3 className="text-sm font-bold text-yellow-800 dark:text-yellow-200">Holiday Overlap Detected</h3><div className="mt-3 flex space-x-2"><button onClick={(e) => handleLeaveSubmit(e, true)} className="px-3 py-1.5 text-xs font-medium rounded-md text-white bg-yellow-600 hover:bg-yellow-700">Confirm & Submit</button><button onClick={() => setOverlappingHolidays(null)} className="px-3 py-1.5 text-xs font-medium rounded-md text-yellow-800 dark:text-yellow-100 bg-yellow-200 dark:bg-yellow-800/50 hover:bg-yellow-300 dark:hover:bg-yellow-800">Cancel</button></div></div>);

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700 mb-4">
                <nav className="-mb-px flex space-x-8 overflow-x-auto">
                    <button onClick={() => setActiveSubTab('leave')} className={`${activeSubTab === 'leave' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Leave Management</button>
                    <button onClick={() => setActiveSubTab('timesheets')} className={`${activeSubTab === 'timesheets' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Projects & Timesheets</button>
                    <button onClick={() => setActiveSubTab('holidays')} className={`${activeSubTab === 'holidays' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Holidays</button>
                    {[Role.MANAGER, Role.HR_MANAGER, Role.ADMIN].includes(user.role) && <button onClick={() => setActiveSubTab('team')} className={`${activeSubTab === 'team' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Team Approvals</button>}
                </nav>
            </div>

            {/* LEAVE MANAGEMENT TAB */}
            {activeSubTab === 'leave' && (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                    <Card title="Request Leave">
                        {overlappingHolidays && <HolidayOverlapWarning />}
                        <form onSubmit={handleLeaveSubmit} className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Start</label><input type="date" value={leaveStartDate} onChange={(e) => setLeaveStartDate(e.target.value)} required style={{ colorScheme: theme }} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" /></div>
                                <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">End</label><input type="date" value={leaveEndDate} onChange={(e) => setLeaveEndDate(e.target.value)} required style={{ colorScheme: theme }} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" /></div>
                            </div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Type</label><select value={leaveType} onChange={(e) => setLeaveType(e.target.value as any)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200"><option>Paid</option><option>Unpaid</option></select></div>
                            <div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Reason</label><textarea value={leaveReason} onChange={(e) => setLeaveReason(e.target.value)} rows={2} required className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" /></div>
                            {leaveError && <p className="text-red-500 text-sm">{leaveError}</p>}
                            <button type="submit" className="w-full py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Submit</button>
                        </form>
                    </Card>
                    <Card title="Leave History">
                         <div className="space-y-2 max-h-80 overflow-y-auto">
                            {leaveRequests.filter(r => r.userId === user.id).map(req => (
                                <div key={req.id} className="p-3 border dark:border-gray-700 rounded-md flex justify-between">
                                    <div className="text-sm"><p className="font-semibold dark:text-gray-200">{req.startDate} - {req.endDate}</p><p className="text-gray-500 dark:text-gray-400">{req.leaveType}</p></div>
                                    <span className={`px-2 py-1 text-xs rounded-full h-fit ${req.status === 'Approved' ? 'bg-green-100 text-green-800' : req.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{req.status}</span>
                                </div>
                            ))}
                         </div>
                    </Card>
                </div>
            )}

            {/* HOLIDAYS TAB */}
            {activeSubTab === 'holidays' && (
                [Role.HR_MANAGER, Role.ADMIN].includes(user.role) ? 
                <HolidayCalendarAdmin calendars={holidayCalendars} holidays={holidays} onAddHoliday={handleAddHoliday} onUpdateHoliday={handleUpdateHoliday} onDeleteHoliday={handleDeleteHoliday} onAddCalendar={handleAddCalendar} onUpdateCalendar={handleUpdateCalendar} onDeleteCalendar={handleDeleteCalendar} /> 
                : 
                <Card title={`Holidays (${holidayCalendars.find(c => c.id === user.holidayCalendarId)?.name})`}>
                    <div className="flex justify-end mb-2 space-x-2">
                        {[{ value: 'All', label: 'All' }, { value: EmployeeType.FULL_TIME, label: 'Full-Time' }, { value: EmployeeType.CONTRACT, label: 'Contract' }].map(opt => (
                            <button key={opt.value} onClick={() => setHolidayFilter(opt.value as any)} className={`px-3 py-1 text-xs rounded-full border ${holidayFilter === opt.value ? 'bg-indigo-100 border-indigo-500 text-indigo-700' : 'border-gray-300 text-gray-600 dark:text-gray-300 dark:border-gray-600'}`}>{opt.label}</button>
                        ))}
                    </div>
                    <div className="space-y-2">
                        {holidays.filter(h => h.calendarId === user.holidayCalendarId && (holidayFilter === 'All' || h.applicableTo.includes(holidayFilter))).map(h => (
                            <div key={h.id} className="p-3 bg-gray-50 dark:bg-gray-700/50 rounded flex justify-between"><span className="font-medium dark:text-gray-200">{h.name}</span><span className="text-gray-500 dark:text-gray-400">{h.date}</span></div>
                        ))}
                    </div>
                </Card>
            )}

            {/* TIMESHEETS TAB */}
            {activeSubTab === 'timesheets' && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                     <Card title="Log Time" className="lg:col-span-1 h-fit">
                        <form onSubmit={handleTimesheetSubmit} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label>
                                <input type="date" value={tsDate} onChange={(e) => setTsDate(e.target.value)} required style={{ colorScheme: theme }} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Project</label>
                                <select value={tsProjectId} onChange={(e) => setTsProjectId(e.target.value)} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200">
                                    {projects.map(p => <option key={p.id} value={p.id}>{p.name} ({p.code})</option>)}
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Hours</label>
                                <input type="number" step="0.5" min="0.5" max="24" value={tsHours} onChange={(e) => setTsHours(e.target.value)} required className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                                <textarea value={tsDesc} onChange={(e) => setTsDesc(e.target.value)} required rows={2} className="mt-1 w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md text-gray-900 dark:text-gray-200" />
                            </div>
                            <button type="submit" className="w-full flex justify-center py-2 px-4 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                                <PlusIcon className="h-5 w-5 mr-1" /> Log Time
                            </button>
                        </form>
                    </Card>
                    <Card title="My Timesheet History" className="lg:col-span-2">
                        <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hrs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {timesheets.filter(t => t.userId === user.id).map(ts => (
                                        <tr key={ts.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{ts.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{projects.find(p => p.id === ts.projectId)?.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{ts.hours}</td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${ts.status === 'Approved' ? 'bg-green-100 text-green-800' : ts.status === 'Rejected' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'}`}>{ts.status}</span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </Card>
                </div>
            )}

            {/* TEAM APPROVALS TAB */}
            {activeSubTab === 'team' && (
                <div className="space-y-8">
                    <Card title="Team Leave Requests">
                         {leaveRequests.filter(r => (user.teamMemberIds || []).includes(r.userId) && r.status === 'Pending').length === 0 ? <p className="text-gray-500 dark:text-gray-400">No pending leave requests.</p> : 
                         leaveRequests.filter(r => (user.teamMemberIds || []).includes(r.userId) && r.status === 'Pending').map(req => (
                            <div key={req.id} className="p-4 border dark:border-gray-700 rounded mb-2 flex justify-between items-center bg-white dark:bg-gray-800">
                                <div><p className="font-bold dark:text-gray-200">{usersById.get(req.userId)?.name}</p><p className="text-sm dark:text-gray-400">{req.startDate} to {req.endDate} ({req.reason})</p></div>
                                <div className="space-x-2"><button onClick={() => handleUpdateRequestStatus(req.id, LeaveStatus.APPROVED)} className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700">Approve</button><button onClick={() => handleUpdateRequestStatus(req.id, LeaveStatus.REJECTED)} className="px-3 py-1 bg-red-600 text-white rounded text-xs hover:bg-red-700">Reject</button></div>
                            </div>
                         ))}
                    </Card>

                    <Card title="Team Timesheet Approvals">
                        {timesheets.filter(t => (user.teamMemberIds || []).includes(t.userId) && t.status === 'Pending').length === 0 ? <p className="text-gray-500 dark:text-gray-400">No pending timesheets.</p> :
                         <div className="overflow-x-auto">
                            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                                <thead className="bg-gray-50 dark:bg-gray-700">
                                    <tr>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Employee</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Project</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Hrs</th>
                                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                                    {timesheets.filter(t => (user.teamMemberIds || []).includes(t.userId) && t.status === 'Pending').map(ts => (
                                        <tr key={ts.id}>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">{usersById.get(ts.userId)?.name}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{ts.date}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{projects.find(p => p.id === ts.projectId)?.code}</td>
                                            <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{ts.hours}</td>
                                            <td className="px-6 py-4 whitespace-nowrap space-x-2">
                                                <button onClick={() => handleTimesheetApproval(ts.id, 'Approved')} className="text-green-600 hover:text-green-900 dark:hover:text-green-400"><CheckCircleIcon className="h-5 w-5" /></button>
                                                <button onClick={() => handleTimesheetApproval(ts.id, 'Rejected')} className="text-red-600 hover:text-red-900 dark:hover:text-red-400"><XCircleIcon className="h-5 w-5" /></button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                         </div>
                        }
                    </Card>
                </div>
            )}
        </div>
    );
};

export default WorkforceModule;
