
import React, { useState, useEffect } from 'react';
import { WorkflowNodeData } from '../../types';
import { Phone, X } from 'lucide-react';

interface NodeConfigModalProps {
  nodeId: string;
  data: WorkflowNodeData;
  onSave: (nodeId: string, newData: Partial<WorkflowNodeData>) => void;
  onClose: () => void;
}

const NodeConfigModal: React.FC<NodeConfigModalProps> = ({ nodeId, data, onSave, onClose }) => {
  const [formData, setFormData] = useState({
    label: '',
    type: 'Call',
    delayValue: 60,
    delayUnit: 'mins'
  });

  useEffect(() => {
    // Parse delay string roughly (e.g. "1 hour delay" -> 60 mins)
    // For this demo, we'll just initialize simply
    setFormData({
      label: data.label,
      type: data.type,
      delayValue: 60,
      delayUnit: 'mins'
    });
  }, [data]);

  const handleSave = () => {
    let delayString = 'Start immediately';
    if (formData.delayValue > 0) {
        delayString = `${formData.delayValue} ${formData.delayUnit} delay`;
    }

    onSave(nodeId, {
      label: formData.label,
      type: formData.type as any,
      delay: delayString
    });
    onClose();
  };

  const DELAY_PRESETS = [
      { label: '5 mins', val: 5, unit: 'mins' },
      { label: '10 mins', val: 10, unit: 'mins' },
      { label: '20 mins', val: 20, unit: 'mins' },
      { label: '30 mins', val: 30, unit: 'mins' },
      { label: '1 hour', val: 60, unit: 'mins' },
      { label: '2 hours', val: 120, unit: 'mins' },
  ];

  return (
    <div className="absolute top-20 right-20 z-50 w-80 bg-white rounded-xl shadow-2xl border border-gray-200 animate-in slide-in-from-right fade-in duration-200">
      <div className="p-4 border-b border-gray-100 flex items-start gap-3">
        <div className="w-10 h-10 rounded-full bg-blue-50 flex items-center justify-center flex-shrink-0">
          <Phone size={20} className="text-blue-600" />
        </div>
        <div className="flex-1">
            <h3 className="font-bold text-gray-900">{data.label}</h3>
            <p className="text-xs text-gray-500">{data.delay}</p>
        </div>
      </div>

      <div className="p-4 space-y-4">
        <div className="grid grid-cols-2 gap-4">
             <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Step Label</label>
                <input 
                    type="text" 
                    value={formData.label}
                    onChange={(e) => setFormData({...formData, label: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
             </div>
             <div>
                <label className="block text-xs font-bold text-gray-700 mb-1">Step Type</label>
                <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                >
                    <option value="Call">Call</option>
                    <option value="SMS">SMS</option>
                    <option value="Email">Email</option>
                </select>
             </div>
        </div>

        <div>
            <label className="block text-xs font-bold text-gray-700 mb-2">Delay (minutes)</label>
            <div className="flex flex-wrap gap-2 mb-3">
                {DELAY_PRESETS.map(preset => (
                    <button
                        key={preset.label}
                        onClick={() => setFormData({...formData, delayValue: preset.val, delayUnit: preset.unit})}
                        className={`px-2 py-1 text-xs rounded border transition-colors ${
                            formData.delayValue === preset.val 
                                ? 'bg-blue-50 border-blue-200 text-blue-700 font-medium' 
                                : 'bg-white border-gray-200 text-gray-600 hover:bg-gray-50'
                        }`}
                    >
                        {preset.label}
                    </button>
                ))}
            </div>
            <input 
                type="number"
                value={formData.delayValue}
                onChange={(e) => setFormData({...formData, delayValue: parseInt(e.target.value)})}
                className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
        </div>
      </div>

      <div className="p-3 bg-gray-50 border-t border-gray-100 rounded-b-xl flex gap-3">
          <button 
            onClick={handleSave}
            className="flex-1 py-2 bg-green-600 text-white text-sm font-medium rounded-md hover:bg-green-700 transition-colors shadow-sm"
          >
              Save
          </button>
          <button 
            onClick={onClose}
            className="flex-1 py-2 bg-white border border-gray-300 text-gray-700 text-sm font-medium rounded-md hover:bg-gray-50 transition-colors"
          >
              Cancel
          </button>
      </div>
    </div>
  );
};

export default NodeConfigModal;
