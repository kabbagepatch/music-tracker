<script setup lang="ts">
defineProps<{
  vinyl: any,
  onPlay?: any,
}>()
</script>

<template>
  <section class="vinyl-header">
    <img class="vinyl-art" :src="vinyl.imageUrl" :alt="vinyl.album">
    <div class="vinyl-details">
      <h2 class="album">{{ vinyl.album }}</h2>
      <h3 class="artist" :style="{ color: 'white' }">{{ vinyl.artist }}</h3>
      <div class="published">Released: {{ vinyl.published }}</div>
      <button v-if="onPlay" :style="{ background: 'black' }" class="play-button" @click="onPlay">Play Vinyl</button>
    </div>
  </section>
  <section>
    <h3 class="subheader">Genres</h3>
    <div class="tags">
      <div v-for="tag in vinyl.genres">
        <div
          class="tag"
          :style="{
            color: 'white',
            borderColor: 'white'
          }"
        >{{ tag }}</div>
      </div>
    </div>
  </section>
  <section>
    <h3 class="subheader">Track List</h3>
    <div class="tracks">
      <div v-for="(track) in vinyl.tracks">
        <div class="track">
          <span class="track-index">
            {{ track.position }}.
          </span>
          <span>
            {{ track.title }}
          </span>
        </div>
      </div>
    </div>
  </section>
</template>

<style scoped>
  section {
    margin-bottom: 16px;
  }
  
  .play-button {
    margin: 10px 0;
  }

  .vinyl-header {
    display: flex;
  }

  .vinyl-art {
    width: 150px;
    height: 150px;
    margin-right: 12px;
  }

  .album, .artist {
    margin: 0;
    line-height: 1.3em;
  }

  .album {
    margin-bottom: 10px;
  }

  .published {
    color: #b3b3b3
  }

  .tags {
    display: flex;
    gap: 8px;
    flex-wrap: wrap;
  }

  .subheader {
    margin-top: 0;
    margin-bottom: 4px;
  }

  .tag {
    border: 1px solid white;
    font-size: 14px;
    padding: 0 12px;
    border-radius: 16px;
  }

  .track-index {
    color: #b3b3b3;
    margin-right: 4px;
  }
</style>
