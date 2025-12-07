
import React, { useState, useRef } from 'react';
import { X, Upload, Check, FileText, Loader2, Building2 } from 'lucide-react';
import { ComplianceApplication } from '../../../types';

interface CreateComplianceModalProps {
  onClose: () => void;
  onCreate: (data: Omit<ComplianceApplication, 'id' | 'status' | 'dateAdded'>) => void;
}

const CreateComplianceModal: React.FC<CreateComplianceModalProps> = ({ onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [einNumber, setEinNumber] = useState('');
  
  const [businessDoc, setBusinessDoc] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const docInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async () => {
    // Manual Validation
    if (!firstName.trim() || !lastName.trim() || !companyName.trim() || !einNumber.trim()) {
        alert("Please fill in all required fields (First Name, Last Name, Business Name, EIN).");
        return;
    }

    // EIN Validation
    // Matches standard 9-digit EIN format: XX-XXXXXXX
    const einRegex = /^\d{2}-\d{7}$/;
    if (!einRegex.test(einNumber)) {
        alert("Invalid EIN format. Please enter a valid 9-digit Employer Identification Number in the format XX-XXXXXXX (e.g., 12-3456789).");
        return;
    }

    if (!businessDoc) {
        alert("Please upload the required business documentation (IRS Letter or Registration).");
        return;
    }

    setIsSubmitting(true);
    
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    try {
        onCreate({
            firstName,
            lastName,
            applicationName: `${firstName} ${lastName}`,
            companyName,
            taxIdNumber: einNumber,
            documents: {
                businessDoc: businessDoc.name
            }
        });
        onClose();
    } catch (error) {
        console.error("Error creating application:", error);
        alert("Failed to submit application. Please try again.");
    } finally {
        setIsSubmitting(false);
    }
  };

  const handleEinChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      let value = e.target.value;
      // Allow only digits and hyphen
      value = value.replace(/[^\d-]/g, '');
      
      // Auto-formatting: If user types the 2nd digit and next isn't a hyphen, add it
      if (value.length === 2 && einNumber.length === 1) {
          value += '-';
      }
      
      // Prevent input longer than 10 chars (9 digits + 1 hyphen)
      if (value.length > 10) return;

      setEinNumber(value);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          if (file.size > 10 * 1024 * 1024) {
              alert("File size must be less than 10MB");
              return;
          }
          if (file.type !== 'application/pdf') {
              alert("Only PDF files are supported");
              return;
          }
          setBusinessDoc(file);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <div className="flex items-center gap-3 mb-1">
            <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                <Building2 size={24} />
            </div>
            <div>
                <h2 className="text-xl font-bold text-gray-900">Business Verification</h2>
                <p className="text-sm text-gray-500">US Business Entity Registration (A2P 10DLC)</p>
            </div>
        </div>
        
        <div className="mt-6 mb-6 p-4 bg-gray-50 border border-gray-200 rounded-lg text-sm text-gray-600">
            To comply with US carrier regulations, we need to verify your business identity. Please provide your official IRS tax information.
        </div>

        <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">First Name <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Authorized"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Last Name <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Representative"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Legal Business Name <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="e.g. Acme Corp LLC"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
                <p className="text-xs text-gray-500 mt-1">Must match exactly with your IRS documents.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Employer Identification Number (EIN) <span className="text-red-500">*</span></label>
                <input 
                    type="text" 
                    value={einNumber}
                    onChange={handleEinChange}
                    placeholder="XX-XXXXXXX"
                    maxLength={10}
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono"
                />
                <p className="text-xs text-gray-500 mt-1">The 9-digit unique Tax ID assigned by the IRS. Format: 12-3456789</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">IRS Verification Letter / Business Registration <span className="text-red-500">*</span></label>
                <div 
                    onClick={() => docInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${businessDoc ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                    {businessDoc ? (
                        <div className="flex items-center gap-2 text-blue-700">
                            <FileText size={20} />
                            <span className="font-medium text-sm">{businessDoc.name}</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Upload CP 575 or 147C Letter</p>
                            <p className="text-xs text-gray-400 mt-1">PDF format, max 10 MB</p>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={docInputRef}
                        onChange={handleFileChange}
                        accept=".pdf"
                        className="hidden"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-100">
                <button 
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Submit Application
                </button>
            </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplianceModal;
