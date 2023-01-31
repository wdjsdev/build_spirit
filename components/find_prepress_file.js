function findPrepressFile ( code )
{
	var result;
	var files = Folder( prepressFolderPath ).getFiles();
	var fName;
	for ( var f = 0; f < files.length && !result; f++ )
	{
		fName = files[ f ].name.replace( /-/g, "_" ).replace( /_/, "-" );
		if ( files[ f ].name.match( code ) && files[ f ].name.match( /\.ai[t]?$/i ) )
		{
			result = files[ f ];
		}
	}
	return result;
}