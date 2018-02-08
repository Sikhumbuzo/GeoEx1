/* global H:true */

sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(Controller, JSONModel, Device) {
	"use strict";

	return Controller.extend("CustomControl.controller.Main", {
		
		_getBusyDialog: function(){
			if (!this._oDialog) {
				this._oDialog = sap.ui.xmlfragment("CustomControl.view.BusyDialog");
				//attach dialog to current view
				this.getView().addDependent(this._oDialog);
			}
			
			return this._oDialog;
		},
		
		_showBusyDialog: function(){
			this._getBusyDialog().open();
		},
		
		_hideBusyDialog: function(){
			this._getBusyDialog().close();
		},
		
		onInit: function() {
			this._showBusyDialog();
			//this.getView().byId("map_canvas").addStyleClass("myMap");
		},

		//OpenLayers
		/*onAfterRendering: function() {
			if (!this.initialized) {
				this.initialized = true;
				
				var map = new ol.Map({
					layers: [
						new ol.layer.Tile({
							source: new ol.source.OSM()
						})
					],
					target: this.getView().byId("map_canvas").getDomRef(),
					controls: ol.control.defaults({
						attributionOptions: ({
							collapsible: false
						})
					}),
					view: new ol.View({
						center: ol.proj.fromLonLat([28.034088, -26.195246]),
        				zoom: 4
					})
				})
			}
		},*/

		//Google Maps
		/*onAfterRendering: function() {
			if (!this.initialized) {
				this.initialized = true;
				this.geocoder = new google.maps.Geocoder();
				
				var jhb = {lat: -26.195246, lng: 28.034088};
				
				window.mapOptions = {
					center: new google.maps.LatLng(-26.195246, 28.034088),
					zoom: 6,
					mapTypeId: google.maps.MapTypeId.ROADMAP
				};

				var map = new google.maps.Map(this.getView().byId("map_canvas").getDomRef(), mapOptions);
				var infowindow = new google.maps.InfoWindow;
				
				var marker = new google.maps.Marker({
					map: map,
					position: jhb
				});
			}
		}*/

		//Here Maps
		onAfterRendering: function() {
			if (!this.initialized) {
				this.initialized = true;
				var platform = new H.service.Platform({
					app_id: "Mv1sZKBYuOL0uLAPcrRy",
					app_code: "lglFX4tb_IwBnHuvVsNT6w",
					useCIT: true,
					useHTTPS: true
				});
			}
			var defaultLayers = platform.createDefaultLayers();
			var map = new H.Map(this.getView().byId("map_canvas").getDomRef(), defaultLayers.normal.map, {
				zoom: 2,
				center: new H.geo.Point(-26.195246, 28.034088)
			});

			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));
			var ui = H.ui.UI.createDefault(map, defaultLayers);

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.loadData("/node/getPoints");
			
			var that = this;

			oModel.attachRequestCompleted(function() {
				var parseData = JSON.parse(JSON.stringify(oModel.getData()));
				//var data = parseData.items;

				/*var points = [];

				for (var i = 0; i < 1000; i++) {
					points.push(data[i].lng, data[i].lat);
				}*/

				that.startClustering(map, parseData);
				that._hideBusyDialog();
			});

		},

		startClustering: function(map, data) {

			var dataPoints = data.map(function(item) {
				return new H.clustering.DataPoint(item.Lat, item.Lon);
			});

			var clusteredDataProvider = new H.clustering.Provider(dataPoints, {
				clusteringOptions: {
					eps: 32,
					minWeight: 2
				}
			});

			var clusteringLayer = new H.map.layer.ObjectLayer(clusteredDataProvider);

			map.addLayer(clusteringLayer);

		}

		//Esri
		/*onAfterRendering: function() {
			if (!this.initialized) {
				require([
					"dojo/dom-construct",
					"esri/tasks/Locator",
					"esri/Map",
					"esri/views/MapView",
					"esri/widgets/Search",
					"esri/widgets/Locate",
					"esri/Graphic",
					"esri/geometry/Point",
					"esri/geometry/Multipoint",
					"esri/symbols/SimpleMarkerSymbol",
					"dojo/domReady!"
				], function(domConstruct, Locator, Map, MapView, Search, Locate, Graphic, Point, Multipoint, SimpleMarkerSymbol) {

					var locatorTask = new Locator({
						url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
					});
					var map = new Map({
						basemap: "osm",
						ground: "world-elevation"
					});
					var view = new MapView({
						container: "content",
						map: map,
						zoom: 3,
						center: [28.034088, -26.195246]
					});
					var locateBtn = new Locate({
						view: view
					});

					var logo = domConstruct.create("img", {
						src: "/webapp/sap.svg",
						id: "logo",
						title: "logo"
					});

					var searchWidget = new Search({
						view: view
					});

					view.ui.add(logo, "bottom-right");

					view.ui.add(searchWidget, {
						position: "top-left",
						index: 0
					});

					view.ui.add(locateBtn, {
						position: "top-left"
					});
					var oModel = new sap.ui.model.json.JSONModel();
					oModel.loadData("/cityPoints.xsjs");

					oModel.attachRequestCompleted(function() {

						var parseData = JSON.parse(JSON.stringify(oModel.getData()));
						var data = parseData.items;

						var points = [];

						for (var i = 0; i < 1000; i++) {
							points.push([data[i].lng, data[i].lat]);
						}

						var multipoint = new Multipoint(points);

						var markerSymbol = new SimpleMarkerSymbol({
							color: "#428bca",
							outline: { // autocasts as new SimpleLineSymbol()
								color: [255, 255, 255],
								width: 2
							}
						});

						var pointGraphic = new Graphic({
							geometry: multipoint,
							symbol: markerSymbol
						});

						view.then(function() {
							view.graphics.add(pointGraphic);
						});
					});

					view.on("click", function(event) {
						event.stopPropagation();

						var lat = Math.round(event.mapPoint.latitude * 1000) / 1000;
						var lon = Math.round(event.mapPoint.longitude * 1000) / 1000;

						view.popup.open({
							title: "Reverse geocode: [" + lon + ", " + lat + "]",
							location: event.mapPoint
						});

						locatorTask.locationToAddress(event.mapPoint).then(function(response) {
							view.popup.content = response.address;
						}).otherwise(function(err) {
							view.popup.content = "No address was found for this location";
						});
					});
				});
			}
		}*/

		//Mapbox
		/*onAfterRendering: function() {
			if (!this.initialized) {
				this.initialized = true;

				mapboxgl.accessToken = "pk.eyJ1Ijoic2lraHVtYnV6byIsImEiOiJjajcxeGZsaXkwNWxlMnFwNHJ6MHd2enJsIn0.spn-7EzaxoJCDCxcRqt7HQ";
				var map = new mapboxgl.Map({
					container: this.getView().byId("map_canvas").getDomRef(),
					style: "mapbox://styles/mapbox/streets-v10",
					center: [-74.0066, 40.7135],
					zoom: 15,
					pitch: 45,
					bearing: -17.6
				});

				map.on('load', function() {
					map.addLayer({
						'id': '3d-buildings',
						'source': 'composite',
						'source-layer': 'building',
						'filter': ['==', 'extrude', 'true'],
						'type': 'fill-extrusion',
						'minzoom': 15,
						'paint': {
							'fill-extrusion-color': '#aaa',
							'fill-extrusion-height': {
								'type': 'identity',
								'property': 'height'
							},
							'fill-extrusion-base': {
								'type': 'identity',
								'property': 'min_height'
							},
							'fill-extrusion-opacity': .6
						}
					});
				});

			}
		}*/

	});
});