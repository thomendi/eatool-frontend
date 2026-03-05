import { memo } from 'react';
import { Handle, Position } from '@xyflow/react';
import type { NodeProps } from '@xyflow/react';
import { cn } from '@/lib/utils';

// Helper for dynamic colors if we have them in data, otherwise default
const getNodeColor = (type?: string) => {
    switch (type) {
        case 'critical': return 'bg-red-600 border-red-700 text-white';
        case 'support': return 'bg-purple-700 border-purple-800 text-white';
        default: return 'bg-blue-500 border-blue-600 text-white';
    }
};

const MacroprocessNode = ({ data, selected }: NodeProps) => {
    return (
        <div
            className={cn(
                "relative min-w-[600px] min-h-[200px] p-8 flex items-center bg-blue-100",
                selected ? "drop-shadow-xl" : "drop-shadow-md"
            )}
            style={{
                // Large container arrow shape
                // Starts indented, ends pointed.
                // Adjust 50px as the arrow depth.
                clipPath: 'polygon(0% 0%, calc(100% - 50px) 0%, 100% 50%, calc(100% - 50px) 100%, 0% 100%, 50px 50%)',
            }}
        >
            {/* Label Area - Floating on the left inside the shape */}
            {/* Label Area - Floating on the left - Adjusted size and position */}
            <div className="absolute left-8 top-4 w-60 font-bold text-slate-800 text-sm leading-tight text-left">
                {data.label as string}
            </div>

            {/* Content Area placeholder - children render on top automatically */}

            <Handle type="target" position={Position.Left} className="opacity-0" />
            <Handle type="source" position={Position.Right} className="opacity-0" />
        </div>
    );
};

const ProcessNode = ({ data, selected }: NodeProps) => {
    // Process nodes are the items inside the chain.
    // Shape: Chevron pointing right.
    const colorClass = getNodeColor(data.variant as string);

    return (
        <div
            className={cn(
                "w-[180px] h-[80px] flex items-center justify-center px-6 text-center text-sm font-semibold transition-all hover:brightness-110",
                colorClass,
                selected ? "brightness-125 ring-2 ring-white" : ""
            )}
            style={{
                // Chevron shape
                clipPath: 'polygon(0% 0%, calc(100% - 20px) 0%, 100% 50%, calc(100% - 20px) 100%, 0% 100%, 20px 50%)',
            }}
        >
            <div className="z-10 leading-tight">
                {data.label as string}
            </div>

            <Handle type="target" position={Position.Left} className="opacity-0" style={{ left: 10 }} />
            <Handle type="source" position={Position.Right} className="opacity-0" style={{ right: -10 }} />
        </div>
    );
};

export const nodeTypes = {
    macroprocess: memo(MacroprocessNode),
    process: memo(ProcessNode),
};
