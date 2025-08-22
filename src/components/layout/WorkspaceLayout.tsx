import React from 'react';
import { motion } from 'motion/react';
import { useLocation, useNavigate } from 'react-router-dom';
import { 
  Home, BrainCircuit, Scissors, Palette, Play, Settings, 
  User, LogOut, Folder, Clock, Star, HelpCircle 
} from 'lucide-react';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { useAuth } from '../../contexts/AuthContext';

interface WorkspaceLayoutProps {
  children: React.ReactNode;
  language: 'th' | 'en';
  setLanguage: (lang: 'th' | 'en') => void;
}

const cinemaEasing = [0.25, 0.46, 0.45, 0.94] as const;

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  path: string;
  color: string;
}

const primaryNavItems: NavItem[] = [
  {
    id: 'dashboard',
    label: 'Dashboard', 
    icon: Home,
    path: '/dashboard',
    color: 'oklch(0.488 0.243 264.376)'
  },
  {
    id: 'projects',
    label: 'Projects',
    icon: Folder,
    path: '/projects',
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'processing',
    label: 'Processing',
    icon: Clock,
    path: '/processing',
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    id: 'library',
    label: 'Library',
    icon: Star,
    path: '/library', 
    color: 'oklch(0.627 0.265 303.9)'
  }
];

const aiToolItems: NavItem[] = [
  {
    id: 'intent-ai',
    label: 'Intent AI',
    icon: BrainCircuit,
    path: '/workspace/intent-ai',
    color: 'oklch(0.488 0.243 264.376)'
  },
  {
    id: 'auto-cut',
    label: 'Auto-Cut',
    icon: Scissors,
    path: '/workspace/auto-cut',
    color: 'oklch(0.696 0.17 162.48)'
  },
  {
    id: 'cinetone',
    label: 'CineTone',
    icon: Palette,
    path: '/workspace/cinetone',
    color: 'oklch(0.769 0.188 70.08)'
  },
  {
    id: 'preview',
    label: 'Preview',
    icon: Play,
    path: '/workspace/preview',
    color: 'oklch(0.627 0.265 303.9)'
  }
];

const bottomNavItems: NavItem[] = [
  {
    id: 'settings',
    label: 'Settings',
    icon: Settings,
    path: '/settings',
    color: 'oklch(0.708 0 0)'
  },
  {
    id: 'help',
    label: 'Help',
    icon: HelpCircle,
    path: '/help',
    color: 'oklch(0.708 0 0)'
  }
];

export function WorkspaceLayout({ children, language, setLanguage }: WorkspaceLayoutProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const { user, signOut } = useAuth();

  const handleNavigation = (path: string) => {
    navigate(path);
  };

  const handleSignOut = async () => {
    await signOut();
    navigate('/');
  };

  const isActivePath = (path: string) => {
    return location.pathname === path || (path !== '/dashboard' && location.pathname.startsWith(path));
  };

  const NavButton = ({ item, isActive }: { item: NavItem; isActive: boolean }) => (
    <motion.button
      className="w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-300 text-left text-base font-medium"
      style={{
        backgroundColor: isActive 
          ? `${item.color} / 0.15` 
          : 'transparent',
        color: isActive ? item.color : 'oklch(0.708 0 0)'
      }}
      onClick={() => handleNavigation(item.path)}
      whileHover={{
        backgroundColor: `${item.color} / 0.1`,
        transition: { duration: 0.2 }
      }}
      whileTap={{ scale: 0.98 }}
    >
      <item.icon 
        className="w-5 h-5 flex-shrink-0"
        style={{ color: isActive ? item.color : 'oklch(0.708 0 0)' }}
      />
      <span className="truncate">{item.label}</span>
      {isActive && (
        <motion.div
          className="ml-auto w-2 h-2 rounded-full"
          style={{ backgroundColor: item.color }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 500, damping: 30 }}
        />
      )}
    </motion.button>
  );

  return (
    <div className="flex min-h-screen" style={{ backgroundColor: 'oklch(0.145 0 0)' }}>
      {/* Sidebar */}
      <motion.aside
        className="w-64 border-r flex flex-col"
        style={{
          backgroundColor: 'oklch(0.205 0 0)',
          borderColor: 'oklch(0.269 0 0)'
        }}
        initial={{ x: -20, opacity: 0 }}
        animate={{ x: 0, opacity: 1 }}
        transition={{ duration: 0.8, ease: cinemaEasing }}
      >
        {/* Logo/Brand */}
        <motion.div 
          className="p-6 border-b"
          style={{ borderColor: 'oklch(0.269 0 0)' }}
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: cinemaEasing }}
        >
          <div className="flex items-center gap-3">
            <div 
              className="w-10 h-10 rounded-xl flex items-center justify-center"
              style={{ 
                background: 'linear-gradient(135deg, oklch(0.488 0.243 264.376), oklch(0.696 0.17 162.48))' 
              }}
            >
              <BrainCircuit className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-black text-white tracking-tight">EyeMotion</h1>
              <p className="text-xs font-medium" style={{ color: 'oklch(0.708 0 0)' }}>
                Cinema Suite
              </p>
            </div>
          </div>
        </motion.div>

        {/* Navigation */}
        <div className="flex-1 px-4 py-6 overflow-y-auto">
          {/* Main Navigation */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2, ease: cinemaEasing }}
          >
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-4" style={{ color: 'oklch(0.708 0 0 / 0.7)' }}>
                Workspace
              </h3>
              <div className="space-y-1">
                {primaryNavItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.3 + index * 0.1, ease: cinemaEasing }}
                  >
                    <NavButton item={item} isActive={isActivePath(item.path)} />
                  </motion.div>
                ))}
              </div>
            </div>

            <Separator className="my-6" style={{ backgroundColor: 'oklch(0.269 0 0)' }} />

            {/* AI Tools */}
            <div className="mb-6">
              <h3 className="text-xs font-bold uppercase tracking-wider mb-3 px-4" style={{ color: 'oklch(0.708 0 0 / 0.7)' }}>
                AI Tools
              </h3>
              <div className="space-y-1">
                {aiToolItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1, ease: cinemaEasing }}
                  >
                    <NavButton item={item} isActive={isActivePath(item.path)} />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        </div>

        {/* Bottom Section */}
        <motion.div 
          className="p-4 border-t"
          style={{ borderColor: 'oklch(0.269 0 0)' }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8, ease: cinemaEasing }}
        >
          {/* Bottom Navigation */}
          <div className="space-y-1 mb-4">
            {bottomNavItems.map((item) => (
              <NavButton key={item.id} item={item} isActive={isActivePath(item.path)} />
            ))}
          </div>

          <Separator className="my-4" style={{ backgroundColor: 'oklch(0.269 0 0)' }} />

          {/* User Section */}
          <div className="space-y-3">
            <div className="flex items-center gap-3 px-4 py-2">
              <div 
                className="w-8 h-8 rounded-lg flex items-center justify-center"
                style={{ backgroundColor: 'oklch(0.269 0 0)' }}
              >
                <User className="w-4 h-4" style={{ color: 'oklch(0.708 0 0)' }} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-white truncate">
                  {user?.email?.split('@')[0] || 'User'}
                </p>
                <p className="text-xs" style={{ color: 'oklch(0.708 0 0)' }}>
                  Professional Plan
                </p>
              </div>
            </div>

            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full justify-start gap-3 px-4 py-3 text-sm font-medium"
              style={{ color: 'oklch(0.708 0 0)' }}
            >
              <LogOut className="w-4 h-4" />
              Sign Out
            </Button>
          </div>
        </motion.div>
      </motion.aside>

      {/* Main Content */}
      <main className="flex-1 min-w-0">
        {children}
      </main>
    </div>
  );
}