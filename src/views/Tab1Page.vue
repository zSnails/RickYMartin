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
          @ionInput="filterCharacters"
          placeholder="Buscar personajes..."
        ></ion-searchbar>


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
    import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonSearchbar, IonInfiniteScroll, IonInfiniteScrollContent} from '@ionic/vue';
    import axios from 'axios';

    interface Character {
      id: number;
      name: string;
      status: string;
      image: string;
    }

    const characters = ref<Character[]>([]);  
    const filteredCharacters = ref<Character[]>([]);  
    const searchQuery = ref('');  
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

    const filterCharacters = () => {
      const query = searchQuery.value.toLowerCase();
      filteredCharacters.value = characters.value.filter(character =>
        character.name.toLowerCase().includes(query)
      );
    };
  </script>

  <style scoped>
    ion-content {
      --background: #44281d;
    }
    ion-item {
      --background: #fffeef;
      --color: #000000;
    }ion-toolbar {
      --background: #44281d;
      --color: #97ce4c;
    }
    .schwifty-title {
      font-family: 'GetSchwifty', sans-serif;
      font-size: 3rem;
    }
  </style>
  