<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Detalles del Episodio</ion-title>
        <ion-buttons slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Detalles del Episodio</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-header>
          <ion-card-title>Nombre: {{ episodeData?.name }}</ion-card-title>
          <ion-card-subtitle>Temporada: {{ episodeData?.episode.substring(1, 3) }}</ion-card-subtitle>
          <ion-card-subtitle>Episodio: {{ episodeData?.episode.substring(4, 6) }}</ion-card-subtitle>
          <ion-card-subtitle>Fecha de salida: {{ episodeData?.air_date }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-list>
            <h1>Personajes</h1>
            <ion-item v-for="character in charactersList" :key="character.id" button
              :href="`/character/${character.id}`">
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
import { IonPage, IonButtons, IonBackButton, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

const route = useRoute();

interface Character {
  id: number;
  name: string;
  image: string;
}


const charactersList = ref<Character[]>([]);

const episodeApiLink = 'https://rickandmortyapi.com/api/episode/' + route.params.id;

const episodeData = ref<Episode | null>(null);

const episodePage = ref<string | null>(episodeApiLink);


const loadEpisode = async () => {
  if (episodePage.value) {
    const response = await axios.get(episodePage.value);
    const result: Episode = response.data;
    episodeData.value = result;
    loadCharacters(episodeData.value.characters);
  }
};

const loadCharacters = async (characters: string[]) => {
  characters.forEach(async (character) => {
    const response = await axios.get(character);
    const result: Character = response.data;
    charactersList.value.push(result);
  });

};

onMounted(() => {
  loadEpisode();
});
</script>

<style scoped>
.schwifty-title {
  font-family: 'GetSchwifty', sans-serif;
  font-size: 3rem;
}
</style>
