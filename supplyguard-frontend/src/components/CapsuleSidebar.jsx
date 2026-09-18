import React from 'react';
import {
  LayoutDashboard,
  Boxes,
  Truck,
  Zap,
  Mail,
  Network,
  History,
  Sparkles
} from 'lucide-react';

export default function CapsuleSidebar({
  activeTab = 'dashboard',
  setActiveTab,
  onPromptChat,
  currentUser,
  onOpenAuth,
  onLogout,
  unreadMailCount = 1
}) {
  const navItems = [
    { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'products', label: 'Product Catalog', icon: Boxes },
    { id: 'suppliers', label: 'Supplier Hub', icon: Truck },
    { id: 'simulator', label: 'Chaos Simulator', icon: Zap },
    { id: 'inbox', label: 'Supplier Mailbox', icon: Mail, hasBadge: true },
    { id: 'graph', label: 'Network Graph', icon: Network },
    { id: 'spacer', isSpacer: true },
    { id: 'audit', label: 'Audit Trail', icon: History }
  ];

  return (
    <aside className="flex lg:flex-col items-center justify-between gap-4 shrink-0 py-1 z-30 select-none">
      
      {/* Top Sparkle / AI Star Button in Champagne */}
      <button
        onClick={() => onPromptChat && onPromptChat("What is our highest risk right now?")}
        className="h-14 w-14 rounded-2xl bg-[#F9E7C9] border-2 border-black flex items-center justify-center text-[#C92924] hover:bg-[#FFFFFF] hover:scale-105 transition-all group shadow-md"
        title="SupplyGuard AI Co-Pilot"
      >
        <Sparkles className="h-7 w-7 group-hover:scale-110 transition-transform text-[#C92924]" />
      </button>

      {/* Vertical Capsule Pill Dock in Solid Champagne (#F9E7C9) */}
      <div className="relative rounded-[36px] bg-[#F9E7C9] border-2 border-black p-3 flex lg:flex-col items-center space-x-2 lg:space-x-0 lg:space-y-4 shadow-xl">
        
        {/* Protruding circular knob in Champagne matching wireframe */}
        <div
          onClick={() => onPromptChat && onPromptChat("Explain stockout runway calculation formula.")}
          className="hidden lg:flex absolute -right-4 top-[35%] h-8 w-8 rounded-full bg-[#F9E7C9] border-2 border-black items-center justify-center shadow-md cursor-pointer hover:scale-110 transition group z-20"
          title="Interactive AI Trigger"
        >
          <span className="h-3 w-3 rounded-full bg-[#1E223D] group-hover:scale-110 transition"></span>
        </div>

        {navItems.map((item) => {
          if (item.isSpacer) {
            return (
              <div
                key="spacer-dot"
                className="h-2.5 w-2.5 rounded-sm bg-black my-1"
                aria-hidden="true"
              />
            );
          }

          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              onClick={() => setActiveTab && setActiveTab(item.id)}
              className={`h-11 w-11 rounded-full flex items-center justify-center transition-all relative ${
                isActive
                  ? 'bg-[#1E223D] text-[#F9E7C9] shadow-lg scale-105'
                  : 'text-[#280B0B] hover:bg-[#FFFFFF] hover:scale-105'
              }`}
              title={item.label}
            >
              <Icon className="h-5 w-5 stroke-[2.2]" />
              
              {/* Notification badge for inbox */}
              {item.hasBadge && unreadMailCount > 0 && (
                <span className="absolute top-1.5 right-1.5 h-2.5 w-2.5 rounded-full bg-[#1E223D] border border-[#F9E7C9]" />
              )}
            </button>
          );
        })}
      </div>

      {/* Bottom User Avatar in Solid Champagne (#F9E7C9) */}
      <div
        onClick={currentUser ? onLogout : onOpenAuth}
        className="h-14 w-14 rounded-full bg-[#F9E7C9] border-2 border-black flex items-center justify-center text-base font-black text-[#C92924] uppercase shadow-xl cursor-pointer hover:scale-105 hover:bg-[#FFFFFF] transition"
        title={currentUser ? `Logged in as ${currentUser.username} (Click to Sign Out)` : 'Click to Sign In'}
      >
        {currentUser?.username ? currentUser.username.substring(0, 2).toUpperCase() : 'DH'}
      </div>
    </aside>
  );
}
