import { NavItem } from '@/types/nav'

interface DocsConfig {
   mainNav: NavItem[]
   sidebarNav: NavItem[]
}

export const docsConfig: DocsConfig = {
   mainNav: [
      {
         title: 'Packaging',
         href: '/products',
      },
      {
         title: 'FAQ',
         href: '/faq',
      },
      {
         title: 'GitHub',
         href: 'https://github.com/sesto-dev',
         external: true,
      },
   ],
   sidebarNav: [
      {
         title: 'Products',
         href: '/products',
      },
      {
         title: 'Gallery',
         href: '/products/gallery',
      },
      {
         title: 'Blog',
         href: '/blog',
      },
      {
         title: 'Orders',
         href: '/profile/orders',
      },
      {
         title: 'Payments',
         href: '/profile/payments',
      },
      {
         title: 'Contact',
         href: '/contact',
      },
      {
         title: 'About',
         href: '/about',
      },
   ],
}
