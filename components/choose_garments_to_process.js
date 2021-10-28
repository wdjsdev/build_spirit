function chooseGarmentsToProcess(garments)
{
	var result = [];
	
	var garNames = [];
	for(var x=0;x<garments.length;x++)
	{
		garNames.push(garments[x].garCode);
	}

	var chosenGarments = chooseFromListbox(garNames,"which garments");

	if(chosenGarments && chosenGarments.length)
	{
		for(var x=0;x<chosenGarments.length;x++)
		{
			result.push(garments[garNames.indexOf(chosenGarments[x])])
		}
	}
	return result;
}