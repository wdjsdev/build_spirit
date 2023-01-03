function masterLoop ( garmentsNeeded )
{

	var curGarment;

	//get an array of the garment "labels"
	//example label is "FD-161_1003_W" or "FD-1873W_1032_W_B"
	var garmentLabels = garmentsNeeded.map(function( gar ) { return gar.label; } );
	garmentLabels = chooseGarmentsToProcess( garmentLabels );

	garmentsNeeded.forEach( function ( gar )
	{
		if ( garmentLabels.indexOf( gar.label ) === -1 )
		{
			return;
		}

		curGarment = gar;

		//find the prepress file
		// if this is a uniform shop
		// use the refDesignNumber to find the prepress file
		// else this is a spirit shop
		// use the label to find the prepress file
		var prepressFileSearchTerm = curGarment.refDesignNumber || curGarment.label;
		prepressFile = findPrepressFile(prepressFileSearchTerm)
		
		//if there's no prepress file for this.. send an
		//log an error and move on
		if ( !prepressFile || !prepressFile.exists )
		{
			log.e( "Failed to find a prepress for: " + curGarment.garCode + ".ai::prepressFileSearchTerm = " + prepressFileSearchTerm );
			errorList.push( "Failed to find a prepress for: " + curGarment.garCode + ".ai" );

			return;
		}


		//locate or create the IHFD folder in the job folder
		prodFolderPath = jobFolderPath + programId + "_IHFD/";
		prodFolder = Folder( prodFolderPath );
		if ( !prodFolder.exists ) prodFolder.create();


		//create the prod file
		prodFile = File( prodFolderPath + programId + "_" + curGarment.label + "_prod.ai" );
		prodDoc = app.documents.add();
		prodDoc.layers[ 0 ].name = "Artwork";
		prodDoc.saveAs( prodFile );


		//open the prepress
		prepressDoc = app.open( prepressFile );


		// import the art
		duplicateArtToProdFile( curGarment );
		prodDoc.activate();


		// input roster data
		inputRosterData( curGarment );


		// fix colors and open the adjustment dialog
		colorFixer();
		initAdjustProdFile();
		createAdjustmentDialog();
		prepressDoc.close( SaveOptions.DONOTSAVECHANGES );
	} );

}