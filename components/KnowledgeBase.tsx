
import React, { useState } from 'react';
import { KnowledgeBaseItem } from '../types';
import { Plus } from 'lucide-react';
import AddKnowledgeBaseModal from './knowledge-base/AddKnowledgeBaseModal';
import KnowledgeBaseTable from './knowledge-base/KnowledgeBaseTable';

interface KnowledgeBaseProps {
  items: KnowledgeBaseItem[];
  setItems: React.Dispatch<React.SetStateAction<KnowledgeBaseItem[]>>;
}

const KnowledgeBase: React.FC<KnowledgeBaseProps> = ({ items, setItems }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddItem = (newItem: Omit<KnowledgeBaseItem, 'id' | 'created' | 'status'>) => {
    const item: KnowledgeBaseItem = {
        id: `rag_${Math.random().toString(36).substr(2, 9)}`,
        source: newItem.source,
        type: newItem.type,
        created: new Date().toLocaleString('en-US', { month: 'short', day: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }),
        status: 'processing' // Simulate initial processing state
    };

    setItems(prev => [item, ...prev]);

    // Simulate async indexing
    setTimeout(() => {
        setItems(prev => prev.map(i => i.id === item.id ? { ...i, status: 'indexed' } : i));
    }, 5000);
  };

  const handleDeleteItem = (id: string) => {
    if (confirm('Are you sure you want to delete this knowledge base? This action cannot be undone.')) {
        setItems(prev => prev.filter(item => item.id !== id));
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
            <h2 className="text-lg font-semibold text-gray-900">Knowledge Base Management</h2>
            <p className="text-sm text-gray-500">Upload documents or links to train your agents.</p>
        </div>
        <button 
            onClick={() => setIsModalOpen(true)}
            className="bg-blue-600 text-white px-4 py-2 rounded-md font-medium text-sm hover:bg-blue-700 transition-colors shadow-sm flex items-center gap-2"
        >
           <Plus size={16} /> Add Knowledge Base
        </button>
      </div>

      <KnowledgeBaseTable items={items} onDelete={handleDeleteItem} />

      {isModalOpen && (
        <AddKnowledgeBaseModal 
            onClose={() => setIsModalOpen(false)} 
            onAdd={handleAddItem} 
        />
      )}
    </div>
  );
};

export default KnowledgeBase;
