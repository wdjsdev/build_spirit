function getCts(ctLocations,garCode,mid)
{
	var cts = [];
	var youthMid = mid.match(/w/i) ? mid.replace(/w/i,"G") : mid + "Y";

	var adultPath = ctLocations[mid] || undefined;
	var youthPath = ctLocations[youthMid] || undefined;


	var adultFile = File(adultPath ? adultPath + "/" + garCode + ".ait" : File.selectDialog("Please select the Converted Template file for " + garCode)); 
	var youthFile = File(youthPath ? youthPath + "/" + garCode.replace(mid,youthMid) + ".ait" : File.selectDialog("Please select the Converted Template file for " + garCode.replace(mid,youthMid))); 
	
	if(adultFile && adultFile.exists)
	{
		log.l("Found a converted template at: " + adultFile.fullName);
		cts.push(adultFile);
	}
	else if (!adultFile)
	{
		errorList.push("Failed to find a converted template for: " + garCode);
	}

	
	if(youthPath !== "no_youth_garment" && youthFile && youthFile.exists)
	{
		log.l("Found a youth converted template at: " + youthFile.fullName);
		cts.push(File(youthFile));	
	}
	else if(youthPath !== "no_youth_garment")
	{
		log.l("No youth garment needed for " + garCode);
	}
	else
	{
		errorList.push("Failed to find a converted template for: " + garCode.replace(mid,youthMid))
	}
	return cts;
}