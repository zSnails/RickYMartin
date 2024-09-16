<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-content>
          <ion-input label-placement="floating" type="email" v-model="email" label="Correo"></ion-input>
          <ion-input label-placement="floating" type="password" v-model="password" label="Contraseña"></ion-input>
          <ion-button type="submit" @click="signIn">Iniciar Sesión</ion-button>
          <!-- <ion-router-link href="/register">¿No tienes una cuenta?</ion-router-link> -->
          <ion-button type="reset" fill="clear" router-link="/register">¿No tienes una cuenta?</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonInput, IonButton, IonCard, IonCardContent, IonContent, IonPage, useIonRouter } from "@ionic/vue";
import { ref } from "vue";
import supabase from "@/supabase";

const { push } = useIonRouter();

const email = ref<string>("");
const password = ref<string>("");

const signIn = async () => {
  const resp = await supabase.auth.signInWithPassword({
    email: email.value,
    password: password.value,
  });
  if (resp.error !== null) {
    console.error(resp.error);
    return;
  }
  push({ path: '/' });
};
</script>
