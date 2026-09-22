'use client'

import { cn } from '@/lib/utils'
import {
   CreditCard,
   FolderTree,
   Image,
   LayoutDashboard,
   Package,
   ShoppingCart,
   Star,
   Tag,
   Ticket,
   Truck,
   Users,
} from 'lucide-react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

export function MainNav({
   className,
   onNavigate,
   ...props
}: React.HTMLAttributes<HTMLElement> & { onNavigate?: () => void }) {
   const pathname = usePathname()

   const routes = [
      {
         href: `/admin`,
         label: 'Overview',
         icon: LayoutDashboard,
         active: pathname === '/admin',
      },
      {
         href: `/admin/banners`,
         label: 'Banners',
         icon: Image,
         active: pathname.includes(`/banners`),
      },
      {
         href: `/admin/categories`,
         label: 'Categories',
         icon: FolderTree,
         active: pathname.includes(`/categories`),
      },
      {
         href: `/admin/products`,
         label: 'Products',
         icon: Package,
         active: pathname.includes(`/products`),
      },
      {
         href: `/admin/reviews`,
         label: 'Reviews',
         icon: Star,
         active: pathname.includes(`/reviews`),
      },
      {
         href: `/admin/orders`,
         label: 'Orders',
         icon: ShoppingCart,
         active: pathname.includes(`/orders`),
      },
      {
         href: `/admin/fulfillment`,
         label: 'Fulfillment',
         icon: Truck,
         active: pathname.includes(`/fulfillment`),
      },
      {
         href: `/admin/payments`,
         label: 'Payments',
         icon: CreditCard,
         active: pathname.includes(`/payments`),
      },
      {
         href: `/admin/users`,
         label: 'Users',
         icon: Users,
         active: pathname.includes(`/users`),
      },
      {
         href: `/admin/brands`,
         label: 'Brands',
         icon: Tag,
         active: pathname.includes(`/brands`),
      },
      {
         href: `/admin/codes`,
         label: 'Codes',
         icon: Ticket,
         active: pathname.includes(`/codes`),
      },
   ]

   return (
      <nav className={cn('flex flex-col gap-1', className)} {...props}>
         {routes.map((route) => (
            <Link
               key={route.href}
               href={route.href}
               onClick={onNavigate}
               className={cn(
                  'flex items-center gap-3 rounded-md px-3 py-2 text-sm transition-colors',
                  route.active
                     ? 'bg-muted font-medium text-foreground'
                     : 'text-muted-foreground hover:bg-muted/70 hover:text-foreground'
               )}
            >
               <route.icon className="h-4 w-4 shrink-0" />
               {route.label}
            </Link>
         ))}
      </nav>
   )
}
