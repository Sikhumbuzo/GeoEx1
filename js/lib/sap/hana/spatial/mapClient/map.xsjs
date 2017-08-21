var destination = $.net.http.readDestination("here-maps");
var client = $.net.http.Client();

var level = $.request.parameters.get("level");
var row = $.request.parameters.get("row");
var col = $.request.parameters.get("col");

if(level != parseInt(level,10) || row != parseInt(row,10) || col != parseInt(col,10))	
{
    $.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody("invalid parameters "+parseInt(level,0));
}
else
{
    //var config = $.config.getObject("sap.hana.spatial.mapClient","config");
    var appCode = "lglFX4tb_IwBnHuvVsNT6w";
    var appId = "Mv1sZKBYuOL0uLAPcrRy";    

    /**
     * http://base.maps.api.here.com/maptile/2.1/TYPE/MAPID/SCHEME/ZOOM/COL/ROW/RESOLUTION/FORMAT
     * TYPE   := maptile | basetile | xbasetile | labeltile | streetile
     * MAPID  := newest | <version_id>
     * SCHEME := normal.day | normal.day.grey | terrain.day | satellite.day | hybrid.day | pedestrian.day | pedestrian.night | ...
     * ZOOO   := [0..19]
     **/        
    var request = new $.web.WebRequest($.net.http.GET, "/maptile/2.1/maptile/newest/normal.day/" + level + "/" + col +"/" + row + "/256/png8?app_id="+appId+"&app_code="+appCode);
	
    try
    {
    	client.request(request, destination);
		var ret = client.getResponse();
		$.response.status = ret.status;
		$.response.setBody(ret.body.asArrayBuffer());
		$.response.contentType = "image/png";
    }
    catch (e) 
    {
		$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
		$.response.setBody(e.toString());
    }
}
