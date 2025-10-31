<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center;">Tambah Data Post</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Tambah Data Post</ion-title>
        </ion-toolbar>
      </ion-header>
      <main>
        <ion-item>
            <ion-input label = "image" label-placement="floating" placeholder="Contoh : https://picsum.photos/300/200"  v-model="image"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label ="post ID" label-placement="floating" v-model="postId"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label ="Judul" label-placement="floating" v-model="judul"></ion-input>
        </ion-item>
        <ion-item>
            <ion-input label ="Deskripsi" label-placement="floating"  v-model="deskripsi"></ion-input>
        </ion-item>
        <ion-button @click="submitForm()">Simpan Data</ion-button>
      </main>
    </ion-content>
  </ion-page>
</template>
<style scoped>
  main {
    padding: 1rem;
    display: flex;
    flex-flow: column nowrap;
    gap: 1.5rem;
  }
</style>
<script setup lang="ts">
import { ref, onMounted } from "vue";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonButton,
  IonInput,
  IonItem,
} from "@ionic/vue";
import { useRouter } from "vue-router";
import axios from "axios";

const router = useRouter();

// Form state
const postId = ref("");
const judul = ref("");
const deskripsi = ref("");
const image = ref("");

// 🚨 Cek login saat halaman dimuat
onMounted(() => {
  const token = localStorage.getItem("token");
  if (!token) {
    alert("Silakan login terlebih dahulu!");
    router.push("/tabs/login");
  }
});

// 🧩 Submit form
const submitForm = async () => {
  try {
    const postData = {
      postId: postId.value,
      judul: judul.value,
      deskripsi: deskripsi.value,
      image: image.value,
    };

    const response = await axios.post("http://localhost:3000/posts", postData);
    console.log("✅ Data masuk ke MySQL:", response.data);

    alert("Data berhasil disimpan!");
    router.push("/tabs/tab1");
  } catch (err: any) {
    console.error("❌ Error kirim data:", err);
    if (err.response?.status === 401) {
      alert("Sesi login habis. Silakan login ulang.");
      localStorage.removeItem("token");
      router.push("/tabs/login");
    } else {
      alert("Terjadi kesalahan saat menyimpan data!");
    }
  }
};
</script>