
import React, { useState } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import Card from './common/Card';
import KycForm from './KycForm';
import DocumentArrowUpIcon from './icons/DocumentArrowUpIcon';

interface OnboardingModuleProps {
  user: User;
}

const OnboardingModule: React.FC<OnboardingModuleProps> = ({ user }) => {
    const [kycCompleted, setKycCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState<'kyc' | 'docs' | 'status'>('kyc');

    const renderDocUpload = () => (
        <Card title="Employee Documents">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <DocumentArrowUpIcon className="h-10 w-10 mx-auto text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">Upload Resume / CV</span>
                    <span className="mt-1 block text-xs text-gray-500">PDF up to 10MB</span>
                </div>
                 <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-6 text-center hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
                    <DocumentArrowUpIcon className="h-10 w-10 mx-auto text-gray-400" />
                    <span className="mt-2 block text-sm font-medium text-gray-900 dark:text-gray-200">Upload Signed Offer Letter</span>
                    <span className="mt-1 block text-xs text-gray-500">PDF up to 10MB</span>
                </div>
            </div>
        </Card>
    );

    const renderStatus = () => (
        <Card title="Onboarding Checklist">
            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                <li className="py-4 flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Identity Verification (KYC)</span>
                    <span className={`px-2 py-1 text-xs rounded-full ${kycCompleted ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>{kycCompleted ? 'Completed' : 'Pending'}</span>
                </li>
                <li className="py-4 flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">Background Check</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-yellow-100 text-yellow-800">In Progress</span>
                </li>
                 <li className="py-4 flex items-center justify-between">
                    <span className="text-gray-700 dark:text-gray-300">IT Asset Allocation</span>
                    <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-800">Pending</span>
                </li>
            </ul>
        </Card>
    );

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('kyc')} className={`${activeTab === 'kyc' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Identity Verification</button>
                    <button onClick={() => setActiveTab('docs')} className={`${activeTab === 'docs' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Documents</button>
                    <button onClick={() => setActiveTab('status')} className={`${activeTab === 'status' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Checklist Status</button>
                </nav>
            </div>

            {activeTab === 'kyc' && (
                kycCompleted ? 
                <div className="bg-green-50 dark:bg-green-900/30 p-6 rounded-lg text-center">
                    <h3 className="text-lg font-medium text-green-800 dark:text-green-200">Verification Complete</h3>
                    <p className="text-green-600 dark:text-green-300">Your identity has been successfully verified.</p>
                </div> 
                : <KycForm onKycSuccess={() => setKycCompleted(true)} />
            )}
            
            {activeTab === 'docs' && renderDocUpload()}
            
            {activeTab === 'status' && renderStatus()}
        </div>
    );
};

export default OnboardingModule;
