function parseSpiritData ( data )
{
	var garmentsInData = [];

	for(var fullLabel in data)
	{
		garmentsInData.push(parseGarment(data[fullLabel],fullLabel));
	}

	function parseGarment( garmentsArray,label )
	{
		var mid = label.replace(/_.*/i,"").replace(/\s/g,"");

		var styleNum = label.replace(/_/g,"-").split("-");
		styleNum = styleNum[styleNum.length-1].replace(/\s.*/i,"");

		if(!styleNum)
		{
			errorList.push("No style number found for " + label);
			log.e("No style number found for " + label);
			return;
		}

		var garmentColor = "";
		if(label.match(/\s/))
		{
			garmentColor = "_" + trimSpaces(label.match(/\s.*$/g)[0]).replace(/\s/g,"_");
		}
		
		var label = mid + "_" + styleNum + garmentColor;
		var garmentRoster = {};
		var refOrderNumber = refDesignNumber = "";
		var refOrder = garmentsArray[0].reforder;
		if(refOrder && !refOrder.match(/^([a-z0-9]{3}-){3}[a-z0-9]{3}$/i))
		{
			var split = garmentsArray[0].reforder.split("_");
			refOrderNumber = split[0];
			refDesignNumber = split[1];
		}
		
		garmentsArray.forEach(function(subGarment)
		{
			var curSize = subGarment.itemtext.replace(/^.*-/g,"");
			if(!garmentRoster[curSize])
			{
				garmentRoster[curSize] = {"players":[]};
				garmentRoster[curSize].qty = 0;
			}
			var curName = subGarment.playername || "";
			var curNumber = subGarment.playernumber || "";
			garmentRoster[curSize].players.push({"name":curName,"number":curNumber});
			garmentRoster[curSize].qty++;
		});

		var garmentObject = {
			"mid": trimSpaces(mid),
			"styleNum": trimSpaces(styleNum),
			"color": trimSpaces(garmentColor),
			"roster": garmentRoster,
			"garCode": mid + "_" + styleNum,
			"label": label,
			"refOrderNumber": refOrderNumber,
			"refDesignNumber": refDesignNumber
		};

		return garmentObject;
	}

	return garmentsInData;
}
