const moment = require('moment')
const vbb_client = require('vbb-client')

const wildau_id = "900000260002";
const kw_id = "900000260001";

const mensa_to_wildau = 3;
const wildau_to_kw = 2;
const kw_to_re = 2;

const wildau_timeframe = 30;
const kw_timeframe = 120;


module.exports = {
    test: function(){
        var options = {
            duration: wildau_timeframe
        };

        var result = getDepartures(wildau_id, options);

        result.then(function(result){
            console.log(result);
            result.forEach(function(each){
                if(each.forward) {
                    each.forward.then((res) => console.log(res));
                }
                each.gleis.then((res) => console.log(res));
            })
        });
    },

    /**
     *
     * Datatype:
     *
     * from: Abfahrtsbahnhof
     * to: Zielbahnhof
     * when: exakter abfahrtszeitpunkt
     * diff: exakter zeit bis abfahrt (negativ)
     * diff_text: text als human readable
     * delay: verspaetung
     * forward: promise[] mit gleichem datentyp wenn wildau -> kw, sonst null
     * @param id
     * @param options
     * @param isForward
     * @returns {PromiseLike<T> | Promise<T>}
     */
    getDepartures: function(id, options, isForward=false){

        return vbb_client.departures(id, options).then(function (body) {

            var departures = [];

            for(var i = 0; i < body.length; i++) {
                // falls wildau -> kw oder kw -> irgendwo mit RE
                if(!isForward || (isForward && body[i].line.express == true)) {


                    var departure = {};
                    departure.from_name = body[i].station.name;
                    departure.from_id = body[i].station.id;
                    departure.to_name = body[i].direction;
                    departure.when = body[i].when;
                    departure.diff = moment.duration(moment().diff(moment(body[i].when)));
                    departure.diff_text = moment.duration(moment().diff(moment(body[i].when))).locale("de").humanize();
                    departure.delay = body[i].delay;
                    departure.journeys = body[i].journeyId;
                    departure.forward = null;

                    // look up id of direction, used for gleis
                    departure.gleis = vbb_client.stations({query: body[i].direction, completion: false}).then((result) => {
                        // dirty hotfix, ignore stations that contain the name (S+U Zoologischer Garten und S+U Zoologischer Garten/Jebensstr.)
                        return result[0];
                    }).then((result) => {
                        return vbb_client.journeys(departure.from_id, result.id, {when: departure.when, results: 1}).then((res) => {return {departurePlatform : res[0].legs[0].departurePlatform, arrivalPlatform : res[0].legs[0].arrivalPlatform}; });
                    });



                    // falls wildau -> kw und direction ist kw
                    if(!isForward && body[i].direction == "S Königs Wusterhausen") {

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
}