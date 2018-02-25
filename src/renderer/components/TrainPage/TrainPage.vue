<template>
    <div id="wrapper">
        <main>
            <div class="left-side">
                <div v-for="trainDat in trainArr">
                    <div class="outerBox">
                        <div class="logo">
                            <img src="../../assets/suburban.svg">
                        </div>

                        <div class="innerBox">
                            <div class="vCenter">
                                <div class="border">
                                    <div class="icon">
                                        ICON
                                    </div>
                                    <div id="endstation" class="text">
                                        <div v-if="trainDat.direction.substr(0,1) === 'S'">
                                            {{ trainDat.station_name }} {{ trainDat.direction.substr(2) }}
                                        </div>
                                    </div>
                                </div>

                                <div class="border">
                                    <div class="icon">
                                        ICON
                                    </div>
                                    <div id="arrive" class="text">
                                        <div class="value">{{ getFormattedTime(trainDat.when) }} Uhr
                                            <span v-if="trainDat.delay">
                                                <span v-if="trainDat.delay > 0">
                                                    <span class="delay"> + {{ trainDat.delay }}</span>
                                                </span>
                                                <span v-else-if="trainDat.delay === 0"></span>
                                                <span v-else="trainDat.delay < 0">
                                                <span class="minusDelay"> - {{ trainDat.delay }}</span>
                                            </span>
                                    </span>
                                        </div>
                                    </div>
                                </div>

                                <div class="border">
                                    <div class="icon">
                                        ICON
                                    </div>
                                    <div id="platform" class="text">
                                        <!-- TODO replace with track and check with bus stop attr -->
                                        <div class="value">Gleis {{  }}</div>
                                    </div>
                                </div>

                            </div>

                        </div>

                        <div class="sbahnbox" v-if="trainDat.product === 'suburban'"></div>

                        <div class="sbahnbox" v-else-if="trainDat.product === 'bus'"></div>

                        <div class="sbahnbox" v-else="trainDat.product === 'regional'">
                            <!-- TODO check the attribute -->
                        </div>
                    </div>
                </div>
            </div>

            <div class="right-site">
                Right side
            </div>
        </main>
    </div>
</template>

<script>
    import mom from 'moment'
    import TransData from '../../data/traindata'
    import { EventBus } from '../EventBus';

    export default {
        data () {
            return {
                name: "Fahrplandaten",
                trainArr: [],
            }
        },
      created () {
        EventBus.$on('transportData', transportData => {
          this.trainArr = transportData

          // console.log(`Oh, that's nice. It's gotten: \n ${transportData[0].delay} :)`)
        })
      },
      methods: {
        getFormattedTime(time) {
            return mom(time).format("HH:mm")
        }
      }
    }
</script>

<style scoped>
    @import "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css";
    @import "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js";


    .delay {
        color: red;
    }

    .minusDelay {
        color: aquamarine;
    }

    * {
        box-sizing: border-box;
        margin: 0;
        padding: 0;
    }

    body { font-family: 'Source Sans Pro', sans-serif; }

    #wrapper {
        background:
                radial-gradient(
                        ellipse at top left,
                        rgba(255, 255, 255, 1) 40%,
                        rgba(229, 229, 229, .9) 100%
                );
        height: 100vh;
        padding: 60px 80px;
        width: 100vw;
    }

    main {
        display: flex;
        justify-content: space-between;
    }

    main > div { flex-basis: 50%; }

    .left-side {
        display: flex;
        flex-direction: column;
    }

    .doc p {
        color: black;
        margin-bottom: 10px;
    }

    .doc button {
        font-size: .8em;
        cursor: pointer;
        outline: none;
        padding: 0.75em 2em;
        border-radius: 2em;
        display: inline-block;
        color: #fff;
        background-color: #4fc08d;
        transition: all 0.15s ease;
        box-sizing: border-box;
        border: 1px solid #4fc08d;
    }

    .doc button.alt {
        color: #42b983;
        background-color: transparent;
    }

    /* s-bahn data format */
    .outerBox {
        width: 500px;
        height: 200px;
        overflow: hidden;
        display: inline-block;

    }

    .innerBox {
        position: absolute;
        border: solid;
        border-radius: 50px;
        border-width: 2px;
        width: 400px;
        height: 196px;
        margin-left: 50px;
        background-color: #666666;
        -moz-box-shadow:    inset 0 0 20px #9d9d9d;
        -webkit-box-shadow: inset 0 0 20px #000000;
        box-shadow:         inset 0 0 20px #9d9d9d;
    }

    .text {
        text-align: left;
        width: 300px;
        color: whitesmoke;
        font-family: sans-serif;
        font-size: 18px;
    }

    .icon {
        float: left;
        width: 50px;
    }

    .logo {
        position: absolute;
        float: left;
        z-index: 10;
    }

    img {
        margin-top: 45px;
        margin-right: 100%;
    }

    .border {
        margin: 20px 0 20px 70px;
    }

    .vCenter {
        margin-top: 37px;
    }

</style>
