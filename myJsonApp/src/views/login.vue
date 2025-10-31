<template>
  <ion-page>
    <ion-header> </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Login</ion-title>
        </ion-toolbar>
      </ion-header>
      <main>
        <div class="container">
          <h1 style="margin-bottom: 1rem; font-weight: bolder; font-size: 2rem">
            Aplication.id
          </h1>
          <p style="margin-bottom: 2rem; line-height: 1.65; font-weight: 400">
            Masuk Menggunakan Akun yang sudah terdaftar di
            <span style="font-weight: 500; color: skyblue;">Application.id</span>
          </p>
          
          <!-- ✅ ubah: tambahkan @submit.prevent -->
          <form @submit.prevent="loginUser">
            <div>
              <label for="user_email">Email :</label>
              <!-- ✅ tambahkan v-model -->
              <input
                type="email"
                id="user_email"
                placeholder="Contoh : emailkamu@.com"
                name="user_email"
                v-model="email"
              />
            </div>
            <div>
              <label for="user_password">Password :</label>
              <!-- ✅ tambahkan v-model -->
              <input
                type="password"
                id="user_password"
                name="user_password"
                v-model="password"
              />
              </div>
            <div>
              <button
                style="border: none; padding: 0.5rem 2rem; border-radius: 20px">
                Masuk
              </button>
              <p>
                Belum Punya Akun?
                <router-link
                  to="/tabs/register"
                  style="color: skyblue; text-decoration: none; font-weight: bold;">
                  Daftar Sekarang
                </router-link>
              </p>
            </div>
          </form>
        </div>
      </main>
    </ion-content>
  </ion-page>
</template>
<style>
main {
  display: grid;
  justify-content: center;
  padding: 2.5rem;
  position: relative;
  z-index: 999;
  background-color: black;
}
.container {
  border-radius: 20px;
  box-shadow: 1px 1px 5px -1px rgba(255, 255, 255, 0.1);
  padding: 5rem;
}

label {
  font-weight: bold;
  font-size: 1rem;
}

form > div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}

form > div > input {
  flex: 1;
  max-width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
}
</style>
<script setup lang="ts">
import {
  IonPage,
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
} from "@ionic/vue";
import { ref } from "vue";
import axios from "axios";
import { useRouter } from "vue-router";

const router = useRouter();

// ✅ data untuk form

const email = ref("");
const password = ref("");

interface LoginResponse {
  message: string;
  token: string;
  user: {
    id: number;
    user_name: string;
    user_email: string;
  };
}

const loginUser = async () => {
  try {
    const res = await axios.post<LoginResponse>("http://localhost:3000/login", {
      user_email: email.value,
      user_password: password.value,
    });

    alert(res.data.message);

    // simpan token dan user
    localStorage.setItem("token", res.data.token);
    localStorage.setItem("user", JSON.stringify(res.data.user));

    router.push("/tabs/tab2");
  } catch (error: any) {
    console.error("Login error:", error);
    if (error.response && error.response.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Terjadi kesalahan koneksi server!");
    }
  }
};

</script>
