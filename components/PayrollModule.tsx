import React, { useState } from 'react';
import type { User, Payslip, Reimbursement } from '../types';
import Card from './common/Card';
import PlusIcon from './icons/PlusIcon';

interface PayrollModuleProps {
  user: User;
}

const MOCK_PAYSLIPS: Payslip[] = [
    { id: 'PS-JUL', userId: 'USR-EMP-01', month: 'July', year: 2024, basicSalary: 5000, allowances: 2000, deductions: 500, tax: 800, netPay: 5700 },
    { id: 'PS-JUN', userId: 'USR-EMP-01', month: 'June', year: 2024, basicSalary: 5000, allowances: 2000, deductions: 200, tax: 800, netPay: 6000 },
];

const MOCK_REIMBURSEMENTS: Reimbursement[] = [
    { id: 'REM-1', userId: 'USR-EMP-01', date: '2024-07-20', category: 'Internet', amount: 50, description: 'July WiFi Bill', status: 'Approved' },
];

const PayrollModule: React.FC<PayrollModuleProps> = ({ user }) => {
    const [activeTab, setActiveTab] = useState<'payslips' | 'reimbursements' | 'tax'>('payslips');
    const [reimbursements, setReimbursements] = useState<Reimbursement[]>(MOCK_REIMBURSEMENTS);
    
    // Reimbursement Form State
    const [remCategory, setRemCategory] = useState('Travel');
    const [remAmount, setRemAmount] = useState('');
    const [remDesc, setRemDesc] = useState('');

    const handleAddReimbursement = (e: React.FormEvent) => {
        e.preventDefault();
        const newRem: Reimbursement = {
            id: `REM-${Date.now()}`,
            userId: user.id,
            date: new Date().toISOString().split('T')[0],
            category: remCategory as any,
            amount: Number(remAmount),
            description: remDesc,
            status: 'Pending'
        };
        setReimbursements([newRem, ...reimbursements]);
        setRemAmount(''); setRemDesc('');
    };

    const renderPayslips = () => (
        <div className="space-y-4">
            {MOCK_PAYSLIPS.map(slip => (
                <div key={slip.id} className="bg-brand-surface dark:bg-gray-800 rounded-lg shadow border border-gray-200 dark:border-gray-700 p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-2 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-800 dark:text-gray-200">{slip.month} {slip.year} Payslip</h3>
                        <span className="text-sm text-gray-500 dark:text-gray-400">ID: {slip.id}</span>
                    </div>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div><p className="text-gray-500 dark:text-gray-400">Basic Salary</p><p className="font-semibold dark:text-gray-200">${slip.basicSalary}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Allowances</p><p className="font-semibold text-green-600 dark:text-green-400">+${slip.allowances}</p></div>
                        <div><p className="text-gray-500 dark:text-gray-400">Deductions/Tax</p><p className="font-semibold text-red-600 dark:text-red-400">-${slip.deductions + slip.tax}</p></div>
                        <div className="bg-indigo-50 dark:bg-indigo-900/30 p-2 rounded text-center">
                            <p className="text-indigo-600 dark:text-indigo-300 font-bold">Net Pay</p>
                            <p className="text-xl font-bold text-indigo-700 dark:text-indigo-200">${slip.netPay}</p>
                        </div>
                    </div>
                    <div className="mt-4 flex justify-end">
                        <button className="text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 dark:hover:text-indigo-300">Download PDF</button>
                    </div>
                </div>
            ))}
        </div>
    );

    const renderReimbursements = () => (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card title="New Claim" className="md:col-span-1 h-fit">
                <form onSubmit={handleAddReimbursement} className="space-y-4">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Category</label>
                        <select value={remCategory} onChange={(e) => setRemCategory(e.target.value)} className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                            <option>Travel</option><option>Food</option><option>Internet</option><option>Other</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Amount ($)</label>
                        <input type="number" value={remAmount} onChange={(e) => setRemAmount(e.target.value)} required className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Description</label>
                        <input type="text" value={remDesc} onChange={(e) => setRemDesc(e.target.value)} required className="mt-1 w-full p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                    </div>
                    <button type="submit" className="w-full flex justify-center items-center py-2 px-4 bg-indigo-600 text-white rounded hover:bg-indigo-700">
                        <PlusIcon className="h-5 w-5 mr-1" /> Submit Claim
                    </button>
                </form>
            </Card>
            <Card title="Claim History" className="md:col-span-2">
                <div className="overflow-x-auto">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Category</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Status</th>
                            </tr>
                        </thead>
                        <tbody className="bg-brand-surface dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {reimbursements.map(r => (
                                <tr key={r.id}>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200">{r.date}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">{r.category}</td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-200">${r.amount}</td>
                                    <td className="px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${r.status === 'Approved' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{r.status}</span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </Card>
        </div>
    );

    const renderTax = () => (
        <Card title="Tax Declaration">
            <div className="space-y-6">
                <div className="p-4 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                    <h4 className="font-semibold text-blue-800 dark:text-blue-200">Current Regime: New Tax Regime</h4>
                    <p className="text-sm text-blue-600 dark:text-blue-300 mt-1">Projected Annual Tax: $12,500</p>
                </div>
                <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200 mb-2">Declare Investments (80C)</h4>
                    <div className="flex gap-2">
                        <input type="text" placeholder="Investment Amount" className="flex-1 p-2 border rounded bg-white dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"/>
                        <button className="px-4 py-2 bg-gray-800 text-white rounded hover:bg-gray-900 dark:bg-gray-600">Update</button>
                    </div>
                </div>
            </div>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('payslips')} className={`${activeTab === 'payslips' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Payslips</button>
                    <button onClick={() => setActiveTab('reimbursements')} className={`${activeTab === 'reimbursements' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Reimbursements</button>
                    <button onClick={() => setActiveTab('tax')} className={`${activeTab === 'tax' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Tax & Deductions</button>
                </nav>
            </div>
            {activeTab === 'payslips' && renderPayslips()}
            {activeTab === 'reimbursements' && renderReimbursements()}
            {activeTab === 'tax' && renderTax()}
        </div>
    );
};

export default PayrollModule;