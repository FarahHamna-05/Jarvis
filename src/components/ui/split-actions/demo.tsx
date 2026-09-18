'use client';

import SplitActions from './index';
import { Plus, Sparkles, Upload, FileSpreadsheet } from 'lucide-react';

export default function SplitActionsDemo() {
  const actions = [
    {
      icon: Plus,
      label: 'New SKU',
      onClick: () => alert('New SKU clicked'),
    },
    {
      icon: Sparkles,
      label: 'AI Draft',
      onClick: () => alert('AI Draft clicked'),
    },
    {
      icon: FileSpreadsheet,
      label: 'Batch CSV',
      onClick: () => alert('Batch CSV clicked'),
    },
  ];

  return (
    <div className="flex h-64 w-full items-center justify-center p-8 bg-slate-50 rounded-2xl">
      <SplitActions actions={actions} />
    </div>
  );
}
