function masterLoop ( garmentsNeeded )
{

	var curGarment;
	var garments = [];


	for ( var gar in garmentsNeeded )
	{
		curGarment = garmentsNeeded[ gar ];
		curGarment.garCode = curGarment.mid.replace( /[yg]/ig, "" ) + "_" + curGarment.styleNum;
		garments.push( curGarment );
	}

	var chosenGarmentCodes = chooseGarmentsToProcess( garments.map( function ( g ) { return g.garCode } ) );

	garments = garments.filter( function ( g ) { return chosenGarmentCodes.indexOf( g.garCode ) > -1 } )

	garments.forEach( function ( gar )
	{
		curGarment = gar;
		prepressFile = findPrepressFile( curGarment.garCode );


		//if there's no prepress file for this.. send an
		//log an error and move on
		if ( !prepressFile || !prepressFile.exists )
		{
			log.e( "Failed to find a prepress for: " + curGarment.garCode + ".ai" );
			errorList.push( "Failed to find a prepress for: " + curGarment.garCode + ".ai" );
			return;
		}


		//locate or create the IHFD folder in the job folder
		prodFolderPath = jobFolderPath + programId + "_IHFD/";
		prodFolder = Folder( prodFolderPath );
		if ( !prodFolder.exists ) prodFolder.create();



		//create the prod file
		prodFile = File( prodFolderPath + programId + "_" + curGarment.garCode + "_prod.ai" );
		prodDoc = app.documents.add();
		prodDoc.layers[ 0 ].name = "Artwork";
		prodDoc.saveAs( prodFile );

		//open the prepress
		prepressDoc = app.open( prepressFile );

		duplicateArtToProdFile( curGarment );

		prodDoc.activate();
		inputRosterData( curGarment );

		colorFixer();
		initAdjustProdFile();
		// prodFileSaveLocation = pdfsPath;
		// getSaveLocation();
		log.l( "prodFileSaveLocation = " + prodFileSaveLocation );
		createAdjustmentDialog();
		prepressDoc.close( SaveOptions.DONOTSAVECHANGES );
	} );



	// for(var ml=0,len=garments.length;ml<len;ml++)
	// {
	// 	curGarment = garments[ml];
	// 	// curGarment.garCode = garCode = curGarment.mid.replace(/[yg]/ig,"") + "_" + curGarment.styleNum;


	// 	// prepressFile = File(prepressFolderPath + garCode + ".ai");
	// 	prepressFile = findPrepressFile(curGarment.garCode);


	// 	//if there's no prepress file for this.. send an
	// 	//log an error and move on
	// 	if(!prepressFile || !prepressFile.exists)
	// 	{
	// 		log.e("Failed to find a prepress for: " + curGarment.garCode + ".ai");
	// 		errorList.push("Failed to find a prepress for: " + curGarment.garCode + ".ai");
	// 		continue;	
	// 	}


	// 	prodFolderPath = jobFolderPath + programId + "_IHFD/";
	// 	prodFolder = Folder(prodFolderPath);
	// 	if(!prodFolder.exists)prodFolder.create();


	// 	//setup pdfs folder for exported items
	// 	// pdfsPath = prodFolderPath + programId + "_" + garCode + "_PDFs";
	// 	// pdfsFolder = Folder(pdfsPath);
	// 	// if(!pdfsFolder.exists)pdfsFolder.create();



	// 	//create the prod file
	// 	prodFile = File(prodFolderPath + programId + "_" + curGarment.garCode + "_prod.ai");
	// 	prodDoc = app.documents.add();
	// 	prodDoc.layers[0].name = "Artwork";
	// 	prodDoc.saveAs(prodFile);

	// 	//open the prepress
	// 	prepressDoc = app.open(prepressFile);

	// 	duplicateArtToProdFile(curGarment);

	// 	prodDoc.activate();
	// 	inputRosterData(curGarment.roster);

	// 	colorFixer();
	// 	initAdjustProdFile();
	// 	// prodFileSaveLocation = pdfsPath;
	// 	// getSaveLocation();
	// 	log.l("prodFileSaveLocation = " + prodFileSaveLocation);
	// 	createAdjustmentDialog();
	// 	prepressDoc.close(SaveOptions.DONOTSAVECHANGES);

	// }	




}