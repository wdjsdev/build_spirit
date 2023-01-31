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

function buildOffering ( gn )
{
	var jobFolderPath = desktopPath + "Spirit_Sites/" + programId + "/";
	var jobFolder = Folder( jobFolderPath );
	if ( !jobFolder.exists ) jobFolder.create();

	var prepressPath = jobFolderPath + "prepress_" + programId + "/";
	var prepressFolder = Folder( prepressPath );
	if ( !prepressFolder.exists ) prepressFolder.create();



	//save master file to local drive folder
	// masterFile.saveAs(File(jobFolderPath + masterFile.name));

	//get param colors layer
	var paramLayer = findSpecificLayer( masterFile.layers, "param", "any" );
	if ( !paramLayer )
	{
		valid = false;
		log.e( "Failed to find param layer. doc layers = ::" + arrayFromContainer( masterFile, "layers" ).join( "\n" ) );
		errorList.push( "Failed to find a Param Colors layer." )
		return;
	}

	//get the artwork layer and adult/youth groups
	var artLayer = findSpecificLayer( masterFile.layers, "artwork", "any" );
	if ( artLayer && artLayer.pageItems.length )
	{
		var artArray = arrayFromContainer( artLayer, "pageItems" ).filter( function ( curItem )
		{
			return !( curItem.name.match( /adult|youth/i ) );
		} );
		var adultArtGroup = findSpecificPageItem( artLayer, "adult", "any" );
		if ( !adultArtGroup )
		{
			adultArtGroup = artLayer.groupItems.add();
			adultArtGroup.name = "adult";
			artArray.forEach( function ( item )
			{
				item.duplicate( adultArtGroup, ElementPlacement.PLACEATEND );
			} )
		}
		var youthArtGroup = findSpecificPageItem( artLayer, "youth", "any" );
		if ( !youthArtGroup )
		{
			youthArtGroup = artLayer.groupItems.add();
			youthArtGroup.name = "youth";
			artArray.forEach( function ( item )
			{
				item.duplicate( youthArtGroup, ElementPlacement.PLACEATEND );
			} )
		}
	}
	else if ( !artLayer.pageItems.length )
	{
		errorList.push( "No artwork on the artwork layer... Can't import any logos/names/numbers to the master files." );
	}
	else
	{
		log.e( "Failed to find artwork layer. doc layers = ::" + arrayFromContainer( masterFile, "layers" ).join( "\n" ) );
		errorList.push( "Failed to find a Artwork layer." )
		// return;
	}



	//get the converted template locations database
	var ctlPath = dataPath + "build_mockup_data/converted_template_locations_database.js";
	if ( !File( ctlPath ).exists )
	{
		log.e( "Failed to find the converted templates location path.::e = " + e + "::e.line = " + e.line )
		errorList.push( "Couldn't find the appropriate CT Database..." );
		valid = false;
		return;
	}

	eval( "#include \"" + ctlPath + "\"" );

	var garmentCodes = [];

	arrayFromContainer( paramLayer, "groupItems" ).forEach( function ( curGroup )
	{
		garmentCodes.push( curGroup.name );
	} )


	garmentCodes = chooseGarmentsToProcess( garmentCodes );

	// app.userInteractionLevel = UserInteractionLevel.DONTDISPLAYALERTS;


	//load the cleanup swatches action
	createAction( "cleanup_swatches", CLEANUP_SWATCHES_ACTION_STRING );
	garmentCodes.forEach( function ( curGarCode )
	{
		log.l( "cur garment code = " + curGarCode );
		var curPrepress, cppab, cppabLen, paramGroup;
		var curCts = getCts( ctLocations, curGarCode );
		if ( curCts.length )
		{
			paramGroup = findSpecificPageItem( paramLayer, curGarCode, "imatch" );
			curPrepress = createPrepress( curCts, paramGroup );
			cppab = curPrepress.artboards;
			cppabLen = cppab.length;


			//prepress has been created
			//now import the artwork into the prepress file
			if ( artLayer )
			{
				arrayFromContainer( curPrepress, "layers" ).forEach( function ( curLayer )
				{
					var curName = curLayer.name;
					if ( !curName.match( /^[fdbmps]{2,3}-[0-9]*/i ) )
					{
						return;
					}


					var curArtLayer = findSpecificLayer( curLayer, "artwork", "any" );
					if ( curName.match( /[yg]_/i ) )
					{
						var refAb = cppab[ cppabLen == 2 ? 1 : 0 ];
						var artCopy = youthArtGroup.duplicate( curArtLayer );
					} else
					{
						var refAb = cppab[ 0 ];
						var artCopy = adultArtGroup.duplicate( curArtLayer );
					}

					artCopy.left = refAb.artboardRect[ 0 ];
					artCopy.top = refAb.artboardRect[ 1 ] + artCopy.height + 50;

					//ungroup the artCopy group and delete any remaining empty group
					afc( artCopy, "pageItems" ).forEach( function ( curItem )
					{
						var curArtGroup = curArtLayer.groupItems.add();
						curArtGroup.name = curItem.name;
						ungroup( curItem, curArtGroup, 1 );
					} );

				} )
			}

			curPrepress.selection = null;
			curPrepress.saveAs( File( prepressPath + curGarCode + ".ai" ) );

		}
		else
		{
			errorList.push( "No converted template files found for " + curGarCode );
			log.e( "No converted template files found for " + curGarCode );
		}

	} )
	removeAction( "cleanup_swatches" );

	// app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

}

function recursiveRemoveGuides ( ci )
{
	ci.locked = false;
	ci.hidden = false;
	if ( ci.guides || ci.name.match( /guide/i ) )
	{
		ci.remove();
	} else if ( ci.typename.match( /group/i ) )
	{
		arrayFromContainer( ci, "pageItems" ).forEach( function ( curItem )
		{
			recursiveRemoveGuides( curItem );
		} )
	} else if ( ci.typename.match( /compound/i ) )
	{
		if ( ci.pathItems && ci.pathItems.length && ci.pathItems[ 0 ].guides )
		{
			ci.remove();
		}
	}
}