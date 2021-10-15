function duplicateArtToProdFile(curGarment)
{
	var garmentLayer = findSpecificLayer(prepressDoc.layers,curGarment.mid,"any");
	if(!garmentLayer)
	{
		errorList.push("Failed to find a garment layer for " + curGarment.garCode);
		return;
	}

	var ppLay = findSpecificLayer(garmentLayer.layers,"prepress","any");
	if(!ppLay)
	{
		errorList.push("Failed to find a prepress layer for " + curGarment.garCode);
		return;
	}

	ppLay.locked = false;
	ppLay.visible = true;

	//loop the roster object and select
	//all the necessary sizes and duplicate them
	//to prod file
	var curSizeLay;
	var tmpLay = ppLay.layers.add();
	var tmpGroup = tmpLay.groupItems.add();
	
	for(var size in curGarment.roster)
	{
		prepressDoc.selection = null;
		curSizeLay = findSpecificLayer(ppLay,size,"any");
		curSizeLay.hasSelectedArtwork = true;
		for(var s= curSizeLay.pageItems.length -1;s>=0;s--)
		{
			curSizeLay.pageItems[s].duplicate(tmpGroup);
		}
	}

	//duplicate the art to the production file
	var prodTmpGroup = tmpGroup.duplicate(prodDoc);

	//ungroup the art
	var curItem;
	for(var x=prodTmpGroup.pageItems.length-1;x>=0;x--)
	{
		curItem = prodTmpGroup.pageItems[x];
		curItem.moveToBeginning(prodTmpGroup.layer);	
		setupRosterGroup(curItem);
	}
	

}