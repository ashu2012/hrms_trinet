
import { GoogleGenAI, GenerateContentResponse, Type, Modality } from "@google/genai";
// FIX: Import EmployeeType enum to use its values.
import { EmployeeType, type KycFormData, type UploadedFile, type VerificationResult, type LeavePolicy } from '../types';

const API_KEY = process.env.API_KEY;

if (!API_KEY) {
  console.warn("API_KEY environment variable not set. Using a placeholder. AI features will not work.");
}

const ai = new GoogleGenAI({ apiKey: API_KEY || 'mock-api-key' });

export const analyzeKycDocument = async (
  document: UploadedFile,
  userFormData: KycFormData
): Promise<VerificationResult> => {
  if (!API_KEY) {
    // Mock response for development without API key
    await new Promise(res => setTimeout(res, 2000));
    if (userFormData.fullName.toLowerCase().includes("test")) {
        return { match: true, message: "Mock verification successful.", extractedData: { fullName: userFormData.fullName, address: userFormData.address, documentId: userFormData.documentId } };
    }
    return { match: false, message: "Mock verification failed: Name mismatch.", extractedData: { fullName: 'Mock Name', address: 'Mock Address', documentId: 'MOCK12345' } };
  }

  const imagePart = {
    inlineData: {
      mimeType: document.type,
      data: document.base64,
    },
  };

  const textPart = {
    // FIX: Removed JSON instructions from prompt as responseSchema is now used.
    text: `Analyze this KYC document. Extract the full name, full address, and document ID number. Compare the extracted information with the following user-submitted data:
    - Full Name: ${userFormData.fullName}
    - Address: ${userFormData.address}
    - Document ID: ${userFormData.documentId}
    
    The "match" field should be true only if all three fields (fullName, address, documentId) from the document closely match the user-submitted data. The "message" should explain the verification outcome.`,
  };

  try {
    const response: GenerateContentResponse = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: { parts: [imagePart, textPart] },
      // FIX: Use responseSchema to enforce JSON output structure for more reliable parsing.
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            match: { type: Type.BOOLEAN },
            message: { type: Type.STRING },
            extractedData: {
              type: Type.OBJECT,
              properties: {
                fullName: { type: Type.STRING },
                address: { type: Type.STRING },
                documentId: { type: Type.STRING },
              },
            },
          },
        },
      },
    });

    const jsonString = response.text.trim();
    const result = JSON.parse(jsonString);
    return result as VerificationResult;
  } catch (error) {
    console.error("Error analyzing KYC document:", error);
    return {
      match: false,
      message: "An error occurred during AI analysis. Please try again.",
    };
  }
};

export const generateSpeech = async (text: string): Promise<string | null> => {
  if (!API_KEY) {
    console.log("Mock TTS for text:", text);
    return null;
  }
  try {
    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash-preview-tts",
        contents: [{ parts: [{ text: `Say with a professional and clear tone: ${text}` }] }],
        config: {
            responseModalities: [Modality.AUDIO],
            speechConfig: {
                voiceConfig: {
                    prebuiltVoiceConfig: { voiceName: 'Kore' },
                },
            },
        },
    });
    return response.candidates?.[0]?.content?.parts?.[0]?.inlineData?.data || null;
  } catch (error) {
    console.error('Error generating speech:', error);
    return null;
  }
};

export const createLeavePolicyFromText = async (description: string): Promise<LeavePolicy | null> => {
  if (!API_KEY) {
    // Mock response for development without API key
    await new Promise(res => setTimeout(res, 3000));
    return {
        policyName: "Mock Generated Policy",
        rules: [
            // FIX: Use EmployeeType enum instead of string literals to fix type error.
            { employeeType: EmployeeType.FULL_TIME, probationMonths: 3, paidLeaveDays: 12, unpaidLeaveDays: 5, accrualRatePerMonth: 1 },
            // FIX: Use EmployeeType enum instead of string literals to fix type error.
            { employeeType: EmployeeType.CONTRACT, probationMonths: 0, paidLeaveDays: 0, unpaidLeaveDays: 10, accrualRatePerMonth: 0 }
        ]
    };
  }
  
  const prompt = `You are an expert HR policy creation AI. Analyze the following leave policy description and convert it into a structured JSON object. The output must strictly adhere to the provided JSON schema.
  
  Description: "${description}"
  
  Identify rules for different employee types (like 'Full-Time' or 'Contract'). If a detail is not mentioned, use a sensible default (e.g., 0 for probation period if not specified).
  The final output must be only the JSON object, with no extra text or markdown formatting.`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-pro",
      contents: prompt,
      config: {
        thinkingConfig: { thinkingBudget: 32768 },
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            policyName: { type: Type.STRING, description: "A suitable name for the policy, derived from the description." },
            rules: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  employeeType: { type: Type.STRING, enum: ["Full-Time", "Contract"], description: "The type of employee this rule applies to." },
                  probationMonths: { type: Type.INTEGER, description: "The probation period in months before leave policy is active." },
                  paidLeaveDays: { type: Type.INTEGER, description: "Total annual paid leave days." },
                  unpaidLeaveDays: { type: Type.INTEGER, description: "Total annual unpaid leave days." },
                  accrualRatePerMonth: { type: Type.NUMBER, description: "Number of paid leave days accrued per month." },
                },
                required: ["employeeType", "probationMonths", "paidLeaveDays", "unpaidLeaveDays", "accrualRatePerMonth"],
              },
            },
          },
          required: ["policyName", "rules"],
        },
      },
    });

    const jsonString = response.text.trim();
    return JSON.parse(jsonString) as LeavePolicy;
  } catch (error) {
    console.error("Error creating leave policy:", error);
    return null;
  }
};
