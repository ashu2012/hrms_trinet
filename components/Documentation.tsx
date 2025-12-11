
import React from 'react';
import Card from './common/Card';
import CheckCircleIcon from './icons/CheckCircleIcon';

const Documentation: React.FC = () => {
  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      <div className="text-center mb-8">
        <h1 className="text-3xl font-extrabold text-gray-900 dark:text-gray-100 mb-2">
          Gemini HRMS – AI-Driven Workforce Management Suite
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Modernizing workforce operations by integrating Google's Gemini AI directly into core administrative workflows.
        </p>
      </div>

      <Card title="Project Overview">
        <div className="prose dark:prose-invert max-w-none text-gray-700 dark:text-gray-300 space-y-4">
          <p>
            Gemini HRMS is a comprehensive Human Resource Management System designed to move beyond traditional data entry. 
            It leverages AI to automate complex processes like identity verification and policy creation.
          </p>
          <p>
            The platform offers a full suite of modules including:
          </p>
          <ul className="list-disc pl-5 space-y-1">
            <li><strong>Workforce Management:</strong> Leave tracking, holiday calendars, and timesheets.</li>
            <li><strong>Payroll:</strong> Payslip generation, tax declarations, and reimbursement claims.</li>
            <li><strong>Performance:</strong> OKRs, goal tracking, and annual appraisals.</li>
            <li><strong>Onboarding:</strong> Seamless new hire experience with automated KYC.</li>
          </ul>
        </div>
      </Card>

      <Card title="Key Innovations">
        <div className="grid gap-6 md:grid-cols-1">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                <span className="font-bold text-lg">1</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">AI Policy Engine</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                Utilizing <strong>Gemini 2.5 Pro</strong> with "Thinking" capabilities, this feature allows HR admins to type complex leave policies in plain English (e.g., "Contractors get 10 days unpaid, Full-time get 20 paid..."), which the AI instantly converts into structured, enforceable system rules.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                <span className="font-bold text-lg">2</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Automated KYC Onboarding</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                Uses <strong>multimodal AI</strong> (Gemini 2.5 Flash) to analyze uploaded ID documents, compare them against user-submitted data for instant verification, and provides audio feedback via Gemini's Text-to-Speech.
              </p>
            </div>
          </div>

          <div className="flex items-start">
            <div className="flex-shrink-0">
              <div className="flex items-center justify-center h-10 w-10 rounded-md bg-indigo-500 text-white">
                <span className="font-bold text-lg">3</span>
              </div>
            </div>
            <div className="ml-4">
              <h3 className="text-lg font-medium leading-6 text-gray-900 dark:text-gray-100">Smart Workflow Logic</h3>
              <p className="mt-2 text-base text-gray-600 dark:text-gray-400">
                Features intelligent holiday overlap detection during leave requests, role-based dashboards for Employees, Managers, and Admins, and automated timesheet approvals.
              </p>
            </div>
          </div>
        </div>
      </Card>

      <Card title="Key Screenshots Description">
        <div className="space-y-8">
          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">1. The AI Policy Engine (Admin Console)</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold">Scene:</span> The Admin panel is open to the "Policy Engine" tab.</p>
              <p><span className="font-semibold">Visual:</span> On the left, a text area contains a complex natural language description of a leave policy. On the right, a structured JSON object is displayed, highlighting how Gemini successfully interpreted specific rules for probation periods and accrual rates from the text.</p>
              <p className="mt-2 italic">"Administrators can generate complex system configurations simply by describing them in plain English using the AI Policy Engine."</p>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">2. Intelligent Onboarding & KYC Verification</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold">Scene:</span> The Onboarding module showing the "Identity Verification" step.</p>
              <p><span className="font-semibold">Visual:</span> The user interface shows a successful verification state with a green checkmark. It displays the uploaded document preview alongside the AI's analysis result ("Match Confirmed").</p>
              <p className="mt-2 italic">"The Onboarding module uses multimodal AI to verify employee documents in real-time, streamlining the KYC process."</p>
            </div>
          </div>

          <div className="border-l-4 border-indigo-500 pl-4 py-1">
            <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100">3. Employee Dashboard & Leave Management</h3>
            <div className="mt-2 text-sm text-gray-600 dark:text-gray-400">
              <p><span className="font-semibold">Scene:</span> The main Dashboard view for a standard Employee user.</p>
              <p><span className="font-semibold">Visual:</span> A clean, sidebar-navigated interface showing "Quick Leave Balance" cards (Paid vs. Unpaid) and the "Workforce" module with a Leave Request form active.</p>
              <p className="mt-2 italic">"A unified dashboard gives employees instant access to leave balances, payroll data, and performance goals."</p>
            </div>
          </div>
        </div>
      </Card>
    </div>
  );
};

export default Documentation;
