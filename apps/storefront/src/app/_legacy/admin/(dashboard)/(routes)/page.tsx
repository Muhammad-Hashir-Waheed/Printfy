import { getGraphRevenue } from '@/actions/get-graph-revenue'
import { getSalesCount } from '@/actions/get-sales-count'
import { getStockCount } from '@/actions/get-stock-count'
import { getTotalRevenue } from '@/actions/get-total-revenue'
import { Overview } from '@/components/overview'
import { StatsCard } from '@/components/stats-card'
import { RevealOnScroll } from '@/components/ui/reveal-on-scroll'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Heading } from '@/components/ui/heading'
import { Separator } from '@/components/ui/separator'
import { formatter } from '@/lib/utils'
import { CreditCard, DollarSign, Package } from 'lucide-react'

export default async function DashboardPage() {
   const totalRevenue = await getTotalRevenue()
   const graphRevenue = await getGraphRevenue()
   const salesCount = await getSalesCount()
   const stockCount = await getStockCount()

   return (
      <div className="flex-col">
         <div className="flex-1 space-y-4 pt-4">
            <Heading title="Dashboard" description="Overview of your store" />
            <Separator />
            <RevealOnScroll>
               <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
                  <StatsCard
                     title="Total Revenue"
                     value={formatter.format(totalRevenue)}
                     icon={<DollarSign className="h-4 text-muted-foreground" />}
                  />
                  <StatsCard
                     title="Sales"
                     value={`+${salesCount}`}
                     icon={<CreditCard className="h-4 text-muted-foreground" />}
                  />
                  <StatsCard
                     title="Products In Stock"
                     value={stockCount}
                     icon={<Package className="h-4 text-muted-foreground" />}
                  />
               </div>
            </RevealOnScroll>
            <RevealOnScroll>
               <Card className="col-span-4">
                  <CardHeader>
                     <CardTitle>Overview</CardTitle>
                  </CardHeader>
                  <CardContent className="pl-2">
                     <Overview data={graphRevenue} />
                  </CardContent>
               </Card>
            </RevealOnScroll>
         </div>
      </div>
   )
}
