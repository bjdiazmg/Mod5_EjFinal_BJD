var map, serviceAreaTask, params, clickpoint;

require([
    "esri/map",
    "esri/layers/FeatureLayer",
    "esri/tasks/ServiceAreaTask", "esri/tasks/ServiceAreaParameters", "esri/tasks/FeatureSet",
    "esri/symbols/SimpleMarkerSymbol", "esri/symbols/SimpleLineSymbol", "esri/symbols/SimpleFillSymbol",
    "esri/geometry/Point", "esri/graphic", "esri/tasks/query",
    "dojo/parser", "dojo/dom", "dijit/registry",
    "esri/Color", "dojo/_base/array",
    "dijit/layout/BorderContainer", "dijit/layout/ContentPane",
    "dijit/form/HorizontalRule", "dijit/form/HorizontalRuleLabels", "dijit/form/HorizontalSlider",
    "dojo/domReady!"
], function (
    Map, FeatureLayer,
    ServiceAreaTask, ServiceAreaParameters, FeatureSet,
    SimpleMarkerSymbol, SimpleLineSymbol, SimpleFillSymbol,
    Point, Graphic, Query, 
    parser, dom, registry,
    Color, arrayUtils
) {
    parser.parse();

    // URL Directorio AGOL
    var urlCentroSalud = "https://services5.arcgis.com/zZdalPw2d0tQx8G1/ArcGIS/rest/services/CENTROS_SALUD_BJD/FeatureServer/0";

    // Mapa
    map = new Map("map", {
        basemap: "streets-vector",
        center: [-3.691288, 40.425840],
        zoom: 12
    });

    // Creo la Capa de los Centros de Salud
    var lyrSalud = new FeatureLayer(urlCentroSalud, {

    });


    //Agregar Capa
    map.addLayers([lyrSalud]);



    //  Armo la Query
    var queryPoints = new Query();
    queryPoints.where = '1 = 1';
    lyrSalud.selectFeatures(queryPoints);

    lyrSalud.on('selection-complete', saveCentros)

    
    function saveCentros(result) {
    console.log('result', result)

     var features= result;
     var featureSet = new FeatureSet();
     featureSet.features = features;

    // console.log(featureSet)

// Parámetros del Service Area

    params = new ServiceAreaParameters();
    params.defaultBreaks= [3];
    params.outSpatialReference = map.spatialReference;
    params.returnFacilities = true;
    params.impedanceAttributeName = "WalkTime"

    // Recorrer result para ir construyendo el FeatureSet de params que vas a enviar (solve)
    params.facilities = featureSet

//Se añade el servicio de rutas como serviceAreaTask

    serviceAreaTask = new ServiceAreaTask("https://formacion.esri.es/server/rest/services/RedMadrid/NAServer/Service%20Area");


//Resolvemos el service area
        serviceAreaTask.solve(params,function(solveResult){
        var polygonSymbol = new SimpleFillSymbol(
        "solid",
        new SimpleLineSymbol("solid", new Color([232,104,80]), 2),
            new Color([232,104,80,0.25])
        );
          
        arrayUtils.forEach(solveResult.serviceAreaPolygons, function(serviceArea){
            serviceArea.setSymbol(polygonSymbol);
            map.graphics.add(serviceArea);
          });
        });


    };









    
});


