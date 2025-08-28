<template>
  <v-container fluid>
    <div v-if="operator">
      <h1 class="mb-2">Détails pour {{ operator.prenom }} {{ operator.nom }}</h1>
      <v-btn prepend-icon="mdi-arrow-left" variant="text" @click="goBack">Retour à la liste</v-btn>

      <v-row class="mt-4">
        <!-- Operator Info Card -->
        <v-col cols="12" md="4">
          <v-card>
            <v-card-title>Informations Personnelles</v-card-title>
            <v-list>
              <v-list-item :title="operator.prenom + ' ' + operator.nom" subtitle="Nom complet"></v-list-item>
              <v-list-item :title="operator.tel" subtitle="Téléphone"></v-list-item>
              <v-list-item :title="operator.machineId" subtitle="N° Machine"></v-list-item>
            </v-list>
          </v-card>
        </v-col>

        <!-- Salary History Card -->
        <v-col cols="12" md="8">
          <v-card>
            <v-card-title>Historique des 3 Derniers Salaires</v-card-title>
            <v-card-text v-if="operator.salaryHistory.length === 0">
              Aucun calcul de salaire enregistré pour cet opérateur.
            </v-card-text>
            <v-expansion-panels v-else>
              <v-expansion-panel
                v-for="(record, index) in operator.salaryHistory"
                :key="index"
                :title="`Calcul du ${new Date(record.calculationDate).toLocaleDateString('fr-FR')}`"
              >
                <v-expansion-panel-text>
                  <v-list density="compact">
                    <v-list-item title="Salaire / Commission Brute" :subtitle="currencyFormatter.format(record.salaireBrut)" class="font-weight-bold"></v-list-item>
                    <v-divider class="my-2"></v-divider>
                    <v-list-item title="Base de Commission" :subtitle="currencyFormatter.format(record.chiffreAffaireHorsTaxe)"></v-list-item>
                    <v-list-item title="Total des Prélèvements" :subtitle="currencyFormatter.format(record.totalPrelevements)"></v-list-item>
                  </v-list>
                </v-expansion-panel-text>
              </v-expansion-panel>
            </v-expansion-panels>
          </v-card>
        </v-col>
      </v-row>

    </div>
    <div v-else>
      <v-alert type="error">
        Opérateur non trouvé.
      </v-alert>
    </div>
  </v-container>
</template>

<script setup lang="ts">
import { useOperatorsStore, type Operator } from '@/stores/operators';
import { useRoute, useRouter } from 'vue-router';
import { computed } from 'vue';

// --- SETUP ---
const route = useRoute();
const router = useRouter();
const operatorsStore = useOperatorsStore();

// --- DATA ---
const operatorId = computed(() => parseInt(route.params.id as string, 10));
const operator = computed<Operator | undefined>(() =>
  operatorsStore.operators.find(o => o.id === operatorId.value)
);

// --- UTILITIES ---
const currencyFormatter = new Intl.NumberFormat('fr-FR', {
  style: 'currency',
  currency: 'EUR',
});

// --- ACTIONS ---
function goBack() {
  router.push({ name: 'operateurs' });
}
</script>

<style scoped>
h1 {
  font-weight: 300;
}
</style>
