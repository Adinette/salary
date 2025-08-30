<template>
  <v-container>
    <h1>Home Page</h1>
    <p>Welcome to the Vuetify-powered home page!</p>
    <v-btn color="primary" class="mt-4" @click="store.increment()">
      Click me! Count is: {{ store.count }}
    </v-btn>
  </v-container>
</template>

<script setup lang="ts">
import { useCounterStore } from '@/stores/counter'

const store = useCounterStore()
</script>
