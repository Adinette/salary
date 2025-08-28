import type { SalaryCalculation } from '@/stores/operators';

interface SalaryInput {
  chiffreAffaireMensuel: number;
  autresPrelevements: number;
}

// This composable encapsulates the business logic for salary calculation.
// It is a "pure" function, meaning it has no side effects and its output
// depends only on its input, making it easy to test and reuse.

export function useSalaryCalculator() {

  const calculate = (input: SalaryInput): Omit<SalaryCalculation, 'operatorName' | 'calculationDate'> => {
    const { chiffreAffaireMensuel, autresPrelevements } = input;

    const chiffreAffaireFinal = chiffreAffaireMensuel / 1.10;
    const chiffreAffaireHorsTaxe = chiffreAffaireFinal * 0.06;

    const FEL = 2500;
    const AIB = chiffreAffaireHorsTaxe * 0.05;
    const totalPrelevements = FEL + AIB + autresPrelevements;

    const salaireBrut = chiffreAffaireHorsTaxe - totalPrelevements;

    return {
      chiffreAffaireMensuel,
      chiffreAffaireFinal,
      chiffreAffaireHorsTaxe,
      fel: FEL,
      aib: AIB,
      autresPrelevements,
      totalPrelevements,
      salaireBrut,
    };
  };

  return {
    calculate,
  };
}
