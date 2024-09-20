<template>
  <div class="flex flex-col">
    <NuxtLink to="/admin/create" class="border px-4 py-2 w-full rounded-full my-4 mx-2">Créer un élément</NuxtLink>
    <div class="overflow-auto">
      <table class="min-w-full divide-y divide-gray-200">
        <thead class="bg-gray-50">
        <tr>
          <th
              v-for="(key, index) in columnKeys"
              :key="index"
              class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
          >
            {{ key }}
          </th>
        </tr>
        </thead>
        <tbody class="bg-white divide-y divide-gray-200">
        <tr v-for="(row, rowIndex) in data" :key="rowIndex" class="hover:bg-gray-50">
          <td
              v-for="(key, index) in columnKeys"
              :key="index"
              class="px-6 py-4 whitespace-nowrap text-sm text-gray-900"
              @contextmenu.prevent="openContextMenu($event, row, key)"
          >
            {{ row[key] }}
          </td>
        </tr>
        </tbody>
      </table>
      <div
          v-if="contextMenu.visible"
          :style="{ top: contextMenu.y + 'px', left: contextMenu.x + 'px' }"
          class="absolute bg-white shadow-md border border-gray-200 rounded-md py-1 z-50"
      >
        <ul>
          <li
              v-for="(option, index) in contextOptions"
              :key="index"
              class="px-4 py-2 hover:bg-gray-100 cursor-pointer text-gray-700"
              @click="selectOption(option)"
          >
            {{ option }}
          </li>
        </ul>
      </div>
    </div>
  </div>

</template>
<script setup>
import { computed } from 'vue';
import {navigateTo} from "#app";

const props = defineProps({
  data: {
    type: Array,
    required: true,
  },
});



const columnKeys = computed(() => {
  if (props.data.length === 0) return [];
  return Object.keys(props.data[0]);
});

const data = ref(props.data);
const router = useRouter();

const contextMenu = ref({
  visible: false,
  x: 0,
  y: 0,
  row: null,
  column: null
});

const contextOptions = ref(["Edit", "Delete", "View Details"]);

// Ouvrir le menu contextuel
const openContextMenu = (event, row, column) => {
  contextMenu.value = {
    visible: true,
    x: event.clientX,
    y: event.clientY,
    row,
    column
  };
};

const selectOption = (option) => {
  if(option === "Edit"){
    console.log(contextMenu.value.row)
    navigateTo({
      path: `/admin/edit`,
      query: {id: contextMenu.value.row.id}});
  }else if(option === "Delete") {
    handleDelete(contextMenu.value.row);
  }

  closeContextMenu();
};

const { $api } = useNuxtApp();
const $config = useRuntimeConfig();

const handleDelete = async (row) => {
  if (confirm(`Are you sure you want to delete the item with ID: ${row.id}?`)) {
    const response = await $api.delete($config.public.API_URL + '/api/asset/' + row.id);
    deleteRow(row.id);
  }
};

const deleteRow = (id) => {
  data.value = data.value.filter(item => item.id !== id);
};

const closeContextMenu = () => {
  contextMenu.value.visible = false;
};

window.addEventListener('click', closeContextMenu);
</script>
