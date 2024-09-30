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
        <div class="graph-container" id="legraph"></div>
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSearchbar, IonList, IonItem, IonAvatar, IonLabel } from '@ionic/vue';

import { Result, Root } from '@/characters-root';
import { ActionSheetButton } from '@ionic/vue';
import { Network, Data, Edge, Node, Options, DataSet } from "vis-network/standalone";
import { add } from 'ionicons/icons';

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

interface Character {
  id: number;
  image: string;
  name: string;
}

const episodes = ref<Episode[]>([]);
const nextPage = ref<string | null>('https://rickandmortyapi.com/api/episode');
const searchQuery = ref('');

const nodes = new DataSet<Node>([]);
const edges = new DataSet<Edge>([]);

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

const loadCharacter = async (characterUrl: string) => {

  const result: Character = await axios.get(characterUrl);

  return { result };
}

const filterEpisodes = () => {
  episodes.value = [];
  nextPage.value = 'https://rickandmortyapi.com/api/episode';
  loadEpisodes();
};

async function prepareGraph() {
  for (const element of episodes.value) {
    for (const characterUrl of element.characters) {
      const character = (await loadCharacter(characterUrl)).result;
      nodes.update({
        id: `character-${element.id}`,
        image: character.image,
        shape: "circularImage",
        label: character.name,
      });
      nodes.update({
        id: element.id,
        color: '#cccccc',
        shape: "square",
        label: element.name,
      });
      edges.update({
        to: `character-${character.id}`,
        from: element.id,
      } as Edge);
    }
  }
}

onMounted(async () => {
  await loadEpisodes();
  await prepareGraph();
  const container = document.getElementById("legraph") as HTMLElement;
  const data: Data = {
    nodes: nodes,
    edges: edges,
  };
  const options: Options = {
    autoResize: false,
  };
  new Network(container, data, options);
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

.graph-container {
  width: 100%;
  height: 100%;
}

</style>