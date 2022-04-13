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
	masterFile.saveAs(File(jobFolderPath + masterFile.name));

	//get param colors layer
	var paramLayer = findSpecificLayer(masterFile.layers, "param", "any");
	if (!paramLayer)
	{
		valid = false;
		log.e("Failed to find param layer. doc layers = ::" + arrayFromContainer(masterFile, "layers").join("\n"));
		errorList.push("Failed to find a Param Colors layer.")
		return;
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

	

	garments.forEach(function(curGarCode){
		log.l("cur garment code = " + curGarCode);
		var curPrepress, paramGroup;
		var curCts = getCts(ctLocations,curGarCode);
		if(curCts.length)
		{
			paramGroup = findSpecificPageItem(paramLayer,curGarCode,"imatch");
			curPrepress = createPrepress(curCts,paramGroup);
			curPrepress.saveAs(File(prepressPath + curGarCode + ".ai"));

			//attention//
			// add logic here to bring in artwork from the master file.. logos, names, numbers..
		}
		else
		{
			errorList.push("No converted template files found for " + curGarCode);
			log.e("No converted template files found for " + curGarCode);
		}

	})
	
}