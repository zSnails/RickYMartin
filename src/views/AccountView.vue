<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-buttons>
          <ion-back-button></ion-back-button>
        </ion-buttons>
        <ion-title>Cuenta</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content>
      <ion-card>
        <ion-card-header v-if="user">
          <ion-card-title>{{ user.email }}</ion-card-title>
          <ion-card-subtitle><b>ID</b> {{ user.id }}</ion-card-subtitle>
        </ion-card-header>
        <ion-card-content>
          <ion-button @click="signOut" color="danger" slot="end">Cerrar Sesión</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import supabase from '@/supabase';
import { IonCard, IonCardHeader, IonButton, IonCardTitle, IonCardContent, IonCardSubtitle, IonTitle, IonHeader, IonPage, IonToolbar, IonContent, IonButtons, IonBackButton, useIonRouter } from '@ionic/vue';
import { User } from '@supabase/auth-js';
import { ref } from 'vue';

const user = ref<User | null>(null);
//console.log(u);

supabase.auth.getUser().then((response) => user.value = response.data.user);

const { replace } = useIonRouter();

async function signOut() {
  await supabase.auth.signOut();
  replace("/login");
}

</script>
