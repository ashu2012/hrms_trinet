
import React, { useState } from 'react';
import type { User } from '../types';
import { Role } from '../types';
import Card from './common/Card';
import KycForm from './KycForm';
import DocumentArrowUpIcon from './icons/DocumentArrowUpIcon';
import UserGroupIcon from './icons/UserGroupIcon';
import ChartBarIcon from './icons/ChartBarIcon';

interface OnboardingModuleProps {
  user: User;
}

const OnboardingModule: React.FC<OnboardingModuleProps> = ({ user }) => {
    const [kycCompleted, setKycCompleted] = useState(false);
    const [activeTab, setActiveTab] = useState<'kyc' | 'docs' | 'status' | 'drives'>('kyc');

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

    const renderRecruitmentDrives = () => (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card title="Campus Drive 2024 (Engineering)">
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-blue-50 dark:bg-blue-900/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <UserGroupIcon className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                            <div>
                                <p className="text-sm font-semibold text-blue-900 dark:text-blue-100">Total Offers</p>
                                <p className="text-2xl font-bold text-blue-700 dark:text-blue-200">45</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-blue-600 dark:text-blue-300">Target: 50</p>
                             <div className="w-20 bg-blue-200 rounded-full h-1.5 mt-1 dark:bg-blue-800">
                                 <div className="bg-blue-600 h-1.5 rounded-full" style={{ width: '90%' }}></div>
                             </div>
                        </div>
                    </div>
                    
                    <div className="grid grid-cols-3 gap-2 text-center text-sm">
                         <div className="p-2 bg-gray-50 dark:bg-gray-800 rounded">
                             <p className="font-bold text-gray-800 dark:text-gray-200">30</p>
                             <p className="text-xs text-gray-500">Joined</p>
                         </div>
                         <div className="p-2 bg-yellow-50 dark:bg-yellow-900/30 rounded">
                             <p className="font-bold text-yellow-800 dark:text-yellow-200">10</p>
                             <p className="text-xs text-yellow-600">Pending Docs</p>
                         </div>
                          <div className="p-2 bg-red-50 dark:bg-red-900/30 rounded">
                             <p className="font-bold text-red-800 dark:text-red-200">5</p>
                             <p className="text-xs text-red-600">Declined</p>
                         </div>
                    </div>
                    
                    <button className="w-full text-sm text-indigo-600 hover:text-indigo-800 dark:text-indigo-400 mt-2">View Candidate List &rarr;</button>
                </div>
            </Card>

            <Card title="Lateral Hiring Q3 (Sales & Marketing)">
                <div className="space-y-4">
                     <div className="flex items-center justify-between p-3 bg-green-50 dark:bg-green-900/30 rounded-lg">
                        <div className="flex items-center gap-3">
                            <ChartBarIcon className="h-6 w-6 text-green-600 dark:text-green-400" />
                            <div>
                                <p className="text-sm font-semibold text-green-900 dark:text-green-100">Offer Acceptance</p>
                                <p className="text-2xl font-bold text-green-700 dark:text-green-200">85%</p>
                            </div>
                        </div>
                        <div className="text-right">
                             <p className="text-xs text-green-600 dark:text-green-300">Industry Avg: 70%</p>
                        </div>
                    </div>

                     <div className="space-y-2">
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-600 dark:text-gray-400">Walk-in (Oct 15)</span>
                             <span className="font-medium text-gray-900 dark:text-gray-200">12 Selected</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-600 dark:text-gray-400">LinkedIn Campaign</span>
                             <span className="font-medium text-gray-900 dark:text-gray-200">8 Selected</span>
                         </div>
                         <div className="flex justify-between text-sm">
                             <span className="text-gray-600 dark:text-gray-400">Employee Referral</span>
                             <span className="font-medium text-gray-900 dark:text-gray-200">5 Selected</span>
                         </div>
                     </div>
                </div>
            </Card>

            <Card title="Onboarding Funnel (All Drives)" className="md:col-span-2">
                 <div className="flex flex-col md:flex-row items-center justify-between px-4 py-6 gap-4">
                     <div className="flex-1 text-center">
                         <div className="bg-indigo-100 dark:bg-indigo-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-indigo-700 dark:text-indigo-300 font-bold text-xl">120</div>
                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Screened</p>
                     </div>
                     <div className="hidden md:block border-t-2 border-dashed border-gray-300 w-12"></div>
                     <div className="flex-1 text-center">
                         <div className="bg-blue-100 dark:bg-blue-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-blue-700 dark:text-blue-300 font-bold text-xl">80</div>
                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Interviewed</p>
                     </div>
                     <div className="hidden md:block border-t-2 border-dashed border-gray-300 w-12"></div>
                      <div className="flex-1 text-center">
                         <div className="bg-yellow-100 dark:bg-yellow-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-yellow-700 dark:text-yellow-300 font-bold text-xl">45</div>
                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Offers Released</p>
                     </div>
                     <div className="hidden md:block border-t-2 border-dashed border-gray-300 w-12"></div>
                      <div className="flex-1 text-center">
                         <div className="bg-green-100 dark:bg-green-900/50 rounded-full w-16 h-16 flex items-center justify-center mx-auto mb-2 text-green-700 dark:text-green-300 font-bold text-xl">38</div>
                         <p className="text-sm font-semibold text-gray-700 dark:text-gray-300">Onboarded</p>
                     </div>
                 </div>
            </Card>
        </div>
    );

    return (
        <div className="space-y-6">
            <div className="border-b border-gray-200 dark:border-gray-700">
                <nav className="-mb-px flex space-x-8">
                    <button onClick={() => setActiveTab('kyc')} className={`${activeTab === 'kyc' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Identity Verification</button>
                    <button onClick={() => setActiveTab('docs')} className={`${activeTab === 'docs' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Documents</button>
                    <button onClick={() => setActiveTab('status')} className={`${activeTab === 'status' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Checklist Status</button>
                    <button onClick={() => setActiveTab('drives')} className={`${activeTab === 'drives' ? 'border-indigo-500 text-indigo-600 dark:text-indigo-400' : 'border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400'} whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm`}>Recruitment Analytics</button>
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

            {activeTab === 'drives' && renderRecruitmentDrives()}
        </div>
    );
};

export default OnboardingModule;
