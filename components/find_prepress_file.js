function findPrepressFile ( garment )
{
	var result;
	var files = Folder( prepressFolderPath ).getFiles().filter( function ( f ) { return f.name.match( /prepress.*\.ai[t]?$/i ) } );
	var fName;
	var code = garment.garCode.replace( /[-_]/g, "" );


	var searchTerm = new RegExp( ( garment.designNumber || garment.orderNumber || code ), "i" );


	findInFiles( files, searchTerm );
	if ( !result )
	{
		findInFiles( files, code.replace( /[yg]/i, "" ) );
	}



	return result;



	function findInFiles ( files, searchTerm )
	{
		files.forEach( function ( f )
		{
			if ( result ) 
			{
				return;
			}
			if ( f.name.replace( /[-_]/g, "" ).match( searchTerm ) )
			{
				result = f;
				log.l( "prepress file: " + result.name + " for " + garment.garCode + " found." )
			}
		} );
	}
}