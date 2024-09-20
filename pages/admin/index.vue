<script setup >
const currentType = ref('home');
const tableCount = ref(0);

const changeType = (type) => {
  currentType.value = type;
  localStorage.setItem('table', type);
}
onMounted(() => {
  if(localStorage.getItem('table')){
    currentType.value = localStorage.getItem('table');
  }
  if(localStorage.getItem('table_count')) {
    tableCount.value = localStorage.getItem('table_count');
  }
})


</script>

<template>
  <div class="flex gap-4 p-4">
    <AdminAside @changeType="changeType"/>
    <div v-if="currentType === 'home'" class="p-4">
      <h1 class="font-bold text-xl">Bienvenue dans AdminDashboard</h1>
      <AdminHomeCard :number="tableCount" :title="'Toutes mes tables'"/>
    </div>
    <AdminContent :type="currentType" api="http://localhost:8215/api/" :key="currentType" v-else/>
  </div>

</template>

