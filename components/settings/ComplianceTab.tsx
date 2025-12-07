
import React, { useState } from 'react';
import { ComplianceApplication } from '../../types';
import { ExternalLink, Trash2 } from 'lucide-react';
import CreateComplianceModal from './compliance/CreateComplianceModal';

const ComplianceTab: React.FC = () => {
  const [applications, setApplications] = useState<ComplianceApplication[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleCreateApplication = (data: Omit<ComplianceApplication, 'id' | 'status' | 'dateAdded'>) => {
      const newApp: ComplianceApplication = {
          id: `comp_${Date.now()}`,
          ...data,
          status: 'Pending',
          dateAdded: new Date().toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric' })
      };
      setApplications(prev => [newApp, ...prev]);
  };

  const handleDelete = (id: string) => {
      if (confirm('Are you sure you want to delete this application?')) {
          setApplications(prev => prev.filter(app => app.id !== id));
      }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
            Compliance settings
            <a href="https://www.axilo.ai/docs/compliance-application/introduction" target="_blank" rel="noopener noreferrer" className="text-blue-600 text-xs font-normal underline flex items-center gap-0.5">
                Learn more about how to submit documents <ExternalLink size={10} />
            </a>
        </h3>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm"
        >
            Create a new Application
        </button>
      </div>

      <div className="bg-white border border-gray-200 rounded-lg shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
            <table className="w-full text-sm text-left">
                <thead className="bg-gray-50 text-gray-500 font-medium border-b border-gray-200">
                    <tr>
                        <th className="px-6 py-3 whitespace-nowrap">Application Name</th>
                        <th className="px-6 py-3 whitespace-nowrap">First Name</th>
                        <th className="px-6 py-3 whitespace-nowrap">Last Name</th>
                        <th className="px-6 py-3 whitespace-nowrap">Company Name</th>
                        <th className="px-6 py-3 whitespace-nowrap">Tax ID Number</th>
                        <th className="px-6 py-3 whitespace-nowrap">Status</th>
                        <th className="px-6 py-3 whitespace-nowrap">Date added</th>
                        <th className="px-6 py-3 text-center">Delete</th>
                    </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                    {applications.length > 0 ? (
                        applications.map(app => (
                            <tr key={app.id} className="hover:bg-gray-50">
                                <td className="px-6 py-4 font-medium text-gray-900">{app.applicationName}</td>
                                <td className="px-6 py-4 text-gray-600">{app.firstName}</td>
                                <td className="px-6 py-4 text-gray-600">{app.lastName}</td>
                                <td className="px-6 py-4 text-gray-600">{app.companyName}</td>
                                <td className="px-6 py-4 text-gray-600">{app.taxIdNumber}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-2.5 py-0.5 rounded-full text-xs font-medium ${
                                        app.status === 'Approved' ? 'bg-green-100 text-green-700' :
                                        app.status === 'Rejected' ? 'bg-red-100 text-red-700' :
                                        'bg-yellow-100 text-yellow-700'
                                    }`}>
                                        {app.status}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{app.dateAdded}</td>
                                <td className="px-6 py-4 text-center">
                                    <button 
                                        onClick={() => handleDelete(app.id)}
                                        className="text-gray-400 hover:text-red-600 transition-colors"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </td>
                            </tr>
                        ))
                    ) : (
                        <tr>
                            <td colSpan={8} className="px-6 py-12 text-center text-gray-500">
                                No compliance applications found.
                            </td>
                        </tr>
                    )}
                </tbody>
            </table>
        </div>
      </div>

      {isModalOpen && (
          <CreateComplianceModal 
            onClose={() => setIsModalOpen(false)}
            onCreate={handleCreateApplication}
          />
      )}
    </div>
  );
};

export default ComplianceTab;
