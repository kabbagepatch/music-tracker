<template>
  <div class="header">
    <img class="icon" :src="`/src/assets/icons/${icon}.png`" />
    <h1 class="title">{{ titleOverride || title }}</h1>
    <button class="right-button" @click="onRightButtonClick">
      <img v-if="rightIcon" class="icon" :src="`/src/assets/icons/${rightIcon}.png`" />
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  titleOverride: {
    type: String,
  },
  rightButtonClick: {
    type: Function,
  }
})

const router = useRouter();
const route = useRoute();

const icon = ref('year')
const title = ref('Music Player and Tracker');
const rightIcon = ref('back')
switch(route.fullPath) {
  case '/':
    icon.value = 'vinyl-transparent'
    rightIcon.value = 'settings'
  case '/player':
    icon.value = 'note-transparent'
    title.value = 'Now Playing';
    break;
  case '/tracker':
  case '/tracker/basic':
  case '/tracker/extended':
    icon.value = 'award-transparent'
    title.value = 'Spotify Tracker';
    break;
    
}

const onRightButtonClick = () => {
  if (props.rightButtonClick) {
    props.rightButtonClick();
  } else {
    router.back();
  }
}

</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  margin-top: -5px;
  margin-bottom: 10px;
}

.header .icon {
  display: block;
  margin-right: 10px;
  width: 30px;
  height: 30px;
}

.header .title {
  margin: 0;
  font-size: 30px;
}

.header .right-button {
  width: 37px;
  height: 30px;
  border-radius: 5px;
  margin-right: 5px;
}

.header .right-button-background {
  background-color: var(--primary-color);
}

.right-button .icon {
  width: 25px;
  height: 25px;
  margin: 1px;
}
</style>

