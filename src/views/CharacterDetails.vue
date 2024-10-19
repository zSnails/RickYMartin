<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons defaultHref="/tabs/tab1" slot="start">
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>{{ character?.name }}</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">{{ character?.name }}</ion-title>
        </ion-toolbar>
      </ion-header>

      <ion-card>
        <ion-card-header v-if="character">
          <ion-card-title>{{ character.name }}</ion-card-title>
          <ion-avatar>
            <img :src="character.image" alt="Imagen del personaje" />
          </ion-avatar>
          <h2>Estado: {{ character.status }}</h2>
          <h3>Especie: {{ character.species }}</h3>
          <h3>Género: {{ character.gender }}</h3>
          <h3>Origen: {{ character.origin.name }}</h3>
          <h3>Ubicación actual: {{ character.location.name }}</h3>
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
import { useCacheStore } from "@/cache";

const { params } = useRoute();
const { fetchCharacter } = useCacheStore();

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

const fc = async (rootId: number, char: string) => {
  //const { data: character } = await axios.get<Root>(char);
  const character = await fetchCharacter(char);
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
    fc(rootId, resident);
    seenCharacters[resident] = true;
    await sleep(1000);
  }
};

fetchCharacter(`https://rickandmortyapi.com/api/character/${params.id}`).then(async (char) => {

  character.value = char;
  nodes.update({
    id: char.id,
    image: char.image,
    shape: "circularImage",
    label: char.name,
  });

  network.value?.focus(char.id);

  fetchLocation(char.id, char.location.url); // BUG: after leaving the page there is still a process fetching characters in the background
});


onMounted(async () => {
  const elemid = `character-relation-graph-root-${params.id}`;
  const container = document.getElementById(elemid) as HTMLElement;
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
