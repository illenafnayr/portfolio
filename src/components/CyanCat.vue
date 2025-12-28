<template>
  <div id="kitty-container">
    <img src="../assets/cyancat.gif" alt="not my problem, it's yours" id="kitty">
  </div>
</template>

<script>
export default {
  name: 'CyanCat',

}
</script>

<style lang="scss">

body {
  overflow: hidden;
}

#kitty-container{
    width: 100vw;
    height: 100vh;
    display: none;
    justify-content: center;
    align-items: center;
}

#kitty {
  width: 100%;
  height: 100%;
}
</style>