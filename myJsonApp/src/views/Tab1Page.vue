<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center;">My JSON APP</ion-title>
      </ion-toolbar>
    </ion-header>

    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">TEST JSON</ion-title>
        </ion-toolbar>
      </ion-header>

      <main>
        <ion-button class="button" @click="router.push('/tabs/create')" style="color:white">
          Tambah Data
        </ion-button>

        <CardCompoenents
          v-for="post in posts"
          :key="post.id"
          :id="post.postId"
          :userId="post.id"
          :judul="post.judul"
          :deskripsi="post.deskripsi"
          :image="post.image"
        >
          <slot>
            <ion-button fill="clear" color="success" @click="router.push(`/tabs/edit/${post.id}`)">Edit</ion-button>
            <ion-button fill="clear" color="danger" @click="hapusPost(post.id)">Hapus</ion-button>
          </slot>
        </CardCompoenents>

        <div v-if="loading" style="text-align:center; margin-top:2rem;">
          <ion-spinner name="crescent"></ion-spinner>
          <p>Memuat data...</p>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>

<style scoped>
main {
  padding: 1rem;
  display: grid;
  flex-flow: column nowrap;
  gap: 1.5rem;
}

@media (min-width: 650px) {
  main {
    grid-template-columns: repeat(3, 1fr);
  }

  .button {
    grid-area: 1 / 1 / 1 / 4;
  }
}
</style>

<script setup lang="ts">
import { ref, onMounted } from "vue";
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent, IonSpinner, IonButton } from "@ionic/vue";
import { useRouter } from "vue-router";
import axios from "axios";
import CardCompoenents from "@/components/cardCompoenents.vue";

const router = useRouter();
const loading = ref(true);

// ✅ 1️⃣ Definisikan tipe data Post (biar TypeScript tahu struktur datanya)
interface Post {
  id: number;
  judul: string;
  deskripsi: string;
  image: string;
  postId?: number; // kalau field ini kadang ada kadang nggak, kasih tanda '?'
}

// ✅ 2️⃣ Gunakan ref dengan tipe Post[]
const posts = ref<Post[]>([]);

onMounted(async () => {
  const token = localStorage.getItem("token");

  // 🚨 Cek token login
  if (!token) {
    alert("Silakan login terlebih dahulu!");
    router.push("/tabs/login");
    return;
  }

  try {
    // ✅ 3️⃣ Tambahkan generic type ke axios.get<Post[]>
    const response = await axios.get<Post[]>("http://localhost:3000/posts", {
      headers: { Authorization: `Bearer ${token}` },
    });

    posts.value = response.data; // ✅ TypeScript sekarang tahu ini array of Post
  } catch (err: any) {
    console.error("Gagal mengambil data:", err);
    if (err.response?.status === 401) {
      alert("Sesi login habis, silakan login ulang!");
      localStorage.removeItem("token");
      router.push("/tabs/login");
    } else {
      alert("Terjadi kesalahan saat mengambil data.");
    }
  } finally {
    loading.value = false;
  }
});

// 🗑️ Hapus post
const hapusPost = async (id: number) => {
  const token = localStorage.getItem("token");

  if (!token) {
    alert("Silakan login terlebih dahulu!");
    router.push("/tabs/login");
    return;
  }

  if (!confirm("Yakin mau hapus data ini?")) return;

  try {
    await axios.delete(`http://localhost:3000/posts/${id}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    posts.value = posts.value.filter((p) => p.id !== id);
    alert("Data berhasil dihapus!");
  } catch (error: any) {
    console.error("Gagal hapus:", error);
    if (error.response?.status === 401) {
      alert("Sesi login habis. Silakan login ulang.");
      localStorage.removeItem("token");
      router.push("/tabs/login");
    } else {
      alert("Gagal menghapus data.");
    }
  }
};
</script>