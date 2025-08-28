<template>
  <v-container fluid>
    <h1 class="mb-6">Dashboard</h1>

    <v-row>
      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4">12</div>
              <div class="text-subtitle-1">Opérateurs Actifs</div>
            </div>
            <v-icon size="48" color="primary">mdi-account-group</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4">28</div>
              <div class="text-subtitle-1">Machines en Ligne</div>
            </div>
            <v-icon size="48" color="success">mdi-robot-industrial</v-icon>
          </v-card-text>
        </v-card>
      </v-col>

      <v-col cols="12" md="4">
        <v-card>
          <v-card-text class="d-flex justify-space-between align-center">
            <div>
              <div class="text-h4">3</div>
              <div class="text-subtitle-1">Alertes Récentes</div>
            </div>
            <v-icon size="48" color="error">mdi-alert-circle</v-icon>
          </v-card-text>
        </v-card>
      </v-col>
    </v-row>
  </v-container>
</template>

<script setup lang="ts">
// No script logic needed for this static view
</script>

<style scoped>
h1 {
  font-weight: 300;
}
</style>
