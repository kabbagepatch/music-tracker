/<template>
  <div class="now-playing">
    <div class="now-playing-inner">
      <div class="song-name">{{ songName }}</div>
      <div class="player">
        <div class="player-left">
          <div class="icon">⏮</div>
          <div class="divider" />
          <div>Menu</div>
        </div>
        <div class="play-button icon" @click="playing = !playing">
          {{ playing ? "Pause" : "Play" }}
        </div>
        <div class="player-right">
          <div class="icon">⏭</div>
          <div class="divider" />
          <div class="heart" @click="liked = !liked">
            {{ liked ? "💖" : "🤍" }}
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  data() {
    return {
      songName: "Renee Rapp - Leave Me Alone",
      playing: false,
      liked: false,
    };
  },
}
</script>

<style>
.now-playing {
  height: 150px;
  background-color: #FFDEEB;
  border-radius: 28px;
  color: white;
  text-align: center;
  font-size: 28px;
  filter: drop-shadow(0 0 0.15em #cc7296);
}

.now-playing-inner {
  margin: 3px;
  padding: 4px 16px;
  border: 1px solid #ff67a4;
  border-radius: 28px;
  height: 134px;
}

.song-name {
  width: 100%;
  font-size: 24px;
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

.play-button {
  font-size: 32px;
  flex: 3;
  background-color: #ff67a4;
  border-radius: 50%;
  width: 80px;
  height: 80px;
  display: flex;
  justify-content: center;
  align-items: center;
  filter: drop-shadow(0 0 0.1em #cc7296);
}

.play-button:hover, .heart:hover {
  background-color: #ff4d87;
  cursor: pointer;
  filter: drop-shadow(0 0 0.25em #cc7296);
}

.player-left, .player-right {
  flex: 4;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.divider {
  height: 10px;
  background: #EFEEC8;
  box-shadow: 0 0 0.1em #cc7296;
  width: 100%;
  border-radius: 20px;
}

.heart {
  font-size: 26px;
  text-shadow: none;
}
</style>