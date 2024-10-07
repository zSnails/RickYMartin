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
          <h1>Amigos</h1>
          <div class="graph-container" :id="`character-relation-graph-root-${params.id}`"></div>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { Network, Data, Edge, Node, Options, DataSet } from "vis-network/standalone";
import { Root } from '@/character-details';
import { IonPage, IonCard, IonHeader, IonContent, IonTitle, IonToolbar, IonButtons, IonBackButton, useIonRouter } from '@ionic/vue';
import axios from "axios";
import { onBeforeUnmount, onMounted, ref } from "vue";
import { useRoute } from 'vue-router';
import { sleep } from "@supabase/auth-js/dist/module/lib/helpers";

const { params } = useRoute();

const nodes = new DataSet<Node>([]);
const edges = new DataSet<Edge>([]);
const { push } = useIonRouter();

const character = ref<Root | null>(null);

const network = ref<Network | null>();

interface Location {
  id: number
  name: string
  type: string
  dimension: string
  residents: string[]
  url: string
  created: string
}

const seenCharacters: Record<string, boolean> = {};

const fetchCharacter = async (rootId: number, char: string) => {
  const { data: character } = await axios.get<Root>(char);
  if (character.id === rootId) return;
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

const fetchLocation = async (rootId: number, location: string) => {
  const { data: episode } = await axios.get<Location>(location);
  for (const resident of episode.residents) {
    if (Object.hasOwn(seenCharacters, resident)) continue;
    fetchCharacter(rootId, resident);
    seenCharacters[resident] = true;
    await sleep(1000);
  }
};

axios.get<Root>(`https://rickandmortyapi.com/api/character/${params.id}`).then(async ({ data: char }) => {

  character.value = char;
  nodes.update({
    id: char.id,
    image: char.image,
    shape: "circularImage",
    label: char.name,
  });

  fetchLocation(char.id, char.location.url);

  while (network.value === null);

  network.value?.focus(char.id);
});


onMounted(async () => {
  const container = document.getElementById(`character-relation-graph-root-${params.id}`) as HTMLElement;
  const data: Data = {
    nodes: nodes,
    edges: edges,
  };
  const options: Options = {
    autoResize: false,
    height: "600px",
  };
  network.value = new Network(container, data, options);
  network.value.on("selectNode", (selected) => {
    if (selected.nodes[0] === parseInt(params.id as string)) return;
    push(`/character/${selected.nodes[0]}`);
  })
});

onBeforeUnmount(() => {
  network.value?.destroy();
})
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
