import React from 'react';
import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  id: string;
  title: string;
  subtitle?: string;
  icon: LucideIcon;
  accentColor?: string;
  children: React.ReactNode;
  delay?: number;
  badge?: React.ReactNode;
}

export const MetricCard: React.FC<MetricCardProps> = ({
  id,
  title,
  subtitle,
  icon: Icon,
  accentColor = 'cyan',
  children,
  delay = 0,
  badge,
}) => {
  return (
    <motion.div
      id={id}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      className="relative rounded-3xl p-6 backdrop-blur-2xl transition-all duration-300 bg-white/[0.03] border border-white/5 shadow-2xl hover:border-cyan-400/30 flex flex-col justify-between"
    >
      <div>
        {/* Card Header */}
        <div className="flex items-center justify-between gap-3 mb-4">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-9 h-9 rounded-xl bg-cyan-400/10 border border-cyan-500/20 flex items-center justify-center text-cyan-400 shrink-0">
              <Icon className="w-4 h-4 stroke-[2.5]" />
            </div>
            <div className="min-w-0">
              <span className="text-xs font-bold text-gray-400 uppercase tracking-widest block truncate">
                {title}
              </span>
              {subtitle && (
                <p className="text-[11px] text-gray-500 font-mono font-medium truncate">
                  {subtitle}
                </p>
              )}
            </div>
          </div>

          {badge && <div className="shrink-0 flex items-center">{badge}</div>}
        </div>

        {/* Card Body */}
        <div className="space-y-3">
          {children}
        </div>
      </div>
    </motion.div>
  );
};
