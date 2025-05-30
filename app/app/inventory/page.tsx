'use client';

import { useState } from 'react';
import { motion } from 'framer-motion';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Package, Plus, ArrowUpCircle, ArrowDownCircle } from 'lucide-react';
import { InventoryCategory, TransactionType } from '@/lib/types';

export default function InventoryPage() {
  const [showNewItemForm, setShowNewItemForm] = useState(false);
  const [showTransactionForm, setShowTransactionForm] = useState(false);

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
            <Package className="h-8 w-8 text-orange-600" />
            Controle de Estoque
          </h1>
          <p className="text-gray-600 mt-2">
            Gerencie o estoque de equipamentos e periféricos de TI
          </p>
        </div>
        <div className="flex gap-2">
          <Button
            onClick={() => setShowNewItemForm(!showNewItemForm)}
            className="bg-orange-600 hover:bg-orange-700 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            Novo Item
          </Button>
          <Button
            onClick={() => setShowTransactionForm(!showTransactionForm)}
            variant="outline"
            className="border-orange-200 text-orange-700 hover:bg-orange-50"
          >
            <ArrowUpCircle className="mr-2 h-4 w-4" />
            Registrar Movimentação
          </Button>
        </div>
      </motion.div>

      {/* New Item Form */}
      {showNewItemForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Novo Item</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nome do Item</Label>
                    <Input placeholder="Ex: Mouse USB" />
                  </div>
                  <div className="space-y-2">
                    <Label>Categoria</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione a categoria" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(InventoryCategory).map((category) => (
                          <SelectItem key={category} value={category}>
                            {category}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade Inicial</Label>
                    <Input type="number" min="0" placeholder="0" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowNewItemForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Salvar Item
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Transaction Form */}
      {showTransactionForm && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Registrar Movimentação</CardTitle>
            </CardHeader>
            <CardContent>
              <form className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Item</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o item" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="mouse">Mouse USB</SelectItem>
                        <SelectItem value="keyboard">Teclado USB</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Tipo de Movimentação</Label>
                    <Select>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecione o tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {Object.values(TransactionType).map((type) => (
                          <SelectItem key={type} value={type}>
                            {type === 'IN' ? 'Entrada' : 'Saída'}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Quantidade</Label>
                    <Input type="number" min="1" placeholder="1" />
                  </div>
                  <div className="space-y-2">
                    <Label>Colaborador (para saídas)</Label>
                    <Input placeholder="Nome do colaborador" />
                  </div>
                  <div className="col-span-2 space-y-2">
                    <Label>Observações</Label>
                    <Input placeholder="Observações adicionais" />
                  </div>
                </div>
                <div className="flex justify-end gap-2">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setShowTransactionForm(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="bg-orange-600 hover:bg-orange-700 text-white"
                  >
                    Registrar Movimentação
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Inventory List */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Mouse USB</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Em estoque:</span>
                <span className="font-semibold">15 unidades</span>
              </div>
              <div className="flex justify-between items-center text-sm">
                <span className="text-green-600 flex items-center">
                  <ArrowUpCircle className="h-4 w-4 mr-1" />
                  Última entrada: 5
                </span>
                <span className="text-red-600 flex items-center">
                  <ArrowDownCircle className="h-4 w-4 mr-1" />
                  Última saída: 2
                </span>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}