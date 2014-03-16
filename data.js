
/*
 * List of station objects.
 * 
 * station: object containing 'system', 'display', 'timeUTC',
 * 'timeZoneOffset', and 'dishes'.
 */
var data = null;
/*
 * This can be called any time to update the DSN 
 * configuration catalog
 */
function data_init(){

    var client = new XMLHttpRequest();
    client.onreadystatechange = data_read;
    client.open("GET", dsn.data.url);
    client.setRequestHeader("X-Requested-With","XMLHttpRequest");
    client.send();
}
function data_read(){

    if (this.readyState == this.DONE) {
        if (this.status == 200 &&
            this.responseXML != null)
        {
            data = [
            ];

            var el_dsn = this.responseXML.documentElement;

            var dsn_list = el_dsn.childNodes;
            var dsn_list_len = dsn_list.length;
            var data_station = -1;
            var data_station_dish = 0;

            for (dsn_list_idx = 0; dsn_list_idx < dsn_list_len; dsn_list_idx++){

                var el = dsn_list[dsn_list_idx];

                if ("station" == el.tagName){

                    data_station += 1;
                    data[data_station] = {
                        system: el.getNamedItem("name").value,
                        display: el.getNamedItem("friendlyName").value,
                        timeUTC: el.getNamedItem("timeUTC").value,
                        timeZoneOffset: el.getNamedItem("timeZoneOffset").value,
                        dishes: []
                    };
                    data_station_dish = 0;
                }
                else if ("dish" == el.tagName){

                    var list_downSignal = el.getElementsByTagName("downSignal");
                    var list_downSignal_len = list_downSignal.length;

                    var list_upSignal = el.getElementsByTagName("upSignal");
                    var list_upSignal_len = list_upSignal.length;

                    var list_targets = el.getElementsByTagName("target");
                    var list_targets_len = list_targets.length;

                    var object_signals = [];
                    var object_signals_idx = 0;

                    for (signal_idx = 0; signal_idx < list_downSignal_len; signal_idx++){
                        var el = list_downSignal.item(signal_idx);

                        var powerNum = parseFloat(el.getNamedItem("power").value);
                        var powerKw = Math.pow(10, (powerNum - 60) / 10.0);

                        object_signals[object_signals_idx++] = {
                            direction: "down",
                            signalType: el.getNamedItem("signalType").value, // "none", "carrier", "data"
                            dataRate: el.getNamedItem("dataRate").value,  // bits per second
                            frequency: el.getNamedItem("frequency").value, // hertz
                            power: powerKw,
                            spacecraft: el.getNamedItem("spacecraft").value
                        };
                    }

                    for (signal_idx = 0; signal_idx < list_upSignal_len; signal_idx++){
                        var el = list_upSignal.item(signal_idx);

                        var powerNum = parseFloat(el.getNamedItem("power").value);
                        var powerKw = powerNum.toFixed(2);

                        object_signals[object_signals_idx++] = {
                            direction: "up",
                            signalType: el.getNamedItem("signalType").value, // "none", "carrier", "data"
                            dataRate: el.getNamedItem("dataRate").value,  // bits per second
                            frequency: el.getNamedItem("frequency").value, // hertz
                            power: powerKw,
                            spacecraft: el.getNamedItem("spacecraft").value
                        };
                    }

                    var object_targets = [];
                    var object_targets_idx = 0;

                    for (target_idx = 0; target_idx < list_targets_len; target_idx++){
                        var el = list_targets.item(target_idx);

                        object_targets[object_targets_idx++] = {
                            system: el.getNamedItem("name").value,
                            uplegRange: el.getNamedItem("uplegRange").value,    // km
                            downlegRange: el.getNamedItem("downlegRange").value,// km
                            rtlt: el.getNamedItem("rtlt").value // round trip light time in seconds, may be '-'.
                        };
                    }

                    var object_dish = {
                        system: el.getNamedItem("name").value,
                        azimuth: el.getNamedItem("azimuthAngle").value,     // deg
                        elevation: el.getNamedItem("elevationAngle").value, // deg
                        created: el.getNamedItem("created").value, // e.g. "2014-03-14T09:35:16.390Z"
                        updated: el.getNamedItem("updated").value,
                        signals: object_signals,
                        targets: object_targets
                    };

                    data[data_station].dishes[data_station_dish++] = object_dish;
                }
                else if ("timestamp" == el.tagName){
                    /*
                     * Unix time
                     */
                    data.timestamp = el.nodeValue;
                }
            }
        }
        else {
            data = null;
        }
    }
}

data_init();
