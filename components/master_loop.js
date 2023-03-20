function masterLoop ( garmentsNeeded )
{


	var listboxGarmentCodes = garmentsNeeded.map( function ( g )
	{
		return g.label + ( g.designNumber ? " - " + g.designNumber : "" );
	} );

	listboxGarmentCodes = getUnique( listboxGarmentCodes );

	var chosenGarmentCodes = chooseGarmentsToProcess( listboxGarmentCodes ).map( function ( cgc ) 
	{
		return cgc.replace( / - .*$/, "" );
	} );

	var garments = garmentsNeeded.filter( function ( g ) { return chosenGarmentCodes.indexOf( g.label ) > -1 } )

	garments.forEach( function ( curGarment )
	{
		prepressFile = findPrepressFile( curGarment );


		//if there's no prepress file for this.. send an Mcx
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

		if ( curGarment.age === "youth" )
		{
			curGarment.garCode = curGarment.mid + ( curGarment.mid.match( /w/i ) ? "G" : "Y" ) + "_" + curGarment.styleNum;
		}


		var prodFileName = prodFolderPath + curGarment.garCode + "_" + curGarment.cco + "prod.ai";
		var prodFile = File( prodFileName );
		var prodDoc = app.documents.add();
		prodDoc.layers[ 0 ].name = "Artwork";
		prodDoc.saveAs( prodFile );



		//open the prepress
		prepressDoc = app.open( prepressFile );

		var prepressGarmentLayer = findSpecificLayer( prepressDoc.layers, curGarment.garCode, "any" );
		if ( !prepressGarmentLayer )
		{
			log.e( "Failed to find the garment layer for: " + curGarment.garCode );
			errorList.push( "Failed to find the garment layer for: " + curGarment.garCode );
			return;
		}

		var artworkDuplicationGroup = prepressGarmentLayer.groupItems.add();

		var prepressLayer = findSpecificLayer( prepressGarmentLayer.layers, "Prepress", "any" );

		for ( var size in curGarment.roster )
		{
			afc( prepressLayer.layers[ size ] ).forEach( function ( pi )
			{
				pi.duplicate( artworkDuplicationGroup, ElementPlacement.PLACEATEND )
			} )
		}


		var prodDocArtGroup = artworkDuplicationGroup.duplicate( prodDoc.layers[ 0 ] );

		prodDoc.activate();
		afc( prodDocArtGroup, "pageItems" ).forEach( function ( pi )
		{
			pi.moveToBeginning( prodDoc.layers[ 0 ] );
			setupRosterGroup( pi );
		} );

		artworkDuplicationGroup.remove();

		inputRosterData( curGarment );
		colorFixer();
		initAdjustProdFile();
		loadExpandAction();
		createAdjustmentDialog();
		prepressDoc.close( SaveOptions.DONOTSAVECHANGES );
	} );






	// function sendArtToProdFile ( artworkDuplicationGroup, prodFileName )
	// {
	// 	//create the prod file
	// 	var prodFile = File( prodFileName );
	// 	var prodDoc = app.documents.add();
	// 	prodDoc.layers[ 0 ].name = "Artwork";
	// 	prodDoc.saveAs( prodFile );

	// 	var prodDocArtGroup = artworkDuplicationGroup.duplicate( prodDoc.layers[ 0 ] );

	// 	afc( prodDocArtGroup, "pageItems" ).forEach( function ( pi )
	// 	{
	// 		pi.moveToBeginning( prodDoc.layers[ 0 ] );
	// 		setupRosterGroup( pi );
	// 	} );

	// 	artworkDuplicationGroup.remove();

	// 	// duplicateArtToProdFile( curGarment );

	// 	prodDoc.activate();
	// 	inputRosterData( curGarment );

	// 	colorFixer();
	// 	initAdjustProdFile();
	// 	log.l( "prodFileSaveLocation = " + prodFileSaveLocation );
	// 	loadExpandAction();
	// 	createAdjustmentDialog();
	// }






}