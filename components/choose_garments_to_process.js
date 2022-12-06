function chooseGarmentsToProcess ( garments )
{
	var result = [];
	// var garNames = garments.map( function ( g ) { return g.garCode } );

	// var chosenGarments = chooseFromListbox( garNames, "which garments" );
	var chosenGarments = chooseFromListbox( garments, "which garments" );


	if ( chosenGarments && chosenGarments.length )
	{
		for ( var x = 0; x < chosenGarments.length; x++ )
		{
			// result.push( garments[ garNames.indexOf( chosenGarments[ x ] ) ] );
			result.push( chosenGarments[ x ] );
		}
	}
	return result;
}