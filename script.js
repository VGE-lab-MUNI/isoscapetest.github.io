var map = L.map('map').setView([39.449811170044626, -8.206305119865776], 6);

var lastClicked;


var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 1
}).addTo(map);


const hexagrid = "https://gist.githubusercontent.com/VGE-lab-MUNI/b363c6dbb7fd390680c10287ba67ff4f/raw/0d96ba2c7ba5873c7f8385d36d96abfd84dbc2bd/PortugalIsoHexa.geojson"
var hexa = new L.GeoJSON.AJAX(hexagrid, {style: gridColor, onEachFeature: displayValue});
map.addLayer(hexa);



var imageUrl = 'https://i.ibb.co/hcqBH3c/Port.png',
    imageBounds = [[36.962295943144255, -9.509959545772267], [42.14680090712174, -6.1849077721580885]],
    image = L.imageOverlay(imageUrl, imageBounds).addTo(map);

map.on('zoomend', function(){
    if (map.getZoom() > 8) 
        {
            image.setStyle({opacity: 0.001});
        } else {
            image.setStyle({opacity: 1});
        }
    }
);

function displayValue(feature, layer) {

    label = "<center>" + "87Sr/86Sr mean value: " + "<b>" + String(Math.round(feature.properties.MEAN* 10000) / 10000);

    layer.bindPopup(label, {className: "my-labels", direction: "top"});

    layer.on('click', function(e) {
        e.target.setStyle({weight: 3});
        if (lastClicked) {
            lastClicked.setStyle({weight: 0});
        }
        lastClicked = e.target;
    });
};





function gridColor(feature) {
    if (feature.properties.MEAN < 0.710899) {
        return {
            fillColor: "#5E4FA2",
            color: "#5E4FA2",
            weight: 0,
            fillOpacity: 0.5,
        }
    } else if (feature.properties.MEAN < 0.712581) {
        return {
            fillColor: "#388EBA",
            color: "#388EBA",
            weight: 0,
            fillOpacity: 0.5
        }
    } else if (feature.properties.MEAN < 0.714362) {
        return {
            fillColor: "#75C8A5",
            color: "#75C8A5",
            weight: 0,
            fillOpacity: 0.5
        } 
    } else if (feature.properties.MEAN < 0.71646) {
        return {
            fillColor: "#BFE5A0",
            color: "#BFE5A0",
            weight: 0,
            fillOpacity: 0.5
        } 
    } else if (feature.properties.MEAN < 0.718723) {
        return {
            fillColor: "#F1F9A9",
            color: "#F1F9A9",
            weight: 0,
            fillOpacity: 0.5
        }
    } else if (feature.properties.MEAN < 0.720876) {
        return {
            fillColor: "#FEEEA2",
            color: "#FEEEA2",
            weight: 0,
            fillOpacity: 0.5
        }
    } else if (feature.properties.MEAN < 0.723293) {
        return {
            fillColor: "#FDBF6F",
            color: "#FDBF6F",
            weight: 0,
            fillOpacity: 0.5
        }
    } else if (feature.properties.MEAN < 0.725902) {
        return {
            fillColor: "#F67B4A",
            color: "#F67B4A",
            weight: 0,
            fillOpacity: 0.5
        }
    } else if (feature.properties.MEAN < 0.728924) {
        return {
            fillColor: "#D8434E",
            color: "#D8434E",
            weight: 0,
            fillOpacity: 0.5
        }
    } else {
        return {
            fillColor: "#9E0142",
            color: "#9E0142",
            weight: 0,
            fillOpacity: 0.5
        }
}    
}
