var map = L.map('map', {minZoom:6, maxZoom:20}).setView([39.449811170044626, -8.206305119865776], 6);
let hexagrid;

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 20,
    minZoom: 6
}).addTo(map);

const boundaries = "https://gist.githubusercontent.com/VGE-lab-MUNI/1fdc942f1d359ad4968b8409dc8ce801/raw/9c85a7d415e7ad27cb0f2de1ca8ed4b121486897/portugalBound.geojson";

originalGrid();

function originalGrid() {
fetch("./GeoTIFF/EBK.tif")
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {

      var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: function (value) {
            if (value > 0.7063 && value < 0.7082) {
                return "#3DA1D1";
            } else if (value > 0.7082 && value < 0.7096) {
                return "#75B3C3";
            } else if (value > 0.7096 && value < 0.7106) {
                return "#B9D6A2";
            } else if (value > 0.7106 && value < 0.7112) {
                return "#9AC5B4";
            } else if (value > 0.7112 && value < 0.7122) {
                return "#D7EA90";
            } else if (value > 0.7122 && value < 0.7136) {
                return "#F1FB7B";
            } else if (value > 0.7136 && value < 0.7155) {
                return "#F6D865";
            } else if (value > 0.7155 && value < 0.7182) {
                return "#F9B552";
            } else if (value > 0.7182 && value < 0.7220) {
                return "#F88F3E";
            } else if (value > 0.7220 && value < 0.7273) {
                return "#F5652C";
            } else if (value > 0.7273 && value < 0.7349) {
                return "#F0261C";
            } else {
                return "transparent";
            }
          },
          resolution: 512
      });
      layer.addTo(map);

      //map.fitBounds(layer.getBounds());
      hexagrid = layer;

      map.on("click", function(event) {
        var lat = event.latlng.lat;
        var lng = event.latlng.lng;
        var value = geoblaze.identify(georaster, [lng, lat]);

        layer.bindPopup("<center>" + "<sup>" + "87" + "</sup>" + "Sr/" + "<sup>" + "86" + "</sup>" + "Sr" + " mean value: " + "<b>" + String(Math.round(value* 10000) / 10000)).openPopup([lat, lng]);
      });
  });
});
};



//var lastClicked;
//var isFiltering = false;

L.control.defaultExtent()
  .addTo(map);



var printPlugin = L.easyPrint({
    title: 'Export map (PNG raster)',
    position: 'topleft',
    sizeModes: ['A4Landscape'],
    filename: 'isoscapeExport',
    exportOnly: true
}).addTo(map);


map.attributionControl.addAttribution('Created by: <b>Ondrej Kvarda</b>');

var btn = document.getElementById('filterButton');
var btn2 = document.getElementById('clearButton');

btn.addEventListener('click', function(){

    clear(hexagrid);
    gridFilter()
 
});

btn2.addEventListener('click', function(){

    clear(hexagrid);
    originalGrid();
    document.getElementById('MinValue').value = null;
    document.getElementById('MaxValue').value = null;

});


function gridFilter() {
    var minValue = document.getElementById('MinValue').value;
    var maxValue = document.getElementById('MaxValue').value;
    filteredGrid(minValue, maxValue);
};

function clear(layer) {
    map.removeLayer(layer);
}

function filteredGrid(minValue, maxValue) {
    fetch("./GeoTIFF/EBK.tif")
  .then(response => response.arrayBuffer())
  .then(arrayBuffer => {
    parseGeoraster(arrayBuffer).then(georaster => {

      var layer = new GeoRasterLayer({
          georaster: georaster,
          opacity: 0.7,
          pixelValuesToColorFn: function (value) {
            if (value > minValue && value < maxValue) {
                return "red";
            } else {
                return "transparent";
            }
          },
          resolution: 512
      });
      layer.addTo(map);

      //map.fitBounds(layer.getBounds());
      hexagrid = layer;

      map.on("click", function(event) {
        var lat = event.latlng.lat;
        var lng = event.latlng.lng;
        var value = geoblaze.identify(georaster, [lng, lat]);

        layer.bindPopup("<center>" + "<sup>" + "87" + "</sup>" + "Sr/" + "<sup>" + "86" + "</sup>" + "Sr" + " mean value: " + "<b>" + String(Math.round(value* 10000) / 10000)).openPopup([lat, lng]);
      });
  });
});
}


/* 
const hexagrid = "https://gist.githubusercontent.com/VGE-lab-MUNI/b363c6dbb7fd390680c10287ba67ff4f/raw/0d96ba2c7ba5873c7f8385d36d96abfd84dbc2bd/PortugalIsoHexa.geojson"
var hexa = new L.GeoJSON.AJAX(hexagrid, {style: gridColor, onEachFeature: displayValue});
var hexa2 = new L.GeoJSON.AJAX(hexagrid, {style: gridFilter, onEachFeature: displayValue});



var imageUrl = 'https://i.ibb.co/hcqBH3c/Port.png',
imageBounds = [[36.962295943144255, -9.509959545772267], [42.14680090712174, -6.1849077721580885]],
image = L.imageOverlay(imageUrl, imageBounds).addTo(map);




map.on('zoomend', function(){
    if (map.getZoom() > 8 && !isFiltering) 
        {
            image.setStyle({opacity: 0.001});
            map.addLayer(hexa);
        } else if (!isFiltering)
        {
            image.setStyle({opacity: 1});
            clear(hexa);
        }
    }
);




function displayValue(feature, layer) {

    label = "<center>" + "<sup>" + "87" + "</sup>" + "Sr/" + "<sup>" + "86" + "</sup>" + "Sr" + " mean value: " + "<b>" + String(Math.round(feature.properties.MEAN* 10000) / 10000);

    layer.bindPopup(label, {className: "my-labels", direction: "top"});

    layer.on('click', function(e) {
        e.target.setStyle({weight: 3});
        if (lastClicked) {
            lastClicked.setStyle({weight: 0});
        }
        lastClicked = e.target;
    });

    map.on('click', function() {
        if (lastClicked) {
            lastClicked.setStyle({weight: 0});
        }
    });
};




function gridColor(feature) {
    if (feature.properties.MEAN < 0.710899) {
        return {
            fillColor: "#5E4FA2",
            color: "#5E4FA2",
            weight: 0,
            fillOpacity: 0.5
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


var btn = document.getElementById('filterButton');
var btn2 = document.getElementById('clearButton');

btn.addEventListener('click', function(){

    clear(hexa);
    var hexa2 = new L.GeoJSON.AJAX(hexagrid, {style: gridFilter, onEachFeature: displayValue});
    map.addLayer(hexa2);
    image.setStyle({opacity: 0.001});
    isFiltering = true;
 
});

btn2.addEventListener('click', function(){

    map.eachLayer(function (layer) {
    map.removeLayer(layer);
    });
    CartoDB_PositronNoLabels.addTo(map);
    image.addTo(map);
    map.addLayer(hexa);
    isFiltering = false;
    document.getElementById('MinValue').value = null;
    document.getElementById('MaxValue').value = null;

});


function clear(layer) {
    map.removeLayer(layer);
}


function gridFilter(feature) {
    var minValue = document.getElementById('MinValue').value;
    var maxValue = document.getElementById('MaxValue').value;
    if (feature.properties.MEAN < maxValue && feature.properties.MEAN > minValue) {
        return {
            fillColor: "#f46862",
            color: "#f46862",
            weight: 0,
            fillOpacity: 0.5
        }
        
    } else {
        return {
            fillColor: "white",
            color: "white",
            weight: 0,
            fillOpacity: 0.0001
        }
    }
};


var customControl =  L.Control.extend({

  options: {
    position: 'topleft'
  },

  onAdd: function (map) {
    var container = L.DomUtil.create('a');
    container.title="Export visible layers to geoJSON";
    container.id = "exportContainer";
    container.style.height = '2.4em';
    container.style.width = '2.4em';
    

    container.onclick = function(e){
        var geojson = hexa.toGeoJSON();
        var convertedData = 'text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(geojson));
        container.setAttribute('href', 'data:' + convertedData);
        container.setAttribute('download','data.geojson');
    }
    return container;
  }
});

 map.addControl(new customControl());

 */
