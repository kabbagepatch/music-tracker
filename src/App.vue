<template>
  <main class="container">
    <RouterView />
  </main>
</template>

<script setup lang="ts">
</script>

<style>
@font-face {
  font-family: "Pixels";
  src: url('./assets/Jersey10-Regular.ttf');
}
@font-face {
  font-family: "Bubbly";
  src: url('./assets/Atop-R99O3.ttf');
}

:root {
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
  font-size: 20px;
  line-height: 24px;
  font-weight: 400;
  text-shadow: -1.5px -1.5px 0 var(--text-outline), 1.5px -1.5px 0 var(--text-outline), -1.5px 1.5px 0 var(--text-outline), 1.5px 1.5px 0 var(--text-outline);
  background-color: var(--background-color);
  background-repeat: no-repeat;
  background-size: cover;
  padding: 10px;
  display: flex;
  justify-content: center;
  align-items: center;

  font-synthesis: none;
  text-rendering: optimizeLegibility;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  -webkit-text-size-adjust: 100%;

  --primary-color: hsl(60, 63%, 89%);
  --primary-color-shadow: hsl(60, 63%, 69%);
  --secondary-color: hsl(77, 14%, 45%);
  --tertiary-color: hsl(31, 43%, 53%);
  --background-color: hsl(227, 8%, 22%);
  --text-color: hsl(0, 0%, 100%);
  --text-outline: hsl(26, 62%, 18%);

  --primary-color: hsl(39, 59%, 78%);
  --primary-color-shadow: hsl(39, 59%, 58%);
  --secondary-color: hsl(18, 71%, 27%);
  --tertiary-color: hsl(31, 51%, 34%);
  --background-color: hsl(26, 42%, 19%);
  --text-color: hsl(0, 0%, 100%);
  --text-outline: hsl(26, 42%, 19%);
}

.container {
  margin: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
}

h1 {
  margin: 0 5px;
  margin-bottom: 10px;
  font-size: 28px;
  width: 100%;
  color: var(--text-color);
}

button {
  display: block;
  margin: 0;
  padding: 0;
  cursor: pointer;
  border: none;
  background: none;
  outline: none;
  color: var(--text-color);
  text-shadow: -1.5px -1.5px 0 var(--text-outline), 1.5px -1.5px 0 var(--text-outline), -1.5px 1.5px 0 var(--text-outline), 1.5px 1.5px 0 var(--text-outline);
  font-size: 24px;
  font-family: Pixels, Inter, Avenir, Helvetica, Arial, sans-serif;
}

a {
  text-decoration: none;
}
</style>