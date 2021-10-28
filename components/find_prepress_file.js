function findPrepressFile(code)
{
	var result;
	var files = Folder(prepressFolderPath).getFiles();
	for(var f=0;f<files.length && !result;f++)
	{
		if(files[f].name.match(code) && files[f].name.match(/\.ai[t]?$/i))
		{
			result = files[f];
		}
	}
	return result;
}