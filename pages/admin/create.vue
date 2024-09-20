<template>
  <div class="flex p-4">
    <AdminAside @changeType="changeType"/>
    <form v-if="Object.keys(formData).length > 0" @submit="handleSubmit" class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg w-full">
      <div v-for="(value, key) in formData" :key="key" class="mb-4">
        <label :for="key" class="block text-gray-700 text-sm font-bold mb-2 capitalize">
          {{ key.replace('_', ' ') }}
        </label>
        <template v-if="key === 'file'">
          <input
              type="file"
              @change="handleFileChange"
              :id="key"
              :name="key"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          />
        </template>
        <template v-else>
          <input
              v-model="formData[key]"
              :id="key"
              :name="key"
              :type="getInputType(key)"
              class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              :placeholder="key.replace('_', ' ')"
          />
        </template>
      </div>
      <button
          type="submit"
          class="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Create
      </button>
    </form>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useNuxtApp } from '#app';
import { tableConfig } from './assets/tableConfig'; // Importation de la configuration

const route = useRoute();
const router = useRouter();

const $config = useRuntimeConfig();
const { $api } = useNuxtApp();

const table = ref('');
const formData = reactive({});
const file = ref(null);

// Fonction pour initialiser formData avec des valeurs vides en fonction des colonnes
const initializeFormData = () => {
  const columns = tableConfig[table.value];

  if (columns) {
    columns.forEach(column => {
      formData[column] = ''; // Initialiser chaque champ à une chaîne vide
    });
  }
};

// Fonction pour gérer le changement de fichier
const handleFileChange = (event) => {
  file.value = event.target.files[0];
};

// Fonction pour créer un nouvel élément
const createItem = async () => {
  try {
    const formDataObj = new FormData();

    // Ajout des données du formulaire
    for (const key in formData) {
      formDataObj.append(key, formData[key]);
    }

    // Ajout du fichier si présent
    if (file.value) {
      formDataObj.append('file', file.value);
    }

    await $api.post(`${$config.public.API_URL}/api/${table.value}`, formDataObj, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });

  } catch (e) {
    console.error(e);
    alert('Échec de la création de l\'élément');
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  createItem();
};

const changeType = (type) => {
  localStorage.setItem('table', type);
};

onMounted(() => {
  table.value = localStorage.getItem('table') || '';
  initializeFormData();
});

const getInputType = (key) => {
  if (key.includes('email')) return 'email';
  if (key.includes('password')) return 'password';
  if (key.includes('date')) return 'date';
  if (key.includes('number')) return 'number';
  return 'text';
};
</script>

<style scoped>
/* Styles personnalisés si nécessaire */
</style>
