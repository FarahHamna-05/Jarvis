'use client';

import { cn } from '@/lib/utils';
import { AnimatePresence, motion } from 'framer-motion';
import { type LucideIcon, Plus } from 'lucide-react';
import { useLayoutEffect, useRef, useState, useEffect } from 'react';

export interface SplitActionItem {
  icon: LucideIcon;
  label: string;
  onClick?: () => void;
  className?: string;
}

export interface SplitActionsProps {
  actions: SplitActionItem[];
  triggerIcon?: LucideIcon;
  triggerLabel?: string;
  className?: string;
  onTriggerClick?: () => void;
}

export default function SplitActions({
  actions,
  triggerIcon: TriggerIcon = Plus,
  triggerLabel = 'Add Product',
  className,
  onTriggerClick,
}: SplitActionsProps) {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const buttonRefs = useRef<(HTMLButtonElement | null)[]>([]);
  const [positions, setPositions] = useState<number[]>([]);

  // Close on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  useLayoutEffect(() => {
    if (!isOpen) return;

    const GAP = 8;

    const calculatePositions = () => {
      const widths = buttonRefs.current.map(
        (button) => button?.offsetWidth ?? 0,
      );

      const totalWidth =
        widths.reduce((sum, width) => sum + width, 0) +
        GAP * (widths.length - 1);

      let cursor = -totalWidth / 2;

      const newPositions = widths.map((width) => {
        const center = cursor + width / 2;
        cursor += width + GAP;
        return center;
      });

      setPositions(newPositions);
    };

    requestAnimationFrame(calculatePositions);

    window.addEventListener('resize', calculatePositions);

    return () => {
      window.removeEventListener('resize', calculatePositions);
    };
  }, [actions, isOpen]);

  return (
    <div
      ref={containerRef}
      className={cn('relative flex items-center justify-center', className)}
    >
      <div
        className="relative flex min-h-10 min-w-10 items-center justify-center z-20"
        onClick={() => {
          setIsOpen((prev) => !prev);
          onTriggerClick?.();
        }}
      >
        <AnimatePresence mode="wait">
          {!isOpen && (
            <motion.button
              key="trigger"
              type="button"
              whileTap={{ scale: 0.95 }}
              whileHover={{ scale: 1.03 }}
              initial={{
                scale: 0.5,
                opacity: 0,
                filter: 'blur(8px)',
              }}
              animate={{
                scale: 1,
                opacity: 1,
                filter: 'blur(0px)',
              }}
              exit={{
                scale: 0.5,
                opacity: 0,
                filter: 'blur(8px)',
              }}
              transition={{
                type: 'spring',
                stiffness: 220,
                damping: 24,
              }}
              className="flex items-center space-x-2 rounded-full bg-[#E51A24] hover:bg-[#C91822] text-white font-bold px-4 py-2 text-xs shadow-md transition cursor-pointer select-none"
            >
              <TriggerIcon className="size-4 stroke-[3]" />
              <span>{triggerLabel}</span>
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence mode="wait">
          {isOpen &&
            actions.map((action, index) => (
              <motion.button
                key={action.label}
                type="button"
                ref={(el) => {
                  buttonRefs.current[index] = el;
                }}
                onClick={(e) => {
                  e.stopPropagation();
                  action.onClick?.();
                  setIsOpen(false);
                }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                initial={{
                  x: 0,
                  scale: 0,
                  opacity: 0,
                  filter: 'blur(8px)',
                }}
                animate={{
                  x: positions[index] ?? 0,
                  scale: 1,
                  opacity: 1,
                  filter: 'blur(0px)',
                }}
                exit={{
                  x: 0,
                  scale: 0.5,
                  opacity: 0,
                  filter: 'blur(8px)',
                }}
                transition={{
                  type: 'spring',
                  stiffness: 220,
                  damping: 24,
                }}
                className={cn(
                  'absolute flex items-center gap-1.5 rounded-full bg-slate-900 hover:bg-slate-800 text-white px-3.5 py-1.5 text-xs font-bold shadow-lg border border-slate-700 whitespace-nowrap cursor-pointer transition-colors',
                  (positions[index] ?? 0) < 0 ? 'origin-right' : 'origin-left',
                  action.className
                )}
              >
                <action.icon className="size-3.5 stroke-2 text-[#E51A24]" />
                <span className="font-semibold">{action.label}</span>
              </motion.button>
            ))}
        </AnimatePresence>
      </div>
    </div>
  );
}

export { SplitActions };
