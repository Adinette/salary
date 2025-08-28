<template>
  <v-container fluid>
    <h1 class="mb-6">Mes machines</h1>
    <v-row>
      <v-col
        v-for="machine in machines"
        :key="machine.id"
        cols="12"
        sm="6"
        md="4"
        lg="3"
      >
        <v-card>
          <v-img
            :src="`https://picsum.photos/seed/${machine.id}/300/200`"
            height="200px"
            cover
          ></v-img>

          <v-card-title>{{ machine.name }}</v-card-title>

          <v-card-subtitle>
            <v-chip :color="getStatusColor(machine.status)" size="small">
              {{ machine.status }}
            </v-chip>
          </v-card-subtitle>

          <v-card-text>
            {{ machine.description }}
          </v-card-text>

          <v-card-actions>
            <v-spacer></v-spacer>
            <v-btn color="primary" variant="tonal">Détails</v-btn>
            <v-btn color="secondary" variant="tonal">Contrôler</v-btn>
          </v-card-actions>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
import { ref } from 'vue';

const machines = ref([
  { id: 1, name: 'Presse Hydraulique A', status: 'En marche', description: 'Presse principale pour les pièces de type A.' },
  { id: 2, name: 'Robot Soudeur B1', status: 'En attente', description: 'Robot de soudure sur la ligne B.' },
  { id: 3, name: 'Convoyeur C3', status: 'En marche', description: 'Convoyeur principal de la section C.' },
  { id: 4, name: 'Presse Hydraulique B', status: 'En panne', description: 'Presse secondaire pour les pièces de type B.' },
  { id: 5, name: 'Robot Peintre A2', status: 'En marche', description: 'Unité de peinture pour la finition.' },
  { id: 6, name: 'Centre d\'usinage D1', status: 'Maintenance', description: 'Centre d\'usinage 5 axes.' },
]);

function getStatusColor(status: string) {
  switch (status) {
    case 'En marche': return 'green';
    case 'En panne': return 'red';
    case 'Maintenance': return 'orange';
    default: return 'grey';
  }
}
</script>

<style scoped>
h1 {
  font-weight: 300;
}
</style>
