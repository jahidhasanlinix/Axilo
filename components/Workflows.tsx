
import React, { useState, useCallback, useRef, useEffect } from 'react';
import ReactFlow, { 
    Background, 
    Controls, 
    MiniMap, 
    addEdge, 
    Connection, 
    Edge, 
    Node, 
    useNodesState, 
    useEdgesState, 
    ReactFlowProvider 
} from 'reactflow';
import { Workflow, WorkflowNodeData } from '../types';
import { Plus, Search, Save, Phone, MessageSquare, Mail, Clock, GitBranch, ChevronDown, Layout } from 'lucide-react';
import WorkflowNode from './workflows/WorkflowNode';
import NodeConfigModal from './workflows/NodeConfigModal';

interface WorkflowsProps {
  workflows: Workflow[];
  setWorkflows: React.Dispatch<React.SetStateAction<Workflow[]>>;
}

const nodeTypes = {
  customStep: WorkflowNode,
};

const STEP_TYPES = [
    { type: 'Call', icon: Phone, color: 'text-blue-600', bg: 'bg-blue-50' },
    { type: 'SMS', icon: MessageSquare, color: 'text-purple-600', bg: 'bg-purple-50' },
    { type: 'Email', icon: Mail, color: 'text-orange-600', bg: 'bg-orange-50' },
    { type: 'Wait', icon: Clock, color: 'text-gray-600', bg: 'bg-gray-50' },
    { type: 'Condition', icon: GitBranch, color: 'text-teal-600', bg: 'bg-teal-50' },
];

const WorkflowsContent: React.FC<WorkflowsProps> = ({ workflows, setWorkflows }) => {
  const [selectedWorkflowId, setSelectedWorkflowId] = useState<string>(workflows[0]?.id || '');
  const [editingNodeId, setEditingNodeId] = useState<string | null>(null);
  const [isAddMenuOpen, setIsAddMenuOpen] = useState(false);
  const addMenuRef = useRef<HTMLDivElement>(null);

  const activeWorkflow = workflows.find(w => w.id === selectedWorkflowId);

  // React Flow State
  const [nodes, setNodes, onNodesChange] = useNodesState([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState([]);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
        if (addMenuRef.current && !addMenuRef.current.contains(event.target as Node)) {
            setIsAddMenuOpen(false);
        }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Initialize nodes/edges when switching workflow
  useEffect(() => {
    if (activeWorkflow) {
      // Hydrate nodes with callbacks
      const hydratedNodes = activeWorkflow.nodes.map(node => ({
        ...node,
        data: {
          ...node.data,
          onEdit: () => setEditingNodeId(node.id),
          onDelete: () => handleDeleteNode(node.id)
        }
      }));
      setNodes(hydratedNodes);
      setEdges(activeWorkflow.edges);
    }
  }, [selectedWorkflowId, activeWorkflow, setNodes, setEdges]);

  const onConnect = useCallback((params: Connection) => {
      setEdges((eds) => addEdge({ ...params, animated: true, style: { stroke: '#4ade80' } }, eds));
  }, [setEdges]);

  const handleCreateWorkflow = () => {
    const newWorkflow: Workflow = {
        id: `wf_${Date.now()}`,
        title: 'New Workflow',
        description: 'Description',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        nodes: [],
        edges: []
    };
    setWorkflows([...workflows, newWorkflow]);
    setSelectedWorkflowId(newWorkflow.id);
  };

  const handleSaveWorkflow = () => {
      if (!activeWorkflow) return;
      
      // Dehydrate nodes (remove functions) to save state
      const plainNodes = nodes.map(n => ({
          ...n,
          data: {
              label: n.data.label,
              type: n.data.type,
              delay: n.data.delay,
              description: n.data.description
          }
      }));

      const updatedWorkflow = {
          ...activeWorkflow,
          nodes: plainNodes,
          edges: edges,
          updatedAt: new Date().toISOString()
      };

      setWorkflows(prev => prev.map(w => w.id === selectedWorkflowId ? updatedWorkflow : w));
      alert('Workflow saved!');
  };

  const handleAddStep = (type: WorkflowNodeData['type']) => {
      const newNodeId = `node_${Date.now()}`;
      
      // Calculate position based on the last node to create a flow
      const lastNode = nodes.length > 0 ? nodes[nodes.length - 1] : null;
      const position = lastNode 
          ? { x: lastNode.position.x, y: lastNode.position.y + 150 } 
          : { x: 250, y: 150 };

      const newNode: Node = {
          id: newNodeId,
          type: 'customStep',
          position,
          data: { 
              label: type, 
              type: type, 
              delay: 'Start immediately',
              onEdit: () => setEditingNodeId(newNodeId),
              onDelete: () => handleDeleteNode(newNodeId)
          }
      };
      
      setNodes((nds) => [...nds, newNode]);

      // Automatically connect to the previous node
      if (lastNode) {
          const newEdge: Edge = {
              id: `e${lastNode.id}-${newNodeId}`,
              source: lastNode.id,
              target: newNodeId,
              animated: true,
              style: { stroke: '#cbd5e1' }
          };
          setEdges((eds) => [...eds, newEdge]);
      }

      setIsAddMenuOpen(false);
  };

  const handleDeleteNode = (id: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== id));
      setEdges((eds) => eds.filter((e) => e.source !== id && e.target !== id));
  };

  const handleUpdateNode = (nodeId: string, newData: Partial<WorkflowNodeData>) => {
      setNodes((nds) => nds.map((node) => {
          if (node.id === nodeId) {
              return {
                  ...node,
                  data: {
                      ...node.data,
                      ...newData
                  }
              };
          }
          return node;
      }));
  };

  const updateWorkflowMeta = (key: keyof Workflow, value: string) => {
      setWorkflows(prev => prev.map(w => w.id === selectedWorkflowId ? { ...w, [key]: value } : w));
  };

  return (
    <div className="flex h-full gap-6">
       {/* List Sidebar */}
       <div className="w-80 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col">
          <div className="p-4 border-b border-gray-100 flex justify-between items-center">
             <h2 className="font-bold text-gray-900">Workflows</h2>
             <button 
                onClick={handleCreateWorkflow}
                className="flex items-center gap-1 px-3 py-1.5 bg-white border border-gray-300 rounded-md text-xs font-medium text-gray-700 hover:bg-gray-50"
             >
                <Plus size={14} /> New Workflow
             </button>
          </div>
          <div className="p-2 border-b border-gray-100">
             <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={14} />
                <input 
                    type="text" 
                    placeholder="Search workflows..." 
                    className="w-full pl-8 pr-3 py-2 border border-gray-200 rounded-md text-sm focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50"
                />
             </div>
          </div>
          <div className="flex-1 overflow-y-auto p-2 space-y-1">
             {workflows.map(wf => (
                 <div 
                    key={wf.id}
                    onClick={() => setSelectedWorkflowId(wf.id)}
                    className={`p-3 rounded-md cursor-pointer border transition-all ${
                        selectedWorkflowId === wf.id 
                            ? 'bg-blue-50 border-blue-200 shadow-sm' 
                            : 'bg-white border-transparent hover:bg-gray-50'
                    }`}
                 >
                    <div className="flex justify-between items-start mb-1">
                        <h3 className={`text-sm font-semibold ${selectedWorkflowId === wf.id ? 'text-blue-900' : 'text-gray-900'}`}>
                            {wf.title}
                        </h3>
                    </div>
                    <p className="text-xs text-gray-500 line-clamp-2">{wf.description}</p>
                    <div className="mt-2 flex items-center gap-2 text-[10px] text-gray-400">
                        <span>{wf.nodes.length} steps</span>
                        <span>•</span>
                        <span>{activeWorkflow?.nodes.find(n => n.type === 'customStep')?.data.type === 'Call' ? 'basic' : 'advanced'}</span>
                    </div>
                 </div>
             ))}
          </div>
       </div>

       {/* Editor Area */}
       <div className="flex-1 bg-white border border-gray-200 rounded-lg shadow-sm flex flex-col overflow-hidden relative">
          {activeWorkflow ? (
              <>
                {/* Editor Header */}
                <div className="p-4 border-b border-gray-100 bg-white z-10">
                    <div className="flex justify-between items-start gap-8">
                        <div className="flex-1 grid grid-cols-2 gap-4">
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Title</label>
                                <input 
                                    type="text" 
                                    value={activeWorkflow.title}
                                    onChange={(e) => updateWorkflowMeta('title', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                             </div>
                             <div>
                                <label className="block text-xs font-bold text-gray-500 uppercase tracking-wider mb-1">Description</label>
                                <input 
                                    type="text" 
                                    value={activeWorkflow.description}
                                    onChange={(e) => updateWorkflowMeta('description', e.target.value)}
                                    className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 outline-none"
                                />
                             </div>
                        </div>
                        <div className="flex items-end gap-2 h-full pb-1">
                            <button 
                                onClick={handleSaveWorkflow}
                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 transition-colors shadow-sm text-sm"
                            >
                                <Save size={16} /> Save Workflow
                            </button>
                            
                            <div className="relative" ref={addMenuRef}>
                                <button 
                                    onClick={() => setIsAddMenuOpen(!isAddMenuOpen)}
                                    className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 text-gray-700 font-medium rounded-md hover:bg-gray-50 transition-colors shadow-sm text-sm"
                                >
                                    <Plus size={16} /> Add Step <ChevronDown size={14} className={`transition-transform ${isAddMenuOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isAddMenuOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white border border-gray-200 rounded-lg shadow-xl z-50 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                                        <div className="py-1">
                                            {STEP_TYPES.map((item) => (
                                                <button
                                                    key={item.type}
                                                    onClick={() => handleAddStep(item.type as any)}
                                                    className="w-full text-left px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50 flex items-center gap-3 transition-colors"
                                                >
                                                    <div className={`w-6 h-6 rounded flex items-center justify-center ${item.bg} ${item.color}`}>
                                                        <item.icon size={14} />
                                                    </div>
                                                    {item.type}
                                                </button>
                                            ))}
                                        </div>
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>

                {/* React Flow Canvas */}
                <div className="flex-1 bg-gray-50 relative">
                     <ReactFlow
                        nodes={nodes}
                        edges={edges}
                        onNodesChange={onNodesChange}
                        onEdgesChange={onEdgesChange}
                        onConnect={onConnect}
                        nodeTypes={nodeTypes}
                        fitView
                        attributionPosition="bottom-right"
                     >
                        <Background gap={12} size={1} />
                        <Controls />
                        <MiniMap />
                     </ReactFlow>

                     {/* Edit Modal Overlay */}
                     {editingNodeId && (
                         <NodeConfigModal 
                            nodeId={editingNodeId}
                            data={nodes.find(n => n.id === editingNodeId)?.data || {}}
                            onSave={handleUpdateNode}
                            onClose={() => setEditingNodeId(null)}
                         />
                     )}
                </div>
              </>
          ) : (
              <div className="flex flex-col items-center justify-center h-full text-gray-500">
                  <Layout size={48} className="text-gray-300 mb-4" />
                  <p className="text-lg font-medium text-gray-900">No workflow selected</p>
                  <p className="text-sm">Select a workflow from the list or create a new one.</p>
              </div>
          )}
       </div>
    </div>
  );
};

// Wrap with Provider
const Workflows: React.FC<WorkflowsProps> = (props) => (
    <ReactFlowProvider>
        <WorkflowsContent {...props} />
    </ReactFlowProvider>
);

export default Workflows;
