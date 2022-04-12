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

	var prepressPath = jobFolderPath + "prepress/";
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
	try
	{
		eval("#include \"" + ctlPath + "\"");
	}
	catch (e)
	{
		log.e("Failed to find the converted templates location path.::e = " + e + "::e.line = " + e.line)
		errorList.push("Couldn't find the appropriate CT Database...");
		valid = false;
		return;
	}

	var garments = [];


	for(var gar in gn)
	{
		curGarment = gn[gar];
		curGarment.garCode = curGarment.mid.replace(/[yg]/ig,"") + "_" + curGarment.styleNum;
		garments.push(curGarment);
	}

	garments = chooseGarmentsToProcess(garments);

	var curGarment, curPrepress, ctPath, paramGroup,garCode;
	var curCts = [];
	// for (var garCode in gn)
	for(var x=0;x<garments.length;x++)
	{
		curGarment = garments[x];
		garCode = curGarment.garCode;
		log.l("curGarment = " + garCode);

		if(garCode.match(/[gy]/i))
		{
			log.l("skipping " + garCode)
			continue;
		}


		curCts = getCts(ctLocations,garCode,curGarment.mid)

		if(curCts.length)
		{
			paramGroup = findSpecificPageItem(paramLayer,curGarment.garCode.replace("_","-"),"imatch");
			curPrepress = createPrepress(curCts,paramGroup);
			curPrepress.saveAs(File(prepressPath + garCode + ".ai"));
		}
		else
		{
			errorList.push("No converted template files found for " + garCode);
			log.e("No converted template files found for " + garCode);
		}

	}
}