import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'

type StatsCardProps = {
   title: string
   value: string | number
   icon: React.ReactNode
}

export function StatsCard({ title, value, icon }: StatsCardProps) {
   return (
      <Card className="rounded-2xl border shadow-sm">
         <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{title}</CardTitle>
            {icon}
         </CardHeader>
         <CardContent>
            <div className="text-2xl font-bold">{value}</div>
         </CardContent>
      </Card>
   )
}
