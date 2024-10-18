<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Detalles de la Ubicación</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Detalles de la Ubicación</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card v-if="location">
        <ion-card-header>
          <!-- <ion-button shape="round" color="dark" size="default" @click="back()">Volver</ion-button> -->
          <ion-card-title>Nombre: {{ location?.name }}</ion-card-title>
          <ion-card-subtitle>Tipo: {{ location?.type }}</ion-card-subtitle>
          <ion-card-subtitle>Dimensión: {{ location?.dimension }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <h1>Residentes</h1>
          <ion-list>
            <ion-item target="_top" v-for="character in charactersList" button :key="character.id"
              @click="push(`/character/${character.id}`)">
              <ion-avatar slot="start">
                <img :src="character.image" alt="character image" />
              </ion-avatar>
              <ion-label>
                <h2>{{ character.name }}</h2>
              </ion-label>
            </ion-item>
          </ion-list>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { useIonRouter, IonPage, IonHeader, IonToolbar, IonBackButton, IonButtons } from '@ionic/vue';

const { push, back } = useIonRouter();

interface Location {
  id: number;
  name: string;
  type: string;
  dimension: string;
  residents: string[];
}

interface Character {
  id: number;
  name: string;
  image: string;
}

const location = ref<Location | null>(null);
const charactersList = ref<Character[]>([]);

const route = useRoute();
const locationId = route.params.id;

const loadLocation = async () => {
  try {
    const response = await axios.get(`https://rickandmortyapi.com/api/location/${locationId}`);
    location.value = response.data;
    if (location.value) {
      loadCharacters(location.value.residents);
    }
  } catch (error) {
    console.error("Error al cargar la location:", error);
  }
};

const loadCharacters = async (residents: string[]) => {
  try {
    const requests = residents.map((residentUrl) => axios.get(residentUrl));
    const responses = await Promise.all(requests);
    charactersList.value = responses.map((res) => res.data);
  } catch (error) {
    console.error("Error al cargar los personajes:", error);
  }
};

onMounted(() => {
  loadLocation();
});
</script>

<style scoped>
ion-content {
  --background: #62a4ab;
}

ion-item {
  --background: #fffeef;
  --color: #000000;
}

ion-toolbar {
  --background: #62a4ab;
  --color: #97ce4c;
}

.schwifty-title {
  font-family: 'GetSchwifty', sans-serif;
  font-size: 3rem;
}
</style>
