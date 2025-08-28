<script setup lang="ts">
import { ref } from 'vue'
import { RouterView } from 'vue-router'

const drawer = ref(true)

const navItems = [
  { title: 'Dashboard', icon: 'mdi-view-dashboard', to: '/' },
  { title: 'Opérateurs', icon: 'mdi-account-group', to: '/operateurs' },
  { title: 'Mes machines', icon: 'mdi-robot-industrial', to: '/machines' },
]
</script>

<template>
  <v-app id="inspire">
    <v-navigation-drawer v-model="drawer">
      <v-list>
        <v-list-item
          v-for="item in navItems"
          :key="item.title"
          :to="item.to"
          :title="item.title"
          :prepend-icon="item.icon"
          link
        ></v-list-item>
      </v-list>
    </v-navigation-drawer>

    <v-app-bar>
      <v-app-bar-nav-icon @click="drawer = !drawer"></v-app-bar-nav-icon>
      <v-app-bar-title>Mon Tableau de Bord</v-app-bar-title>
    </v-app-bar>

    <v-main>
      <v-container fluid>
        <RouterView />
      </v-container>
    </v-main>
  </v-app>
</template>

<style scoped>
/* Scoped styles can be added here if needed */
</style>
