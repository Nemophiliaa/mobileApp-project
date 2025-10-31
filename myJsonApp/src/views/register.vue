<template>
  <ion-page>
    <ion-header></ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Register</ion-title>
        </ion-toolbar>
      </ion-header>

      <main>
        <div class="container">
          <h1 style="margin-bottom: 1rem; font-weight: bolder; font-size: 2rem;">
            Application.id
          </h1>
          <p style="margin-bottom: 2rem; line-height: 1.65; font-weight: 400;">
            Daftar sekarang dan rasakan fitur-fitur seru dari
            <span style="font-weight: bold; color: skyblue;">Application.id</span>
          </p>

          <!-- ✅ Form daftar -->
          <form @submit.prevent="registerUser">
            <div class="g-1">
              <div>
                <label for="user_name">Nama :</label>
                <input
                  type="text"
                  id="user_name"
                  placeholder="namakamu"
                  name="user_name"
                  v-model="user_name"
                  required
                />
              </div>

              <div>
                <label for="user_email">Email :</label>
                <input
                  type="email"
                  id="user_email"
                  placeholder="Contoh: emailkamu@gmail.com"
                  name="user_email"
                  v-model="user_email"
                  required
                />
              </div>
            </div>

            <div>
              <label for="user_password">Password :</label>
              <input
                type="password"
                id="user_password"
                name="user_password"
                v-model="user_password"
                required
              />
            </div>

            <div>
              <button
                type="submit"
                style="border: none; padding: 0.5rem 2rem; border-radius: 20px;"
              >
                Daftar
              </button>
              <p>
                Sudah Punya Akun?
                <router-link
                  to="/tabs/login"
                  style="color: skyblue; text-decoration: none; font-weight: bold;"
                >
                  Masuk
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
form > .g-1 > div {
  display: flex;
  flex-direction: column;
  gap: 1rem;
  margin-bottom: 1.5rem;
}
form > div > input,
form > .g-1 > div > input {
  flex: 1;
  max-width: 100%;
  padding: 0.5rem;
  border-radius: 5px;
}
@media (min-width: 650px) {
  .g-1 {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
  }
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

// ✅ State form
const user_name = ref("");
const user_email = ref("");
const user_password = ref("");

// ✅ Tipe respons backend
interface RegisterResponse {
  message: string;
  token?: string;
  user?: {
    id: number;
    user_name: string;
    user_email: string;
  };
}

// ✅ Fungsi register
const registerUser = async () => {
  try {
    const res = await axios.post<RegisterResponse>("http://localhost:3000/register", {
      user_name: user_name.value,
      user_email: user_email.value,
      user_password: user_password.value,
    });

    alert(res.data.message || "Registrasi berhasil!");

    // ✅ Simpan token jika backend langsung memberi JWT
    if (res.data.token && res.data.user) {
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      router.push("/tabs/tab2"); // langsung login otomatis
    } else {
      router.push("/tabs/login"); // kalau backend tidak kirim token, arahkan ke login
    }

  } catch (error: any) {
    console.error("Error register:", error);
    if (error.response && error.response.data?.message) {
      alert(error.response.data.message);
    } else {
      alert("Terjadi kesalahan koneksi server!");
    }
  }
};
</script>
