
import React, { useState } from 'react';
import { ProviderDefinition } from '../../types';
import { X, Plug, AlertCircle } from 'lucide-react';

interface ConnectProviderModalProps {
  provider: ProviderDefinition;
  onClose: () => void;
  onConnect: (providerId: string, config: Record<string, string>) => void;
}

const ConnectProviderModal: React.FC<ConnectProviderModalProps> = ({ provider, onClose, onConnect }) => {
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleChange = (key: string, value: string) => {
    setFormData(prev => ({ ...prev, [key]: value }));
    if (errors[key]) {
        setErrors(prev => {
            const newErrors = { ...prev };
            delete newErrors[key];
            return newErrors;
        });
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};
    let isValid = true;

    provider.fields.forEach(field => {
        if (field.required && !formData[field.key]?.trim()) {
            newErrors[field.key] = `${field.label} is required`;
            isValid = false;
        }
    });

    if (isValid) {
        onConnect(provider.id, formData);
        onClose();
    } else {
        setErrors(newErrors);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-lg relative animate-in zoom-in-95 duration-200 max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-100">
            <div>
                <h2 className="text-xl font-bold text-gray-900">Connect {provider.name}</h2>
                <p className="text-sm text-gray-500 mt-1">Enter your credentials to connect your {provider.name} account.</p>
            </div>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={24} />
            </button>
        </div>

        {/* Content */}
        <div className="p-6 overflow-y-auto">
            <form onSubmit={handleSubmit} className="space-y-5">
                {provider.fields.map(field => (
                    <div key={field.key}>
                        <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-2">
                            {field.label}
                        </label>
                        <input 
                            type={field.type}
                            value={formData[field.key] || ''}
                            onChange={(e) => handleChange(field.key, e.target.value)}
                            placeholder={field.placeholder}
                            className={`w-full px-4 py-2.5 border rounded-md text-sm outline-none transition-all ${
                                errors[field.key] 
                                    ? 'border-red-300 focus:ring-2 focus:ring-red-200 bg-red-50' 
                                    : 'border-gray-300 focus:ring-2 focus:ring-blue-500 bg-white'
                            }`}
                        />
                        {field.description && <p className="text-xs text-gray-500 mt-1">{field.description}</p>}
                        {errors[field.key] && <p className="text-xs text-red-500 mt-1 flex items-center gap-1"><AlertCircle size={10} /> {errors[field.key]}</p>}
                    </div>
                ))}

                {provider.helpText && (
                    <div className="bg-yellow-50 border border-yellow-200 rounded-md p-3 text-sm text-yellow-800 flex items-start gap-2">
                        <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                        <div>
                            {provider.helpText}
                            {provider.documentationLink && (
                                <div className="mt-1">
                                    <a href={provider.documentationLink} target="_blank" rel="noopener noreferrer" className="underline font-medium hover:text-yellow-900">
                                        Check it here
                                    </a>
                                </div>
                            )}
                        </div>
                    </div>
                )}
            </form>
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 bg-gray-50 rounded-b-xl flex justify-end gap-3">
             <button 
                onClick={onClose}
                className="px-4 py-2.5 bg-white border border-gray-300 rounded-md text-gray-700 font-medium text-sm hover:bg-gray-50 transition-colors"
             >
                Cancel
             </button>
             <button 
                onClick={handleSubmit}
                className="px-6 py-2.5 bg-blue-600 text-white rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
             >
                <Plug size={16} /> Connect {provider.name}
             </button>
        </div>
      </div>
    </div>
  );
};

export default ConnectProviderModal;
