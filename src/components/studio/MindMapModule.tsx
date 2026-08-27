import React, { useState } from 'react';
import {
  Network,
  ZoomIn,
  ZoomOut,
  RotateCcw,
  Sparkles,
  ChevronRight,
  Info,
  CheckCircle2
} from 'lucide-react';
import { StudioMindMap, MindMapNode } from '../../types';

interface MindMapModuleProps {
  mindMap: StudioMindMap;
  onGenerateBranch?: (parentNodeId: string) => void;
}

export const MindMapModule: React.FC<MindMapModuleProps> = ({ mindMap, onGenerateBranch }) => {
  const [zoomLevel, setZoomLevel] = useState(1);
  const [selectedNode, setSelectedNode] = useState<MindMapNode>(mindMap.nodes[0]);

  const getNodeColor = (type: MindMapNode['type']) => {
    switch (type) {
      case 'root':
        return 'bg-blue-600 border-blue-400 text-white shadow-blue-500/25';
      case 'trend':
        return 'bg-amber-600/30 border-amber-500 text-amber-200 shadow-amber-500/15';
      case 'pattern':
        return 'bg-purple-600/30 border-purple-500 text-purple-200 shadow-purple-500/15';
      case 'brand_fit':
        return 'bg-emerald-600/30 border-emerald-500 text-emerald-200 shadow-emerald-500/15';
      case 'strategy':
        return 'bg-blue-600/30 border-blue-500 text-blue-200 shadow-blue-500/15';
      case 'campaign':
        return 'bg-indigo-600/30 border-indigo-500 text-indigo-200 shadow-indigo-500/15';
      case 'asset':
        return 'bg-[#282a2c] border-[#44474a] text-gray-200';
      default:
        return 'bg-[#242527] border-[#333538] text-gray-300';
    }
  };

  return (
    <div className="space-y-4 text-gray-200">
      {/* Header & Zoom Controls */}
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-xs font-bold text-gray-100 uppercase tracking-wider flex items-center gap-1.5">
            <Network className="w-3.5 h-3.5 text-blue-400" />
            <span>Interactive Strategy Mind Map</span>
          </h3>
          <p className="text-[11px] text-gray-400">{mindMap.title}</p>
        </div>

        <div className="flex items-center gap-1">
          <button
            onClick={() => setZoomLevel((z) => Math.min(1.4, z + 0.1))}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 transition-colors"
            title="Zoom In"
          >
            <ZoomIn className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel((z) => Math.max(0.7, z - 0.1))}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 transition-colors"
            title="Zoom Out"
          >
            <ZoomOut className="w-3.5 h-3.5" />
          </button>
          <button
            onClick={() => setZoomLevel(1)}
            className="p-1.5 rounded-lg bg-[#282a2c] hover:bg-[#333538] border border-[#3c4043] text-gray-300 transition-colors"
            title="Reset View"
          >
            <RotateCcw className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Canvas Viewport */}
      <div className="relative h-80 bg-[#171819] rounded-2xl border border-[#3c4043] overflow-hidden shadow-inner p-4 flex items-center justify-center">
        <div
          className="relative w-full h-full transition-transform duration-200 flex items-center justify-center"
          style={{ transform: `scale(${zoomLevel})` }}
        >
          {/* SVG Connection Lines */}
          <svg className="absolute inset-0 w-full h-full pointer-events-none">
            {mindMap.connections.map((conn, idx) => {
              const fromNode = mindMap.nodes.find((n) => n.id === conn.from);
              const toNode = mindMap.nodes.find((n) => n.id === conn.to);
              if (!fromNode || !toNode) return null;

              return (
                <line
                  key={idx}
                  x1={`${fromNode.x}%`}
                  y1={`${fromNode.y}%`}
                  x2={`${toNode.x}%`}
                  y2={`${toNode.y}%`}
                  stroke="#3c4043"
                  strokeWidth="2"
                  strokeDasharray="4 2"
                />
              );
            })}
          </svg>

          {/* Interactive Nodes */}
          {mindMap.nodes.map((node) => {
            const isSelected = selectedNode?.id === node.id;
            return (
              <div
                key={node.id}
                onClick={() => setSelectedNode(node)}
                style={{
                  left: `${node.x}%`,
                  top: `${node.y}%`,
                  transform: 'translate(-50%, -50%)'
                }}
                className={`absolute cursor-pointer p-2.5 rounded-xl border text-center transition-all shadow-md select-none ${getNodeColor(
                  node.type
                )} ${isSelected ? 'ring-2 ring-blue-400 ring-offset-2 ring-offset-[#171819] scale-110 z-20' : 'hover:scale-105 z-10'}`}
              >
                <div className="text-[11px] font-bold tracking-tight whitespace-nowrap">
                  {node.label}
                </div>
                <div className="text-[9px] opacity-75 uppercase tracking-wider">
                  {node.type.replace('_', ' ')}
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Selected Node Details Card */}
      {selectedNode && (
        <div className="p-3.5 bg-[#242527] rounded-xl border border-[#333538] space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-gray-200">
              <Info className="w-3.5 h-3.5 text-blue-400" />
              <span>Node: {selectedNode.label}</span>
            </div>
            <span className="text-[10px] uppercase font-mono px-2 py-0.5 rounded bg-[#1e1f20] border border-[#3c4043] text-gray-300">
              {selectedNode.type}
            </span>
          </div>

          <p className="text-xs text-gray-300 leading-relaxed">{selectedNode.description}</p>

          <div className="pt-2 border-t border-[#333538] flex items-center justify-between text-[11px]">
            <span className="text-gray-400">Connected branches: {mindMap.connections.filter(c => c.from === selectedNode.id || c.to === selectedNode.id).length}</span>
            <button
              onClick={() => onGenerateBranch && onGenerateBranch(selectedNode.id)}
              className="px-2.5 py-1 rounded bg-blue-500/10 hover:bg-blue-500/20 text-blue-400 border border-blue-500/30 font-medium flex items-center gap-1 transition-colors"
            >
              <Sparkles className="w-3 h-3" />
              <span>Expand Node with AI</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};
