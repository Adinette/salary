import { defineStore } from 'pinia'
import { ref } from 'vue'

// --- TYPE DEFINITIONS ---

// This interface now includes each specific deduction for historical accuracy.
export interface SalaryCalculation {
  calculationDate: string;
  operatorName?: string; // Optional: To store the name at the time of calculation
  chiffreAffaireMensuel: number;
  chiffreAffaireFinal: number;
  chiffreAffaireHorsTaxe: number;
  fel: number;
  aib: number;
  dette: number;
  penalite: number;
  remboursement: number;
  ecart: number;
  totalPrelevements: number;
  salaireBrut: number;
}

export interface Operator {
  id: number;
  nom: string;
  prenom: string;
  tel: string;
  machineId: string;
  salaryHistory: SalaryCalculation[];
}

export const useOperatorsStore = defineStore('operators', () => {
  // --- STATE ---
  const operators = ref<Operator[]>([
    {
      id: 1,
      nom: 'Dupont',
      prenom: 'Jean',
      tel: '0612345678',
      machineId: 'MACHINE-001',
      salaryHistory: [],
    },
    {
      id: 2,
      nom: 'Curie',
      prenom: 'Marie',
      tel: '0687654321',
      machineId: 'MACHINE-002',
      salaryHistory: [],
    },
  ]);

  // --- ACTIONS ---

  function addOperator(op: Omit<Operator, 'id' | 'salaryHistory'>) {
    const newId = operators.value.length > 0 ? Math.max(...operators.value.map(o => o.id)) + 1 : 1;
    operators.value.push({
      ...op,
      id: newId,
      salaryHistory: [],
    });
  }

  function updateOperator(op: Operator) {
    const index = operators.value.findIndex(o => o.id === op.id);
    if (index !== -1) {
      operators.value[index] = op;
    }
  }

  function deleteOperator(operatorId: number) {
    const index = operators.value.findIndex(o => o.id === operatorId);
    if (index !== -1) {
      operators.value.splice(index, 1);
    }
  }

  function addSalaryRecord(operatorId: number, record: SalaryCalculation) {
    const operator = operators.value.find(o => o.id === operatorId);
    if (operator) {
      // Add operator name to the record for historical context
      record.operatorName = `${operator.prenom} ${operator.nom}`;
      operator.salaryHistory.unshift(record); // Add to the beginning of the array
      if (operator.salaryHistory.length > 3) {
        operator.salaryHistory.pop(); // Keep only the last 3 records
      }
    }
  }

  return {
    operators,
    addOperator,
    updateOperator,
    deleteOperator,
    addSalaryRecord,
  }
}, {
  persist: true, // Enable persistence for this store
});
