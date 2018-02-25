<template>
    <div id="wrapper" class="blue-grey lighten-3 center">

        <main>
            <div class="left-side">
                <div class="headline">
                    <span class="thin">S-Bahnhof Wildau</span>
                </div>

                <div v-for="trainDat in trainArr">
                    <div class="sbahnbox" v-if="trainDat.product !== 'regional'">

                        <div class="outerBox">
                            <div class="logo">
                                <div class="sbahnbox" v-if="trainDat.product === 'suburban'">
                                    <img src="../../assets/suburban.svg">
                                </div>
                                <div class="sbahnbox" v-else="trainDat.product === 'bus'">
                                    <img src="../../assets/bus.svg">
                                </div>
                            </div>

                            <div class="innerBox card">
                                <div class="vCenter">
                                    <div class="border">
                                        <div v-if="trainDat.product === 'suburban'">
                                            <div class="icon ellipsis">
                                                <span class="sbahnsign">S46</span>
                                            </div>
                                        </div>

                                        <div v-if="trainDat.product === 'bus'">
                                            <div class="icon ellipsisbus">
                                                <span class="bussign ">{{trainDat.station_name.substr(3)}}</span>
                                            </div>
                                        </div>

                                        <div id="endstation" class="text ">
                                            <div v-if="trainDat.direction.substr(0,1) === 'S'">
                                                <p class="endstation">{{ trainDat.direction.substr(2) }}</p>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="border">
                                        <div class="icon">
                                            <i class="small material-icons">access_time</i>
                                        </div>
                                        <div id="arrive" class="text">
                                            <div class="value">{{ substractTime(trainDat.when, trainDat.delay) }} Uhr
                                                <span v-if="trainDat.delay > 0">
                                                    <span class="delay"> + {{ trainDat.delay/60 }}</span>
                                                </span>
                                                <span v-else-if="trainDat.delay === 0 || trainDat.delay == null"></span>
                                                <span v-else="trainDat.delay < 0">
                                                    <span class="minusDelay"> - {{ trainDat.delay }}</span>
                                                </span>
                                            </div>
                                        </div>
                                    </div>

                                    <div class="border">
                                        <div class="icon">
                                            <div v-if="trainDat.product === 'suburban'">
                                                <i class="small material-icons">train</i>
                                            </div>
                                            <div v-if="trainDat.product === 'bus'">
                                                <i class="small material-icons">directions_bus</i>
                                            </div>
                                        </div>
                                        <div class="text">
                                            <!-- TODO replace with track and check with bus stop attr -->
                                            <div v-if="trainDat.product === 'suburban'">
                                                <div class="value">Gleis 4<!--{{ trainDat.journeyId }}--></div>
                                            </div>
                                            <div v-if="trainDat.product === 'bus'">
                                                <div class="value">Haltestelle Timbucktu<!--{{ trainDat.journeyId }}--></div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>


            <!-- only train kw -->
            <div class="right-site justifyRight">
                <div class="headline2">
                    <span class="thin">Bhf. Königs Wusterhausen</span>
                </div>

                <div v-for="trainDat in trainArr">
                    <div v-if="trainDat.product !== 'suburban'">
                        <div class="logo">
                            <img src="../../assets/bahn.svg">
                        </div>

                        <div class="innerBox card">
                            <div class="vCenter">
                                <div class="border">
                                    <div class="icon ellipsistrain">
                                        <span class="trainsign">{{trainDat.station_name}}</span>
                                    </div>
                                </div>

                                <!-- endstation -->
                                <div class="text">
                                    <div v-if="trainDat.direction.substr(0,1) === 'S'">
                                        <p class="endstation endstationtext">{{ trainDat.direction.substr(2) }}</p>
                                        <div id="endstation" class="text">
                                            <div v-if="trainDat.direction.substr(0,1) === 'S'">
                                                {{ trainDat.station_name }} {{ trainDat.direction.substr(2) }}
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div class="border">
                                    <div class="icon">
                                        <i class="small material-icons">access_time</i>
                                    </div>
                                    <div class="text">
                                        <div class="value">{{ substractTime(trainDat.when, trainDat.delay) }} Uhr
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
                        </div>
                        </div>
                    </div>
                </div>
            </div>
        </main>
    </div>
</template>

<script>
    import mom from 'moment'
    import TransData from '../../data/traindata'
    import { EventBus } from '../EventBus';

    //let kwArr;

    EventBus.$on('transportData', transportData => {
        transportData.forEach((data) => {
            console.log(data);
            if(data.forward !== null){
                data.forward.then((mutti) => {
                    console.log(mutti);
                    //kwArr = mutti;
                });
            }
        })
    })


    export default {
        data () {
            return {
                name: "Fahrplandaten",
                trainArr: [],
            }
        },
        /*
        getKwData(){
            EventBus.$on('transportData', transportData => {
                transportData.forEach((data) => {
                    console.log(data);
                    if(data.forward !== null){
                        data.forward.then((mutti) => {
                            return mutti;
                        });
                    }
                })
            })
        },*/
      created () {
        EventBus.$on('transportData', transportData => {
          this.trainArr = transportData

          // console.log(`Oh, that's nice. It's gotten: \n ${transportData[0].delay} :)`)
        })
      },
      methods: {
        getFormattedTime(time) {
            return mom(time).format("HH:mm")
        },
          substractTime(time, delay) {
            if(delay !== null){
                return mom(time).subtract(delay, 'seconds').format("HH:mm")
            } else {
                return mom(time).format("HH:mm")
            }
          }
      }
    }
</script>

<style scoped>
    @import "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/css/materialize.min.css";
    @import "https://cdnjs.cloudflare.com/ajax/libs/materialize/0.100.2/js/materialize.min.js";
    @import "https://fonts.googleapis.com/icon?family=Material+Icons";


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

    .headline {
        font-size: 26px;
        margin-bottom: 10px;
    }

    .thin {
        font-weight: lighter;
    }

    body {
        font-family: 'Source Sans Pro', sans-serif;
        background-color: #737174;
    }

    #wrapper {
        background-color: #e0dee1;
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
        width: 600px;
        height: 200px;
        overflow: hidden;
        display: inline-block;

    }

    .headline2 {
        font-size: 26px;
        margin-bottom: 10px;
        margin-left: -450px;
    }

    .justifyRight {
        margin-left: 300px;
    }

    .innerBox {
        position: absolute;
        border-radius: 3px;
        width: 500px;
        height: 196px;
        margin-left: 50px;
        background-color: #f8f6f9;
    }

    .text {
        padding-left: 55px;
        text-align: left;
        width: 600px;
        color: #000000;
        font-family: sans-serif;
        font-size: 22px;
        #border: solid;
    }

    .icon {
        float: left;
        width: 37px;
        height: 35px;
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
        margin-top: 28px;
    }

    .ellipsis {
        margin-top: 5px;
        position: absolute;
        background-color: #CC8625;
        width: 38px;
        height: 22px;
        border: 2px;
        border-radius: 150px;
    }

    .ellipsisbus {
        margin-top: 5px;
        position: absolute;
        background-color: #B60079;
        width: 38px;
        height: 22px;
        border: 2px;
        border-radius: 150px;
    }

    .ellipsistrain {
        margin-top: 5px;
        position: absolute;
        background-color: #BE1414;
        width: 38px;
        height: 22px;
        border: 2px;
        border-radius: 150px;
    }

    .sbahnsign {
        padding-top: 3px;
        padding-left: 2px;
        color: #FFFFFF;
        text-align: center;
        width: 2.5em;
        height: 1.25em;
        position: relative;
        border-radius: 1.25em;
    }

    .trainsign{
        color: #FFFFFF;
        text-align: center;
        width: 2.5em;
        height: 1.25em;
        #background: #BE1414;
        position: relative;
    }

    .bussign {
        color: #FFFFFF;
        text-align: center;
        width: 2.5em;
        height: 1.25em;
        position: relative;
    }

    .endstation {
        font-size: 28px;
    }

    .endstationtext {
        margin-left: 70px;
    }



</style>
