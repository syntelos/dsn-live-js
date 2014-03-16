
/*
 * Data key catalog maps system name to display name.
 *
 * sites: From site system name to object containing 'system',
 * 'display', and 'flag'.
 *
 * dishes: From dish system name to object containing 'system',
 * 'display', and 'type'.
 *
 * spacecraft: From S/C system name to object containing 'system' and
 * 'display'.
 */
var config = null;
/*
 * This can be called any time to update the DSN 
 * configuration catalog
 */
function config_init(){

    var client = new XMLHttpRequest();
    client.onreadystatechange = config_read;
    client.open("GET", dsn.config.url);
    client.send();
}
function config_read(){

    if (this.readyState == this.DONE) {
        if (this.status == 200 &&
            this.responseXML != null)
        {
            config = {
                sites: {
                },
                dishes: {
                },
                spacecraft: {
                }
            };
            var el_config = this.responseXML.documentElement;

            var sites = el_config.firstChild.childNodes;
            {
                var sites_len = sites.length;
                for (sites_idx = 0; sites_idx < sites_len; sites_idx++){
                    var el_site = sites.item(sites_idx);

                    config.sites[site_system] = {
                        system: el_site.getNamedItem("name").value,
                        display: el_site.getNamedItem("friendlyName").value,
                        flag: el_site.getNamedItem("flag").value
                    };

                    var dishes = el_site.childNodes;
                    var dishes_len = dishes.length;
                    for (dishes_idx = 0; dishes_idx < dishes_len; dishes_idx++){
                        var el_dish = dishes.item(dishes_idx);

                        config.dishes[dish_system] = {
                            system: el_dish.getNamedItem("name").value,
                            display: el_dish.getNamedItem("friendlyName").value,
                            type: el_dish.getNamedItem("type").value
                        };
                    }
                }
            }
            var spacecraft = el_config.lastChild.childNodes;
            {
                var spacecraft_len = spacecraft.length;
                for (spacecraft_idx = 0; spacecraft_idx < spacecraft_len; spacecraft_idx++){
                    var el_sc = spacecraft.item(spacecraft_idx);

                    config.spacecraft[sc_system] = {
                        system: el_site.getNamedItem("name").value,
                        display: el_site.getNamedItem("friendlyName").value
                    };
                }
            }
        }
        else {
            config = null;
        }
    }
}

config_init();
