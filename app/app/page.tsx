
'use client';

import { motion } from 'framer-motion';
import { DashboardStats } from '@/components/dashboard-stats';
import { TaskList } from '@/components/task-list';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp } from 'lucide-react';
import Link from 'next/link';
import { TaskStatus } from '@/lib/types';

export default function DashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="text-center"
      >
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Dashboard de Suporte TI
        </h1>
        <p className="text-lg text-gray-600 max-w-2xl mx-auto">
          Gerencie e acompanhe todas as demandas do time de suporte de forma eficiente e organizada
        </p>
      </motion.div>

      {/* Quick Actions */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="flex justify-center"
      >
        <Link href="/tasks/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white font-medium px-8 py-3">
            <Plus className="mr-2 h-5 w-5" />
            Nova Demanda
          </Button>
        </Link>
      </motion.div>

      {/* Stats Cards */}
      <DashboardStats />

      {/* Recent Tasks */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <Card className="shadow-lg border-0 bg-white/90 backdrop-blur-sm">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
              <TrendingUp className="h-5 w-5 text-blue-600" />
              Demandas Pendentes Recentes
            </CardTitle>
          </CardHeader>
          <CardContent>
            <TaskList 
              showFilters={false} 
              initialFilters={{ status: TaskStatus.PENDING }} 
            />
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
