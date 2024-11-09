<template>
  <div>
    <q-chat-message
      :name="name"
      :text="text"
      :stamp="stamp"
      :sent="name == 'me'"
      :bg-color="(name == 'me') ? 'purple-10': 'red'"
      :text-color="'white'"
      class="custom-chat-message"
    />
  </div>
</template>

<script setup lang="ts">
import type { Message } from './message'

defineProps<Message>()
</script>

<style scoped>
.custom-chat-message {
  margin-left: 20px;
}
</style>
