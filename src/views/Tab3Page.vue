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
          <ion-title size="large" class="schwifty-title">Personajes</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-searchbar color="light" v-model="searchQuery" :debounce="500" @ionInput="filterEpisodes"
        placeholder="Buscar episodios..."></ion-searchbar>
      <ion-list>
        <ion-item v-for="episode in episodes" :key="episode.id" button :href="`/episode/${episode.id}`">
          <ion-avatar slot="start">
          </ion-avatar>
          <ion-label>
            <h2>{{ episode.name }}</h2>
            <h3>{{ episode.episode }}</h3>
          </ion-label>
        </ion-item>
      </ion-list>


    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent,IonSearchbar, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

const episodes = ref<Episode[]>([]);
const nextPage = ref<string | null>('https://rickandmortyapi.com/api/episode');
const searchQuery = ref('');  


const loadEpisodes = async () => {
  if (nextPage.value) {
    const response = await axios.get(nextPage.value);
    const results: Episode[] = response.data.results;
    
    results.forEach((episode) => {
      if (episode.name.toLowerCase().includes(searchQuery.value.toLowerCase())) {
        episodes.value.push(episode);
      }
    });
    
    if (response.data.info.next) {
      nextPage.value = response.data.info.next;
      loadEpisodes();
    }
    
  }
};

const filterEpisodes = () => {
  episodes.value = [];
  nextPage.value = 'https://rickandmortyapi.com/api/episode';
  loadEpisodes();
};



onMounted(() => {
  loadEpisodes();
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

ion-select {
  margin: 10px;
  --background: #fffeef;
  --color: #000000;
}
</style>

