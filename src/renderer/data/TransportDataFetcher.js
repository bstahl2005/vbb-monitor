import {EventBus} from '../components/EventBus';

const moment = require('moment')
const vbb_client = require('vbb-client')

const interval = 500000;

const wildau_id = "900000260002";
const kw_id = "900000260001";

const mensa_to_wildau = 3;
const wildau_to_kw = 2;
const kw_to_re = 2;

const wildau_timeframe = 30;
const kw_timeframe = 120;

const options = {
    duration: wildau_timeframe
};

function getDepartures(id, options, isForward = false) {

    return vbb_client.departures(id, options).then(function (body) {

        var departures = [];

        for (var i = 0; i < body.length; i++) {
            // falls wildau -> kw oder kw -> irgendwo mit RE
            if (!isForward || (isForward && body[i].line.express == true)) {


                var departure = {};
                departure.station_name = body[i].station.name;
                departure.station_id = body[i].station.id;
                departure.direction = body[i].direction;
                departure.when = body[i].when;
                departure.line_name = body[i].line.name;
                departure.diff = moment.duration(moment().diff(moment(body[i].when)));
                departure.diff_text = moment.duration(moment().diff(moment(body[i].when))).locale("de").humanize();
                departure.product = body[i].line.product;
                departure.delay = body[i].delay;
                departure.journeys = body[i].journeyId;
                departure.forward = null;

                // look up id of direction, used for gleis
                departure.gleis = {};

                // falls wildau -> kw und direction ist kw
                if (!isForward && body[i].direction == "S Königs Wusterhausen") {

                    var options_kw = {
                        duration: kw_timeframe,
                        when: moment().add(wildau_to_kw, "minutes").add(kw_to_re, "minutes")
                    };
                    departure.forward = getDepartures(kw_id, options_kw, true);
                }
                departures.push(departure);
            }
        }

        return departures;
    });
}

function getGleis(direction, stationId, when) {
    return vbb_client.stations({query: direction, completion: false}).then((result) => {
        // dirty hotfix, ignore stations that contain the name (S+U Zoologischer Garten und S+U Zoologischer Garten/Jebensstr.)
        return result[0];
    }).then((result) => {
        return vbb_client
            .journeys(stationId, result.id, {when: when, results: 1})
            .then((res) => {
                return {
                    departurePlatform: res[0].legs[0].departurePlatform,
                    arrivalPlatform: res[0].legs[0].arrivalPlatform
                }
            });
    })
}


// Initial request for data
getDepartures(wildau_id, options)
    .then(
        (response) => {

            var promises = [];

            response.forEach((e, i, array) => {
                promises.push(getGleis(e.direction, e.station_id, e.when)
                    .then((gleise) => {response[i].gleis = gleise}));
            });

            Promise.all(promises).then(() => EventBus.$emit('transportData', response));

        });

// if(i == array.length-1){
//EventBus.$emit('transportData', response);
// }


// Interval for all the stuff coming later...
setInterval(() => {

    getDepartures(wildau_id, options);


}, interval);