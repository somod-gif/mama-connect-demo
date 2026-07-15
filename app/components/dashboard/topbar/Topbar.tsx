'use client';

import { usePathname } from 'next/navigation';
import { Menu, X } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';

function getPageTitle(pathname: string): string {
  if (pathname === '/dashboard') return 'Dashboard';
  if (pathname.startsWith('/dashboard/mothers/')) return 'Mother Profile';
  if (pathname === '/dashboard/mothers') return 'Assigned Mothers';
  if (pathname === '/dashboard/find-mothers') return 'Find Mothers';
  if (
    pathname === '/dashboard/documents' ||
    pathname.startsWith('/dashboard/documents/')
  )
    return 'Documents';
  if (pathname === '/dashboard/referrals') return 'Referrals';
  if (pathname === '/dashboard/profile') return 'Profile';
  if (pathname === '/dashboard/settings') return 'Settings';
  return 'Dashboard';
}

export default function Topbar({
  mobileOpen,
  onMobileToggle,
}: {
  mobileOpen: boolean;
  onMobileToggle: () => void;
}) {
  const pathname = usePathname();
  const { user } = useAuth();

  const pageTitle = getPageTitle(pathname);
  const initials = user
    ? `${user.firstName?.charAt(0) || ''}${user.lastName?.charAt(0) || ''}`.toUpperCase() ||
      'CH'
    : 'CH';

  return (
    <header className='sticky top-0 z-20 bg-card/80 backdrop-blur-md border-b border-border'>
      <div className='flex items-center justify-between px-4 md:px-6 lg:px-8 h-12 lg:h-14'>
        <div className='flex items-center gap-3 lg:hidden'>
          <button
            onClick={onMobileToggle}
            className='flex items-center justify-center w-8 h-8 rounded-lg text-muted-foreground hover:bg-background-soft transition-colors -ml-1'
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
          >
            {mobileOpen ? (
              <X className='w-4 h-4' />
            ) : (
              <Menu className='w-4 h-4' />
            )}
          </button>
          <h1 className='text-sm font-bold text-foreground'>{pageTitle}</h1>
        </div>
        <div className='hidden lg:block'>
          <p className='text-sm text-muted-foreground'>
            Good{' '}
            {new Date().getHours() < 12
              ? 'morning'
              : new Date().getHours() < 17
                ? 'afternoon'
                : 'evening'}
            ,{' '}
            <span className='font-semibold text-foreground'>
              {user?.firstName || 'CHEW'}
            </span>
          </p>
        </div>

        <div className='flex items-center gap-2 ml-auto'>
          <div className='flex items-center gap-2 px-2.5 py-1 rounded-lg bg-background-soft'>
            <div className='w-7 h-7 rounded-lg bg-primary-light flex items-center justify-center'>
              <span className='text-[11px] font-bold text-primary'>
                {initials}
              </span>
            </div>
            <div className='hidden sm:block'>
              <p className='text-sm font-medium text-foreground leading-tight'>
                {user?.firstName || 'CHEW'}
              </p>
            </div>
          </div>
        </div>
      </div>
    </header>
  );
}
