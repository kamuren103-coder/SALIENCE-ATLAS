import React, { useEffect, useRef, useState } from 'react';
import * as d3 from 'd3';
import { GraphNode, GraphEdge } from '../../types/evaluation';
import { Search, ZoomIn, ZoomOut, Filter, Info, ShieldAlert } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

interface RelationshipExplorerProps {
  initialNodes: GraphNode[];
  initialEdges: GraphEdge[];
}

const RelationshipExplorer: React.FC<RelationshipExplorerProps> = ({ initialNodes, initialEdges }) => {
  const svgRef = useRef<SVGSVGElement>(null);
  const [nodes, setNodes] = useState<any[]>(initialNodes.map(n => ({ ...n })));
  const [edges, setEdges] = useState<any[]>(initialEdges.map(e => ({ ...e })));
  const [selectedNode, setSelectedNode] = useState<GraphNode | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!svgRef.current) return;

    const width = svgRef.current.clientWidth;
    const height = 600;

    const svg = d3.select(svgRef.current)
      .attr('viewBox', [0, 0, width, height]);

    svg.selectAll('*').remove();

    const g = svg.append('g');

    const zoom = d3.zoom()
      .scaleExtent([0.1, 8])
      .on('zoom', (event) => {
        g.attr('transform', event.transform);
      });

    svg.call(zoom as any);

    const simulation = d3.forceSimulation(nodes)
      .force('link', d3.forceLink(edges).id((d: any) => d.id).distance(100))
      .force('charge', d3.forceManyBody().strength(-300))
      .force('center', d3.forceCenter(width / 2, height / 2));

    const link = g.append('g')
      .attr('stroke', '#999')
      .attr('stroke-opacity', 0.6)
      .selectAll('line')
      .data(edges)
      .join('line')
      .attr('stroke-width', (d: any) => Math.sqrt(d.properties.shares ? d.properties.shares / 50 : 2));

    const node = g.append('g')
      .attr('stroke', '#1e293b')
      .attr('stroke-width', 1.5)
      .selectAll('g')
      .data(nodes)
      .join('g')
      .call(d3.drag()
        .on('start', dragstarted)
        .on('drag', dragged)
        .on('end', dragended) as any)
      .on('click', (event, d: any) => {
        setSelectedNode(d);
      });

    node.append('circle')
      .attr('r', (d: any) => d.type === 'SUPPLIER' ? 12 : d.type === 'TENDER' ? 15 : 8)
      .attr('fill', (d: any) => {
        switch (d.type) {
          case 'SUPPLIER': return '#3b82f6';
          case 'TENDER': return '#10b981';
          case 'DIRECTOR': return '#f59e0b';
          case 'RULE': return '#ef4444';
          default: return '#6b7280';
        }
      });

    node.append('text')
      .attr('dx', 12)
      .attr('dy', '.35em')
      .text((d: any) => d.label)
      .attr('font-size', '10px')
      .attr('fill', '#e2e8f0')
      .attr('stroke', 'none');

    simulation.on('tick', () => {
      link
        .attr('x1', (d: any) => d.source.x)
        .attr('y1', (d: any) => d.source.y)
        .attr('x2', (d: any) => d.target.x)
        .attr('y2', (d: any) => d.target.y);

      node
        .attr('transform', (d: any) => `translate(${d.x},${d.y})`);
    });

    function dragstarted(event: any) {
      if (!event.active) simulation.alphaTarget(0.3).restart();
      event.subject.fx = event.subject.x;
      event.subject.fy = event.subject.y;
    }

    function dragged(event: any) {
      event.subject.fx = event.x;
      event.subject.fy = event.y;
    }

    function dragended(event: any) {
      if (!event.active) simulation.alphaTarget(0);
      event.subject.fx = null;
      event.subject.fy = null;
    }

    return () => simulation.stop();
  }, [nodes, edges]);

  const handleSearch = async () => {
    if (!searchTerm) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/v3/graph/search?q=${searchTerm}`);
      const results = await res.json();
      if (results.length > 0) {
        // Expand graph around search results
        const traverseRes = await fetch(`/api/v3/graph/traverse/${results[0].id}?depth=2`);
        const data = await traverseRes.json();
        setNodes(data.nodes);
        setEdges(data.edges);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#05070D] rounded-xl shadow-sm border border-slate-800 overflow-hidden" id="graph-explorer">
      {/* Header */}
      <div className="px-6 py-4 border-b border-slate-800 bg-white/5/50 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-blue-500/20 rounded-lg text-blue-600">
            <ZoomIn size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-200">Relationship Explorer</h3>
            <p className="text-xs text-slate-400">Interactive Procurement Knowledge Graph</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <div className="relative">
            <input
              type="text"
              placeholder="Search nodes..."
              className="pl-9 pr-4 py-2 bg-[#05070D] border border-slate-800 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-64"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
            <Search className="absolute left-3 top-2.5 text-slate-400" size={16} />
          </div>
          <button 
            onClick={handleSearch}
            disabled={loading}
            className="p-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            {loading ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" /> : <Search size={20} />}
          </button>
        </div>
      </div>

      <div className="flex-1 flex relative min-h-[600px]">
        {/* Graph Canvas */}
        <svg ref={svgRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

        {/* Legend */}
        <div className="absolute top-4 left-4 p-3 bg-[#05070D]/90 backdrop-blur border border-slate-800 rounded-lg text-xs space-y-2 shadow-sm">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-blue-500" />
            <span className="text-slate-600">Supplier</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-emerald-500" />
            <span className="text-slate-600">Tender</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-amber-500" />
            <span className="text-slate-600">Director</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 rounded-full bg-rose-500/100" />
            <span className="text-slate-600">Rule</span>
          </div>
        </div>

        {/* Node Inspector */}
        <AnimatePresence>
          {selectedNode && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              className="absolute right-0 top-0 bottom-0 w-80 bg-[#05070D] border-l border-slate-800 shadow-xl p-6 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h4 className="font-bold text-slate-200">Node Inspector</h4>
                <button onClick={() => setSelectedNode(null)} className="text-slate-400 hover:text-slate-300">×</button>
              </div>

              <div className="mb-6">
                <div className={`inline-block px-2 py-1 rounded text-[10px] font-bold mb-2 ${
                  selectedNode.type === 'SUPPLIER' ? 'bg-blue-500/20 text-blue-600' :
                  selectedNode.type === 'TENDER' ? 'bg-emerald-500/20 text-emerald-600' :
                  'bg-slate-800 text-slate-600'
                }`}>
                  {selectedNode.type}
                </div>
                <h2 className="text-xl font-bold text-slate-100">{selectedNode.label}</h2>
                <p className="text-xs text-slate-400 mt-1">ID: {selectedNode.id}</p>
              </div>

              <div className="space-y-4">
                <div>
                  <h5 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Properties</h5>
                  <div className="space-y-2">
                    {Object.entries(selectedNode.properties).map(([key, value]) => (
                      <div key={key} className="flex justify-between text-sm py-1 border-b border-slate-800">
                        <span className="text-slate-400 capitalize">{key}</span>
                        <span className="font-medium text-slate-200">{String(value)}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4">
                  <button className="w-full py-2 bg-slate-800 text-slate-300 rounded-lg font-medium hover:bg-slate-700 transition-colors flex items-center justify-center gap-2">
                    <Info size={16} />
                    View Digital Twin
                  </button>
                </div>

                <div className="pt-2">
                  <button className="w-full py-2 bg-rose-500/10 text-rose-600 rounded-lg font-medium hover:bg-rose-100 transition-colors flex items-center justify-center gap-2">
                    <ShieldAlert size={16} />
                    Analyze Risks
                  </button>
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
};

export default RelationshipExplorer;
