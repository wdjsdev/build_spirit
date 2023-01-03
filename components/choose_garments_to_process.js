function chooseGarmentsToProcess ( garmentCodes )
{
	var result = [];

	var chosenGarments = chooseFromListbox( garmentCodes, "which garments" );


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