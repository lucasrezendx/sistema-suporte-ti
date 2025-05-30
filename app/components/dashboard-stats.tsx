
'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ClipboardList, 
  Clock, 
  CheckCircle, 
  AlertTriangle,
  TrendingUp,
  Users
} from 'lucide-react';

interface DashboardStats {
  totalTasks: number;
  pendingTasks: number;
  resolvedTasks: number;
  urgentTasks: number;
  tasksByCategory: Array<{ category: string; _count: { id: number } }>;
  tasksByUrgency: Array<{ urgency: string; _count: { id: number } }>;
  recentTasks: Array<any>;
}

const StatCard = ({ 
  title, 
  value, 
  icon: Icon, 
  color, 
  delay = 0 
}: { 
  title: string; 
  value: number; 
  icon: any; 
  color: string; 
  delay?: number;
}) => {
  const [animatedValue, setAnimatedValue] = useState(0);

  useEffect(() => {
    const timer = setTimeout(() => {
      const duration = 1000;
      const steps = 60;
      const increment = value / steps;
      let current = 0;

      const counter = setInterval(() => {
        current += increment;
        if (current >= value) {
          setAnimatedValue(value);
          clearInterval(counter);
        } else {
          setAnimatedValue(Math.floor(current));
        }
      }, duration / steps);

      return () => clearInterval(counter);
    }, delay);

    return () => clearTimeout(timer);
  }, [value, delay]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay }}
      whileHover={{ y: -5 }}
    >
      <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm hover:shadow-xl transition-all duration-300">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium text-gray-600">{title}</CardTitle>
          <Icon className={`h-5 w-5 ${color}`} />
        </CardHeader>
        <CardContent>
          <div className={`text-3xl font-bold ${color}`}>
            {animatedValue.toLocaleString()}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export function DashboardStats() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await fetch('/api/tasks/stats');
        if (response.ok) {
          const data = await response.json();
          setStats(data);
        }
      } catch (error) {
        console.error('Error fetching stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading || !stats) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i} className="shadow-lg border-0 bg-white/90 backdrop-blur-sm animate-pulse">
            <CardHeader className="pb-2">
              <div className="h-4 bg-gray-200 rounded w-3/4"></div>
            </CardHeader>
            <CardContent>
              <div className="h-8 bg-gray-200 rounded w-1/2"></div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      <StatCard
        title="Total de Demandas"
        value={stats.totalTasks}
        icon={ClipboardList}
        color="text-blue-600"
        delay={0}
      />
      <StatCard
        title="Demandas Pendentes"
        value={stats.pendingTasks}
        icon={Clock}
        color="text-orange-600"
        delay={0.1}
      />
      <StatCard
        title="Demandas Resolvidas"
        value={stats.resolvedTasks}
        icon={CheckCircle}
        color="text-green-600"
        delay={0.2}
      />
      <StatCard
        title="Demandas Urgentes"
        value={stats.urgentTasks}
        icon={AlertTriangle}
        color="text-red-600"
        delay={0.3}
      />
    </div>
  );
}
