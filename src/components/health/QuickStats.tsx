import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardFooter, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { 
  ArrowRight, 
  TrendingUp, 
  TrendingDown, 
  HeartPulse, 
  Brain, 
  ActivitySquare, 
  Medal, 
  Zap 
} from "lucide-react";
import { ActivityRing } from "@/components/ui/activity-ring";
import { cn } from "@/lib/utils";

export const QuickStats = () => {
  const stats = [
    {
      id: 'physical-activity',
      title: 'Daily Activity',
      value: '78%',
      target: '10,000 steps',
      change: '+12%',
      trend: 'up',
      category: 'physical',
      icon: <ActivitySquare className="h-5 w-5" />,
      color: 'bg-blue-500'
    },
    {
      id: 'heart-rate',
      title: 'Heart Rate',
      value: '72 bpm',
      target: 'Resting',
      change: '-3 bpm',
      trend: 'down',
      category: 'physical',
      icon: <HeartPulse className="h-5 w-5" />,
      color: 'bg-red-500'
    },
    {
      id: 'mindfulness',
      title: 'Mindfulness',
      value: '32 min',
      target: '45 min goal',
      change: '-5 min',
      trend: 'down',
      category: 'mental',
      icon: <Brain className="h-5 w-5" />,
      color: 'bg-purple-500'
    },
    {
      id: 'flow-states',
      title: 'Flow States',
      value: '3',
      target: 'Today',
      change: '+1',
      trend: 'up',
      category: 'mental',
      icon: <Zap className="h-5 w-5" />,
      color: 'bg-amber-500'
    }
  ];

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold tracking-tight">Quick Overview</h2>
        <Button variant="ghost" size="sm" className="gap-1">
          View Details <ArrowRight className="h-4 w-4" />
        </Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
        {stats.map(stat => (
          <StatCard key={stat.id} stat={stat} />
        ))}
      </div>
    </div>
  );
};

type StatCardProps = {
  stat: {
    id: string;
    title: string;
    value: string;
    target: string;
    change: string;
    trend: 'up' | 'down';
    category: 'physical' | 'mental';
    icon: React.ReactNode;
    color: string;
  }
};

const StatCard = ({ stat }: StatCardProps) => {
  const getGradientClass = (category: 'physical' | 'mental') => {
    return category === 'physical'
      ? 'from-health-primary/10 to-health-primary/5 border-health-primary/20'
      : 'from-mental-primary/10 to-mental-primary/5 border-mental-primary/20';
  };

  return (
    <Card className={cn(
      "overflow-hidden transition-all duration-300 hover:shadow-md border",
      `bg-gradient-to-br ${getGradientClass(stat.category)}`
    )}>
      <CardHeader className="p-4 pb-2 flex flex-row items-center justify-between space-y-0">
        <div className="flex items-center space-x-2">
          <div className={cn(
            "flex h-7 w-7 rounded-full items-center justify-center", 
            stat.category === 'physical' ? 'bg-health-primary/10 text-health-primary' : 'bg-mental-primary/10 text-mental-primary'
          )}>
            {stat.icon}
          </div>
          <CardTitle className="text-sm font-medium">{stat.title}</CardTitle>
        </div>
        <div className={cn(
          "flex items-center text-xs font-medium",
          stat.trend === 'up' ? 'text-green-500' : 'text-red-500'
        )}>
          {stat.trend === 'up' ? (
            <TrendingUp className="h-3 w-3 mr-1" />
          ) : (
            <TrendingDown className="h-3 w-3 mr-1" />
          )}
          {stat.change}
        </div>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="flex justify-between items-center">
          <div>
            <div className="text-2xl font-bold">{stat.value}</div>
            <p className="text-xs text-muted-foreground mt-1">{stat.target}</p>
          </div>
          <div>
            <ActivityRing 
              progress={parseInt(stat.value) || 75} 
              size={42}
              color={stat.category === 'physical' ? 'purple' : 'teal'}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}; 