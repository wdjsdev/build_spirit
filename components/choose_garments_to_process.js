function chooseGarmentsToProcess(garNames)
{
	var result = [];

	var chosenGarments = chooseFromListbox(garNames,"which garments");

	if(chosenGarments && chosenGarments.length)
	{
		for(var x=0;x<chosenGarments.length;x++)
		{
			result.push(garNames[garNames.indexOf(chosenGarments[x])])
		}
	}
	return result;
}