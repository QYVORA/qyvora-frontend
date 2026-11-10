/**
 * DIAGRAM LEGEND
 * ==============
 * 
 * Visual legend explaining diagram symbols, colors, and states.
 */

import React, { memo } from 'react';
import type { DiagramLegend as DiagramLegendType } from '../types';

export interface DiagramLegendProps {
  legend: DiagramLegendType;
  position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
}

export const DiagramLegend = memo<DiagramLegendProps>(({
  legend,
  position = 'bottom-right',
}) => {
  const positionClass = `diagram-legend-${position}`;
  
  return (
    <div className={`diagram-legend ${positionClass}`}>
      {legend.title && (
        <div className="diagram-legend-title">
          {legend.title}
        </div>
      )}
      
      <div className="space-y-2">
        {legend.items.map((item, index) => (
          <div key={index} className="diagram-legend-item">
            {/* Visual representation */}
            <div
              className="diagram-legend-visual"
              style={{
                borderColor: item.visual.color || 'var(--color-border)',
                backgroundColor: item.visual.color
                  ? `${item.visual.color}20`
                  : 'transparent',
              }}
            >
              {item.visual.icon && (
                <span style={{ color: item.visual.color }}>
                  {item.visual.icon}
                </span>
              )}
              
              {item.type === 'edge' && !item.visual.icon && (
                <div
                  className="w-full h-0.5"
                  style={{
                    backgroundColor: item.visual.color || 'var(--color-border)',
                    ...(item.visual.style === 'dashed' && {
                      backgroundImage: `linear-gradient(to right, ${item.visual.color || 'var(--color-border)'} 50%, transparent 50%)`,
                      backgroundSize: '8px 2px',
                      backgroundRepeat: 'repeat-x',
                      backgroundColor: 'transparent',
                    }),
                    ...(item.visual.style === 'dotted' && {
                      backgroundImage: `radial-gradient(circle, ${item.visual.color || 'var(--color-border)'} 40%, transparent 40%)`,
                      backgroundSize: '6px 2px',
                      backgroundRepeat: 'repeat-x',
                      backgroundColor: 'transparent',
                    }),
                  }}
                />
              )}
            </div>
            
            {/* Label and description */}
            <div className="flex-1 min-w-0">
              <div className="diagram-legend-label font-black">
                {item.label}
              </div>
              {item.description && (
                <div className="text-[10px] text-text-muted mt-0.5">
                  {item.description}
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
});

DiagramLegend.displayName = 'DiagramLegend';

export default DiagramLegend;
