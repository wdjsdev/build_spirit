function findPrepressFile ( garment )
{
	var resultFiles = [];
	var files = Folder( prepressFolderPath ).getFiles().filter( function ( f ) { return f.name.match( /prepress.*\.ai[t]?$/i ) } );
	var fName;
	var code = garment.garCode.replace( /[-_]/g, "" );


	var searchTerm = new RegExp( ( garment.designNumber || garment.orderNumber || code ), "i" );


	findInFiles( files, searchTerm );
	if ( !resultFiles.length )
	{
		findInFiles( files, code.replace( /y/i, "" ).replace( /g/i, "W" ) );
	}

	if ( !resultFiles.length )
	{
		return;
	}

	if ( resultFiles.length > 1 )
	{
		var chosenFileName = chooseFromListbox( resultFiles.map( function ( f ) { return f.name } ), "Choose a prepress file for " + garment.label, [ 0, 0, 400, 200 ] );
		// var result = files[ chosenFileName[ 0 ] ];
		if ( !chosenFileName.length ) return;
		var result = files.filter( function ( f ) { return f.name == chosenFileName[ 0 ] } )[ 0 ];
	}
	else
	{
		var result = resultFiles[ 0 ];
	}

	return result;



	function findInFiles ( files, searchTerm )
	{
		files.forEach( function ( f )
		{
			if ( f.name.replace( /[-_]/g, "" ).match( searchTerm ) )
			{
				resultFiles.push( f );
				log.l( "prepress file: " + f.name + " for " + garment.garCode + " found." )
			}
		} );
	}
}