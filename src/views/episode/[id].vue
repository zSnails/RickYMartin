<template>
    <ion-page>
        <ion-header>
            <ion-toolbar>
                <ion-title>Detalles del Episodio</ion-title>
            </ion-toolbar>
        </ion-header>
        <ion-content :fullscreen="true">
            <ion-header collapse="condense">
                <ion-toolbar>
                    <ion-title size="large">Detalles del Episodio</ion-title>
                </ion-toolbar>
            </ion-header>
            <ion-card>
                <ion-card-header>
                    <ion-button shape="round" color="dark" size="default" @click="router.back()">Volver</ion-button>
                    <ion-card-title>Nombre: {{episodeData?.name}}</ion-card-title>
                    <ion-card-subtitle>Temporada: {{ episodeData?.episode.substring(1,3)}}</ion-card-subtitle>
                    <ion-card-subtitle>Episodio: {{ episodeData?.episode.substring(4, 6) }}</ion-card-subtitle>
                    <ion-card-subtitle>Fecha de salida: {{ episodeData?.air_date }}</ion-card-subtitle>
                </ion-card-header>
                <ion-card-content>
                    <ion-list>
                        <h1>Personajes</h1>
                        <ion-item v-for="character in charactersList" :key="character.id" button :href="`/character/${character.id}`" >
                            <ion-avatar slot="start">
                                <img :src="character.image" alt="character image" />
                            </ion-avatar>
                            <ion-label>
                                <h2>{{ character.name }}</h2>

                            </ion-label>
                        </ion-item>
                    </ion-list>
                </ion-card-content>
            </ion-card>

        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonList, IonItem, IonAvatar, IonLabel, IonInfiniteScroll, IonInfiniteScrollContent } from '@ionic/vue';
import { IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle, IonCardContent } from '@ionic/vue';
import { IonButton, IonIcon } from '@ionic/vue';
import router from '@/router';

interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
}
const route = useRoute();

interface Character {
    id: number;
    name: string;
    image: string;
}

interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
}


const charactersList = ref<Character[]>([]);

const episodeApiLink = 'https://rickandmortyapi.com/api/episode/' + route.params.id;

const episodeData = ref<Episode | null>(null);

const episodePage = ref<string | null>(episodeApiLink);


const loadEpisode = async (event: CustomEvent | null = null) => {
    if (episodePage.value) {
        const response = await axios.get(episodePage.value);
        const result: Episode = response.data;
        episodeData.value = result;
        loadCharacters(episodeData.value.characters);

    }
};


const loadCharacters = async (characters: string[]) => {
    characters.forEach(async (character) => {
        const response = await axios.get(character);
        const result: Character = response.data;

        charactersList.value.push(result);
    });

};



onMounted(() => {
    console.log(episodeApiLink);
    loadEpisode();

});



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
