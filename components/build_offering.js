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


	var curGarment, curPrepress, ctPath, paramGroup;
	var curCts = [];
	for (var garCode in gn)
	{
		log.l("curGarment = " + garCode);
		if(garCode.match(/[gy]/i))
		{
			log.l("skipping " + garCode)
			continue;
		}

		curGarment = gn[garCode];

		curCts = getCts(ctLocations,garCode,curGarment.mid)

		if(curCts.length)
		{
			paramGroup = findSpecificPageItem(paramLayer,curGarment.mid + "-" + curGarment.styleNum,"imatch");
			curPrepress = createPrepress(curCts,paramGroup);
			curPrepress.saveAs(File(prepressPath + garCode + ".ai"));
		}
		else
		{
			errorList.push("No prepress files found for " + garCode);
			log.e("No prepress files found for " + garCode);
		}

	}
}