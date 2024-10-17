<template>
  <div>
    <q-chat-message
      :name="name"
      :text="text"
      :stamp="stamp"
      :sent="name == 'me'"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Message } from './message'

  defineProps<Message>()
</script>