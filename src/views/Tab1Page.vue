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

      <ion-searchbar color="light" v-model="searchQuery" :debounce="500" @ionInput="filterCharacters"
        placeholder="Buscar personajes..."></ion-searchbar>

      <ion-select placeholder="Filtrar por especie" v-model="selectedSpecies" @ionChange="filterCharactersBySpecies">
        <ion-select-option value="">Todas las especies</ion-select-option>
        <ion-select-option value="Human">Human</ion-select-option>
        <ion-select-option value="Alien">Alien</ion-select-option>
        <ion-select-option value="Humanoid">Humanoid</ion-select-option>
        <ion-select-option value="Unknown">Unknown</ion-select-option>
        <ion-select-option value="Poppybutthole">Poppybutthole</ion-select-option>
        <ion-select-option value="MythologicalCreature">Mythological Creature</ion-select-option>
        <ion-select-option value="Animal">Animal</ion-select-option>
        <ion-select-option value="Robot">Robot</ion-select-option>
        <ion-select-option value="Cronenberg">Cronenberg</ion-select-option>
        <ion-select-option value="Disease">Disease</ion-select-option>
      </ion-select>
      <ion-select placeholder="Filtrar por episodio" v-model="selectedEpisode" @ionChange="filterCharactersByEpisode">
        <ion-select-option value="">Cualquier episodio</ion-select-option>
        <ion-select-option v-for="episode in episodes" :key="episode.id" :value="episode">{{ episode.episode + " " +episode.name}}</ion-select-option>
      </ion-select>

      <ion-list>
        <ion-item v-for="character in filteredCharacters" :key="character.id" button routerLink="/character-details">
          <ion-avatar slot="start">
            <img :src="character.image" alt="character image" />
          </ion-avatar>
          <ion-label>
            <h2>{{ character.name }}</h2>
            <p :style="getStatusColor(character.status)">
              {{ getStatusText(character.status) }}
            </p>
          </ion-label>
        </ion-item>
      </ion-list>

      <ion-infinite-scroll threshold="100px" @ionInfinite="loadMoreCharacters">
        <ion-infinite-scroll-content loadingSpinner="bubbles"
          loadingText="Cargando más personajes..."></ion-infinite-scroll-content>
      </ion-infinite-scroll>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar, IonSelect, IonSelectOption, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
  import axios from 'axios';

  interface Character {
    id: number;
    name: string;
    status: string;
    image: string;
    species: string; 
    episode: string[];
  }

  interface Episode {
    id: number;
    name: string;
    episode: string;
    url: string;
  }

  const characters = ref<Character[]>([]);  
  const filteredCharacters = ref<Character[]>([]);  
  const searchQuery = ref('');  
  const selectedSpecies = ref('');
  const nextPage = ref<string | null>('https://rickandmortyapi.com/api/character');
  const selectedEpisode = ref('');
  const episodes = ref<Episode[]>([]);
  const nextPageEpisodes = ref<string | null>('https://rickandmortyapi.com/api/episode');

  const loadCharacters = async (event: CustomEvent | null = null) => {
    if (nextPage.value) {
      const response = await axios.get(nextPage.value);
      const results: Character[] = response.data.results;
      characters.value.push(...results);
      filterCharacters();

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

  const loadEpisodes = async () => {
    if (nextPageEpisodes.value) {
      const response = await axios.get(nextPageEpisodes.value);
      episodes.value.push(...response.data.results);
      if (response.data.info.next) {
        nextPageEpisodes.value = response.data.info.next;
        loadEpisodes();
      }
    };
  };

  onMounted(() => {
    loadCharacters();  
    loadEpisodes(); 
  });

  const getStatusText = (status: string) => {
    if (status === 'Alive') return 'Vivo';
    if (status === 'Dead') return 'Muerto';
    return 'Desaparecido';
  };

  const getStatusColor = (status: string) => {
    if (status === 'Alive') return { color: 'green' };
    if (status === 'Dead') return { color: 'red' };
    return { color: 'gray' };
  };

  const loadMoreCharacters = (event: CustomEvent) => {
    loadCharacters(event);
  };

  const filterCharacters = () => {
    const query = searchQuery.value.toLowerCase();
    filteredCharacters.value = characters.value.filter(character => {
      const matchesQuery = character.name.toLowerCase().includes(query);
      const matchesSpecies = selectedSpecies.value ? character.species === selectedSpecies.value : true;
      //@ts-ignore              perdon Z :(
      const matchesEpisode = selectedEpisode.value.url ? character.episode.includes(selectedEpisode.value.url) : true;
      return matchesQuery && matchesSpecies && matchesEpisode;
    });
  };

  const filterCharactersBySpecies = () => {
    filterCharacters();
  };

  const filterCharactersByEpisode = () => {
    filterCharacters();
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
  ion-select {
    margin: 10px;
    --background: #fffeef;
    --color: #000000;
  }
</style>
