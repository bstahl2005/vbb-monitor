<template>
    <div>
        <img id="logo" src="~@/assets/logo.png" alt="electron-vue" width="150px">
        <train-infos></train-infos>
    </div>
</template>

<script>
    import TrainInfos from './TrainPage/TrainPage.vue'

    export default {
        name: 'LandingPage',
        components: {TrainInfos}
    }
</script>

<style scoped>

</style>