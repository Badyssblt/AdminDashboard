<script setup>
import { ref, onMounted } from 'vue';
import { useRoute } from 'vue-router';
import {navigateTo, useNuxtApp} from '#app';

const route = useRoute();
const id = ref(route.query.id);

const $config = useRuntimeConfig();
const { $api } = useNuxtApp();

const table = ref('');
const formData = ref({});

const fetchItem = async () => {
  try {
    const response = await $api.get(`${$config.public.API_URL}/api/${$config.public.IS_ADMIN_IN_ROUTE ? 'admin/' : ''}${table.value}/${id.value}`);
    formData.value = response.data;
  } catch (e) {
    console.error(e);
  }
};

const editItem = async () => {
  try {
    await $api.patch(`${$config.public.API_URL}/api/${table.value}/${id.value}`, formData.value);
    alert('Mis à jour avec succès');
  } catch (e) {
    console.error(e);
    alert('Failed to update item');
  }
};

const handleSubmit = (event) => {
  event.preventDefault();
  editItem();
};

const changeType = (type) => {
  localStorage.setItem('table', type);
}

onMounted(async () => {
  if(localStorage.getItem('table') === "home") {
    navigateTo('/admin');
  }
  table.value = localStorage.getItem('table');
  if (table.value && table.value.endsWith('s')) {
    table.value = table.value.slice(0, -1);
  }
  await fetchItem();
});

const getInputType = (key) => {
  if (key.includes('email')) return 'email';
  if (key.includes('password')) return 'password';
  if (key.includes('date')) return 'date';
  if (key.includes('number')) return 'number';
  return 'text';
};
</script>

<template>
  <div class="flex p-4">
    <AdminAside @changeType="changeType"/>
    <form v-if="Object.keys(formData).length > 0" @submit="handleSubmit" class="max-w-lg mx-auto p-4 bg-white shadow-md rounded-lg w-full">
      <div v-for="(value, key) in formData" :key="key" class="mb-4">
        <template v-if="typeof value === 'object' && !Array.isArray(value)">
          <h3 class="text-lg font-semibold mb-2 capitalize">{{ key.replace('_', ' ') }}</h3>
          <div v-for="(subValue, subKey) in value" :key="subKey" class="mb-4">
            <label :for="`${key}_${subKey}`" class="block text-gray-700 text-sm font-bold mb-2 capitalize">
              {{ subKey.replace('_', ' ') }}
            </label>
            <input
                v-model="formData[key][subKey]"
                :id="`${key}_${subKey}`"
                :name="`${key}_${subKey}`"
                :type="getInputType(subKey)"
                class="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
                :placeholder="subKey.replace('_', ' ')"
            />
          </div>
        </template>
        <template v-else>
          <label :for="key" class="block text-gray-700 text-sm font-bold mb-2 capitalize">
            {{ key.replace('_', ' ') }}
          </label>
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
        Submit
      </button>
    </form>
  </div>

</template>

<style scoped>
/* Ajoutez ici des styles personnalisés si nécessaire */
</style>
