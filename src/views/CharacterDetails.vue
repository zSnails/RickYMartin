<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons defaultHref="/home" slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Detalles del Personaje</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Detalles del Personaje</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-card>
        <ion-card-header v-if="character">
          <ion-avatar>
            <img :src="character.image" alt="">
          </ion-avatar>
          <ion-card-title>Nombre: {{ character.name }}</ion-card-title>
          <ion-card-subtitle>Ubicación: {{ character.location.name }}</ion-card-subtitle>
          <span class="biological-info">
            <ion-card-subtitle>{{ character.gender }}</ion-card-subtitle>
            -
            <ion-card-subtitle>{{ character.species }}</ion-card-subtitle>
            -
            <ion-card-subtitle>{{ character.status }}</ion-card-subtitle>
          </span>
        </ion-card-header>
        <ion-card-content class="h-fit">
          <div class="graph-container" id="character-relation-graph"></div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { Network, Data, Edge, Node, Options, DataSet } from "vis-network/standalone";
import { Root } from '@/character-details';
import { IonPage, IonCard, IonHeader, IonContent, IonTitle, IonToolbar, IonButtons, IonBackButton } from '@ionic/vue';
import axios from "axios";
import { onMounted, ref } from "vue";
import { useRoute } from 'vue-router';

const { params } = useRoute();

const nodes = new DataSet<Node>([]);
const edges = new DataSet<Edge>([]);

const character = ref<Root | null>(null);

const network = ref<Network | null>();

interface Episode {
  id: number
  name: string
  air_date: string
  episode: string
  characters: string[]
  url: string
  created: string
}

const fetchCharacter = async (rootId: number, char: string) => {
  const { data: character } = await axios.get<Root>(char);
  nodes.update({
    id: character.id,
    image: character.image,
    shape: "circularImage",
    label: character.name,
  });
  edges.update({
    id: `${character.id}-${rootId}`,
    from: character.id,
    to: rootId
  });
};

const fetchEpisode = async (rootId: number, ep: string) => {
  const { data: episode } = await axios.get<Episode>(ep);
  for (const character of episode.characters) {
    fetchCharacter(rootId, character);
    await sleep(1000);
  }
};

axios.get<Root>(`https://rickandmortyapi.com/api/character/${params.id}`).then(({ data: char }) => {

  character.value = char;
  nodes.update({
    id: char.id,
    image: char.image,
    shape: "circularImage",
    label: char.name,
  });

  for (const episode of char.episode) {
    fetchEpisode(char.id, episode);
  }

  network.value?.focus(char.id);
});

function sleep(ms: number) {
    return new Promise(resolve => setTimeout(resolve, ms));
}


onMounted(async () => {
  const container = document.getElementById("character-relation-graph") as HTMLElement;
  const data: Data = {
    nodes: nodes,
    edges: edges,
  };
  const options: Options = {
    autoResize: false,
    height: "600px"
  };
  network.value = new Network(container, data, options);
});
</script>
<style scoped>
.biological-info {
  display: flex;
  flex-direction: row;
  gap: 1ch;
}

.graph-container {
  width: 100%;
  height: 100%;
}

.h-fit {
  min-height: fit-content;
}
</style>
