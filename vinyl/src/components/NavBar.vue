<script setup lang="ts">
</script>

<template>
  <footer>
    <div class="tabs">
      <div
        :class="'tab' + (!$route.path.includes('catalog') ? ' selected' : '')"
        @click="$router.push('/')"
      >
        <img class="icon" src="../assets/icons/vinyl.png" />
        <span class="tab-name">Activity</span>
      </div>
      <div
        :class="'tab' + ($route.path.includes('catalog') ? ' selected' : '')"
        @click="$router.push('/catalog')"
      >
        <img class="icon" src="../assets/icons/list.png" />
        <span class="tab-name">Catalog</span>
      </div>
      <div :style="{ width: '120px', background: 'rgb(41, 41, 41)' }" />
      <button
        @click="$router.push($route.path.includes('catalog') ? '/catalog/add' : '/catalog')"
      >
        <img class="button-icon" src="../assets/icons/plus.png" />
      </button>
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
    /* width: calc(100% - 50px); */
  }
  
  .tab {
    width: 100%;
    text-align: center;
    padding-top: 10px;
    background-color: rgb(41, 41, 41);
    font-size: 20px;
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
  }
  
  .selected {
    font-weight: bold;
    background-color: #1a1a1a;
    height: 60px;
    margin-top: -5px;
  }
  
  .icon {
    margin-bottom: 30px;
    width: 20px;
  }

  .tab-name {
    margin-bottom: 30px;
  }

  button {
    background-color: rgb(41, 41, 41);
    position: fixed;
    right: 0;
    bottom: 0;
    border-radius: 50%;
    width: 75px;
    height: 75px;
    font-size: 42px;
    padding: 0;
    border: 2px solid #bebebe;
    margin: 4px;
    display: flex;
    justify-content: center;
    align-items: center;
  }

  .button-icon {
    width: 32px;
  }
</style>