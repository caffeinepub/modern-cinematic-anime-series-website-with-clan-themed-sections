import { ReactNode, CSSProperties } from 'react';
import { cn } from '../../lib/utils';

interface GlowingGlassPanelProps {
  children: ReactNode;
  className?: string;
  style?: CSSProperties;
}

export function GlowingGlassPanel({ children, className, style }: GlowingGlassPanelProps) {
  return (
    <div className={cn('glowing-glass-panel', className)} style={style}>
      {children}
    </div>
  );
}
