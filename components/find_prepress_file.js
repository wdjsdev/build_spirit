function findPrepressFile ( garment )
{
	var result;
	var files = Folder( prepressFolderPath ).getFiles();
	var fName;
	var code = garment.garCode;

	var searchTerm = new RegExp( ( garment.designNumber || garment.orderNumber || code ), "i" );
	files.forEach( function ( f )
	{
		if ( result || !f.name.match( /prepress.*\.ai[t]?$/i ) )
		{
			return;
		}
		if ( f.name.match( searchTerm ) )
		{
			result = f;
		}
	} );

	log.l( "prepress file: " + result.name + " for " + garment.garCode + " found." )
	return result;
}