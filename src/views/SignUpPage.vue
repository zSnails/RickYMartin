<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-header>
          <ion-card-title>Registrarse</ion-card-title>
        </ion-card-header>
        <ion-card-content class="center-content">
          <ion-input error-text="Correo inválido" label-placement="floating" type="email" v-model="email"
            label="Correo"></ion-input>
          <ion-input error-text="Contraseña inválida" label-placement="floating" type="password" v-model="password"
            label="Contraseña">
            <ion-input-password-toggle v-if="password.length > 0" slot="end"></ion-input-password-toggle>
          </ion-input>
          <ion-input error-text="Las contraseñas no coinciden" label-placement="floating" type="password"
            v-model="confirmation" label="Confirmar Contraseña">
            <ion-input-password-toggle v-if="confirmation.length > 0" slot="end"></ion-input-password-toggle>
          </ion-input>
          <ion-button @click="signUp">Registrarse</ion-button>
          <ion-button type="reset" fill="clear" router-link="/login">¿Ya tienes una cuenta?</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import supabase from '@/supabase';
import { IonPage, IonContent, IonInputPasswordToggle, useIonRouter, IonButton, IonInput, IonCardContent, IonCard } from '@ionic/vue';
import { ref } from 'vue';

const email = ref<string>("");
const password = ref<string>("");
const confirmation = ref<string>("");

const { push } = useIonRouter();

const signUp = async () => {
  if (password.value !== confirmation.value) {
    console.error("passwords do not match");
    return;
  }

  const response = await supabase.auth.signUp({
    email: email.value,
    password: password.value,
  });
  if (response.error !== null) {
    console.error(response.error);
    return;
  }
  console.info("sucessfully registered");
  push({ path: '/' });
};
</script>
