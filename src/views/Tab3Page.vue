<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Grafo de Episodios</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Episodes Graph</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="graph-container" id="episode-graph"></div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, useIonRouter } from '@ionic/vue';

import { Network, Data, Edge, Node, Options, DataSet } from "vis-network/standalone";

interface Episode {
  id: number;
  name: string;
  air_date: string;
  episode: string;
  characters: string[];
}

interface Character {
  data: any;
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

async function prepareGraph() {
  let contEpisodes = 0;
  for (const element of episodes.value) {
    let contCharacters = 0;
    for (const characterUrl of element.characters) {
      const character = (await loadCharacter(characterUrl)).result;
      nodes.update({
        id: `character-${element.id}-${character.data.id}`,
        image: character.data.image,
        shape: "circularImage",
        label: character.data.name,
      });
      nodes.update({
        id: `episode-${element.id}`,
        color: '#cccccc',
        shape: "square",
        label: element.name,
      });
      edges.update({
        to: `character-${element.id}-${character.data.id}`,
        from: `episode-${element.id}`,
      } as Edge);
      contCharacters++;
      if (contCharacters > 6) {
        break;
      }
    }
    contEpisodes++;
    if (contEpisodes > 15) {
      break;
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
  const network = new Network(container, data, options);

  network.on("selectNode", function (params) {
    const selectedNodeId = params.nodes[0];


    if (selectedNodeId.startsWith('character-')) {
      //const characterId = selectedNodeId.split('-')[2];
      //window.location.href = `/character/${characterId}`;
      //Not implemented yet
    } else if (selectedNodeId.startsWith('episode-')) {
      const episodeId = selectedNodeId.split('-')[1];
      window.location.href = `/episode/${episodeId}`;
    }
  });

});


</script>
<style scoped>
.graph-container {
  width: 100%;
  height: 100%;
}
</style>
