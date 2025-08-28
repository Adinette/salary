<template>
  <v-container fluid>
    <h1 class="mb-6">Opérateurs</h1>
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
      >
        <template v-slot:item.status="{ value }">
          <v-chip :color="getStatusColor(value)">
            {{ value }}
          </v-chip>
        </template>
        <template v-slot:item.chiffreAffaireMensuel="{ value }">
          {{ currencyFormatter.format(value) }}
        </template>
        <template v-slot:item.autresPrelevements="{ value }">
          {{ currencyFormatter.format(value) }}
        </template>
        <template v-slot:item.actions="{ item }">
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
          <v-tooltip location="top" text="Calculer le salaire">
            <template v-slot:activator="{ props }">
              <v-btn icon="mdi-currency-usd" v-bind="props" variant="text" density="compact" @click="calculateSalary(item)"></v-btn>
            </template>
          </v-tooltip>
        </template>
      </v-data-table>
    </v-card>

    <!-- Add/Edit Dialog -->
    <v-dialog v-model="dialog" max-width="600px" persistent>
      <v-card>
        <v-card-title>
          <span class="text-h5">{{ formTitle }}</span>
        </v-card-title>
        <v-card-text>
          <v-container>
            <v-row>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.name" label="Nom"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model="editedItem.role" label="Poste"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="editedItem.chiffreAffaireMensuel" label="CA Mensuel" type="number" prefix="€"></v-text-field>
              </v-col>
              <v-col cols="12" sm="6">
                <v-text-field v-model.number="editedItem.autresPrelevements" label="Autres Prélèvements" type="number" prefix="€"></v-text-field>
              </v-col>
            </v-row>
          </v-container>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="closeDialog">Annuler</v-btn>
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

    <!-- Salary Calculation Dialog -->
    <v-dialog v-model="salaryDialog" max-width="600px">
      <v-card v-if="salaryCalculationResult">
        <v-card-title>
          <span class="text-h5">Calcul du Salaire pour {{ salaryCalculationResult.operatorName }}</span>
        </v-card-title>
        <v-card-text>
          <v-list lines="two">
            <v-list-item title="Chiffre d'Affaire Mensuel" :subtitle="currencyFormatter.format(salaryCalculationResult.chiffreAffaireMensuel)"></v-list-item>
            <v-list-item title="Chiffre d'Affaire Final (CA / 1.10)" :subtitle="currencyFormatter.format(salaryCalculationResult.chiffreAffaireFinal)"></v-list-item>
            <v-list-item title="Base de Commission (CA Final * 6%)" :subtitle="currencyFormatter.format(salaryCalculationResult.chiffreAffaireHorsTaxe)"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-subheader>Prélèvements</v-list-subheader>
            <v-list-item title="FEL (fixe)" :subtitle="currencyFormatter.format(salaryCalculationResult.fel)"></v-list-item>
            <v-list-item title="AIB (5% de la Base de Commission)" :subtitle="currencyFormatter.format(salaryCalculationResult.aib)"></v-list-item>
            <v-list-item title="Autres Prélèvements" :subtitle="currencyFormatter.format(salaryCalculationResult.autresPrelevements)"></v-list-item>
            <v-list-item class="font-weight-bold" title="Total des Prélèvements" :subtitle="currencyFormatter.format(salaryCalculationResult.totalPrelevements)"></v-list-item>
            <v-divider class="my-2"></v-divider>
            <v-list-item class="text-h6" title="Salaire / Commission Brute" :subtitle="currencyFormatter.format(salaryCalculationResult.salaireBrut)" color="primary"></v-list-item>
          </v-list>
        </v-card-text>
        <v-card-actions>
          <v-spacer></v-spacer>
          <v-btn color="blue-darken-1" variant="text" @click="salaryDialog = false">Fermer</v-btn>
        </v-card-actions>
      </v-card>
    </v-dialog>

  </v-container>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

// --- TYPE DEFINITIONS ---
interface Operator {
  id: number;
  name: string;
  role: string;
  status: string;
  chiffreAffaireMensuel: number;
  autresPrelevements: number;
}

interface SalaryCalculation {
  operatorName: string;
  chiffreAffaireMensuel: number;
  chiffreAffaireFinal: number;
  chiffreAffaireHorsTaxe: number;
  fel: number;
  aib: number;
  autresPrelevements: number;
  totalPrelevements: number;
  salaireBrut: number;
}

// --- UTILITIES ---
const currencyFormatter = new Intl.NumberFormat('fr-FR', { style: 'currency', currency: 'EUR' });
function getStatusColor(status: string) {
  if (status === 'Actif') return 'green';
  if (status === 'Inactif') return 'red';
  return 'orange';
}

// --- DATA ---
const headers = ref([
  { title: 'ID', key: 'id', align: 'start' },
  { title: 'Nom', key: 'name' },
  { title: 'Poste', key: 'role' },
  { title: 'Statut', key: 'status' },
  { title: 'CA Mensuel', key: 'chiffreAffaireMensuel', align: 'end' },
  { title: 'Autres Prélèvements', key: 'autresPrelevements', align: 'end' },
  { title: 'Actions', key: 'actions', sortable: false, align: 'center' },
]);

const operators = ref<Operator[]>([
  { id: 1, name: 'Jean Dupont', role: 'Opérateur de ligne', status: 'Actif', chiffreAffaireMensuel: 35000, autresPrelevements: 150 },
  { id: 2, name: 'Marie Curie', role: 'Superviseur', status: 'Actif', chiffreAffaireMensuel: 55000, autresPrelevements: 0 },
  { id: 3, name: 'Pierre Martin', role: 'Opérateur de ligne', status: 'Inactif', chiffreAffaireMensuel: 0, autresPrelevements: 0 },
  { id: 4, name: 'Sophie Lemoine', role: 'Maintenance', status: 'Actif', chiffreAffaireMensuel: 42000, autresPrelevements: 50 },
  { id: 5, name: 'Lucas Petit', role: 'Opérateur de ligne', status: 'En pause', chiffreAffaireMensuel: 15000, autresPrelevements: 200 },
  { id: 6, name: 'Camille Dubois', role: 'Superviseur', status: 'Actif', chiffreAffaireMensuel: 61000, autresPrelevements: 100 },
]);

// --- ADD/EDIT DIALOG STATE & LOGIC ---
const dialog = ref(false);
const editedIndex = ref(-1);
const editedItem = ref<Partial<Operator>>({ name: '', role: '', status: 'Actif', chiffreAffaireMensuel: 0, autresPrelevements: 0 });
const defaultItem = ref<Partial<Operator>>({ name: '', role: '', status: 'Actif', chiffreAffaireMensuel: 0, autresPrelevements: 0 });
const formTitle = computed(() => editedIndex.value === -1 ? 'Nouvel opérateur' : 'Modifier l\'opérateur');

function openNewItemDialog() {
  editedIndex.value = -1;
  editedItem.value = { ...defaultItem.value };
  dialog.value = true;
}

function closeDialog() {
  dialog.value = false;
  editedItem.value = { ...defaultItem.value };
  editedIndex.value = -1;
}

function saveItem() {
  if (editedIndex.value > -1) {
    Object.assign(operators.value[editedIndex.value], editedItem.value);
  } else {
    const newId = operators.value.length > 0 ? Math.max(...operators.value.map(op => op.id)) + 1 : 1;
    operators.value.push({ ...editedItem.value, id: newId, status: 'Actif' } as Operator);
  }
  closeDialog();
}

// --- DELETE DIALOG STATE & LOGIC ---
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
    const index = operators.value.findIndex(op => op.id === itemToDelete.value!.id);
    if (index > -1) {
      operators.value.splice(index, 1);
    }
  }
  closeDeleteDialog();
}

// --- ACTIONS LOGIC ---
function editItem(item: Operator) {
  editedIndex.value = operators.value.indexOf(item);
  editedItem.value = { ...item };
  dialog.value = true;
}

// --- SALARY CALCULATION STATE & LOGIC ---
const salaryDialog = ref(false);
const salaryCalculationResult = ref<SalaryCalculation | null>(null);

function calculateSalary(item: Operator) {
  const chiffreAffaireFinal = item.chiffreAffaireMensuel / 1.10;
  const chiffreAffaireHorsTaxe = chiffreAffaireFinal * 0.06;
  const FEL = 2500;
  const AIB = chiffreAffaireHorsTaxe * 0.05;
  const totalPrelevements = FEL + AIB + item.autresPrelevements;
  const salaireBrut = chiffreAffaireHorsTaxe - totalPrelevements;
  salaryCalculationResult.value = {
    operatorName: item.name,
    chiffreAffaireMensuel: item.chiffreAffaireMensuel,
    chiffreAffaireFinal,
    chiffreAffaireHorsTaxe,
    fel: FEL,
    aib: AIB,
    autresPrelevements: item.autresPrelevements,
    totalPrelevements,
    salaireBrut,
  };
  salaryDialog.value = true;
}
</script>

<style scoped>
h1 {
  font-weight: 300;
}
</style>
