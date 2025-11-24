<template>
  <div class="header">
    <img class="icon" :src="`/src/assets/icons/${icon || defaultIcon}.png`" />
    <h1 class="title">{{ title || defaultTitle }}</h1>
    <button class="right-button" @click="onRightButtonClick">
      <img v-if="rightIcon" class="icon" :src="`/src/assets/icons/${rightIcon}.png`" />
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const props = defineProps({
  icon: {
    type: String,
  },
  title: {
    type: String,
  },
  rightButtonClick: {
    type: Function,
  }
})

const router = useRouter();
const route = useRoute();

const defaultIcon = ref('vinyl-transparent')
const defaultTitle = ref('Music Player and Tracker');
const rightIcon = ref('back')
const routeParts = route.fullPath.split('/');
if (routeParts.length > 1) {
  switch(routeParts[1]) {
    case 'player':
      defaultIcon.value = 'note-transparent'
      defaultTitle.value = 'Now Playing';
      break;
    case 'tracker':
      defaultIcon.value = 'award-transparent'
      defaultTitle.value = 'Spotify Tracker';
      break;
    default: 
      defaultIcon.value = 'vinyl-transparent'
      rightIcon.value = 'settings'
      break;
  }
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
  width: 366px;
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

