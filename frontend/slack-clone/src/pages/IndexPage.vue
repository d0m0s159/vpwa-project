<template>
  <q-page>
    <div class="example-row-all-breakpoints">
      <div class="col">
        <div v-for="n in 3" :key="n">
          <q-btn no-caps square unelevated size="0px" padding="0px" color="teal">
            <q-avatar class="channel-icon" text-color="black">
              new
            </q-avatar>
          </q-btn>
        </div>
        <div v-for="n in 20" :key="n">
          <q-btn no-caps square unelevated size="0px" padding="0px" color="red">
            <q-avatar class="channel-icon" text-color="black">
              oh no
            </q-avatar>
          </q-btn>
        </div>
      </div>
    </div>
  </q-page>
</template>

<style scoped>
  h1 {
    margin-top: 0px
  }
  .channel-icon {
    margin: 6px;
    background-color: white;
  }
  .list-container {
    width: 60px;

  }
</style>

<style lang="sass">

</style>

<script>
export default {
  setup () {
    return {
      horizontalThumbStyle: {
        opacity: 0,
      },
      verticalThumbStyle: {
        width: '4px',
      }
    }
  }
}
</script>
