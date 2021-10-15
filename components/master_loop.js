function masterLoop(garmentsNeeded)
{
	
	var curGarment;
	var garments = [];


	for(var gar in garmentsNeeded)
	{
		garments.push(garmentsNeeded[gar]);
	}

	////////////////////////
	////////ATTENTION://////
	//
	//		put some logic here to allow for selecting
	//		which garments to process
	//
	////////////////////////


	for(var ml=0,len=garments.length;ml<len;ml++)
	{
		curGarment = garments[ml];
		curGarment.garCode = garCode = curGarment.mid + "_" + curGarment.styleNum;
		prepressFile = File(prepressFolderPath + garCode + ".ai");
		

		//if there's no prepress file for this.. send an
		//log an error and move on
		if(!prepressFile.exists)
		{
			log.e("Failed to find a prepress for: " + garCode + ".ai");
			errorList.push("Failed to find a prepress for: " + garCode + ".ai");
			continue;
		}


		prodFolderPath = jobFolderPath + programId + "_IHFD/";
		prodFolder = Folder(prodFolderPath);
		if(!prodFolder.exists)prodFolder.create();


		//setup pdfs folder for exported items
		// pdfsPath = prodFolderPath + programId + "_" + garCode + "_PDFs";
		// pdfsFolder = Folder(pdfsPath);
		// if(!pdfsFolder.exists)pdfsFolder.create();



		//create the prod file
		prodFile = File(prodFolderPath + programId + "_" + garCode + "_prod.ai");
		prodDoc = app.documents.add();
		prodDoc.layers[0].name = "Artwork";
		prodDoc.saveAs(prodFile);

		//open the prepress
		prepressDoc = app.open(prepressFile);

		duplicateArtToProdFile(curGarment);
		
		prodDoc.activate();
		inputRosterData(curGarment.roster);

		colorFixer();
		initAdjustProdFile();
		prodFileSaveLocation = pdfsPath;
		getSaveLocation();
		createAdjustmentDialog();

		break;
	}	




}