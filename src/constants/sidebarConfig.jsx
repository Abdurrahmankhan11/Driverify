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
        { label: 'Featured Vehicles', path: '/dashboard/user/featured', icon: 'Star' },
        { label: 'Recently Viewed', path: '/dashboard/user/recently-viewed', icon: 'Clock' },
        { label: 'Wishlist', path: '/dashboard/user/wishlist', icon: 'Heart' },
      ]
    },
    {
      section: 'Services',
      items: [
        { label: 'Middleman Services', path: '/dashboard/user/middleman-services', icon: 'Handshake' },
        { label: 'My Negotiations', path: '/dashboard/user/negotiations', icon: 'Handshake' },
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
        { label: 'Requests', path: '/dashboard/middleman/requests', icon: 'Briefcase' },
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
        { label: 'Featured Vehicles', path: '/dashboard/admin/featured', icon: 'Star' },
        { label: 'Reports', path: '/dashboard/admin/reports', icon: 'AlertTriangle' },
        { label: 'Middleman Requests', path: '/dashboard/admin/middleman', icon: 'Handshake' },
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
