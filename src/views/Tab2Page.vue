<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title>Character Homeworld Graph</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Character Homeworld Graph</ion-title>
        </ion-toolbar>
      </ion-header>
      <div class="graph-container" id="legraph"></div>
    </ion-content>
    <ion-fab slot="fixed" vertical="bottom" horizontal="end">
      <ion-fab-button id="open-action-sheet">
        <ion-icon :icon="add"></ion-icon>
      </ion-fab-button>
    </ion-fab>
    <ion-action-sheet @didDismiss="handleDismiss" header="Actions" trigger="open-action-sheet"
      :buttons="actionSheetButtons">
    </ion-action-sheet>
  </ion-page>
</template>
<script setup lang="ts">
import { Result, Root } from '@/characters-root';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, ActionSheetButton } from '@ionic/vue';
import axios from "axios";
import { ref, onMounted } from 'vue';
import { Network, Data, Edge, Node, Options, DataSet } from "vis-network/standalone";
import { add } from 'ionicons/icons';

const nextUrl = ref<string | null>("https://rickandmortyapi.com/api/character");

const nodes = new DataSet<Node>([]);
const edges = new DataSet<Edge>([]);

const loadCharacters = async () => {
  if (nextUrl.value) {
    const { data: d } = await axios.get<Root>(nextUrl.value);
    nextUrl.value = d.info.next;
    return d;
  }

  return { results: [] as Result[] } as Root;
}

//let network: Network | null = null;

async function handleDismiss(event: CustomEvent) {
  if (event.detail?.data?.action === "load-more") {
    await loadCharacters();
    await prepareGraph();
  }
}

const actionSheetButtons: ActionSheetButton[] = [
  {
    text: 'Load More Characters',
    data: {
      action: 'load-more',
    },
  },
];


const seenLocations: Record<string, boolean> = {};

async function prepareGraph() {
  const newGroup = await loadCharacters()
  for (const element of newGroup.results) {
    nodes.update({
      id: `character-${element.id}`,
      image: element.image,
      shape: "circularImage",
      label: element.name,
    });
    const locationId = `location-${element.location.url.split('/').at(-1)}`;
    if (!Object.hasOwn(seenLocations, locationId)) {
      seenLocations[locationId] = true;
      nodes.update({
        id: locationId,
        color: '#cccccc',
        shape: "square",
        label: element.location.name,
      });
    }
    edges.update({
      to: `character-${element.id}`,
      from: locationId,
    } as Edge);
  }
}


onMounted(async () => {
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
  //let lastPosition: Position | null = null;
  //const max_zoom = 2;
  //const min_zoom = 1.5;

  //network.on("zoom", function (params) {
  //  if (params.scale < min_zoom || params.scale > max_zoom) { // adjust this value according to your requirement
  //    if (lastPosition) network?.moveTo({
  //      position: lastPosition, // use the last position before zoom limit
  //      scale: params.scale > max_zoom ? max_zoom : min_zoom // this scale prevents zooming out beyond the desired limit
  //    });
  //  } else {
  //    // store the current position as the last position before zoom limit
  //    if (network) lastPosition = network.getViewPosition();
  //    else lastPosition = null;
  //  }
  //});
  //// on pan, store the current position
  //network.on("dragEnd", function () {
  //  if (network) lastPosition = network.getViewPosition();
  //  else lastPosition = null;
  //});
});

</script>
<style scoped>
.graph-container {
  width: 100%;
  height: 100%;
}
</style>