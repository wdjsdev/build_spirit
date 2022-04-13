function getCts(ctLocations,garCode)
{
	var mid = garCode.substring(0,garCode.lastIndexOf("-"));
	var styleNum = garCode.substring(garCode.lastIndexOf("-")+1);
	var cts = [];
	var youthMid = mid.match(/w/i) ? mid.replace(/w/i,"G") : mid + "Y";

	var adultPath = ctLocations[mid];
	var youthPath = ctLocations[youthMid];

	if(adultPath)
	{
		 adultPath += "/" + mid + "_" + styleNum + ".ait"
	}
	if(youthPath)
	{
		 youthPath += "/" + youthMid + "_" + styleNum + ".ait"
	}

	var adultFile = File(adultPath ? adultPath : File.openDialog("Please select the Converted Template file for " + garCode)); 
	var youthFile = File(youthPath ? youthPath : File.openDialog("Please select the Converted Template file for " + garCode.replace(mid,youthMid))); 
	
	if(adultFile && adultFile.exists)
	{
		log.l("Found a converted template at: " + adultFile.fullName);
		cts.push(adultFile);
	}
	else
	{
		errorList.push("Failed to find a converted template for: " + garCode);
	}

	
	if(!youthPath.match(/no_youth/i) && youthFile && youthFile.exists)
	{
		log.l("Found a youth converted template at: " + youthFile.fullName);
		cts.push(File(youthFile));	
	}
	else if (youthPath.match(/no_youth/i))
	{
		log.l("No youth garment needed for " + garCode);
	}
	else
	{
		errorList.push("Failed to find a converted template for: " + garCode.replace(mid,youthMid))
	}
	return cts;
}