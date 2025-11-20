<template>
  <div class="container">
    <Header />
    <div class="titleContainer">
      <h1 @click="switchItemType">Top {{ itemType === 'artists' ? 'Artists' : 'Tracks' }}</h1>
      <h1 @click="switchTimeRange">{{ timeRange === 'long_term' ? '1 Year' : (timeRange === 'medium_term' ? '6 Months' : '4 Weeks') }}</h1>
    </div>
    <ItemList :items="items" :onMore="switchLimit" />
  </div>
</template>

<script setup lang="ts">
import { Ref, ref } from "vue"

import Header from "../Header.vue";
import ItemList from "../components/ItemList.vue";
import { getTopItems } from '../services/spotify';

const itemType : (Ref<'tracks' | 'artists'>) = ref('tracks');
const timeRange : (Ref<'short_term' | 'medium_term' | 'long_term'>) = ref('short_term');
const limit = ref(10);

const items: any = ref([]);
const dataCache: any = {}

const setTopItems = () => {
  const cached = dataCache[`${itemType.value}-${timeRange.value}`];
  if (cached && cached.length >= limit.value) {
    items.value = dataCache[`${itemType.value}-${timeRange.value}`].slice(0, limit.value);
    return;
  }

  getTopItems(itemType.value, timeRange.value, limit.value).then(data => {
    items.value = data.items;
    dataCache[`${itemType.value}-${timeRange.value}`] = data.items;
  }).catch(err => {
    console.error("Error fetching top items:", err);
  });
}
setTopItems();

const switchItemType = () => {
  if (itemType.value === 'tracks') {
    itemType.value = 'artists';
  } else {
    itemType.value = 'tracks';
  }
  setTopItems();
};

const switchTimeRange = () => {
  if (timeRange.value === 'long_term') {
    timeRange.value = 'short_term';
  } else if (timeRange.value === 'medium_term') {
    timeRange.value = 'long_term';
  } else {
    timeRange.value = 'medium_term';
  }
  setTopItems();
};

const switchLimit = () => {
  console.log("onMore");
  if (limit.value === 10) {
    limit.value = 20;
  } else if (limit.value === 20) {
    limit.value = 50;
  } else {
    limit.value = 10;
  }
  setTopItems();
}

</script>

<style scoped>
.container {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  margin-bottom: -10px;
}

.titleContainer {
  display: flex;
  width: 100%;
  justify-content: space-between;
  margin: 3px 0;
}

h1 {
  margin-bottom: 10px;
  font-size: 28px;
  color: white;
  cursor: pointer;
  width: auto;
}
</style>