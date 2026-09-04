import type { LucideIcon } from 'lucide-react';

export interface ShellNavItem {
  id: string;
  label: string;
  icon: LucideIcon;
  desc: string;
  group?: string;
}

export interface ShellNavGroup {
  id: string;
  label: string;
}
