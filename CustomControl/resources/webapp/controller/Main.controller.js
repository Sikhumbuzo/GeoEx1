sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("CustomControl.controller.Main", {
		onInit: function() {
			this.getView().byId("map_canvas").addStyleClass("myMap");
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
		/*onAfterRendering: function() {
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

			var map = new H.Map(this.getView().byId("map_canvas").getDomRef(), defaultLayers.normal.map,{
				zoom: 10,
				center: {lat: -26.195246, lng: 28.034088}
			});
			var behavior = new H.mapevents.Behavior(new H.mapevents.MapEvents(map));

			var ui = H.ui.UI.createDefault(map, defaultLayers);
			
			var jhbMarker = new H.map.Marker({
				lat: -26.195246,
				lng: 28.034088
			});
			map.addObject(jhbMarker);
		}*/

		//Esri
		onAfterRendering: function() {
			if (!this.initialized) {
				require([
					"dojo/dom-construct",
					"esri/Map",
					"esri/views/MapView",
					"esri/tasks/Locator",
					"esri/widgets/Locate",
					"esri/widgets/Search",
					"dojo/domReady!"
				], function(domConstruct, Map, MapView, Locator, Locate, Search) {

					var locatorTask = new Locator({
						url: "https://geocode.arcgis.com/arcgis/rest/services/World/GeocodeServer"
					});
					var map = new Map({
						basemap: "osm"
					});
					var view = new MapView({
						container: "content",
						map: map,
						zoom: 12,
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
		}

	});
});