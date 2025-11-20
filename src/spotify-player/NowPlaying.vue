<template>
  <card>
    <div class="song-name-container">
      <div class="song-name" @click="nowPlayingClick">{{ artists }} - {{ songName }}</div>
    </div>
    <div class="player">
      <div class="player-left">
        <button class="icon over" @click="backClick">
          <img :style="{ width: '40px', marginTop: '8px' }" src="../assets/rewind.png">
        </button>
        <div class="divider" />
        <button class="under" @click="menuClick">Home</button>
      </div>
      <div class="play-button-container">
        <div class="play-button" @click="playClick">
          <div class="play-button-inner icon">
            <img v-if="!playing" :style="{ width: '50px', marginLeft: '5px' }" src="../assets/play-button.png">
            <img v-else :style="{ width: '50px' }" src="../assets/pause-button.png">
          </div>
        </div>
      </div>
      <div class="player-right">
        <button class="icon over" @click="forwardClick">
          <img :style="{ width: '40px', marginTop: '8px' }" src="../assets/fast-forward.png">
        </button>
        <div class="divider" />
        <button class="under heart" @click="liked = !liked">
          <img v-if="!liked" :style="{ width: '30px' }" src="../assets/heart.png">
          <img v-else :style="{ width: '30px' }" src="../assets/heart-filled.png">
        </button>
      </div>
    </div>
  </card>
</template>

<script setup>
import { ref } from "vue";
import Card from "../components/Card.vue";

defineProps({
  songName: {
    type: String,
    default: "",
  },
  artists: {
    type: String,
    default: "",
  },
  backClick: {
    type: Function,
    default: () => {},
  },
  forwardClick: {
    type: Function,
    default: () => {},
  },
  playClick: {
    type: Function,
    default: () => {},
  },
  playing: {
    type: Boolean,
    default: false,
  },
  liked: {
    type: Boolean,
    default: false,
  },
  nowPlayingClick: {
    type: Function,
    default: () => {},
  },
});

</script>

<style scoped>
.song-name-container {
  max-width: 324px;
  width: 100%;
  height: 24px;
  overflow: hidden;
  position: relative;
  white-space: nowrap;
  display: flex;
  justify-content: center;
}

.song-name {
  flex-wrap: nowrap;
  animation: move 10s linear infinite forwards;
  cursor: pointer;
  font-size: 28px;
}

@keyframes move {
  0%,
  10%,
  90%,
  100% {
    transform: translateX(calc(max(0px, (100% - 314px) / 2)));
  }
  40%,
  60% {
    transform: translateX(calc(-1 * max(0px, (100% - 314px) / 2)));
  }
}

.player {
  display: flex;
  justify-content: space-evenly;
  align-items: center;
  gap: 20px;
  height: 110px;
  letter-spacing: 0;
  line-height: 0;
}

.icon {
  font-size: 32px;
}

.play-button-container {
  flex: 3;
  display: flex;
  justify-content: center;
  align-items: center;
}

.play-button {
  background: var(--tertiary-color);
  border-radius: 50%;
  width: 80px;
  height: 80px;
  padding: 2px;
  filter: drop-shadow(0 0 0.1em var(--primary-color-shadow));
}

.play-button-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 78px;
  height: 78px;
  border: 1px solid var(--primary-color);
  border-radius: 50%;
}

.play-button:hover, .heart:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 0.25em var(--primary-color-shadow));
}

.player-left, .player-right {
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
}

.divider {
  height: 6px;
  background: var(--tertiary-color);
  box-shadow: 0 0 0.1em var(--primary-color-shadow);
  width: 100%;
  border-radius: 20px;
}

.over, .under {
  width: 45px;
  height: 45px;
  font-size: 28px;
}
</style>