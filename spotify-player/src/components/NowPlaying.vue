/<template>
  <div class="now-playing">
    <div class="now-playing-inner">
      <div class="song-name">{{ songName.length > 27 ? songName.substring(0,26) + '...' : songName }}</div>
      <div class="player">
        <div class="player-left">
          <button class="icon over" @click="backClick">⏮</button>
          <div class="divider" />
          <button class="under">Menu</button>
        </div>
        <div class="play-button-container">
          <div class="play-button" @click="playing = !playing">
            <div class="play-button-inner icon">
              {{ playing ? "⏸" : "▶"}}
            </div>
          </div>
        </div>
        <div class="player-right">
          <button class="icon over" @click="forwardClick">⏭</button>
          <div class="divider" />
          <button class="under heart" @click="liked = !liked">
            {{ liked ? "💖" : "🤍" }}
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from "vue";

defineProps({
  songName: {
    type: String,
    default: "Renee Rapp - Leave Me Alone",
  },
  backClick: {
    type: Function,
    default: () => {},
  },
  forwardClick: {
    type: Function,
    default: () => {},
  },
});

const playing = ref(false);
const liked = ref(false);
</script>

<style>
.now-playing {
  height: 156px;
  background-color: #FFDEEB;
  border-radius: 28px;
  color: white;
  text-align: center;
  font-size: 20px;
  filter: drop-shadow(0 0 0.15em #cc7296);
}

.now-playing-inner {
  margin: 3px;
  padding: 12px 16px;
  border: 1px solid #ff67a4;
  border-radius: 28px;
  height: 124px;
}

.song-name {
  width: 100%;
  flex-wrap: nowrap;
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
  color: #ff67a4;
  text-shadow: none;
  background: white;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  padding: 2px;
  filter: drop-shadow(0 0 0.1em #cc7296);
}

.play-button-inner {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 78px;
  height: 78px;
  border: 1px solid #ff67a4;
  border-radius: 50%;
}

.play-button:hover, .heart:hover {
  cursor: pointer;
  filter: drop-shadow(0 0 0.25em #cc7296);
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
  background: #EFEEC8;
  box-shadow: 0 0 0.1em #cc7296;
  width: 100%;
  border-radius: 20px;
}

.over, .under {
  height: 45px;
}

.heart {
  text-shadow: none;
}
</style>