<template>
  <div class="container">
    <div v-if="displaySummary" class="summary">
      <div v-for="item in summary">
        <div>{{ item.key }}: <span class="summary-title">{{ item.value }}</span></div>
      </div>
    </div>
    <div class="section" v-if="cardOne.entries.length && displayCardOne">
      <card>
        <button class="title-button" @click="toggleCardOne"><h1 class="title">{{ cardOne.title }}</h1></button>
        <div v-for="entry in (displaySummary ? cardOne.entries.slice(0, 5) : cardOne.entries)">
          <div class="entry">
            <router-link
              v-if="entry.link"
              :to="`/tracker/extended/${cardOne.linkType}/${encodeURIComponent(entry.link)}`"
            >
              {{ entry.left.length > 28 ? entry.left.slice(0,28).trim() + '...' : entry.left }}
            </router-link>
            <div v-else >{{ entry.left.length > 28 ? entry.left.slice(0,28).trim() + '...' : entry.left }}</div>
            <div>{{ entry.right }}</div>
          </div>
        </div>
      </card>
    </div>
    <div class="section" v-if="cardTwo.entries.length && displayCardTwo">
      <card>
        <button class="title-button" @click="toggleCardTwo"><h1 class="title">{{ cardTwo.title }}</h1></button>
        <div v-for="entry in (displaySummary ? cardTwo.entries.slice(0, 5) : cardTwo.entries)">
          <div class="entry">
            <router-link
              v-if="entry.link"
              :to="`/tracker/extended/${cardTwo.linkType}/${encodeURIComponent(entry.link)}`"
            >
              {{ entry.left.length > 21 ? entry.left.slice(0,21).trim() + '...' : entry.left }}
            </router-link>
            <div v-else >{{ entry.left.length > 21 ? entry.left.slice(0,21).trim() + '...' : entry.left }}</div>
            <div>{{ entry.right }}</div>
          </div>
        </div>
      </card>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from "vue";
import Card from "../components/Card.vue";

defineProps<{
  summary: { key: string; value: string | number | undefined }[],
  cardOne: { title: string; entries: { left: string, right: string | number | undefined, link?: string }[], linkType?: 'tracks' | 'artists' },
  cardTwo: { title: string; entries: { left: string, right: string | number | undefined, link?: string }[], linkType?: 'tracks' | 'artists' },
}>();

const displaySummary = ref(true);
const displayCardOne = ref(true);
const displayCardTwo = ref(true);

const toggleCardOne = () => {
  displaySummary.value = !displaySummary.value;
  displayCardTwo.value = !displayCardTwo.value;
}

const toggleCardTwo = () => {
  displaySummary.value = !displaySummary.value;
  displayCardOne.value = !displayCardOne.value;
}

</script>

<style scoped>
.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-bottom: 10px;
}

.header h1 {
  text-align: center;
  margin: 0;
}

.summary {
  margin-bottom: 15px;
  margin-left: 10px;
  font-family: monospace;
  font-weight: bold;
}

.summary-title {
  color: var(--primary-color);
}

.section {
  margin-bottom: 20px;
  font-family: Helvetica, Arial, sans-serif;
  font-size: 16px;
  line-height: 24px;
}

.section:nth-last-child(1) {
  margin-bottom: 0;
}

.title-button {
  display: block;
  height: 30px;
  width: 105%;
  margin-top: -5px;
  margin-left: -10px;
  margin-bottom: 5px;
  border-radius: 15px;
}

.title-button:hover {
  background-color: hsla(227, 8%, 22%, 25%);
}

.title {
  text-align: left;
  margin-left: 10px;
}

.entry {
  display: flex;
  justify-content: space-between;
  text-align: left;
  text-shadow: none;
  color: var(--background-color);
  margin: 0;
  font-weight: bold;
  font-family: monospace;
}

.entry a {
  color: var(--background-color);
}

.entry a:hover {
  background-color: hsla(227, 8%, 22%, 5%);
  color: hsl(227, 8%, 42%);
}
</style>