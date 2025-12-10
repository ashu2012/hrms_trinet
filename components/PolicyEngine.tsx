
import React, { useState } from 'react';
import type { LeavePolicy } from '../types';
import { createLeavePolicyFromText } from '../services/geminiService';
import Card from './common/Card';
import Spinner from './common/Spinner';

const PolicyEngine: React.FC = () => {
  const [description, setDescription] = useState(
    "Create a new 'Standard 2024' policy. Full-time employees get 20 paid leave days and 10 unpaid days after a 3-month probation period. They accrue 1.67 days per month. Contract employees get 15 unpaid days and no paid leave."
  );
  const [generatedPolicy, setGeneratedPolicy] = useState<LeavePolicy | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleGeneratePolicy = async () => {
    if (!description.trim()) {
      setError("Please enter a policy description.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setGeneratedPolicy(null);

    const policy = await createLeavePolicyFromText(description);

    if (policy) {
      setGeneratedPolicy(policy);
    } else {
      setError("Failed to generate policy. The AI could not process the request.");
    }
    setIsLoading(false);
  };

  return (
    <Card title="AI-Powered Leave Policy Engine">
      <div className="space-y-4">
        <p className="text-gray-600 dark:text-gray-400">
          Describe the new leave policy in plain English. Our AI will use its advanced reasoning capabilities
          to structure it for our system. This feature uses Gemini 2.5 Pro with an extended thinking budget for complex queries.
        </p>
        <div>
          <label htmlFor="policyDescription" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Policy Description</label>
          <textarea
            id="policyDescription"
            rows={4}
            className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            placeholder="e.g., Full-time employees get 15 days paid leave..."
          />
        </div>
        <div className="flex justify-end">
          <button
            onClick={handleGeneratePolicy}
            disabled={isLoading}
            className="inline-flex items-center justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-400"
          >
            {isLoading && <Spinner />}
            <span className={isLoading ? 'ml-2' : ''}>Generate Policy</span>
          </button>
        </div>
        {error && <p className="text-red-600 dark:text-red-500">{error}</p>}
        {generatedPolicy && (
          <div className="mt-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">Generated Policy: <span className="font-bold text-indigo-600 dark:text-indigo-400">{generatedPolicy.policyName}</span></h3>
            <pre className="mt-2 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-md overflow-x-auto text-sm text-gray-800 dark:text-gray-300">
              {JSON.stringify(generatedPolicy, null, 2)}
            </pre>
          </div>
        )}
      </div>
    </Card>
  );
};

export default PolicyEngine;
