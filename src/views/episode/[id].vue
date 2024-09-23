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

           
        </ion-content>
    </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import axios from 'axios';

interface Episode {
    id: number;
    name: string;
    air_date: string;
    episode: string;
    characters: string[];
}

interface Character {
    id: number;
    name: string;
    status: string;
    species: string;
    image: string;
}

const route = useRoute();
const episode = ref<Episode | null>(null);
const characters = ref<Character[]>([]);


onMounted(async () => {
    
    console.log(route.params.id);
});

</script>

<style scoped>
/* Aquí puedes añadir estilos personalizados si lo necesitas */
</style>
