import React, { useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import {
  LayoutDashboard,
  BatteryCharging,
  PlusCircle,
  FileCheck2,
  Recycle,
  Search,
  LogOut,
  Menu,
  X,
  FileText,
  Sliders,
  Users,
  Send,
  Zap,
  RotateCcw,
} from 'lucide-react';
import { Logo } from '../common/Logo';
import { GlobalSearchModal } from '../common/GlobalSearchModal';
import { NotificationDropdown } from '../common/NotificationDropdown';
import { authService } from '../../services/auth';
import { dbService } from '../../services/db';
import type { UserRole } from '../../types/battery';

interface AppShellProps {
  children: React.ReactNode;
}

export const AppShell: React.FC<AppShellProps> = ({ children }) => {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const currentUser = authService.getCurrentUser();

  const handleLogout = () => {
    authService.logout();
    navigate('/login');
  };

  const roleNavItems: Record<
    UserRole,
    { label: string; path: string; icon: React.ReactNode }[]
  > = {
    refurbisher: [
      { label: 'Dashboard', path: '/refurbisher/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Battery Records', path: '/refurbisher/batteries', icon: <BatteryCharging className="w-4 h-4" /> },
      { label: 'New Assessment', path: '/refurbisher/assessment/new', icon: <PlusCircle className="w-4 h-4" /> },
      { label: 'Incoming Requests', path: '/refurbisher/requests', icon: <Send className="w-4 h-4" /> },
      { label: 'Reports', path: '/refurbisher/reports', icon: <FileText className="w-4 h-4" /> },
      { label: 'Settings', path: '/refurbisher/settings', icon: <Sliders className="w-4 h-4" /> },
    ],
    second_life: [
      { label: 'Dashboard', path: '/second-life/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Available Candidates', path: '/second-life/batteries', icon: <BatteryCharging className="w-4 h-4" /> },
      { label: 'My Requests', path: '/second-life/requests', icon: <Send className="w-4 h-4" /> },
      { label: 'Settings', path: '/second-life/settings', icon: <Sliders className="w-4 h-4" /> },
    ],
    recycler: [
      { label: 'Dashboard', path: '/recycler/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'Recycling Queue', path: '/recycler/batteries', icon: <Recycle className="w-4 h-4" /> },
      { label: 'Processing Status', path: '/recycler/tracking', icon: <FileCheck2 className="w-4 h-4" /> },
      { label: 'Reports', path: '/recycler/reports', icon: <FileText className="w-4 h-4" /> },
      { label: 'Settings', path: '/recycler/settings', icon: <Sliders className="w-4 h-4" /> },
    ],
    admin: [
      { label: 'Overview', path: '/admin/dashboard', icon: <LayoutDashboard className="w-4 h-4" /> },
      { label: 'All Batteries', path: '/admin/batteries', icon: <BatteryCharging className="w-4 h-4" /> },
      { label: 'Assessments', path: '/admin/assessments', icon: <FileCheck2 className="w-4 h-4" /> },
      { label: 'Requests', path: '/admin/requests', icon: <Send className="w-4 h-4" /> },
      { label: 'User Directory', path: '/admin/users', icon: <Users className="w-4 h-4" /> },
      { label: 'System Settings', path: '/admin/settings', icon: <Sliders className="w-4 h-4" /> },
    ],
  };

  const navs = currentUser ? roleNavItems[currentUser.role] : [];

  const roleBadges: Record<UserRole, { label: string; color: string }> = {
    refurbisher: { label: 'REFURBISHER PORTAL', color: 'bg-cyan-950 text-cyan-400 border-cyan-800' },
    second_life: { label: 'SECOND-LIFE PROVIDER', color: 'bg-amber-950 text-amber-400 border-amber-800' },
    recycler: { label: 'RECYCLER PORTAL', color: 'bg-rose-950 text-rose-400 border-rose-800' },
    admin: { label: 'ADMINISTRATION', color: 'bg-purple-950 text-purple-400 border-purple-800' },
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      {/* Top Bar Navigation */}
      <header className="h-16 bg-slate-900/90 border-b border-slate-800/90 sticky top-0 z-30 backdrop-blur-md px-4 sm:px-6 flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 rounded-lg text-slate-400 hover:text-white bg-slate-800"
          >
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
          <div onClick={() => navigate('/')} className="cursor-pointer">
            <Logo size="sm" showSubtitle={false} />
          </div>
        </div>

        {/* Global Search Button */}
        <div className="flex-1 max-w-md mx-4 hidden sm:block">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="w-full bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-slate-700 text-slate-400 px-3.5 py-1.5 rounded-lg text-xs font-mono flex items-center justify-between transition-colors shadow-inner"
          >
            <span className="flex items-center gap-2">
              <Search className="w-3.5 h-3.5 text-cyan-400" />
              <span>Search Battery ID (e.g. EVB-2048), Serial...</span>
            </span>
            <span className="px-1.5 py-0.5 rounded bg-slate-800 border border-slate-700 text-[10px] text-slate-400">
              Ctrl+K
            </span>
          </button>
        </div>

        {/* Top Right User Profile & Controls */}
        <div className="flex items-center gap-3">
          <button
            onClick={() => setIsSearchOpen(true)}
            className="sm:hidden p-2 bg-slate-800 text-slate-300 rounded-lg"
          >
            <Search className="w-4 h-4" />
          </button>

          <NotificationDropdown userRole={currentUser?.role} />

          {currentUser && (
            <div className="flex items-center gap-3 pl-3 border-l border-slate-800">
              <div className="hidden lg:flex flex-col text-right font-mono">
                <span className="text-xs font-bold text-white leading-none">
                  {currentUser.name}
                </span>
                <span className="text-[10px] text-slate-400 truncate max-w-[140px] mt-0.5">
                  {currentUser.organization}
                </span>
              </div>

              <span
                className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded border hidden sm:inline-block ${
                  roleBadges[currentUser.role]?.color
                }`}
              >
                {roleBadges[currentUser.role]?.label}
              </span>

              <button
                onClick={handleLogout}
                title="Sign Out"
                className="p-2 rounded-lg bg-slate-800 hover:bg-rose-950 hover:text-rose-400 text-slate-400 transition-colors border border-slate-700/80"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </header>

      {/* Main Layout Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Sidebar (Desktop) */}
        <aside className="w-64 bg-slate-900/60 border-r border-slate-800/80 hidden md:flex flex-col justify-between p-4 shrink-0 font-mono">
          <div className="space-y-6">
            <div>
              <div className="text-[10px] font-bold text-slate-500 uppercase tracking-widest px-3 mb-2">
                Navigation
              </div>
              <nav className="space-y-1">
                {navs.map((item) => {
                  const isActive = location.pathname === item.path;
                  return (
                    <button
                      key={item.path}
                      onClick={() => navigate(item.path)}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-xs font-medium transition-all ${
                        isActive
                          ? 'bg-cyan-950/80 text-cyan-400 border border-cyan-800/80 shadow-md shadow-cyan-950/30'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      <span className={isActive ? 'text-cyan-400' : 'text-slate-400'}>
                        {item.icon}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Quick Demo Portal Switcher Box */}
            <div className="p-3 bg-slate-950/80 border border-slate-800 rounded-xl space-y-2 text-xs">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                <Zap className="w-3 h-3 text-cyan-400" /> Portal Quick Switch
              </div>
              <div className="grid grid-cols-2 gap-1 text-[10px]">
                <button
                  onClick={() => {
                    authService.login('refurbisher@cellwise.demo', 'Refurb@123');
                    navigate('/refurbisher/dashboard');
                  }}
                  className={`p-1.5 rounded text-center border font-mono transition-colors ${
                    currentUser?.role === 'refurbisher'
                      ? 'bg-cyan-950 text-cyan-300 border-cyan-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Refurbisher
                </button>

                <button
                  onClick={() => {
                    authService.login('secondlife@cellwise.demo', 'Second@123');
                    navigate('/second-life/dashboard');
                  }}
                  className={`p-1.5 rounded text-center border font-mono transition-colors ${
                    currentUser?.role === 'second_life'
                      ? 'bg-amber-950 text-amber-300 border-amber-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Second-Life
                </button>

                <button
                  onClick={() => {
                    authService.login('recycler@cellwise.demo', 'Recycler@123');
                    navigate('/recycler/dashboard');
                  }}
                  className={`p-1.5 rounded text-center border font-mono transition-colors ${
                    currentUser?.role === 'recycler'
                      ? 'bg-rose-950 text-rose-300 border-rose-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Recycler
                </button>

                <button
                  onClick={() => {
                    authService.login('admin@cellwise.demo', 'Admin@123');
                    navigate('/admin/dashboard');
                  }}
                  className={`p-1.5 rounded text-center border font-mono transition-colors ${
                    currentUser?.role === 'admin'
                      ? 'bg-purple-950 text-purple-300 border-purple-700 font-bold'
                      : 'bg-slate-900 text-slate-400 border-slate-800 hover:bg-slate-800'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>CELLWISE Engine</span>
            <button
              onClick={() => dbService.resetDatabaseToDefaults()}
              title="Reset Demo Data"
              className="hover:text-cyan-400 p-1 transition-colors flex items-center gap-1"
            >
              <RotateCcw className="w-3 h-3" /> Reset
            </button>
          </div>
        </aside>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 z-40 bg-slate-950/90 md:hidden pt-20 p-4 font-mono">
            <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-3">
              <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">
                Mobile Menu
              </div>
              {navs.map((item) => (
                <button
                  key={item.path}
                  onClick={() => {
                    navigate(item.path);
                    setIsMobileMenuOpen(false);
                  }}
                  className="w-full flex items-center gap-3 p-3 rounded-lg bg-slate-800 text-slate-200 text-sm font-medium"
                >
                  {item.icon}
                  <span>{item.label}</span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Main Workspace Area */}
        <main className="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 bg-slate-950">
          <div className="max-w-7xl mx-auto">{children}</div>
        </main>
      </div>

      {/* Global Search Modal */}
      <GlobalSearchModal
        isOpen={isSearchOpen}
        onClose={() => setIsSearchOpen(false)}
        onSelectBattery={(batteryId) => {
          navigate(`/battery/${batteryId}/passport`);
        }}
      />
    </div>
  );
};
