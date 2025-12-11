
import React, { useState } from 'react';
import type { JobPosting } from '../types';
import { EmployeeType } from '../types';
import { generateJobDescription } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';
import PlusIcon from './icons/PlusIcon';

const RecruitmentModule: React.FC = () => {
  const [jobs, setJobs] = useState<JobPosting[]>([
    { id: 'JOB-1', title: 'Senior React Developer', department: 'Engineering', location: 'Remote', type: EmployeeType.FULL_TIME, description: 'We are looking for an experienced developer...', status: 'Published', applicantsCount: 12 },
    { id: 'JOB-2', title: 'HR Associate', department: 'Human Resources', location: 'Bangalore', type: EmployeeType.CONTRACT, description: 'Assist with day-to-day HR ops...', status: 'Draft', applicantsCount: 0 },
  ]);

  const [isCreating, setIsCreating] = useState(false);
  const [newJob, setNewJob] = useState({ title: '', department: '', location: '', type: EmployeeType.FULL_TIME, requirements: '' });
  const [generatedDescription, setGeneratedDescription] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerateJD = async () => {
    if (!newJob.title || !newJob.department || !newJob.requirements) {
      alert("Please fill in Title, Department, and Requirements first.");
      return;
    }
    setIsGenerating(true);
    const desc = await generateJobDescription(newJob.title, newJob.department, newJob.requirements);
    setGeneratedDescription(desc);
    setIsGenerating(false);
  };

  const handleCreateJob = (e: React.FormEvent) => {
    e.preventDefault();
    if (!generatedDescription) {
        alert("Please generate a description first.");
        return;
    }
    const posting: JobPosting = {
      id: `JOB-${Date.now()}`,
      title: newJob.title,
      department: newJob.department,
      location: newJob.location,
      type: newJob.type,
      description: generatedDescription,
      status: 'Published',
      applicantsCount: 0
    };
    setJobs([posting, ...jobs]);
    setIsCreating(false);
    setNewJob({ title: '', department: '', location: '', type: EmployeeType.FULL_TIME, requirements: '' });
    setGeneratedDescription('');
  };

  return (
    <div className="space-y-6">
      {!isCreating ? (
        <>
          <div className="flex justify-between items-center">
             <h2 className="text-xl font-bold text-gray-800 dark:text-gray-200">Active Job Postings</h2>
             <button onClick={() => setIsCreating(true)} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                <PlusIcon className="h-5 w-5 mr-2" /> Create New Job
             </button>
          </div>
          <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
             {jobs.map(job => (
                <Card key={job.id} className="relative">
                   <div className="flex justify-between items-start mb-2">
                       <div>
                           <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">{job.title}</h3>
                           <p className="text-sm text-gray-500 dark:text-gray-400">{job.department} • {job.location}</p>
                       </div>
                       <span className={`px-2 py-1 text-xs font-semibold rounded-full ${job.status === 'Published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                           {job.status}
                       </span>
                   </div>
                   <div className="mt-4 flex justify-between items-center text-sm">
                       <span className="text-gray-600 dark:text-gray-400">{job.type}</span>
                       <span className="text-indigo-600 dark:text-indigo-400 font-medium">{job.applicantsCount} Applicants</span>
                   </div>
                   <div className="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                       <button className="text-sm text-gray-500 hover:text-gray-900 dark:hover:text-gray-200">View Details</button>
                   </div>
                </Card>
             ))}
          </div>
        </>
      ) : (
        <Card title="Create New Job Posting">
           <form onSubmit={handleCreateJob} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Job Title</label>
                      <input type="text" required value={newJob.title} onChange={e => setNewJob({...newJob, title: e.target.value})} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Department</label>
                      <input type="text" required value={newJob.department} onChange={e => setNewJob({...newJob, department: e.target.value})} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Location</label>
                      <input type="text" required value={newJob.location} onChange={e => setNewJob({...newJob, location: e.target.value})} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200" />
                  </div>
                  <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Employment Type</label>
                      <select value={newJob.type} onChange={e => setNewJob({...newJob, type: e.target.value as EmployeeType})} className="mt-1 w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200">
                          {Object.values(EmployeeType).map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                  </div>
              </div>
              
              <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Key Requirements (for AI)</label>
                  <p className="text-xs text-gray-500 mb-2">List the top 3-5 skills or requirements. The AI will use this to write the full description.</p>
                  <textarea rows={3} required value={newJob.requirements} onChange={e => setNewJob({...newJob, requirements: e.target.value})} placeholder="e.g. 5+ years React, TypeScript, Leadership skills, Agile methodology" className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"></textarea>
              </div>

              <div className="flex justify-end">
                  <button type="button" onClick={handleGenerateJD} disabled={isGenerating} className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-gradient-to-r from-purple-600 to-indigo-600 hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50">
                      {isGenerating ? <><Spinner /><span className="ml-2">Generating...</span></> : '✨ Generate Job Description with AI'}
                  </button>
              </div>

              {generatedDescription && (
                  <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-md border border-gray-200 dark:border-gray-700">
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">AI Generated Description</label>
                      <textarea rows={10} value={generatedDescription} onChange={e => setGeneratedDescription(e.target.value)} className="w-full p-2 border rounded dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200 font-mono text-sm"></textarea>
                  </div>
              )}

              <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200 dark:border-gray-700">
                  <button type="button" onClick={() => setIsCreating(false)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md hover:bg-gray-50">Cancel</button>
                  <button type="submit" disabled={!generatedDescription} className="px-4 py-2 text-sm font-medium text-white bg-indigo-600 rounded-md hover:bg-indigo-700 disabled:bg-indigo-300">Publish Job</button>
              </div>
           </form>
        </Card>
      )}
    </div>
  );
};

export default RecruitmentModule;
