
import React, { useState, useRef } from 'react';
import { X, Upload, Check, User, GitBranch, FileText, Calendar, AlertCircle, Phone, ArrowRight, Clock } from 'lucide-react';
import { Agent, Workflow, Campaign } from '../../types';

interface CreateCampaignModalProps {
  agents: Agent[];
  workflows: Workflow[];
  onClose: () => void;
  onCreate: (campaign: Partial<Campaign>) => void;
}

const CreateCampaignModal: React.FC<CreateCampaignModalProps> = ({ agents, workflows, onClose, onCreate }) => {
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    name: `New campaign ${new Date().toLocaleString()}`,
    description: '',
    file: null as File | null,
    agentId: '',
    workflowId: '',
    phoneNumber: 'Axilo managed phone numbers',
    startTime: ''
  });
  const [csvError, setCsvError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setFormData({ ...formData, file });
      validateCsv(file);
    }
  };

  const validateCsv = (file: File) => {
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result as string;
      const firstLine = text.split('\n')[0];
      const headers = firstLine.split(',').map(h => h.trim().toLowerCase());
      
      if (!headers.includes('contact_number')) {
        setCsvError('Please upload a file with the required headers: contact_number');
      } else {
        setCsvError(null);
      }
    };
    reader.readAsText(file);
  };

  const handleNext = () => {
    setStep(prev => prev + 1);
  };

  const handleBack = () => {
    setStep(prev => prev - 1);
  };

  const handleSubmit = () => {
    onCreate({
      name: formData.name,
      description: formData.description,
      agentId: formData.agentId,
      workflowId: formData.workflowId,
      fileName: formData.file?.name || 'unknown.csv',
      scheduledAt: formData.startTime || new Date().toISOString()
    });
  };

  const isStep1Valid = formData.name && formData.file && !csvError;
  const isStep2Valid = formData.agentId && formData.workflowId && formData.startTime;

  const renderStepIndicator = () => (
    <div className="flex items-center justify-between px-10 py-6 bg-gray-50 border-b border-gray-100">
       <div className={`flex flex-col items-center ${step >= 1 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${step >= 1 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}>
             {step > 1 ? <Check size={16} /> : 1}
          </div>
          <span className="text-xs font-medium">Campaign Details</span>
       </div>
       <div className={`h-[1px] flex-1 mx-4 ${step >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
       <div className={`flex flex-col items-center ${step >= 2 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${step >= 2 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}>
             {step > 2 ? <Check size={16} /> : 2}
          </div>
          <span className="text-xs font-medium">Workflow & Agent</span>
       </div>
       <div className={`h-[1px] flex-1 mx-4 ${step >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`}></div>
       <div className={`flex flex-col items-center ${step >= 3 ? 'text-blue-600' : 'text-gray-400'}`}>
          <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-sm mb-1 ${step >= 3 ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300'}`}>
             3
          </div>
          <span className="text-xs font-medium">Review</span>
       </div>
    </div>
  );

  const renderWorkflowPreview = (workflowId: string) => {
      const wf = workflows.find(w => w.id === workflowId);
      if (!wf) return <div className="text-center text-gray-400 py-10">Select a workflow to view details</div>;

      return (
          <div className="bg-white border border-gray-200 rounded-lg p-4">
              <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-sm text-gray-900">{wf.title}</h4>
                  <span className="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">Configured</span>
              </div>
              
              <div className="flex items-center gap-2 overflow-x-auto pb-2">
                  {wf.nodes.map((node, index) => (
                      <React.Fragment key={node.id}>
                          <div className="flex flex-col items-center min-w-[100px]">
                              <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2 border border-blue-100">
                                  {node.data.type === 'Call' ? <Phone size={18} /> : 
                                   node.data.type === 'SMS' ? <FileText size={18} /> : 
                                   <Clock size={18} />}
                              </div>
                              <span className="text-xs font-semibold text-gray-900">{node.data.label}</span>
                              <span className="text-[10px] text-gray-500">{node.data.delay || 'No delay'}</span>
                          </div>
                          {index < wf.nodes.length - 1 && (
                              <div className="h-[1px] w-8 bg-gray-300"></div>
                          )}
                      </React.Fragment>
                  ))}
              </div>
          </div>
      )
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-xl shadow-xl w-full max-w-[1000px] h-[700px] flex flex-col animate-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
            <h2 className="text-lg font-bold text-gray-900">Create New Campaign</h2>
            <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
                <X size={24} />
            </button>
        </div>

        {/* Steps */}
        {renderStepIndicator()}

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-8 bg-gray-50/50">
            {step === 1 && (
                <div className="space-y-6 max-w-3xl mx-auto bg-white p-8 rounded-xl border border-gray-200 shadow-sm">
                    <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2 mb-4">
                        <FileText size={20} className="text-blue-600" /> Campaign Details
                    </h3>
                    
                    <div className="space-y-5">
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Campaign Name</label>
                            <input 
                                type="text" 
                                value={formData.name}
                                onChange={(e) => setFormData({...formData, name: e.target.value})}
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none transition-shadow"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Description</label>
                            <textarea 
                                rows={3}
                                value={formData.description}
                                onChange={(e) => setFormData({...formData, description: e.target.value})}
                                placeholder="Campaign description"
                                className="w-full px-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none resize-none transition-shadow"
                            />
                        </div>
                        
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1.5">Candidates CSV</label>
                            {csvError && (
                                <div className="mb-3 bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-md text-sm flex items-center gap-2">
                                    <AlertCircle size={16} />
                                    {csvError}
                                </div>
                            )}
                            <div 
                                onClick={() => fileInputRef.current?.click()}
                                className={`border-2 border-dashed rounded-lg px-6 py-8 flex flex-col items-center justify-center cursor-pointer transition-colors ${csvError ? 'border-red-300 bg-red-50' : 'border-gray-300 bg-gray-50 hover:bg-gray-100 hover:border-blue-400'}`}
                            >
                                {formData.file ? (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <FileText size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">{formData.file.name}</p>
                                        <p className="text-xs text-gray-500 mt-1">{(formData.file.size / 1024).toFixed(2)} KB</p>
                                    </div>
                                ) : (
                                    <div className="text-center">
                                        <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-3">
                                            <Upload size={24} />
                                        </div>
                                        <p className="text-sm font-medium text-gray-900">Click to upload CSV</p>
                                        <p className="text-xs text-gray-500 mt-1">Must contain 'contact_number' header</p>
                                    </div>
                                )}
                                <input 
                                    type="file" 
                                    ref={fileInputRef}
                                    accept=".csv"
                                    className="hidden"
                                    onChange={handleFileChange}
                                />
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {step === 2 && (
                <div className="max-w-6xl mx-auto">
                     <div className="flex items-center gap-2 mb-6">
                        <GitBranch size={20} className="text-blue-600" /> 
                        <h3 className="text-lg font-bold text-gray-900">Workflow & Agent Configuration</h3>
                        <span className="ml-auto text-xs bg-gray-100 px-2 py-1 rounded text-gray-500">1/10 Configured</span>
                     </div>

                     <div className="grid grid-cols-12 gap-6">
                         {/* Left Config Panel */}
                         <div className="col-span-5 bg-white p-6 rounded-xl border border-gray-200 shadow-sm h-fit">
                            <h4 className="font-bold text-gray-900 mb-6 pb-2 border-b border-gray-100">Configuration 1</h4>
                            
                            <div className="space-y-5">
                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Select Workflow</label>
                                    <select 
                                        value={formData.workflowId}
                                        onChange={(e) => setFormData({...formData, workflowId: e.target.value})}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Select Workflow</option>
                                        {workflows.map(wf => <option key={wf.id} value={wf.id}>{wf.title}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Select Agent</label>
                                    <select 
                                        value={formData.agentId}
                                        onChange={(e) => setFormData({...formData, agentId: e.target.value})}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option value="">Select Agent</option>
                                        {agents.map(a => <option key={a.id} value={a.id}>{a.name}</option>)}
                                    </select>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">From phone number</label>
                                    <select 
                                        value={formData.phoneNumber}
                                        onChange={(e) => setFormData({...formData, phoneNumber: e.target.value})}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                                    >
                                        <option>Axilo managed phone numbers</option>
                                        <option>My Custom Numbers</option>
                                    </select>
                                    <p className="text-[10px] text-gray-500 mt-1">You can <a href="#" className="underline decoration-dotted">purchase phone numbers</a> to start making calls from your own custom numbers.</p>
                                </div>

                                <div>
                                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wide mb-1.5">Campaign Start Time <span className="text-red-500">*</span></label>
                                    <input 
                                        type="datetime-local"
                                        value={formData.startTime}
                                        onChange={(e) => setFormData({...formData, startTime: e.target.value})}
                                        className="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                    />
                                    <p className="text-[10px] text-gray-500 mt-1">When should this campaign begin?</p>
                                </div>
                            </div>

                            <button className="w-full mt-6 py-2.5 border border-dashed border-gray-300 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 hover:border-gray-400 transition-colors">
                                + Add Another Workflow
                            </button>
                         </div>

                         {/* Right Visual Panel */}
                         <div className="col-span-7 bg-gray-50 border border-gray-200 border-dashed rounded-xl p-6 flex flex-col items-center justify-center min-h-[400px]">
                             {formData.workflowId ? (
                                 <div className="w-full space-y-4">
                                     <div className="flex items-center justify-between mb-2">
                                         <span className="text-sm font-bold text-gray-700">Workflow 1: {workflows.find(w => w.id === formData.workflowId)?.title}</span>
                                         <span className="text-xs bg-white border px-2 py-1 rounded shadow-sm text-gray-600">Configured</span>
                                     </div>
                                     {renderWorkflowPreview(formData.workflowId)}
                                 </div>
                             ) : (
                                 <div className="text-center text-gray-400">
                                     <p>Select workflows to view details</p>
                                 </div>
                             )}
                         </div>
                     </div>
                </div>
            )}

            {step === 3 && (
                <div className="max-w-5xl mx-auto space-y-6">
                    <div className="flex items-center gap-2 mb-2">
                        <Check size={20} className="text-blue-600" /> 
                        <h3 className="text-lg font-bold text-gray-900">Review Campaign</h3>
                    </div>
                    
                    {/* Campaign Details Card */}
                    <div className="grid grid-cols-12 gap-6">
                        <div className="col-span-4 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-blue-900 mb-4">
                                <FileText size={16} /> Campaign Details
                            </h4>
                            <div className="space-y-3">
                                <div>
                                    <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Name</div>
                                    <div className="text-sm font-medium text-gray-900">{formData.name}</div>
                                </div>
                                {formData.description && (
                                    <div>
                                        <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Description</div>
                                        <div className="text-sm text-gray-600">{formData.description}</div>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="col-span-8 bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-green-700 mb-4">
                                <GitBranch size={16} /> Configuration
                            </h4>
                            <div className="space-y-1">
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-2">Workflows & Agents</div>
                                <div className="flex items-start gap-3">
                                    <div className="font-medium text-sm text-gray-900">{workflows.find(w => w.id === formData.workflowId)?.title}</div>
                                    <div className="text-sm text-gray-500">Agent: {agents.find(a => a.id === formData.agentId)?.name}</div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Workflow Overview */}
                    <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                        <h4 className="flex items-center gap-2 text-sm font-bold text-purple-700 mb-4">
                            <GitBranch size={16} /> Workflow Overview
                        </h4>
                        <div className="mb-2 text-sm font-medium text-gray-700">Workflow 1: {workflows.find(w => w.id === formData.workflowId)?.title}</div>
                        {renderWorkflowPreview(formData.workflowId)}
                    </div>

                    {/* Timing and Data */}
                    <div className="space-y-4">
                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-orange-700 mb-4">
                                <Clock size={16} /> Workflow Timing
                            </h4>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">Campaign Start (Workflow 1)</div>
                                <div className="text-sm font-medium text-gray-900 mt-1">
                                    {formData.startTime ? new Date(formData.startTime).toLocaleString() : '-'}
                                </div>
                            </div>
                        </div>

                        <div className="bg-white p-5 rounded-lg border border-gray-200 shadow-sm">
                            <h4 className="flex items-center gap-2 text-sm font-bold text-gray-700 mb-4">
                                <FileText size={16} /> Data
                            </h4>
                            <div>
                                <div className="text-[10px] font-bold text-gray-400 uppercase tracking-wider">CSV File</div>
                                <div className="text-sm font-medium text-gray-900 mt-1">{formData.file?.name}</div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>

        {/* Footer */}
        <div className="p-6 border-t border-gray-100 flex justify-between items-center bg-gray-50 rounded-b-xl">
             <button 
                onClick={step === 1 ? onClose : handleBack}
                className="px-6 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium text-sm hover:bg-white transition-colors shadow-sm bg-white"
             >
                {step === 1 ? 'Cancel' : 'Back'}
             </button>
             
             {step < 3 ? (
                 <button 
                    onClick={handleNext}
                    disabled={step === 1 ? !isStep1Valid : !isStep2Valid}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
                 >
                    Next <ArrowRight size={16} />
                 </button>
             ) : (
                 <button 
                    onClick={handleSubmit}
                    className="px-6 py-2.5 bg-blue-600 text-white rounded-lg font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
                 >
                    Create Campaign
                 </button>
             )}
        </div>
      </div>
    </div>
  );
};

export default CreateCampaignModal;
