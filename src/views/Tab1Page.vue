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

      <ion-searchbar color="light"
        v-model="searchQuery"
        :debounce="500"
        @ionInput="onFilterChange"
        placeholder="Buscar personajes..."
      ></ion-searchbar>

      <ion-select placeholder="Filtrar por especie" v-model="selectedSpecies" @ionChange="onFilterChange">
        <ion-select-option value="">Todas las especies</ion-select-option>
        <ion-select-option value="Human">Humano</ion-select-option>
        <ion-select-option value="Alien">Alien</ion-select-option>
        <ion-select-option value="Humanoid">Humanoide</ion-select-option>
        <ion-select-option value="Unknown">Desconocido</ion-select-option>
        <ion-select-option value="poopybutthole">Poppybutthole</ion-select-option>
        <ion-select-option value="MythologicalCreature">Criatura Mítica</ion-select-option>
        <ion-select-option value="Animal">Animal</ion-select-option>
        <ion-select-option value="Robot">Robot</ion-select-option>
        <ion-select-option value="Cronenberg">Cronenberg</ion-select-option>
        <ion-select-option value="Disease">Enfermedad</ion-select-option>
      </ion-select>

      <ion-select placeholder="Filtrar por género" v-model="selectedGender" @ionChange="onFilterChange">
        <ion-select-option value="">Todos los géneros</ion-select-option>
        <ion-select-option value="Female">Femenino</ion-select-option>
        <ion-select-option value="Male">Masculino</ion-select-option>
        <ion-select-option value="Genderless">Sin género</ion-select-option>
        <ion-select-option value="unknown">Desconocido</ion-select-option>
      </ion-select>

      <ion-list>
        <ion-item
          v-for="character in filteredCharacters"
          :key="character.id"
          button
          routerLink="/character-details"
        >
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
        <ion-infinite-scroll-content
          loadingSpinner="bubbles"
          loadingText="Cargando más personajes..."
        ></ion-infinite-scroll-content>
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
    gender: string;
  }

  const characters = ref<Character[]>([]);  
  const filteredCharacters = ref<Character[]>([]);  
  const searchQuery = ref('');  
  const selectedSpecies = ref('');
  const selectedGender = ref('');
  const nextPage = ref<string | null>(null);

  const loadCharacters = async (event: CustomEvent | null = null, reset = false) => {
    if (reset) {
      characters.value = [];  
      nextPage.value = null;  
    }

    let url = nextPage.value || 'https://rickandmortyapi.com/api/character';

    const filters: string[] = [];
    if (searchQuery.value) filters.push(`name=${searchQuery.value}`);
    if (selectedSpecies.value) filters.push(`species=${selectedSpecies.value}`);
    if (selectedGender.value) filters.push(`gender=${selectedGender.value}`);
    
    if (filters.length > 0) {
      url += `?${filters.join('&')}`;
    }

    try {
      const response = await axios.get(url);
      const results: Character[] = response.data.results;
      characters.value.push(...results);
      filteredCharacters.value = characters.value;

      nextPage.value = response.data.info.next;
    } catch (error) {
      console.error('Error loading characters:', error);
    }

    if (event) {
      const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;
      infiniteScroll.complete();
      if (!nextPage.value) {
        infiniteScroll.disabled = true;
      }
    }
  };

  onMounted(() => {
    loadCharacters();  
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

  const onFilterChange = () => {
    loadCharacters(null, true);  
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
