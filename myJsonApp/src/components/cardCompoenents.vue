<template>
    <div class="card">
        <nav>
            <img v-if="image" :src="image" alt="Gambar Post" class="card-img" />
        </nav>
        <header class="card-header">
            <h1>User Id : {{userId }}</h1>
            <h1>Post Id : {{id}}</h1>
        </header>
        <div class="card-content">
            <p>{{judul}}</p>
            <p>{{deskripsi}}</p>
            <slot>
                
            </slot>
        </div>
    </div>  
</template>

<script setup lang="ts">
defineProps({
  judul: String,
  deskripsi: String,
  id: Number,
  userId: Number , 
  image : String 
});

import { useRouter } from 'vue-router';

const router = useRouter(); 


</script>
<style>
.card {
    display: flex;
    box-shadow: 1px 1px 15px -1px rgba(255,255,255,0.10);
    flex-direction: column;
    border-radius: 10px;
    overflow: hidden;
    max-width: 650px;
    margin: 0 auto;
}


.card-header {
    display: flex;
    justify-content: center;
    flex-direction: column;
    padding: 1rem;

}

nav {
    display: flex;
}

.card-img {
    width: 100%;
}


h1 {
    font-size: 1.5rem;
    font-family: Arial, Helvetica, sans-serif;
}



p {
    font-size: 1rem;
    line-height: 1.5;
}

.card-content {
    padding: 1rem   ;
}
</style>
