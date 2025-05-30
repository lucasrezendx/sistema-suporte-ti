
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CheckCircle, 
  Clock, 
  User, 
  Calendar, 
  Edit3, 
  Trash2,
  AlertTriangle,
  AlertCircle,
  Info,
  Minus
} from 'lucide-react';
import { Task, UrgencyLevel, TaskCategory, TaskStatus } from '@/lib/types';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import { useToast } from '@/hooks/use-toast';

interface TaskCardProps {
  task: Task;
  onTaskUpdated?: () => void;
  onEdit?: (task: Task) => void;
}

const urgencyConfig = {
  [UrgencyLevel.URGENT]: {
    label: 'Urgente',
    color: 'bg-red-100 text-red-800 border-red-200',
    icon: AlertTriangle,
    iconColor: 'text-red-600'
  },
  [UrgencyLevel.IMPORTANT]: {
    label: 'Importante',
    color: 'bg-orange-100 text-orange-800 border-orange-200',
    icon: AlertCircle,
    iconColor: 'text-orange-600'
  },
  [UrgencyLevel.NOT_URGENT]: {
    label: 'Não Urgente',
    color: 'bg-yellow-100 text-yellow-800 border-yellow-200',
    icon: Info,
    iconColor: 'text-yellow-600'
  },
  [UrgencyLevel.NOT_IMPORTANT]: {
    label: 'Não Importante',
    color: 'bg-green-100 text-green-800 border-green-200',
    icon: Minus,
    iconColor: 'text-green-600'
  }
};

const categoryConfig = {
  [TaskCategory.EXPANSION]: { label: 'Expansão', color: 'bg-purple-100 text-purple-800' },
  [TaskCategory.SUPPORT]: { label: 'Suporte', color: 'bg-blue-100 text-blue-800' },
  [TaskCategory.MONITORING]: { label: 'Monitoramento', color: 'bg-indigo-100 text-indigo-800' },
  [TaskCategory.CENTRAL_PROJECTS]: { label: 'Projetos Central', color: 'bg-pink-100 text-pink-800' }
};

export function TaskCard({ task, onTaskUpdated, onEdit }: TaskCardProps) {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const urgency = urgencyConfig[task.urgency];
  const category = categoryConfig[task.category];
  const UrgencyIcon = urgency.icon;

  const handleStatusToggle = async () => {
    setIsLoading(true);
    try {
      const newStatus = task.status === TaskStatus.PENDING ? TaskStatus.RESOLVED : TaskStatus.PENDING;
      
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus })
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar status');
      }

      toast({
        title: newStatus === TaskStatus.RESOLVED ? 'Demanda resolvida!' : 'Demanda reaberta!',
        description: `A demanda foi marcada como ${newStatus === TaskStatus.RESOLVED ? 'resolvida' : 'pendente'}.`,
      });

      onTaskUpdated?.();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar status',
        description: 'Ocorreu um erro ao atualizar o status da demanda.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!confirm('Tem certeza que deseja excluir esta demanda?')) return;

    setIsLoading(true);
    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE'
      });

      if (!response.ok) {
        throw new Error('Falha ao excluir demanda');
      }

      toast({
        title: 'Demanda excluída!',
        description: 'A demanda foi removida do sistema.',
      });

      onTaskUpdated?.();
    } catch (error) {
      toast({
        title: 'Erro ao excluir demanda',
        description: 'Ocorreu um erro ao excluir a demanda.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      whileHover={{ y: -2 }}
      className="group"
    >
      <Card className={`shadow-md hover:shadow-lg transition-all duration-300 border-0 bg-white/90 backdrop-blur-sm ${
        task.status === TaskStatus.RESOLVED ? 'opacity-75' : ''
      }`}>
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-center gap-2 flex-1">
              <UrgencyIcon className={`h-4 w-4 ${urgency.iconColor}`} />
              <Badge variant="outline" className={`${urgency.color} border font-medium`}>
                {urgency.label}
              </Badge>
              <Badge variant="outline" className={`${category.color} font-medium`}>
                {category.label}
              </Badge>
            </div>
            <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => onEdit?.(task)}
                className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-600"
              >
                <Edit3 className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDelete}
                disabled={isLoading}
                className="h-8 w-8 p-0 hover:bg-red-100 hover:text-red-600"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        
        <CardContent className="pt-0">
          <div className="space-y-3">
            <p className="text-gray-800 leading-relaxed">{task.description}</p>
            
            <div className="flex items-center gap-4 text-sm text-gray-600">
              <div className="flex items-center gap-1">
                <User className="h-4 w-4" />
                <span>{task.requester}</span>
              </div>
              <div className="flex items-center gap-1">
                <Calendar className="h-4 w-4" />
                <span>{format(new Date(task.createdAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
              </div>
            </div>

            {task.status === TaskStatus.RESOLVED && task.resolvedAt && (
              <div className="flex items-center gap-1 text-sm text-green-600 bg-green-50 px-2 py-1 rounded">
                <CheckCircle className="h-4 w-4" />
                <span>Resolvida em {format(new Date(task.resolvedAt), 'dd/MM/yyyy HH:mm', { locale: ptBR })}</span>
              </div>
            )}

            <div className="flex gap-2 pt-2">
              <Button
                onClick={handleStatusToggle}
                disabled={isLoading}
                size="sm"
                className={`flex-1 ${
                  task.status === TaskStatus.PENDING
                    ? 'bg-green-600 hover:bg-green-700 text-white'
                    : 'bg-blue-600 hover:bg-blue-700 text-white'
                }`}
              >
                {task.status === TaskStatus.PENDING ? (
                  <>
                    <CheckCircle className="mr-2 h-4 w-4" />
                    Marcar como Resolvida
                  </>
                ) : (
                  <>
                    <Clock className="mr-2 h-4 w-4" />
                    Reabrir Demanda
                  </>
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
