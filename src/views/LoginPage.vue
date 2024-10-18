<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-card class="ion-margin ion-padding">
        <ion-card-header>
          <ion-card-title>Iniciar Sesión</ion-card-title>
        </ion-card-header>
        <ion-card-content class="center-content">
          <ion-input error-text="Correo inválido" ref="mail" label-placement="floating" type="email" v-model="email"
            label="Correo"></ion-input>
          <ion-input error-text="Contraseña inválida" ref="pwd" label-placement="floating" type="password"
            v-model="password" label="Contraseña">
            <ion-input-password-toggle v-if="password.length > 0" slot="end"></ion-input-password-toggle>
          </ion-input>
          <ion-button class="ion-padding" type="submit" @click="signIn">Iniciar Sesión</ion-button>
          <ion-button type="reset" fill="clear" router-link="/register">¿No tienes una cuenta?</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import { IonInput, IonButton, IonInputPasswordToggle, IonCard, IonCardContent, IonContent, IonPage, useIonRouter } from "@ionic/vue";
import { ref } from "vue";
import supabase from "@/supabase";

const { replace } = useIonRouter();

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
  replace({ path: '/' });
};
</script>
