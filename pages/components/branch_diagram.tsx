import { useCallback } from 'react';
import ReactFlow, {
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  addEdge,
} from 'reactflow';

import 'reactflow/dist/style.css';

const initialNodes = [
  { id: '1', position: { x: 0, y: 0 }, data: { label: 'asdfasd' } },
  { id: '2', position: { x: 0, y: 100 }, data: { label: 'sdfgsdfg' } },
];

const initialEdges = [{ id: 'e1-2', source: '1', target: '2' }];

function BranchDiagram() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  const onConnect = useCallback((params) => setEdges((eds) => addEdge(params, eds)), [setEdges]);

  return (
    <ReactFlow
      nodes={nodes}
      edges={edges}
      onNodesChange={onNodesChange}
      onEdgesChange={onEdgesChange}
      onConnect={onConnect}
      elementsSelectable={true}
      nodesConnectable={false}
      nodesDraggable={false}
    >
      <Background />
    </ReactFlow>
  );
}

export default BranchDiagram;