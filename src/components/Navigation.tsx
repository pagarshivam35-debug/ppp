import React from 'react';
import { 
  ShieldCheck, 
  Layers, 
  Crosshair, 
  BarChart3, 
  BookOpen, 
  Camera, 
  AlertTriangle,
  Menu,
  X
} from 'lucide-react';

export type ActiveTab = 'dashboard' | 'detection_lab' | 'defense_analysis' | 'evaluation' | 'about';

interface NavigationProps {
  activeTab: ActiveTab;
  setActiveTab: (tab: ActiveTab) => void;
  systemStatus: {
    online: boolean;
    model: string;
  };
}

export const Navigation: React.FC<NavigationProps> = ({
  activeTab,
  setActiveTab,
  systemStatus
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  const navItems = [
    { id: 'dashboard' as ActiveTab, label: 'Dashboard', icon: BarChart3 },
    { id: 'detection_lab' as ActiveTab, label: 'Detection Lab', icon: Crosshair },
    { id: 'defense_analysis' as ActiveTab, label: 'Defense Analysis', icon: Layers },
    { id: 'evaluation' as ActiveTab, label: 'Evaluation', icon: ShieldCheck },
    { id: 'about' as ActiveTab, label: 'About & Methodology', icon: BookOpen },
  ];

  return (
    <>
      {/* Top Header - Strict 3-zone contract */}
      <header className="h-16 border-b border-slate-800 bg-[#0B132B]/95 backdrop-blur-md sticky top-0 z-40 px-4 lg:px-8 flex items-center justify-between gap-8">
        {/* Zone 1: Wordmark */}
        <div className="flex items-center gap-3">
          <button 
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-2 text-slate-400 hover:text-white"
            aria-label="Toggle navigation"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div 
            onClick={() => setActiveTab('dashboard')}
            className="cursor-pointer flex items-center gap-2.5"
          >
            <div className="w-8 h-8 rounded-lg bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <span className="text-lg font-bold tracking-tight text-white whitespace-nowrap">
              PatchGuard
            </span>
          </div>
        </div>

        {/* Zone 2: Navigation Links (single-line, clean typography) */}
        <nav className="hidden md:flex items-center gap-7">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center gap-2 text-sm font-medium transition-colors whitespace-nowrap ${
                  isActive 
                    ? 'text-cyan-400' 
                    : 'text-slate-400 hover:text-slate-200'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Zone 3: Primary Action / Quick Test Trigger */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('detection_lab')}
            className="px-3.5 py-1.5 text-xs font-semibold text-slate-900 bg-cyan-400 hover:bg-cyan-300 rounded-md transition-colors whitespace-nowrap flex items-center gap-1.5 cursor-pointer shadow-sm shadow-cyan-500/10"
          >
            <Crosshair className="w-3.5 h-3.5" />
            <span>Launch Lab</span>
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-x-0 top-16 bg-[#0B132B] border-b border-slate-800 z-50 p-4 space-y-2">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  setActiveTab(item.id);
                  setMobileMenuOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors ${
                  isActive 
                    ? 'bg-cyan-500/10 text-cyan-400 border border-cyan-500/20' 
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
                }`}
              >
                <Icon className="w-4 h-4" />
                <span>{item.label}</span>
              </button>
            );
          })}
        </div>
      )}
    </>
  );
};
