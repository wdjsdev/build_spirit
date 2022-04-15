//given a garmentsNeeded object (gn)
//loop each garment and identify the converted template
//file, open the file, recolor the file, save the file to job folder


/*
"FD-6062_1007":
	{
		roster:
		{
			S: [(
			{
				name: undefined,
				number: "2"
			})],
			"2XL": [(
			{
				name: "",
				number: ""
			})]
		},
		mid: "FD-6062",
		styleNum: "1007"
	},*/

function buildOffering(gn)
{
	var jobFolderPath = desktopPath + "Spirit_Sites/" + programId + "/";
	var jobFolder = Folder(jobFolderPath);
	if (!jobFolder.exists) jobFolder.create();

	var prepressPath = jobFolderPath + "prepress_" + programId + "/";
	var prepressFolder = Folder(prepressPath);
	if (!prepressFolder.exists) prepressFolder.create();



	//save master file to local drive folder
	// masterFile.saveAs(File(jobFolderPath + masterFile.name));

	//get param colors layer
	var paramLayer = findSpecificLayer(masterFile.layers, "param", "any");
	if (!paramLayer)
	{
		valid = false;
		log.e("Failed to find param layer. doc layers = ::" + arrayFromContainer(masterFile, "layers").join("\n"));
		errorList.push("Failed to find a Param Colors layer.")
		return;
	}

	//get the artwork layer and adult/youth groups
	var artLayer = findSpecificLayer(masterFile.layers, "artwork", "any");
	if (!artLayer)
	{
		valid = false;
		log.e("Failed to find artwork layer. doc layers = ::" + arrayFromContainer(masterFile, "layers").join("\n"));
		errorList.push("Failed to find a Artwork layer.")
		// return;
	}
	else{
		var adultArtGroup = findSpecificPageItem(artLayer, "adult", "any");
		var youthArtGroup = findSpecificPageItem(artLayer, "youth", "any");
	}



	//get the converted template locations database
	var ctlPath = dataPath + "build_mockup_data/converted_template_locations_database.js";
	if(!File(ctlPath).exists)
	{
		log.e("Failed to find the converted templates location path.::e = " + e + "::e.line = " + e.line)
		errorList.push("Couldn't find the appropriate CT Database...");
		valid = false;
		return;
	}

	eval("#include \"" + ctlPath + "\"");

	var garments = [];

	arrayFromContainer(paramLayer,"groupItems").forEach(function(curGroup)
	{
		garments.push(curGroup.name);
	})


	garments = chooseGarmentsToProcess(garments);

	app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;

	garments.forEach(function(curGarCode){
		log.l("cur garment code = " + curGarCode);
		var curPrepress, cppab, cppabLen, paramGroup;
		var curCts = getCts(ctLocations,curGarCode);
		if(curCts.length)
		{
			paramGroup = findSpecificPageItem(paramLayer,curGarCode,"imatch");
			curPrepress = createPrepress(curCts,paramGroup);
			cppab = curPrepress.artboards;
			cppabLen = cppab.length;


			//prepress has been created
			//now import the artwork into the prepress file
			if(artLayer)
			{
				arrayFromContainer(curPrepress, "layers").forEach(function (curLayer) {
					var curName = curLayer.name;
					if (!curName.match(/^[fdbmps]{2,3}-[0-9]*/i)) {
						return;
					}


					var curArtLayer = findSpecificLayer(curLayer, "artwork", "any");
					if (curName.match(/[yg]_/i)) {
						var refAb = cppab[cppabLen == 2 ? 1 : 0];
						var artCopy = youthArtGroup.duplicate(curArtLayer);
					} else {
						var refAb = cppab[0];
						var artCopy = adultArtGroup.duplicate(curArtLayer);
					}

					var artCopyName = artCopy.name;

					artCopy.left = refAb.artboardRect[0];
					artCopy.top = refAb.artboardRect[1] + artCopy.height + 50;
					ungroup(artCopy);
					if (findSpecificPageItem(curLayer, artCopyName, "imatch")) {
						curLayer.pageItems[artCopyName].remove();
					}
					arrayFromContainer(curArtLayer, "symbolItems").forEach(function (curItem) {
						curItem.breakLink();
					})

					arrayFromContainer(curArtLayer,"layers").forEach(function(curLayer){
						arrayFromContainer(curLayer, "pageItems").forEach(function (curItem) {
							curItem.locked = false;
							curItem.hidden = false;
							curItem.moveToBeginning(curArtLayer);
							if (curItem.typename.match(/group|compound/i)) {
								if(!curItem.pageItems || !curItem.pageItems.length || curItem.name.match(/guide/i))
								{
									curItem.remove();
								}
								else
								{
									arrayFromContainer(curItem, "pageItems").forEach(function (curSubItem) {
										curSubItem.locked = false;
										curSubItem.hidden = false;
										if (curSubItem.guides) {
											curSubItem.remove();
										}
									})
								}
								
							}
							else if(curItem.guides)
							{
								curItem.remove();
							}
						})
						curLayer.remove();
					})
					

					



				})
			}
			
			curPrepress.selection = null;
			curPrepress.saveAs(File(prepressPath + curGarCode + ".ai"));

		}
		else
		{
			errorList.push("No converted template files found for " + curGarCode);
			log.e("No converted template files found for " + curGarCode);
		}

	})

	app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;
	
}