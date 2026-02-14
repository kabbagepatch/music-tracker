<script setup lang="ts">
import type { Vinyl } from '../types';

const props = defineProps<{
  vinyl?: Vinyl,
  onPlay?: any,
  onAdd?: any,
}>()

</script>

<template>
  <section class="vinyl-header">
    <img class="vinyl-art" v-if="vinyl?.imageUrl" :src="vinyl?.imageUrl" :alt="vinyl?.album" />
    <div class="vinyl-art" v-else />
    <div class="vinyl-details">
      <h2 v-if="vinyl?.album" class="album">{{ vinyl?.album }}</h2>
      <h2 v-else class="album">Loading...</h2>
      <h3 class="artist" :style="{ color: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white', }">{{ vinyl?.artist }}</h3>
      <div class="published">Released: {{ vinyl?.published }}</div>
      <div v-if="vinyl?.barcode" class="published">Bar Code: {{ vinyl?.barcode }}</div>
      <div class="published">Disk: {{ vinyl?.discColor }}</div>
    </div>
    <div :style="{ width: '40px' }" />
    <button class="back-button" @click="$router.back()">
      <img src="../assets/icons/back.png" />
    </button>
  </section>
  <section class="button-container">
    <button
      v-if="onPlay"
      :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white' }"
      class="play-button"
      @click="onPlay"
    >
      Play Vinyl
    </button>
    <button
      v-if="onAdd"
      :style="{ background: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white' }"
      class="play-button"
      @click="onAdd"
    >
      Add To Catalog
    </button>
    <hr class="line" :style="{ borderColor: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white' }" />
  </section>
  <section>
    <h3 class="subheader">Genres</h3>
    <div class="tags">
      <div v-for="tag in vinyl?.genres">
        <div
          class="tag"
          :style="{
            color: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white',
            borderColor: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white'
          }"
        >{{ tag }}</div>
      </div>
    </div>
  </section>
  <section>
    <h3 class="subheader">Track List</h3>
    <div class="tracks">
      <div v-for="(track) in vinyl?.tracks">
        <div class="track">
          <span class="track-index" :style="{ color: vinyl?.albumColors?.length ? vinyl.albumColors[0] : 'white', }">
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

  .back-button {
    width: 36px;
    height: 36px;
    position: absolute;
    right: 0;
    margin-top: -2px;
    margin-right: 5px;
    padding: 0;
    background: none;
  }

  .back-button img {
    width: 24px;
    margin-top: 5px;
  }

  .button-container {
    width: 100%;
    text-align: center;
    position: relative;
    margin-bottom: 0;
  }

  .line {
    position: absolute;
    margin-top: -30px;
    width: 100%;
    z-index: 1;
  }
  
  .play-button {
    color: black;
    font-size: 20px;
    padding: 4px 16px;
    font-weight: bold;
    margin: 10px 0;
    z-index: 2;
    position: relative;
  }

  .vinyl-header {
    display: flex;
  }

  .vinyl-art {
    width: 175px;
    height: 175px;
    margin-right: 12px;
  }

  .album, .artist {
    margin: 0;
    line-height: 1.3em;
  }

  .artist {
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
