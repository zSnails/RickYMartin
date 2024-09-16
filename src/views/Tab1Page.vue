<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Personajes Rick and Morty</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large">Personajes</ion-title>
          </ion-toolbar>
        </ion-header>
  
        <!-- Lista de personajes con scroll habilitado -->
        <ion-list>
          <ion-item
            v-for="character in characters"
            :key="character.id"
            button
            routerLink="/character-details"
          >
            <ion-avatar slot="start">
              <img :src="character.image" alt="character image" />
            </ion-avatar>
            <ion-label>
              <h2>{{ character.name }}</h2>
              <p :style="getStatusColor(character.status)">
                {{ getStatusText(character.status) }}
              </p>
            </ion-label>
          </ion-item>
        </ion-list>
      </ion-content>
    </ion-page>
  </template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/vue';
import axios from 'axios';

// Estados para manejar personajes y la paginación
const characters = ref([]);
const nextPage = ref<string | null>('https://rickandmortyapi.com/api/character');

// Función para cargar personajes desde la API
const loadCharacters = async () => {
  if (nextPage.value) {
    const response = await axios.get(nextPage.value);
    characters.value.push(...response.data.results);
    nextPage.value = response.data.info.next; // Actualizamos el siguiente enlace para cargar más personajes
  }
};

// Cargar personajes al montar el componente
onMounted(() => {
  loadCharacters();
});

// Función para obtener el texto de estado en español
const getStatusText = (status: string) => {
  if (status === 'Alive') return 'Vivo';
  if (status === 'Dead') return 'Muerto';
  return 'Desaparecido';
};

// Función para obtener el color basado en el estado
const getStatusColor = (status: string) => {
  if (status === 'Alive') return { color: 'green' };
  if (status === 'Dead') return { color: 'red' };
  return { color: 'yellow' }; // Color para "Desaparecido"
};
</script>
