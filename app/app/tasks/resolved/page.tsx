
'use client';

import { motion } from 'framer-motion';
import { TaskList } from '@/components/task-list';
import { Button } from '@/components/ui/button';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import Link from 'next/link';
import { TaskStatus } from '@/lib/types';

export default function ResolvedTasksPage() {
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
            <CheckCircle className="h-8 w-8 text-green-600" />
            Demandas Resolvidas
          </h1>
          <p className="text-gray-600 mt-2">
            Histórico de todas as demandas que foram concluídas
          </p>
        </div>
        <Link href="/tasks">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Pendentes
          </Button>
        </Link>
      </motion.div>

      {/* Task List */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
      >
        <TaskList initialFilters={{ status: TaskStatus.RESOLVED }} />
      </motion.div>
    </div>
  );
}
