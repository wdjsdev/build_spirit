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
		log.l( "Processing garment: " + curGarment.garCode );
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

		// if ( curGarment.age === "youth" )
		// {
		// 	curGarment.garCode = curGarment.mid + ( curGarment.mid.match( /w/i ) ? "G" : "Y" ) + "_" + curGarment.styleNum;
		// }


		var prodFileName = prodFolderPath + curGarment.garCode + "_" + curGarment.cco + "prod.ai";
		var prodFile = File( prodFileName );
		var prodDoc = app.documents.add();
		curGarment.prodFile = prodDoc;
		prodDoc.layers[ 0 ].name = "Artwork";
		prodDoc.saveAs( prodFile );

		log.l( "Created the production file: " + prodFile.name );
		log.l( "Opening the prepress file: " + prepressFile.name );


		//open the prepress
		prepressDoc = app.open( prepressFile );
		curGarment.prepressDoc = prepressDoc;

		//normalize the garment layer names
		afc( prepressDoc, "layers" ).forEach( function ( l )
		{
			l.name = l.name.replace( /[-]/g, "_" ).replace( /_/, "-" );
		} );

		var prepressGarmentLayer = findSpecificLayer( prepressDoc.layers, curGarment.garCode, "any" );
		if ( !prepressGarmentLayer )
		{
			log.e( "Failed to find the garment layer for: " + curGarment.garCode );
			errorList.push( "Failed to find the garment layer for: " + curGarment.garCode );
			return;
		}

		log.l( "Found the garment layer for: " + curGarment.garCode + ", " + prepressGarmentLayer.name );

		var artworkDuplicationGroup = prepressGarmentLayer.groupItems.add();

		var prepressLayer = findSpecificLayer( prepressGarmentLayer.layers, "Prepress", "any" );

		fixImproperWomensSizing( prepressLayer );

		var curSizeLayer;
		for ( var size in curGarment.roster )
		{
			curSizeLayer = findSpecificLayer( prepressLayer.layers, new RegExp( "^" + size + "w?", "i" ) );
			if ( !curSizeLayer ) continue;

			if ( curGarment.var )
			{
				for ( var curWaist in curGarment.roster[ size ] )
				{
					afc( curSizeLayer, "groupItems" ).forEach( function ( pi )
					{
						if ( !pi.name.match( new RegExp( "^" + curWaist + "w?", "i" ) ) )
						{
							return;
						}
						pi.duplicate( artworkDuplicationGroup, ElementPlacement.PLACEATEND )
					} )
				}
			}
			else
			{
				afc( curSizeLayer, "groupItems" ).forEach( function ( pi )
				{
					pi.duplicate( artworkDuplicationGroup, ElementPlacement.PLACEATEND )
				} )
			}
		}

		log.l( "Duplicating " + artworkDuplicationGroup.pageItems.length + " page items to the production file." )

		if ( !artworkDuplicationGroup.pageItems.length )
		{
			errorList.push( "No prepress artwork found for: " + curGarment.garCode );
			log.e( "No prepress artwork found for: " + curGarment.garCode );
			return;
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