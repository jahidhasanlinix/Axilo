
import React, { useState, useRef } from 'react';
import { X, Upload, Check, FileText, Loader2 } from 'lucide-react';
import { ComplianceApplication } from '../../../types';

interface CreateComplianceModalProps {
  onClose: () => void;
  onCreate: (data: Omit<ComplianceApplication, 'id' | 'status' | 'dateAdded'>) => void;
}

const CreateComplianceModal: React.FC<CreateComplianceModalProps> = ({ onClose, onCreate }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [companyName, setCompanyName] = useState('');
  const [gstNumber, setGstNumber] = useState('');
  
  const [cinFile, setCinFile] = useState<File | null>(null);
  const [gstFile, setGstFile] = useState<File | null>(null);
  
  const [isSubmitting, setIsSubmitting] = useState(false);

  const cinInputRef = useRef<HTMLInputElement>(null);
  const gstInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!cinFile || !gstFile) {
        alert("Please upload all required documents.");
        return;
    }

    setIsSubmitting(true);
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1500));

    onCreate({
        firstName,
        lastName,
        applicationName: `${firstName} ${lastName}`,
        companyName,
        taxIdNumber: gstNumber,
        documents: {
            cin: cinFile.name,
            gst: gstFile.name
        }
    });
    
    setIsSubmitting(false);
    onClose();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, setFile: (f: File) => void) => {
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
          setFile(file);
      }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-in zoom-in-95 duration-200 max-h-[90vh] overflow-y-auto">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Create a new Application</h2>
        <p className="text-sm text-gray-500 mb-6">Create a new Compliance Application</p>

        <form onSubmit={handleSubmit} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your First Name</label>
                    <input 
                        type="text" 
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                        placeholder="Enter your first name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
                <div>
                    <label className="block text-sm font-bold text-gray-900 mb-2">Your Last Name</label>
                    <input 
                        type="text" 
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                        placeholder="Enter your last name"
                        className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                        required
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Company Name (only Private Limited Company supported)</label>
                <input 
                    type="text" 
                    value={companyName}
                    onChange={(e) => setCompanyName(e.target.value)}
                    placeholder="Well Labs Private Limited"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">CIN Certificate (only Private Limited Company supported)</label>
                <div 
                    onClick={() => cinInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${cinFile ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                    {cinFile ? (
                        <div className="flex items-center gap-2 text-blue-700">
                            <FileText size={20} />
                            <span className="font-medium text-sm">{cinFile.name}</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Drag and drop your file here, or <span className="text-blue-600">click to browse</span></p>
                            <p className="text-xs text-gray-400 mt-1">Only PDF files up to 10 MB</p>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={cinInputRef}
                        onChange={(e) => handleFileChange(e, setCinFile)}
                        accept=".pdf"
                        className="hidden"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">GST Number</label>
                <input 
                    type="text" 
                    value={gstNumber}
                    onChange={(e) => setGstNumber(e.target.value)}
                    placeholder="ABCDEFGHIJKL1234"
                    className="w-full px-3 py-2.5 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">GST File</label>
                <div 
                    onClick={() => gstInputRef.current?.click()}
                    className={`border-2 border-dashed border-gray-300 rounded-lg p-6 flex flex-col items-center justify-center cursor-pointer hover:bg-gray-50 transition-colors ${gstFile ? 'bg-blue-50 border-blue-200' : ''}`}
                >
                    {gstFile ? (
                        <div className="flex items-center gap-2 text-blue-700">
                            <FileText size={20} />
                            <span className="font-medium text-sm">{gstFile.name}</span>
                        </div>
                    ) : (
                        <>
                            <Upload size={24} className="text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Drag and drop your file here, or <span className="text-blue-600">click to browse</span></p>
                            <p className="text-xs text-gray-400 mt-1">Only PDF files up to 10 MB</p>
                        </>
                    )}
                    <input 
                        type="file" 
                        ref={gstInputRef}
                        onChange={(e) => handleFileChange(e, setGstFile)}
                        accept=".pdf"
                        className="hidden"
                    />
                </div>
            </div>

            <div className="flex justify-end pt-2">
                <button 
                    type="submit"
                    disabled={isSubmitting}
                    className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
                >
                    {isSubmitting ? <Loader2 size={16} className="animate-spin" /> : <Check size={16} />}
                    Create Application
                </button>
            </div>
        </form>
      </div>
    </div>
  );
};

export default CreateComplianceModal;
