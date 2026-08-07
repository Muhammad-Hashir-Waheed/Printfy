'use client'

import {
   NavigationMenu,
   NavigationMenuContent,
   NavigationMenuItem,
   NavigationMenuLink,
   NavigationMenuList,
   NavigationMenuTrigger,
   navigationMenuTriggerStyle,
} from '@/components/ui/navigation-menu'
import { PrintfyLogo } from '@/components/native/printfy-logo'
import config from '@/config/site'
import { DUMMY_BRANDS } from '@/lib/catalog-dummy'
import { buildCatalogHref } from '@/lib/catalog-navigation'
import { cn } from '@/lib/utils'
import Link from 'next/link'
import { forwardRef } from 'react'

const components: { title: string; href: string; description: string }[] =
   DUMMY_BRANDS.map((brand) => ({
      title: brand.title,
      href: buildCatalogHref({ brand: brand.title }),
      description: `Browse custom packaging from ${brand.title}.`,
   }))

export function MainNav() {
   return (
      <div className="hidden md:flex gap-4">
         <Link href="/" className="flex items-center gap-2">
            <PrintfyLogo className="h-8 w-8 shrink-0 rounded-lg" />
            <span className="hidden font-medium sm:inline-block">
               {config.name}
            </span>
         </Link>
         <NavMenu />
      </div>
   )
}

export function NavMenu() {
   return (
      <NavigationMenu>
         <NavigationMenuList>
            <NavigationMenuItem>
               <Link href="/products" legacyBehavior passHref>
                  <NavigationMenuLink className={navigationMenuTriggerStyle()}>
                     <div className="font-normal text-foreground/70">
                        Products
                     </div>
                  </NavigationMenuLink>
               </Link>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">
                     Categories
                  </div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid gap-3 p-4 md:w-[400px] lg:w-[500px] lg:grid-cols-[.75fr_1fr]">
                     <li className="row-span-3">
                        <NavigationMenuLink asChild>
                           <Link
                              className="flex h-full w-full select-none flex-col justify-end rounded-md bg-gradient-to-b from-muted/50 to-muted p-6 no-underline outline-none focus:shadow-md"
                              href="/products"
                           >
                              <div className="mb-2 mt-4 text-lg font-medium">
                                 Shop packaging
                              </div>
                              <p className="text-sm leading-tight text-muted-foreground">
                                 Browse every custom packaging product in one
                                 place.
                              </p>
                           </Link>
                        </NavigationMenuLink>
                     </li>
                     <ListItem
                        href={buildCatalogHref({ productType: 'Food Packaging' })}
                        title="Food packaging"
                     >
                        Pizza boxes, burger boxes, fries cartons and cups.
                     </ListItem>
                     <ListItem
                        href={buildCatalogHref({
                           productType: 'Shipping Packaging',
                        })}
                        title="Shipping packaging"
                     >
                        Mailer boxes, shipping cartons and poly mailers.
                     </ListItem>
                     <ListItem
                        href={buildCatalogHref({ productType: 'Retail Packaging' })}
                        title="Retail packaging"
                     >
                        Shopping bags, gift boxes, rigid boxes and tags.
                     </ListItem>
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
            <NavigationMenuItem>
               <NavigationMenuTrigger>
                  <div className="font-normal text-foreground/70">Brands</div>
               </NavigationMenuTrigger>
               <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-2 p-4 md:w-[500px] md:grid-cols-2 lg:w-[600px] ">
                     {components.map((component) => (
                        <ListItem
                           key={component.title}
                           title={component.title}
                           href={component.href}
                        >
                           {component.description}
                        </ListItem>
                     ))}
                  </ul>
               </NavigationMenuContent>
            </NavigationMenuItem>
         </NavigationMenuList>
      </NavigationMenu>
   )
}

const ListItem = forwardRef<
   React.ElementRef<'a'>,
   React.ComponentPropsWithoutRef<'a'>
>(({ className, title, children, href, ...props }, ref) => {
   return (
      <li>
         <NavigationMenuLink asChild>
            <Link
               href={href}
               ref={ref}
               className={cn(
                  'block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent hover:text-accent-foreground focus:bg-accent focus:text-accent-foreground',
                  className
               )}
               {...props}
            >
               <div className="text-sm font-medium leading-none">{title}</div>
               <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                  {children}
               </p>
            </Link>
         </NavigationMenuLink>
      </li>
   )
})

ListItem.displayName = 'ListItem'
