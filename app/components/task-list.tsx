
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { TaskCard } from './task-card';
import { TaskFilters } from './task-filters';
import { TaskEditModal } from './task-edit-modal';
import { Task, TaskFilters as TaskFiltersType } from '@/lib/types';
import { Loader2, FileX } from 'lucide-react';

interface TaskListProps {
  showFilters?: boolean;
  initialFilters?: TaskFiltersType;
}

export function TaskList({ showFilters = true, initialFilters = {} }: TaskListProps) {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState<TaskFiltersType>(initialFilters);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const fetchTasks = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      
      Object.entries(filters).forEach(([key, value]) => {
        if (value) {
          params.append(key, value);
        }
      });

      const response = await fetch(`/api/tasks?${params.toString()}`);
      if (!response.ok) {
        throw new Error('Falha ao carregar demandas');
      }
      
      const data = await response.json();
      setTasks(data);
    } catch (error) {
      console.error('Error fetching tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [filters]);

  const handleFiltersChange = (newFilters: TaskFiltersType) => {
    setFilters(newFilters);
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleTaskUpdated = () => {
    fetchTasks();
    setEditingTask(null);
  };

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-12">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
        <span className="ml-2 text-gray-600">Carregando demandas...</span>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {showFilters && (
        <TaskFilters
          filters={filters}
          onFiltersChange={handleFiltersChange}
          onClearFilters={handleClearFilters}
        />
      )}

      {tasks.length === 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center py-12"
        >
          <FileX className="h-16 w-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            Nenhuma demanda encontrada
          </h3>
          <p className="text-gray-600">
            {Object.values(filters).some(v => v) 
              ? 'Tente ajustar os filtros para encontrar demandas.'
              : 'Não há demandas cadastradas no momento.'
            }
          </p>
        </motion.div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <AnimatePresence>
            {tasks.map((task, index) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <TaskCard
                  task={task}
                  onTaskUpdated={handleTaskUpdated}
                  onEdit={handleEditTask}
                />
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {editingTask && (
        <TaskEditModal
          task={editingTask}
          isOpen={!!editingTask}
          onClose={() => setEditingTask(null)}
          onTaskUpdated={handleTaskUpdated}
        />
      )}
    </div>
  );
}
