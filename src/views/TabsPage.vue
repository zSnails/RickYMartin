<template>
  <ion-page>
    <ion-tabs>
      <ion-menu contentId="main-content">
        <ion-header>
          <ion-toolbar color="gray">
            <ion-title>Navegar</ion-title>
          </ion-toolbar>
        </ion-header>
        <ion-content class="ion-padding">
          hola
        </ion-content>
      </ion-menu>
      <div class="ion-page" id="main-content">
        <ion-header>
          <ion-toolbar>
            <ion-buttons slot="start">
              <ion-menu-button></ion-menu-button>
            </ion-buttons>
            <ion-title>Rick and Morty App</ion-title>
          </ion-toolbar>
        </ion-header>
      </div> 
      <ion-router-outlet></ion-router-outlet>
      <ion-tab-bar slot="bottom">
        <ion-tab-button tab="tab1" href="/tabs/tab1">
          <ion-icon aria-hidden="true" :icon="triangle" />
          <ion-label>Tab 1</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab2" href="/tabs/tab2">
          <ion-icon aria-hidden="true" :icon="ellipse" />
          <ion-label>Tab 2</ion-label>
        </ion-tab-button>

        <ion-tab-button tab="tab3" href="/tabs/tab3">
          <ion-icon aria-hidden="true" :icon="square" />
          <ion-label>Tab 3</ion-label>
        </ion-tab-button>
      </ion-tab-bar>
    </ion-tabs>
  </ion-page>
</template>

<script setup lang="ts">
import { IonTabBar, IonTabButton, IonTabs, IonLabel, IonIcon, IonPage, IonRouterOutlet, IonButtons, IonMenu, IonMenuButton, IonContent, IonHeader, IonToolbar, IonTitle} from '@ionic/vue';
import { ellipse, square, triangle } from 'ionicons/icons';
</script>
