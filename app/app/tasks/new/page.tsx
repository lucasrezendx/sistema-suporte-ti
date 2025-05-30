
'use client';

import { motion } from 'framer-motion';
import { TaskForm } from '@/components/task-form';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Plus } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function NewTaskPage() {
  const router = useRouter();

  const handleTaskCreated = () => {
    router.push('/tasks');
  };

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
            <Plus className="h-8 w-8 text-blue-600" />
            Nova Demanda
          </h1>
          <p className="text-gray-600 mt-2">
            Registre uma nova demanda para o time de suporte TI
          </p>
        </div>
        <Link href="/tasks">
          <Button variant="outline" className="border-gray-300 text-gray-700 hover:bg-gray-50">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Voltar para Demandas
          </Button>
        </Link>
      </motion.div>

      {/* Task Form */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="max-w-2xl mx-auto"
      >
        <TaskForm onTaskCreated={handleTaskCreated} />
      </motion.div>
    </div>
  );
}
