sap.ui.define([
	"sap/ui/core/mvc/Controller"
], function(Controller) {
	"use strict";

	return Controller.extend("com.sap.clusterClusterUI.controller.Main", {

		onInit: function() {
			//create an instance of ClusterTree which will be used as our clustering mode
			this.oCurrentClustering = new sap.ui.vbm.ClusterTree({
				rule: "status=good",
				click: this.onClickCluster.bind(this),
				vizTemplate: new sap.ui.vbm.Cluster({
					type: sap.ui.vbm.SemanticType.Success,
					icon: "sap-icon://shipping-status",
					text: {
						path: "/",
						formatter: function(data) {
							//							return this.mClusterId;
							var oClusterInstance = this;
							var sRenderedClusterId = oClusterInstance.getId();
							var oVizObjMap = oClusterInstance.getParent().mVizObjMap;
							for (var sClusterKey in oVizObjMap) {
								if (oVizObjMap[sClusterKey].getId() === sRenderedClusterId) {
									var oVBI = oClusterInstance.getParent().getParent();
									var spotIds = oVBI.getInfoForCluster(sClusterKey, sap.ui.vbm.ClusterInfoType.ContainedVOs);
									var aSpots = [];
									spotIds.map(function(spotId) {
										aSpots.push(oVBI.getVoByInternalId(spotId));
									});
									return aSpots.length;
								}
							}
						}
					}
				})
			});

			//create an instance of the popover which will be shown
			//when clicking a cluster. The popover will include a list
			//of the spots the cluster represents.
			this.oPopover = new sap.m.Popover({
				title: "Cluster Details",
				placement: sap.m.PlacementType.Right,
				contentMinWidth: "11rem",
				content: new sap.m.List({
					items: {
						path: "/spots",
						template: new sap.m.StandardListItem({
							title: "{name}",
							icon: "sap-icon://shipping-status"
						})
					}
				})
			});

			//Add map provider
			var oMapConfig = {
				"MapProvider": [{
					"name": "HEREMAPS",
					"type": "",
					"description": "",
					"tileX": "256",
					"tileY": "256",
					"minLOD": "0",
					"maxLOD": "23",
					"copyright": "© 1987–2017 HERE",
					"Source": [{
						"id": "s1",
						"url": "https://1.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
					}, {
						"id": "s2",
						"url": "https://2.base.maps.cit.api.here.com/maptile/2.1/maptile/newest/normal.day/{LOD}/{X}/{Y}/256/png8?app_id=Mv1sZKBYuOL0uLAPcrRy&app_code=lglFX4tb_IwBnHuvVsNT6w"
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

			//save a reference to the instance of GeoMap
			this.oVBI = this.getView().byId("vbi");
			this.oVBI.setMapConfiguration(oMapConfig);
			this.oVBI.setRefMapLayerStack("DEFAULT");

			var oModel = new sap.ui.model.json.JSONModel();
			oModel.setSizeLimit(99999);

			$.getJSON("model/clusterUnclustered.json", function(data) {
				oModel.setData(data);
				this.oData = data;
			}.bind(this));

			this.getView().setModel(oModel);

		},
		onToggleCluster: function(event) {
			if (event.getParameter("pressed")) {
				//If the toggle button is pressed, we add the clustering and updated the button text.
				this.oVBI.addCluster(this.oCurrentClustering);
				event.getSource().setText("Cluster off");
			} else {
				//If the toggle button is deactivated, we remove the clustering and update the button text.
				this.oVBI.removeCluster(this.oCurrentClustering);
				event.getSource().setText("Cluster on");
			}
		},

		onClickCluster: function(event) {
			//clusterContainer is an instance of sap.ui.vbm.ClusterContainer
			var clusterContainer = event.getParameter("instance");
			//oTargetCluster is an instance of sap.ui.vbm.Cluster
			var oTargetCluster = clusterContainer.getItem();

			var type = sap.ui.vbm.ClusterInfoType.ContainedVOs;
			//retrieving an array of all current spots belonging to the clicked cluster
			var allSpots = this.oVBI.getClusteredSpots(clusterContainer, type);

			var spots = allSpots.map(function(spot) {
				return {
					name: spot.getTooltip()
				};
			});

			//creating a model for the Popover list
			var oClusterModel = new sap.ui.model.json.JSONModel();
			oClusterModel.setSizeLimit(99999);
			//setting the data which will be a list of spot ids
			oClusterModel.setData({
				spots: spots
			});

			//passing the data model to the popover
			this.oPopover.setModel(oClusterModel);
			//open the popover
			jQuery.sap.delayedCall(0, this, function() {
				this.oPopover.openBy(oTargetCluster);
			}.bind(this));
		}

	});
});