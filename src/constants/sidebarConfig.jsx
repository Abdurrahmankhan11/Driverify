export const SIDEBAR_CONFIG = {
  USER: [
    {
      section: 'Overview',
      items: [
        { label: 'Home', path: '/dashboard/user', icon: 'Home' },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'My Listings', path: '/dashboard/user/listings', icon: 'Car' },
        { label: 'List Vehicle', path: '/dashboard/user/post-vehicle', icon: 'Plus' },
      ]
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile', path: '/dashboard/user/profile', icon: 'User' },
      ]
    }
  ],
  MIDDLEMAN: [
    {
      section: 'Overview',
      items: [
        { label: 'Dashboard', path: '/dashboard/middleman', icon: 'LayoutDashboard' },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'Active Deals', path: '/dashboard/middleman/deals', icon: 'Briefcase' },
        { label: 'Inspections', path: '/dashboard/middleman/inspections', icon: 'ClipboardCheck' },
      ]
    },
    {
      section: 'Account',
      items: [
        { label: 'Messages', path: '/dashboard/middleman/messages', icon: 'MessageSquare' },
      ]
    }
  ],
  ADMIN: [
    {
      section: 'Overview',
      items: [
        { label: 'Admin Dashboard', path: '/dashboard/admin', icon: 'LayoutDashboard' },
      ]
    },
    {
      section: 'Management',
      items: [
        { label: 'Users', path: '/dashboard/admin/users', icon: 'Users' },
        { label: 'All Listings', path: '/dashboard/admin/listings', icon: 'List' },
      ]
    },
    {
      section: 'Account',
      items: [
        { label: 'Profile', path: '/dashboard/admin/profile', icon: 'User' },
      ]
    }
  ]
};
