<template>
  <v-container fluid>
    <h1 class="mb-6">Gestion des Opérateurs</h1>
    <v-card>
      <v-card-title>
        Liste des opérateurs
        <v-spacer></v-spacer>
        <v-btn color="primary" @click="openNewItemDialog">Ajouter un opérateur</v-btn>
      </v-card-title>
      <v-data-table
        :headers="headers"
        :items="operators"
        item-value="id"
        class="elevation-1"
        :items-per-page-options="[
          { value: 10, title: '10' },
          { value: 25, title: '25' },
          { value: 50, title: '50' },
          { value: -1, title: 'Tout' }
        ]"
      >
        <template v-slot:item.actions="{ item }">
          <v-tooltip location="top" text="Détails & Historique">
             <template v-slot:activator="{ props }">
              <v-btn icon="mdi-eye" v-bind="props" variant="text" density="compact" @click="viewItemDetails(item)"></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Calculer Salaire">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-currency-usd" v-bind="props" variant="text" density="compact" @click="openSalaryForm(item)"></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Modifier">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-pencil" v-bind="props" variant="text" density="compact" @click="editItem(item)"></v-btn>
            </template>
          </v-tooltip>
          <v-tooltip location="top" text="Supprimer">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-delete" v-bind="props" variant="text" density="compact" @click="deleteItem(item)"></v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="editDialog" max-width="600px" persistent>
      <v-card>
        <v-card-title><span class="text-h5">{{ formTitle }}</span></v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.prenom" label="Prénom"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.nom" label="Nom"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.tel" label="Téléphone"></v-text-field></v-col>
              <v-col cols="12" sm="6"><v-text-field v-model="editedItem.machineId" label="N° Machine"></v-text-field></v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeEditDialog">Annuler</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="saveItem">Sauvegarder</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Delete Confirmation Dialog -->
    <v-dialog v-model="deleteDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Êtes-vous sûr de vouloir supprimer cet opérateur ?</v-card-title>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDeleteDialog">Annuler</v-btn>
          <v-btn color="red-darken-1" variant="tonal" @click="deleteItemConfirm">Supprimer</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Salary Form Dialog -->
    <v-dialog v-model="salaryFormDialog" max-width="700px" persistent>
      <v-card>
        <v-card-title><span class="text-h5">Calculer le salaire pour {{ currentOperator?.prenom }} {{ currentOperator?.nom }}</span></v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" md="6">
                <v-text-field v-model.number="salaryInput.chiffreAffaireMensuel" label="Chiffre d'Affaire Mensuel" type="number" prefix="€" required></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                <v-text-field label="FEL" :model-value="2500" readonly type="number" prefix="€"></v-text-field>
              </v-col>
              <v-col cols="12" md="6">
                 <v-text-field label="AIB (calculé)" :model-value="calculatedAIB.toFixed(2)" readonly type="number" prefix="€"></v-text-field>
              </v-col>
            </v-row>
            <v-divider class="my-4"></v-divider>
            <p class="text-subtitle-1 mb-2">Autres Prélèvements (Optionnel)</p>
            <v-row>
              <v-col cols="12" md="6"><v-text-field v-model.number="salaryInput.dette" label="Dette" type="number" prefix="€" clearable></v-text-field></v-col>
              <v-col cols="12" md="6"><v-text-field v-model.number="salaryInput.penalite" label="Pénalité" type="number" prefix="€" clearable></v-text-field></v-col>
              <v-col cols="12" md="6"><v-text-field v-model.number="salaryInput.remboursement" label="Remboursement" type="number" prefix="€" clearable></v-text-field></v-col>
              <v-col cols="12" md="6"><v-text-field v-model.number="salaryInput.ecart" label="Écart" type="number" prefix="€" clearable></v-text-field></v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeSalaryFormDialog">Annuler</v-btn>
          <v-btn color="blue-darken-1" variant="text" @click="confirmAndCalculate">Calculer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

    <!-- Salary Confirmation Dialog -->
     <v-dialog v-model="salaryConfirmDialog" max-width="500px">
      <v-card>
        <v-card-title class="text-h5">Confirmer le calcul</v-card-title>
        <v-card-text>Êtes-vous sûr de vouloir valider ces informations ? Cette action enregistrera le calcul de salaire pour ce mois.</v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="salaryConfirmDialog = false">Annuler</v-btn>
          <v-btn color="green-darken-1" variant="tonal" @click="executeCalculation">Confirmer et Calculer</v-btn>
          <v-spacer></v-spacer>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import { useOperatorsStore, type Operator, type SalaryCalculation } from '@/stores/operators';
import { useSalaryCalculator, type SalaryInput } from '@/composables/useSalaryCalculator';
import { storeToRefs } from 'pinia';
import { useRouter } from 'vue-router';

// --- SETUP ---
const router = useRouter();
const operatorsStore = useOperatorsStore();
const { operators } = storeToRefs(operatorsStore);
const { calculate } = useSalaryCalculator();

// --- TABLE HEADERS ---
const headers = ref([
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Prénom', key: 'prenom' },
  { title: 'Nom', key: 'nom' },
  { title: 'Téléphone', key: 'tel' },
  { title: 'N° Machine', key: 'machineId' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]);

// --- ADD/EDIT DIALOG ---
const editDialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref<Partial<Operator>>({});
const defaultItem: Partial<Operator> = { nom: '', prenom: '', tel: '', machineId: '' };
const formTitle = computed(() => editedIndex.value === -1 ? 'Nouvel opérateur' : 'Modifier l\'opérateur');

function openNewItemDialog() {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem };
  editDialog.value = true;
}

function editItem(item: Operator) {
  editedIndex.value = operators.value.findIndex(o => o.id === item.id);
  editedItem.value = { ...item };
  editDialog.value = true;
}

function closeEditDialog() {
  editDialog.value = false;
  editedItem.value = { ...defaultItem };
  editedIndex.value = -1;
}

function saveItem() {
  if (editedIndex.value > -1) {
    operatorsStore.updateOperator(editedItem.value as Operator);
  } else {
    operatorsStore.addOperator(editedItem.value as Omit<Operator, 'id' | 'salaryHistory'>);
  }
  closeEditDialog();
}

// --- DELETE DIALOG ---
const deleteDialog = ref(false);
const itemToDelete = ref<Operator | null>(null);

function deleteItem(item: Operator) {
  itemToDelete.value = item;
  deleteDialog.value = true;
}

function closeDeleteDialog() {
  deleteDialog.value = false;
  itemToDelete.value = null;
}

function deleteItemConfirm() {
  if (itemToDelete.value) {
    operatorsStore.deleteOperator(itemToDelete.value.id);
  }
  closeDeleteDialog();
}

// --- SALARY CALCULATION ---
const salaryFormDialog = ref(false);
const salaryConfirmDialog = ref(false);
const currentOperator = ref<Operator | null>(null);
const defaultSalaryInput: SalaryInput = {
  chiffreAffaireMensuel: 0,
  dette: undefined,
  penalite: undefined,
  remboursement: undefined,
  ecart: undefined,
};
const salaryInput = ref<SalaryInput>({ ...defaultSalaryInput });

const calculatedAIB = computed(() => {
  const ca = salaryInput.value.chiffreAffaireMensuel || 0;
  const chiffreAffaireFinal = ca / 1.10;
  const chiffreAffaireHorsTaxe = chiffreAffaireFinal * 0.06;
  return chiffreAffaireHorsTaxe * 0.05;
});

function openSalaryForm(item: Operator) {
  currentOperator.value = item;
  salaryInput.value = { ...defaultSalaryInput }; // Reset form
  salaryFormDialog.value = true;
}

function closeSalaryFormDialog() {
  salaryFormDialog.value = false;
  currentOperator.value = null;
}

function confirmAndCalculate() {
  if ((salaryInput.value.chiffreAffaireMensuel || 0) <= 0) {
    alert("Le Chiffre d'Affaire Mensuel doit être supérieur à 0.");
    return;
  }
  salaryConfirmDialog.value = true;
}

function executeCalculation() {
  if (!currentOperator.value) return;

  const calculationResult = calculate(salaryInput.value);

  const finalRecord: SalaryCalculation = {
    ...calculationResult,
    operatorName: `${currentOperator.value.prenom} ${currentOperator.value.nom}`,
    calculationDate: new Date().toISOString(),
  };

  operatorsStore.addSalaryRecord(currentOperator.value.id, finalRecord);

  salaryConfirmDialog.value = false;
  closeSalaryFormDialog();

  viewItemDetails(currentOperator.value);
}

// --- NAVIGATION ---
function viewItemDetails(item: Operator) {
  router.push({ name: 'operateur-details', params: { id: item.id } });
}
</script>

<style scoped>
h1 {
  font-weight: 300;
}
</style>
