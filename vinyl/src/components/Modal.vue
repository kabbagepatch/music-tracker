<script setup lang="ts">
defineProps<{
  onClose?: any
}>()

const modalClick = (e: any) => {
  e.stopPropagation();
}
</script>

<template>
  <div class="backdrop" @click="onClose">
    <div class="modal" @click="modalClick">
      <header class="modal-header">
        <slot name="header">
          This is the default title!
        </slot>
        <button
          type="button"
          class="close-button"
          @click="onClose"
        >
          x
        </button>
      </header>

      <section class="modal-body">
        <slot name="body">
          This is the default body!
        </slot>
      </section>

      <footer class="modal-footer">
        <slot name="footer">
          This is the default footer!
        </slot>
      </footer>
    </div>
  </div>
</template>

<style scoped>
.backdrop {
  position: fixed;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;
  background-color: rgba(0, 0, 0, 0.7);
  display: flex;
  justify-content: center;
  align-items: center;
}

.modal {
  background-color: #1a1a1a;
  box-shadow: 2px 2px 5px 1px black;
  overflow-x: auto;
  display: flex;
  flex-direction: column;
  min-width: 300px;
}

.modal-header, .modal-footer {
  min-height: 40px;
  padding: 15px;
  display: flex;
  align-items: start;
  justify-content: space-between;
  gap: 12px;
}

.modal-footer {
  justify-content: end;
}

.modal-header {
  padding-right: 0px;
}

.close-button {
  font-size: 24px;
  padding: 5px 15px;
}

.modal-body {
  padding: 0 15px;
}
</style>