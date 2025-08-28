import type { SalaryCalculation } from '@/stores/operators';

export interface SalaryInput {
  chiffreAffaireMensuel: number;
  dette?: number;
  penalite?: number;
  remboursement?: number;
  ecart?: number;
}

// This composable encapsulates the business logic for salary calculation.
export function useSalaryCalculator() {

  const calculate = (input: SalaryInput): Omit<SalaryCalculation, 'operatorName' | 'calculationDate'> => {
    const {
      chiffreAffaireMensuel,
      dette,
      penalite,
      remboursement,
      ecart
    } = input;

    const chiffreAffaireFinal = chiffreAffaireMensuel / 1.10;
    const chiffreAffaireHorsTaxe = chiffreAffaireFinal * 0.06;

    const FEL = 2500;
    const AIB = chiffreAffaireHorsTaxe * 0.05;

    const autresPrelevements = (dette || 0) + (penalite || 0) + (remboursement || 0) + (ecart || 0);
    const totalPrelevements = FEL + AIB + autresPrelevements;

    const salaireBrut = chiffreAffaireHorsTaxe - totalPrelevements;

    return {
      chiffreAffaireMensuel,
      chiffreAffaireFinal,
      chiffreAffaireHorsTaxe,
      fel: FEL,
      aib: AIB,
      dette: (dette || 0),
      penalite: (penalite || 0),
      remboursement: (remboursement || 0),
      ecart: (ecart || 0),
      totalPrelevements,
      salaireBrut,
    };
  };

  return {
    calculate,
  };
}
