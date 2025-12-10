
import React, { useState } from 'react';
import type { AppSettings } from '../types';
import Card from './common/Card';
import { fileToBase64 } from '../utils/helpers';
import DocumentArrowUpIcon from './icons/DocumentArrowUpIcon';

interface SettingsPanelProps {
  settings: AppSettings;
  onUpdateSettings: (newSettings: AppSettings) => void;
}

const SettingsPanel: React.FC<SettingsPanelProps> = ({ settings, onUpdateSettings }) => {
  const [companyName, setCompanyName] = useState(settings.companyName);
  
  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      try {
        const base64 = await fileToBase64(file);
        const logoUrl = `data:${file.type};base64,${base64}`;
        onUpdateSettings({ ...settings, logoUrl });
      } catch (error) {
        console.error("Error uploading logo:", error);
        alert("Failed to upload logo.");
      }
    }
  };

  const handleNameSave = () => {
      onUpdateSettings({ ...settings, companyName });
      alert("Company details updated successfully.");
  };

  return (
    <div className="space-y-6">
        <Card title="General Settings">
            <div className="space-y-4">
                <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">Company Name</label>
                    <div className="mt-1 flex gap-4">
                        <input 
                            type="text" 
                            value={companyName} 
                            onChange={(e) => setCompanyName(e.target.value)} 
                            className="block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200" 
                        />
                        <button onClick={handleNameSave} className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">Save</button>
                    </div>
                </div>
            </div>
        </Card>

        <Card title="Branding & Logo">
            <div className="space-y-4">
                <p className="text-sm text-gray-500 dark:text-gray-400">Upload your company logo. This will be displayed in the top right corner of the dashboard.</p>
                
                <div className="flex items-start space-x-6">
                    <div className="flex-shrink-0">
                        {settings.logoUrl ? (
                            <div className="relative">
                                <img src={settings.logoUrl} alt="Company Logo" className="h-24 w-auto object-contain border border-gray-200 dark:border-gray-700 rounded-md p-2 bg-white" />
                                <button 
                                    onClick={() => onUpdateSettings({...settings, logoUrl: null})}
                                    className="mt-2 text-xs text-red-600 hover:text-red-800 dark:text-red-400"
                                >
                                    Remove Logo
                                </button>
                            </div>
                        ) : (
                            <div className="h-24 w-24 border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-md flex items-center justify-center bg-gray-50 dark:bg-gray-800 text-gray-400">
                                No Logo
                            </div>
                        )}
                    </div>

                    <div className="flex-1">
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Upload New Logo</label>
                        <div className="flex items-center justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
                            <div className="space-y-1 text-center">
                                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400" />
                                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                                    <label htmlFor="logo-upload" className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                                        <span>Upload a file</span>
                                        <input id="logo-upload" name="logo-upload" type="file" className="sr-only" onChange={handleLogoUpload} accept="image/*" />
                                    </label>
                                    <p className="pl-1">or drag and drop</p>
                                </div>
                                <p className="text-xs text-gray-500">PNG, JPG, GIF up to 2MB</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </Card>
    </div>
  );
};

export default SettingsPanel;
