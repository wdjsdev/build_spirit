function masterLoop(garmentsNeeded)
{
	
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




	var jobFolderPath = "/Volumes/Macintosh HD/Users/will.dowling/Desktop/Spirit_Sites/UFg-qvC-4D5-z2t_2021 Ohio Slam Force Spirit Wear Shop/";
	var prepressFilePath = jobFolderPath + "Prepress/";
	var prepressFile;
	var prepressDoc;
	var ppLay; //prepress layer


	var prodFolderPath = jobFolderPath + "IHFD/";
	var pdfsPath;
	var pdfsFolder;


	var curGarment;
	var garCode;
	

	
	var prodDoc;
	var prodFile;


	for(var ml=0,len=garments.length;ml<len;ml++)
	{
		curGarment = garments[ml];
		curGarment.garCode = garCode = curGarment.mid + "_" + curGarment.styleNum;
		prepressFile = File(prepressFilePath + garCode + ".ai");
		

		//if there's no prepress file for this.. send an
		//log an error and move on
		if(!prepressFile.exists)
		{
			log.e("Failed to find a prepress for: " + garCode + ".ai");
			errorList.push("Failed to find a prepress for: " + garCode + ".ai");
			continue;
		}


		//setup pdfs folder for exported items
		pdfsPath = prodFolderPath + garCode + "_PDFs";
		pdfsFolder = Folder(pdfsPath);
		if(!pdfsFolder.exists)pdfsFolder.create();


		//create the prod file
		prodFile = File(prodFolderPath + garCode + "_prod.ai");
		prodDoc = app.documents.add();
		prodDoc.saveAs(prodFile);

		//open the prepress
		prepressDoc = app.open(prepressFile);

		duplicateArtToProdFile(curGarment);
		



		break;
	}	



	function duplicateArtToProdFile(curGarment)
	{
		var garmentLayer = findSpecificLayer(prepressDoc.layers,curGarment.mid,"any");
		if(!garmentLayer)
		{
			errorList.push("Failed to find a garment layer for " + curGarment.garCode);
			return;
		}

		var ppLay = findSpecificLayer(garmentLayer.layers,"prepress","any");
		if(!ppLay)
		{
			errorList.push("Failed to find a prepress layer for " + curGarment.garCode);
			return;
		}

		ppLay.locked = false;
		ppLay.visible = true;

		//loop the roster object and select
		//all the necessary sizes and duplicate them
		//to prod file
		var curSizeLay;
		var tmpLay = ppLay.layers.add();
		var tmpGroup = tmpLay.groupItems.add();
		for(var size in curGarment.roster)
		{
			curSizeLay = findSpecificLayer(ppLay,size,"any");
			curSizeLay.hasSelectedArtwork = true;
				
		}

	}
}