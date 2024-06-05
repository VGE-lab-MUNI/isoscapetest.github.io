(function () {
    "use strict";
}());

var map = L.map('map').setView([48.95, 16.59], 9);

var CartoDB_PositronNoLabels = L.tileLayer('https://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}{r}.png', {
	attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
	subdomains: 'abcd',
	maxZoom: 20,
    minZoom: 9
}).addTo(map);

L.control.defaultExtent()
  .addTo(map);

const settlementsIconPresent = L.icon({
    iconUrl: "markerPresent.svg",
    iconSize: [10, 10]
});

const settlementsIconNotPresent = L.icon({
    iconUrl: "markerNotPresent.svg",
    iconSize: [10, 10]
});

const settlements = "https://gist.githubusercontent.com/VGE-lab-MUNI/54c20ac7bfad5f260631e39f49bd0b74/raw/2998a9a831db6f048ade20a2f304177981c807f9/hutter_points.geojson";

const dwellings = "https://gist.githubusercontent.com/VGE-lab-MUNI/6a04baa6f4b6ad6525c208fdcacd608e/raw/a9187314740772563fc88e05b0387e0a4b2dab10/hutter.geojson"
    
var hutteritesDwellings = new L.GeoJSON.AJAX(dwellings, {style: dwellingsStyle, onEachFeature: nameDisplayDwellings});

var hutteritesSettlements = new L.GeoJSON.AJAX(settlements, {pointToLayer: markerDisplay, onEachFeature: nameDisplaySettlements}).addTo(map);

function dwellingsStyle(feature) {
    if (feature.properties.Certainty == 1) {
        return {
    fillColor: "#AA9EFF",
    color: "#0000dc",
    weight: 2,
    fillOpacity: 0.7
  } 
    } else if (feature.properties.Certainty == 2) {
        return {
    fillColor: "#c8c0ff",
    color: "#0000dc",
    dashArray: "5, 5",
    weight: 2,
    fillOpacity: 0.7
  }
    } else {
        return {
    fillColor: "#e3dfff",
    color: "#0000dc",
    dashArray: "0.1, 5",
    weight: 2,
    fillOpacity: 0.7
  }
    }
    
};

hutteritesSettlements.on('click', function(e) {
    map.setView(e.latlng, 15);
});

function markerDisplay(feature, latlng) {
    
    if (feature.properties.Dwellings == "N") 
    
    {
    
        return L.marker(latlng, {icon:settlementsIconNotPresent}); 
    }
    
    else 
    
    {
        
        return L.marker(latlng, {icon:settlementsIconPresent});
    }
}

function nameDisplaySettlements(feature, layer) {
    if (feature.properties.Dwellings == "N") {
        label = "<center>" + "<b>" + String(feature.properties.Settlement);
    } else {
        label = "<center>" + "<b>" + String(feature.properties.Settlement) + "<br>" + "</b>" + "Počet identifikovaných lokací: " + String(feature.properties.Count);
    }
    layer.bindTooltip(label, {className: "my-labels", direction: "top"});
};

function nameDisplayDwellings(feature, layer) {
   
    label = "<center>" + "<b>" + String(feature.properties.Dwelling) + "<br>" + "Jistota lokalizace: " + "</b>" + String(feature.properties.Certainty);
    
    layer.bindTooltip(label, {className: "my-labels", direction: "top"});
};



map.on('zoomend', function(){
    var element = document.getElementById("hide-dwellings");
    if (map.getZoom() > 13) 
        
        {
            map.addLayer(hutteritesDwellings);
            element.style.display = "block";
        } 
    
        else
            
        {
            map.removeLayer(hutteritesDwellings);
            element.style.display = "none";
        }
    }
);


map.on('zoomend', function(){
    var element = document.getElementById("hide-settlements");
    if (map.getZoom() > 13) 
        
        {
            map.removeLayer(hutteritesSettlements);
            element.style.display = "none";
        } 
    
        else
            
        {
            map.addLayer(hutteritesSettlements);
            element.style.display = "block";
        }
    }
);