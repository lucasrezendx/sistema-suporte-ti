
'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Loader2, Save, X } from 'lucide-react';
import { Task, UrgencyLevel, TaskCategory, UpdateTaskData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TaskEditModalProps {
  task: Task;
  isOpen: boolean;
  onClose: () => void;
  onTaskUpdated: () => void;
}

const urgencyOptions = [
  { value: UrgencyLevel.URGENT, label: 'Urgente' },
  { value: UrgencyLevel.IMPORTANT, label: 'Importante' },
  { value: UrgencyLevel.NOT_URGENT, label: 'Não Urgente' },
  { value: UrgencyLevel.NOT_IMPORTANT, label: 'Não Importante' }
];

const categoryOptions = [
  { value: TaskCategory.EXPANSION, label: 'Expansão' },
  { value: TaskCategory.SUPPORT, label: 'Suporte' },
  { value: TaskCategory.MONITORING, label: 'Monitoramento' },
  { value: TaskCategory.CENTRAL_PROJECTS, label: 'Projetos Central' }
];

export function TaskEditModal({ task, isOpen, onClose, onTaskUpdated }: TaskEditModalProps) {
  const [formData, setFormData] = useState<UpdateTaskData>({
    description: task.description,
    requester: task.requester,
    urgency: task.urgency,
    category: task.category
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    setFormData({
      description: task.description,
      requester: task.requester,
      urgency: task.urgency,
      category: task.category
    });
  }, [task]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao atualizar demanda');
      }

      toast({
        title: 'Demanda atualizada com sucesso!',
        description: 'As alterações foram salvas.',
      });

      onTaskUpdated();
    } catch (error) {
      toast({
        title: 'Erro ao atualizar demanda',
        description: 'Ocorreu um erro ao salvar as alterações.',
        variant: 'destructive'
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <Dialog open={isOpen} onOpenChange={onClose}>
          <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2 text-xl font-semibold">
                Editar Demanda
              </DialogTitle>
            </DialogHeader>

            <motion.form
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              onSubmit={handleSubmit}
              className="space-y-6 mt-4"
            >
              <div className="space-y-2">
                <Label htmlFor="edit-description" className="text-sm font-medium text-gray-700">
                  Descrição da Demanda *
                </Label>
                <Textarea
                  id="edit-description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  required
                  className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="edit-requester" className="text-sm font-medium text-gray-700">
                  Solicitante *
                </Label>
                <Input
                  id="edit-requester"
                  value={formData.requester}
                  onChange={(e) => setFormData({ ...formData, requester: e.target.value })}
                  required
                  className="border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Nível de Urgência *
                  </Label>
                  <Select
                    value={formData.urgency}
                    onValueChange={(value: UrgencyLevel) => setFormData({ ...formData, urgency: value })}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {urgencyOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label className="text-sm font-medium text-gray-700">
                    Categoria *
                  </Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value: TaskCategory) => setFormData({ ...formData, category: value })}
                  >
                    <SelectTrigger className="border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {categoryOptions.map((option) => (
                        <SelectItem key={option.value} value={option.value}>
                          {option.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="submit"
                  disabled={isLoading}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium"
                >
                  {isLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Salvando...
                    </>
                  ) : (
                    <>
                      <Save className="mr-2 h-4 w-4" />
                      Salvar Alterações
                    </>
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  <X className="mr-2 h-4 w-4" />
                  Cancelar
                </Button>
              </div>
            </motion.form>
          </DialogContent>
        </Dialog>
      )}
    </AnimatePresence>
  );
}
