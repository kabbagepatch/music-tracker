<script setup lang="ts">
</script>

<template>
  <footer>
    <div class="tabs">
      <div
        :class="'tab' + (!$route.path.includes('catalog') ? ' selected' : '')"
        @click="$router.push('/')"
      >
        Activity
      </div>
      <div
        :class="'tab' + ($route.path.includes('catalog') ? ' selected' : '')"
        @click="$router.push('/catalog')"
      >
        Catalog
      </div>
      <button
        @click="$router.push('/catalog/add')"
      >+</button>
    </div>
  </footer>
</template>

<style scoped>
  footer {
    background-color: rgb(41, 41, 41);
    position: fixed;
    bottom: 0;
    left: 0;
    height: 50px;
    width: 100%;
  }

  .tabs {
    display: flex;
    width: calc(100% - 50px);
    height: 100%;
  }

  .tab {
    width: 100%;
    height: 100%;
    text-align: center;
    padding-top: 10px;
    background-color: rgb(41, 41, 41);
    font-size: 18px;
  }

  .selected {
    font-weight: bold;
    background-color: #1a1a1a;
    height: 60px;
    margin-top: -10px;
  }

  button {
    background-color: rgb(41, 41, 41);
    position: fixed;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    width: 80px;
    height: 80px;
    font-size: 48px;
    padding: 0;
    border: 2px solid #bebebe;
    margin: 5px;
  }
</style>