<template>
  <div class="container">
    <Header />
    <button>
      <router-link to="/tracker/extended/year/2025">
        <title-card
          title="Yearly"
          iconName="year"
          :subtitles="['View your Top Tracks and Artists by year']"
        />
      </router-link>
    </button>
    <button>
      <router-link to="/tracker/extended/year/2025/11">
        <title-card
          title="Monthly"
          iconName="month"
          :subtitles="['Dive Deeper into your Top Tracks and Artists by month']"
        />
      </router-link>
    </button>
    <button>
      <router-link to="/tracker/extended/custom">
        <title-card
          title="Custom"
          iconName="calendar"
          :subtitles="['Pick a custom date range to view your stats']"
        />
      </router-link>
    </button>
  </div>
</template>

<script setup lang="ts">
import TitleCard from "../components/TitleCard.vue";
import Header from "../Header.vue";
</script>

<style scoped>
button {
  margin-top: 16px;
}
</style>