<template>
  <div class="header">
    <img class="icon" :src="`/src/assets/${icon}.png`" />
    <h1 class="title">{{ title }}</h1>
    <button :class="'right-button' + (rightIcon ? '' : ' right-button-background')" @click="onRightButtonClick">
      <img v-if="rightIcon" class="icon" :src="`/src/assets/${rightIcon}.png`" />
    </button>
  </div>
</template>

<script setup lang="js">
import { ref } from 'vue';
import { useRoute, useRouter } from 'vue-router';

const router = useRouter();
const route = useRoute();

const icon = ref('vinyl-transparent')
const title = ref('Music Player and Tracker');
const rightIcon = ref()
switch(route.fullPath) {
  case '/player':
    icon.value = 'note-transparent'
    title.value = 'Now Playing';
    rightIcon.value = 'back'
    break;
  case '/tracker':
    icon.value = 'award-transparent'
    title.value = 'Spotify Tracker';
    rightIcon.value = 'back'
    break;
  default:
    rightIcon.value = undefined;
}

const props = defineProps({
  rightButtonClick: {
    type: Function,
  }
})

const onRightButtonClick = () => {
  console.log(props.rightButtonClick);
  if (props.rightButtonClick) {
    props.rightButtonClick();
  } else {
    router.push('/');
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

