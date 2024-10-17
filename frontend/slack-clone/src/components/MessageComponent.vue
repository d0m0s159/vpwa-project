<template>
  <div>
    <q-chat-message
      :name="name"
      :text="text"
      :stamp="stamp"
      :sent="name == 'me'"
      :bg-color="(name == 'me') ? 'purple-10': 'red'"
      :text-color="'white'"
    />
  </div>
</template>

<script setup lang="ts">
  import type { Message } from './message'

  defineProps<Message>()
</script>