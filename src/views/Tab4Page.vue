<template>
    <ion-page>
      <ion-header>
        <ion-toolbar>
          <ion-title>Locations Rick and Morty</ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content :fullscreen="true">
        <ion-header collapse="condense">
          <ion-toolbar>
            <ion-title size="large" class="schwifty-title">Locations</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-searchbar color="light" v-model="searchQuery" :debounce="500" @ionInput="filterLocations"
          placeholder="Buscar locations..."></ion-searchbar>
        <ion-list>
          <ion-item v-for="location in filteredLocations" :key="location.id" button :href="`/location/${location.id}`">
            <ion-label>
              <h2>{{ location.name }}</h2>
              <h3>{{ location.type }} - {{ location.dimension }}</h3>
            </ion-label>
          </ion-item>
        </ion-list>
  
        <ion-infinite-scroll threshold="100px" @ionInfinite="loadMoreLocations">
          <ion-infinite-scroll-content loadingSpinner="bubbles"
            loadingText="Cargando más locations..."></ion-infinite-scroll-content>
        </ion-infinite-scroll>
      </ion-content>
    </ion-page>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import axios from 'axios';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
  
  interface Location {
    id: number;
    name: string;
    type: string;
    dimension: string;
  }
  
  const locations = ref<Location[]>([]);
  const filteredLocations = ref<Location[]>([]);
  const nextPage = ref<string | null>('https://rickandmortyapi.com/api/location');
  const searchQuery = ref('');
  
  const loadLocations = async (event: CustomEvent | null = null) => {
    if (nextPage.value) {
      const response = await axios.get(nextPage.value);
      const results: Location[] = response.data.results;
      locations.value.push(...results);
      filterLocations();
      nextPage.value = response.data.info.next;
    }
  
    if (event) {
      const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;
      infiniteScroll.complete();
      if (!nextPage.value) {
        infiniteScroll.disabled = true;
      }
    }
  };
  
  const filterLocations = () => {
    const query = searchQuery.value.toLowerCase();
    filteredLocations.value = locations.value.filter(location => 
      location.name.toLowerCase().includes(query)
    );
  };
  
  onMounted(() => {
    loadLocations();
  });
  
  const loadMoreLocations = (event: CustomEvent) => {
    loadLocations(event);
  };
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
  
  ion-searchbar {
    margin: 10px;
    --background: #fffeef;
    --color: #000000;
  }
  </style>
  