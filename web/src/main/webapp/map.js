
var map, layer, markers, vector, points, lineFeature;
var allMarkers = []




function init(){
    OpenLayers.Control.Click = OpenLayers.Class(OpenLayers.Control, {
        defaultHandlerOptions: {
            'single': true

        },

        initialize: function(options) {
            this.handlerOptions = OpenLayers.Util.extend(
                {}, this.defaultHandlerOptions
            );
            OpenLayers.Control.prototype.initialize.apply(
                this, arguments
            );
            this.handler = new OpenLayers.Handler.Click(
                this, {
                    'click': this.onClick,
                }, this.handlerOptions
            );
        },

        onClick: function(evt) {
            console.debug(evt)
            var lonlat = map.getLonLatFromPixel(evt.xy);

            var msg = "click " + lonlat;
            size = new OpenLayers.Size(21, 25);
            calculateOffset = function(size) { return new OpenLayers.Pixel(-(size.w/2), -size.h); };
            icon = new OpenLayers.Icon(
                'http://www.openlayers.org/dev/img/marker.png',
                size, null, calculateOffset);



            allMarkers.push(new OpenLayers.Marker(new OpenLayers.LonLat(lonlat.lon, lonlat.lat), icon))
            if(allMarkers.length > 2)
                allMarkers.shift()
            markers.clearMarkers();
            for(i in allMarkers)
                markers.addMarker(allMarkers[i])



            points.push( new OpenLayers.Geometry.Point(lonlat.lon, lonlat.lat))

            if(points.length > 2){
                points.shift()
            }


            var line = new OpenLayers.Geometry.LineString(points);

            var style = { strokeColor: '#0000ff',
                        strokeOpacity: 1,
                        strokeWidth: 5
            };

            if(lineFeature != null)
                vector.removeFeatures([lineFeature])

            lineFeature = new OpenLayers.Feature.Vector(line, null, style);

            vector.addFeatures([lineFeature]);

            if(points.length == 2)
            {
                a = points[0].clone().transform(map.getProjectionObject(), new OpenLayers.Projection("WGS84"))
                b = points[1].clone().transform(map.getProjectionObject(), new OpenLayers.Projection("WGS84"))
                $.post("/hvorlangt", {
                    "a" : {"lat": a.x, "lon" : a.y},
                    "b" : {"lat": b.x, "lon" : b.y}
                }, function(data, status ,xhr){

                    $("#lengde")
                        .text("jo, " + data.distance + "km")
                        .addClass("emph")

                })

            }
        }

    });



    map = new OpenLayers.Map( 'map', {
       projection: new OpenLayers.Projection('EPSG:32633'),
       maxExtent: new OpenLayers.Bounds(-2500000.0,3500000.0,3045984.0,9045984.0),
       units: "m",
       maxResolution: 2708.0, // tilsvarer zoom level 3 (hele er 21664.0)
       numZoomLevels: 18 // egentlig 21, men maxResolution tilsvarer zoom level 3 (følgelig er 0-3 skrudd av)
    } );
    
    map.addControl(new OpenLayers.Control.LayerSwitcher());

    

    var topo2 = new OpenLayers.Layer.WMS(
       "Topografisk norgeskart2", "http://opencache.statkart.no/gatekeeper/gk/gk.open?",
       {layers: 'topo2', format: 'image/jpeg'}

    );

    var control =  new OpenLayers.Control.Click({
                        handlerOptions: {
                            "single": true
                        }
                    })

    vector = new OpenLayers.Layer.Vector("Vector Layer");
    map.addLayer(vector)

    points = new Array()



    map.addControl(control)

    markers = new OpenLayers.Layer.Markers( "Markers" );
    map.addLayer(markers);

    map.addLayer(topo2);

    map.zoomToMaxExtent();
    map.setCenter(new OpenLayers.LonLat(166361,6834916),8); //Besseggen

    control.activate()
}




$(document).ready(function(){
    init()
})
