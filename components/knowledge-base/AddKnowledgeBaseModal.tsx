
import React, { useState, useRef } from 'react';
import { X, Upload, Link, Loader2, FileText } from 'lucide-react';
import { KnowledgeBaseItem } from '../../types';

interface AddKnowledgeBaseModalProps {
  onClose: () => void;
  onAdd: (item: Omit<KnowledgeBaseItem, 'id' | 'created' | 'status'>) => void;
}

const AddKnowledgeBaseModal: React.FC<AddKnowledgeBaseModalProps> = ({ onClose, onAdd }) => {
  const [activeTab, setActiveTab] = useState<'PDF' | 'URL'>('PDF');
  const [url, setUrl] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
    }
  };

  const handleSubmit = async () => {
    if (activeTab === 'PDF' && !file) return;
    if (activeTab === 'URL' && !url) return;

    setIsLoading(true);

    // Simulate network request
    await new Promise(resolve => setTimeout(resolve, 1500));

    onAdd({
      source: activeTab === 'PDF' ? file?.name || 'document.pdf' : url,
      type: activeTab
    });

    setIsLoading(false);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-6 relative animate-in zoom-in-95 duration-200">
        <button 
          onClick={onClose}
          className="absolute right-6 top-6 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X size={24} />
        </button>

        <h2 className="text-xl font-bold text-gray-900 mb-6">Add Knowledge Base</h2>

        {/* Tabs */}
        <div className="flex p-1 bg-gray-100 rounded-lg mb-6">
          <button
            onClick={() => setActiveTab('PDF')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'PDF' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <FileText size={16} /> Upload PDF
          </button>
          <button
            onClick={() => setActiveTab('URL')}
            className={`flex-1 py-2 text-sm font-medium rounded-md transition-all flex items-center justify-center gap-2 ${
              activeTab === 'URL' 
                ? 'bg-white text-blue-600 shadow-sm' 
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <Link size={16} /> Add URL
          </button>
        </div>

        {/* Content */}
        <div className="space-y-6">
          {activeTab === 'PDF' ? (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">PDF File</label>
              <div 
                onClick={() => fileInputRef.current?.click()}
                className="w-full px-4 py-3 border border-gray-300 rounded-md bg-white cursor-pointer hover:border-blue-400 transition-colors flex items-center justify-between"
              >
                <span className={`text-sm ${file ? 'text-gray-900' : 'text-gray-400'}`}>
                  {file ? file.name : 'Choose File No file chosen'}
                </span>
                <Upload size={18} className="text-gray-400" />
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileChange}
                    accept=".pdf"
                    className="hidden"
                />
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Website URL</label>
              <input 
                type="url" 
                value={url}
                onChange={(e) => setUrl(e.target.value)}
                placeholder="https://example.com"
                className="w-full px-4 py-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 outline-none text-sm"
              />
            </div>
          )}

          <div className="text-xs text-gray-500">
            Refer Knowledge base APIs at <a href="#" className="text-blue-600 underline">here</a>.
          </div>

          <div className="flex justify-end pt-2">
            <button 
              onClick={handleSubmit}
              disabled={isLoading || (activeTab === 'PDF' && !file) || (activeTab === 'URL' && !url)}
              className="bg-blue-600 text-white px-6 py-2.5 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
            >
              {isLoading ? (
                <>
                  <Loader2 size={16} className="animate-spin" /> Processing...
                </>
              ) : (
                activeTab === 'PDF' ? 'Upload PDF' : 'Add URL'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AddKnowledgeBaseModal;
