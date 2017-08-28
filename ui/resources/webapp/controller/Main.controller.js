sap.ui.define([
	"sap/ui/core/mvc/Controller",
	"sap/ui/model/json/JSONModel",
	"sap/ui/Device"
], function(Controller, JSONModel, Device) {
	"use strict";

	return Controller.extend("ui.controller.Main", {
		onInit: function() {

			var oModel = new sap.ui.model.json.JSONModel("/cityPoints.xsjs");
			this.getView().setModel(oModel);

			var oDeviceModel = new JSONModel(Device);
			oDeviceModel.setDefaultBindingMode("OneWay");
			this.getView().setModel(oDeviceModel, "device");

			var oGeoMap = this.getView().byId("vbi");
			var oMapConfig = {
				"MapProvider": [{
					"name": "HEREMAPS",
					"type": "",
					"description": "",
					"tileX": "256",
					"tileY": "256",
					"minLOD": "1",
					"maxLOD": "20",
					"copyright": "© 1987–2017 HERE",
					"Source": [{
						"id": "s1",
						"url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
					}, {
						"id": "s2",
						"url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
					}, {
						"id": "s3",
						"url": "https://3.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
					}, {
						"id": "s4",
						"url": "https://4.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
					}]
				}],
				"MapLayerStacks": [{
					"name": "DEFAULT",
					"MapLayer": {
						"name": "layer1",
						"refMapProvider": "HEREMAPS",
						"opacity": "1",
						"colBkgnd": "RGB(255,255,255)"
					}
				}]
			};
			
				
			oGeoMap.setMapConfiguration(oMapConfig);
			oGeoMap.setRefMapLayerStack("DEFAULT");
		},
		onPressResize: function() {
			if (this.byId("btnResize").getTooltip() === "Minimize") {
				if (sap.ui.Device.system.phone) {
					this.byId("vbi").minimize(132, 56, 1320, 560); //Height: 3,5 rem; Width: 8,25 rem
				} else {
					this.byId("vbi").minimize(168, 72, 1680, 720); //Height: 4,5 rem; Width: 10,5 rem
				}
				this.byId("btnResize").setTooltip("Maximize");
			} else {
				this.byId("vbi").maximize();
				this.byId("btnResize").setTooltip("Minimize");
			}
		}
	});
});