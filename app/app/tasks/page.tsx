
'use client';

import { motion } from 'framer-motion';
import { TaskList } from '@/components/task-list';
import { Button } from '@/components/ui/button';
import { Plus, Clock } from 'lucide-react';
import Link from 'next/link';
import { TaskStatus } from '@/lib/types';

export default function TasksPage() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-2">
            <Clock className="h-8 w-8 text-orange-600" />
            Demandas Pendentes
          </h1>
          <p className="text-gray-600 mt-2">
            Visualize e gerencie todas as demandas que aguardam resolução
          </p>
        </div>
        <Link href="/tasks/new">
          <Button className="bg-blue-600 hover:bg-blue-700 text-white font-medium">
            <Plus className="mr-2 h-4 w-4" />
            Nova Demanda
          </Button>
        </Link>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TaskList initialFilters={{ status: TaskStatus.PENDING }} />
      </motion.div>
    </div>
  );
}
