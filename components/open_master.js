function openMaster(programId)
{
	var masterFolder,masterFile;

	var path = "/Volumes/Customization/5_Spiritwear Sites/Spirit Wear Shop";

	var shopFolders = Folder(path).getFiles();
	

	
	for(var x = shopFolders.length-1;x>=0 && !masterFolder;x--)
	{
		if(shopFolders[x].name.indexOf(programId)>-1)
		{
			masterFolder = shopFolders[x];
		}
	}

	if(!masterFolder)
	{
		log.e("Failed to find the master file matching programId: " + programId);
		valid = false;
		return undefined;
	}

	var shopFiles = masterFolder.getFiles();
	for(var x=shopFiles.length-1;x>=0;x--)
	{
		if(shopFiles[x].name.indexOf(programId)>-1 && shopFiles[x].name.indexOf(".ai")>-1)
		{
			masterFile = shopFiles[x]
		}
	}

	app.open(masterFile);
	return app.activeDocument;

}