<template>
  <div class="card">
    <div class="card-inner">
      <slot />
    </div>
  </div>
</template>

<style scoped>
.card {
  width: 364px;
  height: 156px;
  background-color: #FFDEEB;
  border-radius: 28px;
  color: white;
  font-size: 20px;
  filter: drop-shadow(0 0 0.15em #cc7296);
  padding: 1px;
  text-align: center;
}

.card-inner {
  margin: 3px;
  padding: 12px 16px;
  border: 1px solid #ff67a4;
  border-radius: 28px;
  height: 124px;
}
</style>