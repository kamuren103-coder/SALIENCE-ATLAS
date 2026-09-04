import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export type ShellBreakpoint = 'desktop' | 'tablet' | 'mobile';

interface ShellContextType {
  collapsed: boolean;
  setCollapsed: (v: boolean) => void;
  mobileOpen: boolean;
  setMobileOpen: (v: boolean) => void;
  breakpoint: ShellBreakpoint;
}

const ShellContext = createContext<ShellContextType | undefined>(undefined);

export function ShellProvider({ children }: { children: ReactNode }) {
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [breakpoint, setBreakpoint] = useState<ShellBreakpoint>('desktop');

  useEffect(() => {
    const compute = () => {
      const w = window.innerWidth;
      if (w < 768) setBreakpoint('mobile');
      else if (w < 1024) setBreakpoint('tablet');
      else setBreakpoint('desktop');
    };
    compute();
    window.addEventListener('resize', compute);
    return () => window.removeEventListener('resize', compute);
  }, []);

  // Close mobile drawer on route change handled by caller via explicit set.

  return (
    <ShellContext.Provider value={{ collapsed, setCollapsed, mobileOpen, setMobileOpen, breakpoint }}>
      {children}
    </ShellContext.Provider>
  );
}

export function useShell() {
  const ctx = useContext(ShellContext);
  if (!ctx) throw new Error('useShell must be used inside a ShellProvider');
  return ctx;
}
