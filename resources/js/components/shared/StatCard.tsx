import React from 'react';
import { cn } from '@/lib/utils';
import { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

type IconVariant = 'default' | 'success' | 'destructive' | 'warning';

interface StatCardProps {
  title: string;
  value: string | number;
  icon: LucideIcon;
  trend?: string;
  trendUp?: boolean;
  iconVariant?: IconVariant;
  className?: string;
}

const iconVariantStyles: Record<IconVariant, { bg: string; text: string }> = {
  default:     { bg: 'bg-primary/10',     text: 'text-primary' },
  success:     { bg: 'bg-success/10',     text: 'text-success' },
  destructive: { bg: 'bg-destructive/10', text: 'text-destructive' },
  warning:     { bg: 'bg-warning/10',     text: 'text-warning' },
};

export default function StatCard({ title, value, icon: Icon, trend, trendUp, iconVariant = 'default', className }: StatCardProps) {
  const { bg, text } = iconVariantStyles[iconVariant];
  return (
    <Card className={cn('hover:shadow-md transition-shadow', className)}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">{title}</p>
            <p className="text-2xl font-bold mt-1">{value}</p>
            {trend && (
              <p className={cn('text-xs mt-1 font-medium', trendUp ? 'text-success' : 'text-destructive')}>
                {trend}
              </p>
            )}
          </div>
          <div className={cn('h-10 w-10 rounded-lg flex items-center justify-center', bg)}>
            <Icon className={cn('h-5 w-5', text)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
