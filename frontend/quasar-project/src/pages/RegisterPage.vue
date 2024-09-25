<template>
  <q-page class="column flex-center">
    <div>
      <q-input v-model="inputValue" :outlined="true" label="E-mail" />

    </div>
  </q-page>
</template>

<script>
export default {
  data() {
    return {
      inputValue: 'fdsjfklajd',
    };
  },
};
</script>
