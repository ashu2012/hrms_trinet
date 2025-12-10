
import React, { useState, useMemo, useEffect } from 'react';
import type { Holiday, HolidayCalendar } from '../types';
import { EmployeeType } from '../types';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';
import PencilIcon from './icons/PencilIcon';
import TrashIcon from './icons/TrashIcon';

interface HolidayCalendarAdminProps {
  calendars: HolidayCalendar[];
  holidays: Holiday[];
  onAddHoliday: (newHoliday: Omit<Holiday, 'id'>) => void;
  onUpdateHoliday: (updatedHoliday: Holiday) => void;
  onDeleteHoliday: (holidayId: string) => void;
  onAddCalendar: (name: string) => void;
  onUpdateCalendar: (id: string, name: string) => void;
  onDeleteCalendar: (id: string) => void;
}

const HolidayCalendarAdmin: React.FC<HolidayCalendarAdminProps> = ({ 
    calendars, holidays, onAddHoliday, onUpdateHoliday, onDeleteHoliday, 
    onAddCalendar, onUpdateCalendar, onDeleteCalendar 
}) => {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedCalendarId, setSelectedCalendarId] = useState(calendars[0]?.id || '');
  
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMode, setModalMode] = useState<'add' | 'edit'>('add');
  const [editingHoliday, setEditingHoliday] = useState<Holiday | null>(null);
  
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);
  const [holidayName, setHolidayName] = useState('');
  const [applicableTo, setApplicableTo] = useState<EmployeeType[]>([EmployeeType.FULL_TIME, EmployeeType.CONTRACT]);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [calendarName, setCalendarName] = useState('');
  const [editingCalendarId, setEditingCalendarId] = useState<string | null>(null);
  
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    // If the selected calendar is deleted, select the first one in the new list
    if (!calendars.some(c => c.id === selectedCalendarId)) {
        setSelectedCalendarId(calendars[0]?.id || '');
    }
  }, [calendars, selectedCalendarId]);

  const currentYear = currentDate.getFullYear();
  const currentMonth = currentDate.getMonth();

  const holidaysByDate = useMemo(() => {
    const map = new Map<string, Holiday[]>();
    holidays
      .filter(h => h.calendarId === selectedCalendarId)
      .filter(h => searchTerm ? h.name.toLowerCase().includes(searchTerm.toLowerCase()) : true)
      .forEach(h => {
        const list = map.get(h.date) || [];
        list.push(h);
        map.set(h.date, list);
      });
    return map;
  }, [holidays, selectedCalendarId, searchTerm]);

  const changeMonth = (delta: number) => {
    setCurrentDate(prev => new Date(prev.getFullYear(), prev.getMonth() + delta, 1));
  };
  
  const openAddModal = (day: number) => {
    setModalMode('add');
    setSelectedDate(new Date(currentYear, currentMonth, day));
    setHolidayName('');
    setApplicableTo([EmployeeType.FULL_TIME, EmployeeType.CONTRACT]);
    setEditingHoliday(null);
    setIsModalOpen(true);
  };

  const openEditModal = (holiday: Holiday) => {
    setModalMode('edit');
    setEditingHoliday(holiday);
    setSelectedDate(new Date(`${holiday.date}T00:00:00`));
    setHolidayName(holiday.name);
    setApplicableTo(holiday.applicableTo);
    setIsModalOpen(true);
  };
  
  const handleModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!holidayName || !selectedDate) return;
    if (modalMode === 'add') {
        onAddHoliday({
            name: holidayName, date: selectedDate.toISOString().split('T')[0],
            calendarId: selectedCalendarId, applicableTo: applicableTo,
        });
    } else if (editingHoliday) {
        onUpdateHoliday({
            ...editingHoliday, name: holidayName,
            date: selectedDate.toISOString().split('T')[0], applicableTo: applicableTo,
        });
    }
    setIsModalOpen(false);
  };

  const handleModalDelete = () => {
    if (editingHoliday && window.confirm(`Are you sure you want to delete the holiday "${editingHoliday.name}"?`)) {
        onDeleteHoliday(editingHoliday.id);
        setIsModalOpen(false);
    }
  };

  const handleApplicableToChange = (type: EmployeeType) => {
    setApplicableTo(prev => 
      prev.includes(type) ? prev.filter(t => t !== type) : [...prev, type]
    );
  };

  const handleCalendarModalOpen = (calendarId: string | null = null) => {
    if (calendarId) {
        setEditingCalendarId(calendarId);
        setCalendarName(calendars.find(c => c.id === calendarId)?.name || '');
    } else {
        setEditingCalendarId(null);
        setCalendarName('');
    }
    setIsCalendarModalOpen(true);
  };

  const handleCalendarModalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!calendarName.trim()) return;
    if (editingCalendarId) {
        onUpdateCalendar(editingCalendarId, calendarName);
    } else {
        onAddCalendar(calendarName);
    }
    setIsCalendarModalOpen(false);
  };

  const renderCalendarGrid = () => {
    const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
    const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay();
    const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
    const blanks = Array(firstDayIndex).fill(null);
    const weekdays = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    return (
      <><div className="grid grid-cols-7 gap-2 text-center text-sm font-semibold text-gray-600 dark:text-gray-400 mb-2">{weekdays.map(day => <div key={day}>{day}</div>)}</div><div className="grid grid-cols-7 gap-2">{blanks.map((_, i) => <div key={`blank-${i}`} className="border rounded-lg dark:border-gray-700"></div>)}{days.map(day => { const dateStr = new Date(currentYear, currentMonth, day).toISOString().split('T')[0]; const dayHolidays = holidaysByDate.get(dateStr) || []; return (<button key={day} onClick={() => openAddModal(day)} className="relative border rounded-lg h-28 p-2 text-left transition-colors bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700/50 focus:outline-none focus:ring-2 focus:ring-indigo-500"><span className="font-medium text-gray-800 dark:text-gray-200">{day}</span><div className="mt-1 space-y-0.5 overflow-y-auto max-h-20">{dayHolidays.map(h => (<div key={h.id} onClick={(e) => { e.stopPropagation(); openEditModal(h); }} className="text-xs p-1 rounded bg-indigo-100 text-indigo-800 dark:bg-indigo-900/70 dark:text-indigo-300 truncate hover:ring-2 hover:ring-indigo-400">{h.name}</div>))}</div></button>); })}</div></>
    );
  };
  
  const renderHolidayModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{modalMode === 'add' ? 'Add' : 'Edit'} Holiday</h2><form onSubmit={handleModalSubmit} className="space-y-4"><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Date</label><input type="text" value={selectedDate?.toLocaleDateString()} disabled className="mt-1 block w-full px-3 py-2 bg-gray-100 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-gray-500 dark:text-gray-300"/></div><div><label htmlFor="holidayName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Holiday Name</label><input type="text" id="holidayName" value={holidayName} onChange={e => setHolidayName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200"/></div><div><label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Applicable To</label><div className="mt-2 space-y-2">{Object.values(EmployeeType).map(type => (<label key={type} className="flex items-center"><input type="checkbox" checked={applicableTo.includes(type)} onChange={() => handleApplicableToChange(type)} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"/><span className="ml-2 text-sm text-gray-700 dark:text-gray-300">{type}</span></label>))}</div></div><div className="flex justify-between items-center pt-4">{modalMode === 'edit' && (<button type="button" onClick={handleModalDelete} className="px-4 py-2 text-sm font-medium text-white bg-red-600 rounded-md hover:bg-red-700 flex items-center gap-1"><TrashIcon className="h-4 w-4"/> Delete</button>)}<div className="flex justify-end space-x-2 flex-grow"><button type="button" onClick={() => setIsModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{modalMode === 'add' ? 'Add Holiday' : 'Save Changes'}</button></div></div></form></div></div>
  );

  const renderCalendarModal = () => (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"><div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl p-6 w-full max-w-md"><h2 className="text-xl font-bold text-gray-900 dark:text-gray-100 mb-4">{editingCalendarId ? 'Edit' : 'Create'} Calendar</h2><form onSubmit={handleCalendarModalSubmit} className="space-y-4"><div><label htmlFor="calendarName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Calendar Name</label><input type="text" id="calendarName" value={calendarName} onChange={e => setCalendarName(e.target.value)} required className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200"/></div><div className="flex justify-end space-x-2 pt-4"><button type="button" onClick={() => setIsCalendarModalOpen(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50 dark:hover:bg-gray-600">Cancel</button><button type="submit" className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700">{editingCalendarId ? 'Save Changes' : 'Create Calendar'}</button></div></form></div></div>
  );

  return (
    <Card>
      {isModalOpen && renderHolidayModal()}
      {isCalendarModalOpen && renderCalendarModal()}
      <div className="flex flex-col sm:flex-row justify-between sm:items-center mb-4 gap-4">
        <div className="flex items-center space-x-4"><button onClick={() => changeMonth(-1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&lt;</button><h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">{new Intl.DateTimeFormat('en-US', { month: 'long', year: 'numeric' }).format(currentDate)}</h2><button onClick={() => changeMonth(1)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700">&gt;</button></div>
        <div className="flex-grow sm:flex-grow-0"><input type="search" value={searchTerm} onChange={e => setSearchTerm(e.target.value)} placeholder="Search holidays..." className="w-full sm:w-auto px-3 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md"/></div>
      </div>
      <div className="flex flex-col md:flex-row justify-between md:items-center mb-4 gap-4">
        <div className="flex items-center gap-2 flex-wrap">
            <select value={selectedCalendarId} onChange={e => setSelectedCalendarId(e.target.value)} className="w-full sm:w-auto pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-200 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md">
                {calendars.map(cal => <option key={cal.id} value={cal.id}>{cal.name}</option>)}
            </select>
            {selectedCalendarId && <><button onClick={() => handleCalendarModalOpen(selectedCalendarId)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"><PencilIcon className="h-5 w-5"/></button><button onClick={() => onDeleteCalendar(selectedCalendarId)} className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-600 dark:text-gray-400"><TrashIcon className="h-5 w-5"/></button></>}
        </div>
        <button onClick={() => handleCalendarModalOpen()} className="inline-flex items-center justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"><PlusIcon className="h-5 w-5 mr-2"/> New Calendar</button>
      </div>
      {renderCalendarGrid()}
       <p className="text-xs text-gray-500 dark:text-gray-400 mt-4 text-center">Click on a date to add a holiday, or click an existing holiday to edit it.</p>
    </Card>
  );
};

export default HolidayCalendarAdmin;
