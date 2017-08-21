tileProvider = new H.map.provider.ImageTileProvider({
  label: "normal.day",
  descr: "Nokia Base Map tile provider",
  min: 0,
  max: 23,
  // zoomlevel [0,...,19]
  getURL: function(col, row, level)
  {
    return ["/sap/hana/spatial/mapClient/map.xsjs?col=",
    col,
    "&row=",
    row,
    "&level=",
    level
    ].join("");
  }
});