try{
	
	var connection = $.hdb.getConnection();
	var query = "SELECT \"Latitude\" AS \"Lat\", \"Longitude\" AS \"Lon\", \"City\" AS \"City\" FROM \"GEOEX1_HDI_CONTAINER_2_1\".\"GeoEx1.db::SACities.CityData\" ";
	var results = connection.executeQuery(query);
	//var response = {type: "FeatureCollection"};
	var response = {};
	
	response.items = [];
    
	for(var row = 0; row < results.length; row++) {            
		response.items.push({pos: JSON.parse(results[row].Lon.toString())+";"+JSON.parse(results[row].Lat.toString())+";"+0, tooltip: results[row].City.toString()});
	}
	
	connection.close();

	$.response.contentType = "application/json";
	$.response.setBody(JSON.stringify({Spots: response}));	
	$.response.setStatus = $.net.http.OK;
	
}catch (e){
	$.response.status = $.net.http.INTERNAL_SERVER_ERROR;
    $.response.setBody(e.message);
}