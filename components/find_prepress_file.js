function findPrepressFile(code)
{
	log.l("Looking for a prepress file for: " + code );
	log.l("Searching folder: " + prepressFolderPath);
	var result;
	var files = Folder(prepressFolderPath).getFiles();
	var fName;
	code = code.replace(/[-_]/g,"");
	for(var f=0;f<files.length && !result;f++)
	{
		fName = files[f].name.replace(/[-_]/g,"");
		if(fName.match(code) && fName.match(/\.ai[t]?$/i) && fName.match(/prepress/i))
		{
			result = files[f];
		}
		else if( fName.match( code.replace(/[yg]/i,"") ))
		{
			result = files[f];
		}
		
	}
	return result;
}