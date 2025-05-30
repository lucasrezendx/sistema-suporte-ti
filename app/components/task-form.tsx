
'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { Plus, Loader2 } from 'lucide-react';
import { UrgencyLevel, TaskCategory, CreateTaskData } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';

interface TaskFormProps {
  onTaskCreated?: () => void;
  onCancel?: () => void;
}

const urgencyOptions = [
  { value: UrgencyLevel.URGENT, label: 'Urgente', color: 'text-red-600' },
  { value: UrgencyLevel.IMPORTANT, label: 'Importante', color: 'text-orange-600' },
  { value: UrgencyLevel.NOT_URGENT, label: 'Não Urgente', color: 'text-yellow-600' },
  { value: UrgencyLevel.NOT_IMPORTANT, label: 'Não Importante', color: 'text-green-600' }
];

const categoryOptions = [
  { value: TaskCategory.EXPANSION, label: 'Expansão' },
  { value: TaskCategory.SUPPORT, label: 'Suporte' },
  { value: TaskCategory.MONITORING, label: 'Monitoramento' },
  { value: TaskCategory.CENTRAL_PROJECTS, label: 'Projetos Central' }
];

export function TaskForm({ onTaskCreated, onCancel }: TaskFormProps) {
  const [formData, setFormData] = useState<CreateTaskData>({
    description: '',
    requester: '',
    urgency: UrgencyLevel.NOT_URGENT,
    category: TaskCategory.SUPPORT
  });
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      if (!response.ok) {
        throw new Error('Falha ao criar demanda');
      }

      toast({
        title: 'Demanda criada com sucesso!',
        description: 'A nova demanda foi registrada no sistema.',
      });

      setFormData({
        description: '',
        requester: '',
        urgency: UrgencyLevel.NOT_URGENT,
        category: TaskCategory.SUPPORT
      });

      onTaskCreated?.();
    } catch (error) {
      toast({
        title: 'Erro ao criar demanda',
        description: 'Ocorreu um erro ao registrar a demanda. Tente novamente.',
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
    >
      <Card className="shadow-lg border-0 bg-white/80 backdrop-blur-sm">
        <CardHeader className="pb-4">
          <CardTitle className="flex items-center gap-2 text-xl font-semibold text-gray-800">
            <Plus className="h-5 w-5 text-blue-600" />
            Nova Demanda
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="description" className="text-sm font-medium text-gray-700">
                Descrição da Demanda *
              </Label>
              <Textarea
                id="description"
                placeholder="Descreva detalhadamente a demanda..."
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                required
                className="min-h-[100px] resize-none border-gray-200 focus:border-blue-500 focus:ring-blue-500"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="requester" className="text-sm font-medium text-gray-700">
                Solicitante *
              </Label>
              <Input
                id="requester"
                placeholder="Nome do solicitante"
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
                        <span className={option.color}>{option.label}</span>
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
                className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5"
              >
                {isLoading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Criando...
                  </>
                ) : (
                  <>
                    <Plus className="mr-2 h-4 w-4" />
                    Criar Demanda
                  </>
                )}
              </Button>
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  className="px-6 border-gray-300 text-gray-700 hover:bg-gray-50"
                >
                  Cancelar
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}
