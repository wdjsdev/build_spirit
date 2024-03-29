function getJobFolderPath()
{
	var jfPath = desktopPath + "Spirit_Sites/";
	var foundProgramId = false;



	if (!Folder(jfPath).exists)
	{
		Folder(jfPath).create();
		errorList.push("Please copy the program folder to /Desktop/Spirit_Sites/ and try again.");
		valid = false;
		return undefined;
	}

	var orderFolders = Folder(jfPath).getFiles();
	for (var x = 0; x < orderFolders.length; x++)
	{
		if (orderFolders[x].name.match(programId))
		{
			jfPath += orderFolders[x].name + "/";
			foundProgramId = true;
			break;
		}
	}

	if (!foundProgramId)
	{
		errorList.push("Failed to find a job folder matching the program id: " + programId);
		valid = false;
	}

	return decodeURI(jfPath);
}