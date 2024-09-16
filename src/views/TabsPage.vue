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
          <ion-title size="large">Personajes</ion-title>
        </ion-toolbar>
      </ion-header>

      <!-- Searchbar para buscar personajes -->
      <ion-searchbar
        v-model="searchQuery"
        :debounce="500"
        @ionInput="filterCharacters"
        placeholder="Buscar personajes..."
      ></ion-searchbar>

      <!-- Lista de personajes con scroll infinito habilitado -->
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

      <!-- Scroll infinito para cargar más personajes -->
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
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar } from '@ionic/vue';
import axios from 'axios';

// Define la interfaz para los personajes
interface Character {
  id: number;
  name: string;
  status: string;
  image: string;
}

// Estados para manejar personajes, búsqueda y paginación
const characters = ref<Character[]>([]);  // Arreglo de personajes
const filteredCharacters = ref<Character[]>([]);  // Arreglo filtrado
const searchQuery = ref('');  // Término de búsqueda
const nextPage = ref<string | null>('https://rickandmortyapi.com/api/character');

const loadCharacters = async (event: CustomEvent | null = null) => {
  if (nextPage.value) {
    const response = await axios.get(nextPage.value);
    const results: Character[] = response.data.results;
    characters.value.push(...results);
    filterCharacters();
    nextPage.value = response.data.info.next;
  }

  if (event) {
    const infiniteScroll = event.target as HTMLIonInfiniteScrollElement;  // Casting a HTMLIonInfiniteScrollElement
    infiniteScroll.complete();  // Ahora TypeScript reconoce el método complete()
    if (!nextPage.value) {
      infiniteScroll.disabled = true;  // También reconoce la propiedad disabled
    }
  }
};


// Cargar personajes al montar el componente
onMounted(() => {
  loadCharacters();
});

// Función para obtener el texto de estado en español
const getStatusText = (status: string) => {
  if (status === 'Alive') return 'Vivo';
  if (status === 'Dead') return 'Muerto';
  return 'Desaparecido';
};

// Función para obtener el color basado en el estado
const getStatusColor = (status: string) => {
  if (status === 'Alive') return { color: 'green' };
  if (status === 'Dead') return { color: 'red' };
  return { color: 'yellow' };
};

// Función para cargar más personajes cuando se hace scroll infinito
const loadMoreCharacters = (event: CustomEvent) => {
  loadCharacters(event);
};

// Función para filtrar personajes en base a la búsqueda
const filterCharacters = () => {
  const query = searchQuery.value.toLowerCase();
  filteredCharacters.value = characters.value.filter(character =>
    character.name.toLowerCase().includes(query)
  );
};
</script>
