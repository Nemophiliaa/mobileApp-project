<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center;">Edit Data Post</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <main v-if="!loading">
        <ion-item>
          <ion-input label="Image URL" label-placement="floating" v-model="image"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Post ID" label-placement="floating" v-model="postId"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Judul" label-placement="floating" v-model="judul"></ion-input>
        </ion-item>

        <ion-item>
          <ion-input label="Deskripsi" label-placement="floating" v-model="deskripsi"></ion-input>
        </ion-item>

        <ion-button expand="block" @click="submitForm()">Edit Data</ion-button>
      </main>

      <div v-else style="text-align:center; margin-top: 2rem;">
        <ion-spinner name="crescent"></ion-spinner>
        <p>Memuat data...</p>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import axios from "axios";
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonItem,
  IonInput,
  IonButton,
  IonSpinner,
} from "@ionic/vue";

const router = useRouter();
const route = useRoute();

const postId = ref("");
const judul = ref("");
const deskripsi = ref("");
const image = ref("");
const loading = ref(true);

onMounted(async () => {
  const token = localStorage.getItem("token");

  // 🚨 Cek token login
  if (!token) {
    alert("Silakan login terlebih dahulu!");
    router.push("/tabs/login");
    return;
  }

  try {
    const response = await axios.get(
      `http://localhost:3000/posts/${route.params.id}`,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    const post: any = response.data;
    postId.value = post.postId;
    judul.value = post.judul;
    deskripsi.value = post.deskripsi;
    image.value = post.image;
  } catch (error: any) {
    if (error.response?.status === 401) {
      alert("Sesi login habis, silakan login ulang!");
      localStorage.removeItem("token");
      router.push("/tabs/login");
    } else {
      alert("Gagal memuat data post!");
    }
  } finally {
    loading.value = false;
  }
});

// 🧩 Submit form untuk update data
const submitForm = async () => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Silakan login terlebih dahulu!");
    router.push("/tabs/login");
    return;
  }

  const postData = {
    postId: postId.value,
    judul: judul.value,
    deskripsi: deskripsi.value,
    image: image.value,
  };

  try {
    const response = await axios.put(
      `http://localhost:3000/posts/${route.params.id}`,
      postData,
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    console.log("✅ Data berhasil diupdate:", response.data);
    alert("Data berhasil diupdate!");
    router.push("/tabs/tab1");
  } catch (err: any) {
    console.error("❌ Gagal update:", err);
    if (err.response?.status === 401) {
      alert("Sesi login habis. Silakan login ulang.");
      localStorage.removeItem("token");
      router.push("/tabs/login");
    } else {
      alert("Terjadi kesalahan saat update data!");
    }
  }
};
</script>
