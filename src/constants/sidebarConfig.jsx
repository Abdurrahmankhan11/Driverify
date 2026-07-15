export const SIDEBAR_CONFIG = {
  USER: [
    { label: 'Home', path: '/dashboard/user', icon: 'Home' },
    { label: 'Profile', path: '/dashboard/user/profile', icon: 'User' },
    { label: 'My Listings', path: '/dashboard/user/listings', icon: 'Car' },
    { label: 'List Vehicle', path: '/dashboard/user/post-vehicle', icon: 'Plus' },
    // { label: 'Messages', path: '/dashboard/user/messages', icon: 'MessageCircle' },
    // { label: 'Settings', path: '/dashboard/user/settings', icon: 'Settings' },
  ],
  MIDDLEMAN: [
    { label: 'Dashboard', path: '/dashboard/middleman', icon: 'LayoutDashboard' },
    { label: 'Active Deals', path: '/dashboard/middleman/deals', icon: 'Briefcase' },
    { label: 'Inspections', path: '/dashboard/middleman/inspections', icon: 'ClipboardCheck' },
    { label: 'Messages', path: '/dashboard/middleman/messages', icon: 'MessageSquare' },
    { label: 'Settings', path: '/dashboard/middleman/settings', icon: 'Settings' },
  ],
  ADMIN: [
    { label: 'Admin Hub', path: '/dashboard/admin', icon: 'ShieldAlert' },
    { label: 'Profile', path: '/dashboard/admin/profile', icon: 'User' },
    { label: 'Users', path: '/dashboard/admin/users', icon: 'Users' },
    { label: 'All Listings', path: '/dashboard/admin/listings', icon: 'List' },
    // { label: 'System Logs', path: '/dashboard/admin/logs', icon: 'TerminalSquare' },
    // { label: 'Settings', path: '/dashboard/admin/settings', icon: 'Settings' },
  ]
};
