
import React, { useState } from 'react';
import { X, Upload, Calendar, Clock, CheckCircle2 } from 'lucide-react';
import { Agent, Batch } from '../../types';

interface UploadBatchModalProps {
  agent: Agent;
  onClose: () => void;
  onCreateBatch: (batchData: Partial<Batch>) => void;
}

const UploadBatchModal: React.FC<UploadBatchModalProps> = ({ agent, onClose, onCreateBatch }) => {
  const [file, setFile] = useState<File | null>(null);
  const [scheduleType, setScheduleType] = useState<'now' | 'schedule'>('now');
  const [scheduledDate, setScheduledDate] = useState('');
  const [scheduledTime, setScheduledTime] = useState('');
  const [webhookUrl, setWebhookUrl] = useState('');

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = () => {
    if (!file) return;

    // Simulate file parsing logic
    const totalMock = Math.floor(Math.random() * 500) + 50; // Random number between 50 and 550
    const validMock = totalMock - Math.floor(Math.random() * 10); // Slight difference for realism

    const newBatch: Partial<Batch> = {
      agentId: agent.id,
      fileName: file.name,
      validContacts: validMock,
      totalContacts: totalMock,
      workflow: 'Standard Call', // Could be dynamic in future
      scheduledAt: scheduleType === 'schedule' ? `${scheduledDate} ${scheduledTime}` : undefined,
      executionStatus: scheduleType === 'now' ? 'Running' : 'Pending'
    };
    
    onCreateBatch(newBatch);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-2xl p-6 relative animate-in zoom-in-95 duration-200">
        <button onClick={onClose} className="absolute right-6 top-6 text-gray-400 hover:text-gray-600">
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-1">Upload Batch</h2>
        <p className="text-sm text-gray-500 mb-6">Select a CSV file to upload.</p>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-100 rounded-lg p-4 mb-6 flex items-start gap-3">
          <div className="text-blue-600 mt-0.5"><CheckCircle2 size={18} /></div>
          <div className="text-sm text-blue-800">
            <p className="font-semibold mb-1">Ensure that your CSV file includes a column labeled <span className="font-mono bg-blue-100 px-1 rounded">contact_number</span> for phone numbers.</p>
            <p>If your agent prompt uses variables (e.g., <span className="font-mono bg-blue-100 px-1 rounded">{`{customer_name}`}</span>), add each as a separate CSV column using the exact variable name as the header.</p>
          </div>
        </div>

        {/* File Upload Area */}
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 mb-6 flex flex-col items-center justify-center bg-gray-50 hover:bg-gray-100 transition-colors">
            {file ? (
                <div className="text-center">
                    <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                        <CheckCircle2 size={24} />
                    </div>
                    <p className="text-sm font-medium text-gray-900">{file.name}</p>
                    <p className="text-xs text-gray-500 mt-1">{(file.size / 1024).toFixed(2)} KB</p>
                    <button onClick={() => setFile(null)} className="text-xs text-red-500 hover:underline mt-2">Remove file</button>
                </div>
            ) : (
                <>
                    <Upload size={32} className="text-gray-400 mb-3" />
                    <p className="text-sm text-gray-600">Drag and drop your CSV here, or <label className="text-blue-600 hover:underline cursor-pointer">click to browse <input type="file" accept=".csv" className="hidden" onChange={handleFileChange} /></label></p>
                    <p className="text-xs text-gray-400 mt-1">Only .csv files are supported</p>
                </>
            )}
        </div>

        {/* Configuration */}
        <div className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Calls will be made via Plivo using:</label>
                <select className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500 bg-white">
                    <option>Axilo managed phone numbers</option>
                    <option>My Custom Numbers</option>
                </select>
                <p className="text-xs text-gray-500 mt-1">You can <a href="#" className="underline">purchase phone numbers</a> to start making calls from your own custom numbers.</p>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">When do you want to run this batch?</label>
                <div className="flex bg-gray-100 p-1 rounded-lg mb-4">
                    <button 
                        onClick={() => setScheduleType('now')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${scheduleType === 'now' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        Run Now
                    </button>
                    <button 
                        onClick={() => setScheduleType('schedule')}
                        className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${scheduleType === 'schedule' ? 'bg-white text-blue-600 shadow-sm' : 'text-gray-500 hover:text-gray-700'}`}
                    >
                        <Clock size={16} /> Schedule
                    </button>
                </div>

                {scheduleType === 'now' ? (
                    <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                        <CheckCircle2 size={16} /> Batch will start immediately after creation
                    </div>
                ) : (
                    <div className="flex gap-4">
                        <div className="flex-1 relative">
                            <input 
                                type="date" 
                                value={scheduledDate}
                                onChange={(e) => setScheduledDate(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                        <div className="flex-1">
                             <input 
                                type="time" 
                                value={scheduledTime}
                                onChange={(e) => setScheduledTime(e.target.value)}
                                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500" 
                            />
                        </div>
                    </div>
                )}
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-900 mb-2">Webhook URL</label>
                <input 
                    type="text" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    placeholder="https://example.com/webhook"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm outline-none focus:ring-2 focus:ring-blue-500"
                />
            </div>
        </div>

        <div className="mt-8 flex justify-end">
             <button 
                onClick={handleSubmit}
                disabled={!file}
                className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed"
             >
                Confirm
             </button>
        </div>

      </div>
    </div>
  );
};

export default UploadBatchModal;
