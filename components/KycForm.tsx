
import React, { useState, useCallback } from 'react';
import { KycStatus, type KycFormData, type UploadedFile, type VerificationResult } from '../types';
import { fileToBase64, playAudio } from '../utils/helpers';
import { analyzeKycDocument, generateSpeech } from '../services/geminiService';
import Spinner from './common/Spinner';
import CheckCircleIcon from './icons/CheckCircleIcon';
import XCircleIcon from './icons/XCircleIcon';
import DocumentArrowUpIcon from './icons/DocumentArrowUpIcon';

interface KycFormProps {
  onKycSuccess: () => void;
}

const KycForm: React.FC<KycFormProps> = ({ onKycSuccess }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<KycFormData>({
    fullName: 'Test User',
    address: '123 Test St, Testville',
    documentId: 'TEST12345',
  });
  const [addressProof, setAddressProof] = useState<UploadedFile | null>(null);
  const [idProof, setIdProof] = useState<UploadedFile | null>(null);
  const [status, setStatus] = useState<KycStatus>(KycStatus.PENDING);
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>, fileType: 'address' | 'id') => {
    const file = e.target.files?.[0];
    if (file) {
      const base64 = await fileToBase64(file);
      const uploadedFile = { name: file.name, type: file.type, base64 };
      if (fileType === 'address') {
        setAddressProof(uploadedFile);
      } else {
        setIdProof(uploadedFile);
      }
    }
  };
  
  const handleVerification = useCallback(async () => {
    if (!idProof) return;
    setStatus(KycStatus.VERIFYING);
    
    const result = await analyzeKycDocument(idProof, formData);
    setVerificationResult(result);

    const ttsText = result.match ? "Verification Successful. Welcome aboard." : "Verification Failed. Please review your details and documents.";
    const audioData = await generateSpeech(ttsText);
    if(audioData) {
        playAudio(audioData);
    }
    
    if (result.match) {
      setStatus(KycStatus.SUCCESS);
      setTimeout(onKycSuccess, 3000);
    } else {
      setStatus(KycStatus.FAILED);
    }
  }, [idProof, formData, onKycSuccess]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else if (step === 2) {
      setStatus(KycStatus.SUBMITTING);
      handleVerification();
    }
  };
  
  const renderStep1 = () => (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Personal Information</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Please enter your details exactly as they appear on your documents.</p>
      </div>
      <div className="space-y-4">
        <div>
          <label htmlFor="fullName" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Name</label>
          <input type="text" name="fullName" id="fullName" value={formData.fullName} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200" required />
        </div>
        <div>
          <label htmlFor="address" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Full Address</label>
          <input type="text" name="address" id="address" value={formData.address} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200" required />
        </div>
        <div>
          <label htmlFor="documentId" className="block text-sm font-medium text-gray-700 dark:text-gray-300">Aadhaar / ID Number</label>
          <input type="text" name="documentId" id="documentId" value={formData.documentId} onChange={handleInputChange} className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 text-gray-900 dark:text-gray-200" required />
        </div>
      </div>
    </div>
  );

  const FileUploadInput = ({ label, file, onChange }: { label: string; file: UploadedFile | null; onChange: (e: React.ChangeEvent<HTMLInputElement>) => void; }) => (
    <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">{label}</label>
        <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md">
            <div className="space-y-1 text-center">
                <DocumentArrowUpIcon className="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" />
                <div className="flex text-sm text-gray-600 dark:text-gray-400">
                    <label htmlFor={label} className="relative cursor-pointer bg-white dark:bg-gray-800 rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500">
                        <span>Upload a file</span>
                        <input id={label} name={label} type="file" className="sr-only" onChange={onChange} accept="image/*" />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500 dark:text-gray-500">PNG, JPG, GIF up to 10MB</p>
            </div>
        </div>
        {file && <p className="mt-2 text-sm text-gray-500 dark:text-gray-400">Uploaded: {file.name}</p>}
    </div>
  );

  const renderStep2 = () => (
    <div className="space-y-6">
       <div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">Document Upload</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-1">Upload clear images of your documents.</p>
      </div>
      <div className="space-y-4">
        <FileUploadInput label="Address Proof" file={addressProof} onChange={(e) => handleFileChange(e, 'address')} />
        <FileUploadInput label="Aadhaar / ID Proof" file={idProof} onChange={(e) => handleFileChange(e, 'id')} />
      </div>
    </div>
  );

  const renderVerification = () => (
    <div className="text-center py-8">
        <Spinner />
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-4">Verifying your details...</h2>
        <p className="text-gray-500 dark:text-gray-400 mt-2">Our AI is analyzing your documents. This may take a moment.</p>
    </div>
  );
  
  const renderResult = () => (
    <div className="text-center py-8">
        {status === KycStatus.SUCCESS ? 
            <CheckCircleIcon className="h-20 w-20 text-green-500 mx-auto" /> : 
            <XCircleIcon className="h-20 w-20 text-red-500 mx-auto" />}
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200 mt-4">{verificationResult?.message}</h2>
        {status === KycStatus.SUCCESS && <p className="text-gray-500 dark:text-gray-400 mt-2">Redirecting to dashboard...</p>}
        {status === KycStatus.FAILED && (
            <div className="mt-4 text-left bg-red-50 dark:bg-red-900/50 p-4 rounded-lg">
                <h3 className="font-semibold text-red-800 dark:text-red-300">Mismatch Details:</h3>
                <ul className="list-disc list-inside text-sm text-red-700 dark:text-red-400 mt-2">
                    {verificationResult?.extractedData?.fullName !== formData.fullName && <li>Name: (Document: {verificationResult?.extractedData?.fullName || 'N/A'})</li>}
                    {verificationResult?.extractedData?.address !== formData.address && <li>Address: (Document: {verificationResult?.extractedData?.address || 'N/A'})</li>}
                    {verificationResult?.extractedData?.documentId !== formData.documentId && <li>ID: (Document: {verificationResult?.extractedData?.documentId || 'N/A'})</li>}
                </ul>
                <button
                    onClick={() => { setStatus(KycStatus.PENDING); setStep(1); }}
                    className="mt-4 w-full bg-red-600 text-white py-2 px-4 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
                >
                    Try Again
                </button>
            </div>
        )}
    </div>
  );

  return (
    <div className="max-w-2xl mx-auto bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8">
        <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-gray-100 mb-2">HRMS Onboarding</h1>
        <p className="text-center text-gray-600 dark:text-gray-400 mb-8">Complete the following steps to get started.</p>

        {status === KycStatus.PENDING && (
            <form onSubmit={handleSubmit}>
                {step === 1 && renderStep1()}
                {step === 2 && renderStep2()}
                <div className="mt-8 flex justify-end space-x-4">
                    {step === 2 && <button type="button" onClick={() => setStep(1)} className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm hover:bg-gray-50 dark:hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">Back</button>}
                    <button type="submit" disabled={step === 2 && (!addressProof || !idProof)} className="inline-flex justify-center py-2 px-6 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:bg-indigo-300 disabled:cursor-not-allowed">
                        {step === 1 ? 'Next' : 'Submit for Verification'}
                    </button>
                </div>
            </form>
        )}
        {status === KycStatus.VERIFYING && renderVerification()}
        {(status === KycStatus.SUCCESS || status === KycStatus.FAILED) && renderResult()}
    </div>
  );
};

export default KycForm;
