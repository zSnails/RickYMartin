<template>
  <ion-page>
    <ion-content :fullscreen="true">
      <ion-card>
        <ion-card-content>
          <ion-input label-placement="floating" type="email" v-model="email" label="Correo"></ion-input>
          <ion-input label-placement="floating" type="password" v-model="password" label="Contraseña"></ion-input>
          <ion-input label-placement="floating" type="password" v-model="confirmation"
            label="Confirmar Contraseña"></ion-input>
          <ion-button @click="signUp">Registrarse</ion-button>
          <ion-button type="reset" fill="clear" router-link="/login">¿Ya tienes una cuenta?</ion-button>
        </ion-card-content>
      </ion-card>
    </ion-content>
  </ion-page>
</template>
<script setup lang="ts">
import supabase from '@/supabase';
import { IonPage, IonContent, useIonRouter, IonButton, IonInput, IonCardContent, IonCard } from '@ionic/vue';
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
