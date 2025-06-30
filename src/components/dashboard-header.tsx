import type { ReactNode } from 'react';
import { ThemeToggle } from './theme-toggle';

type DashboardHeaderProps = {
  title: string;
  children?: ReactNode;
};

export function DashboardHeader({ title, children }: DashboardHeaderProps) {
  return (
    <header className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between mb-6">
      <h1 className="text-3xl font-bold tracking-tight text-foreground">{title}</h1>
      <div className="flex items-center gap-2">
        {children}
        <ThemeToggle />
      </div>
    </header>
  );
}
