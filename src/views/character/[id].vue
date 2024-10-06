<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-buttons slot="start">
            <ion-back-button defaultHref="/tabs/tab4"></ion-back-button>
          </ion-buttons>
          <ion-title>{{ character?.name }}</ion-title>
        </ion-toolbar>
      </ion-header>
  
      <ion-content :fullscreen="true">
        <ion-card v-if="character">
          <ion-card-header>
            <ion-button shape="round" color="dark" size="default" @click="router.back()">Volver</ion-button>
            <ion-card-title>{{ character.name }}</ion-card-title>
          </ion-card-header>
          <ion-card-content>
            <ion-grid>
              <ion-row>
                <ion-col size="12" class="ion-text-center">
                  <ion-avatar>
                    <img :src="character.image" alt="Imagen del personaje" />
                  </ion-avatar>
                </ion-col>
              </ion-row>
              <ion-row>
                <ion-col size="12">
                  <h2>Estado: {{ character.status }}</h2>
                  <h3>Especie: {{ character.species }}</h3>
                  <h3>Género: {{ character.gender }}</h3>
                  <h3>Origen: {{ character.origin.name }}</h3>
                  <h3>Ubicación actual: {{ character.location.name }}</h3>
                </ion-col>
              </ion-row>
            </ion-grid>
          </ion-card-content>
        </ion-card>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import router from '@/router';
  
  interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    type: string;
    gender: string;
    origin: {
      name: string;
    };
    location: {
      name: string;
    };
    image: string;
  }
  
  const character = ref<Character | null>(null);

  const route = useRoute();
  const characterId = route.params.id;

  const loadCharacter = async () => {
    try {
      const response = await axios.get(`https://rickandmortyapi.com/api/character/${characterId}`);
      character.value = response.data;
    } catch (error) {
      console.error("Error al cargar el personaje:", error);
    }
  };

  onMounted(() => {
    loadCharacter();
  });
  </script>
  
  <style scoped>
  ion-content {
    --background: #62a4ab;
  }
  
  ion-card-title {
    font-size: 2rem;
    color: #333;
  }
  
  ion-avatar img {
    border-radius: 50%;
    max-width: 150px;
    margin: 0 auto;
  }
  
  h2, h3 {
    margin: 10px 0;
    font-size: 1.2rem;
    color: #555;
  }
  
  ion-toolbar {
    --background: #62a4ab;
    --color: #97ce4c;
  }
  </style>
