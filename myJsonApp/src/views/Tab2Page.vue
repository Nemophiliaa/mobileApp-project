<template>
  <ion-page>
    <ion-header>
      <ion-toolbar>
        <ion-title style="text-align: center; font-weight: 600;">Dashboard</ion-title>
      </ion-toolbar>
    </ion-header>
    <ion-content :fullscreen="true">
      <ion-header collapse="condense">
        <ion-toolbar>
          <ion-title size="large">Dashboard</ion-title>
        </ion-toolbar>
      </ion-header>
        <main style="padding: 3.5rem;">
          <div style="display: flex; justify-content: end;">
            <button 
              @click="logout"
              style="padding: 1rem 1.5rem; border-radius: 5px; color: white; font-weight: 500; background-color: red;">
              Keluar
          </button>
          </div>
          <div style="padding: 1.5rem; border-radius: 5px; box-shadow: 1px 1px 5px -2px rgba(244, 244, 244, 0.10);">
              <h1>Hai Selamat Datang!, {{userName}} 👋 </h1>
              <p>Lorem ipsum dolor sit amet consectetur adipisicing elit. Tempora, natus?</p>
          </div>
            <div class="card-wrapper" style="padding: 1.5rem; border-radius:  5px; display: grid;  box-shadow: 1px 1px 5px -2px rgba(244, 244, 244, 0.10);">
               <div class="card"> 
                   <header>
                      <ion-icon aria-hidden="true" :icon="peopleCircle"/>
                   </header>
                   <footer>
                     <h1>{{totalPosts}}</h1>
                     <p>Data Posts User</p>
                   </footer>
               </div>
               <div class="card"> 
                   <header>
                      <ion-icon aria-hidden="true" :icon="personCircleOutline"/>
                   </header>
                   <footer>
                     <h1>{{totalAccount}}</h1>
                     <p>User Account</p>
                   </footer>
               </div>
           </div>
        </main>
    </ion-content>
  </ion-page>
</template>
<style>
main {
  display: grid;
  gap: 1.5rem;
}

@media (min-width:750px) {
    .card-wrapper {
      grid-template-columns: repeat(2, 1fr);
      gap: 1rem;
    }
}

.card {
  box-shadow: 1px 1px 5px -2px rgba(255, 255, 255, 0.05);
  padding: 1rem;
  border-radius: 5px;
  display: flex;
  gap: 5rem; 
  align-items: center;
}

.card > header {
  font-size: 3rem;
}




</style>

<script setup lang="ts">
import { ref , onMounted } from 'vue';
import { IonPage, IonHeader, IonToolbar, IonTitle, IonContent } from '@ionic/vue';
import ExploreContainer from '@/components/ExploreContainer.vue';
import { ellipse, square, triangle, peopleCircle, people, personCircleOutline, peopleCircleOutline} from 'ionicons/icons';
import axios from 'axios';  // ✅ tambahkan import axios
import { useRouter } from 'vue-router'

const user = JSON.parse(localStorage.getItem('user') || '{}')
const userName = ref(user.user_name || 'Pengguna')
const router = useRouter()

// total data
const totalPosts = ref(0)
const totalAccount = ref(0)

// ✅ tambahkan interface untuk tipe data response axios
interface TotalPostsResponse {
  total_posts: number;
}

interface TotalUsersResponse {
  total_users: number;
}

// ===== Fungsi ambil data dari backend =====
const getTotals = async () => {
  try {
    const [postsRes, usersRes] = await Promise.all([
      axios.get<TotalPostsResponse>('http://localhost:3000/total-posts'),
      axios.get<TotalUsersResponse>('http://localhost:3000/total-users'),
    ])

    totalPosts.value = postsRes.data.total_posts
    totalAccount.value = usersRes.data.total_users
  } catch (error) {
    console.error('Gagal ambil data total:', error)
  } 
}

// jalankan otomatis saat halaman dibuka
onMounted(() => {
  getTotals()
})

const logout = () => {
  // Hapus semua data login di localStorage
  localStorage.removeItem('user')
  localStorage.removeItem('token') 

  // Redirect ke halaman login
  router.push('/tabs/login')
}
</script>
