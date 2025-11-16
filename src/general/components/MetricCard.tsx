import { Card, CardContent } from "@/components/ui/card";
import { TrendingUp, TrendingDown } from "lucide-react";
import type { LucideIcon } from "lucide-react";

interface MetricCardProps {
  title: string;
  value: string | number;
  change: string;
  isPositive?: boolean;
  icon: LucideIcon;
}

export function MetricCard({ title, value, change, isPositive = true, icon: Icon }: MetricCardProps) {
  return (
    <Card className="hover:shadow-md transition-shadow">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-4">
          <span className="text-sm text-muted-foreground">{title}</span>
          <Icon className="h-5 w-5 text-muted-foreground" />
        </div>
        <div className="flex items-end justify-between">
          <span className="text-3xl font-bold text-foreground">{value}</span>
          <div className={`flex items-center text-sm ${isPositive ? 'text-success' : 'text-critical'}`}>
            {isPositive ? <TrendingUp className="h-4 w-4 mr-1" /> : <TrendingDown className="h-4 w-4 mr-1" />}
            {change}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
