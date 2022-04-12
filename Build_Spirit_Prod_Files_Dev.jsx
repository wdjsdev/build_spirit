/*

Script Name: Build_Spirit_Prod_Files
Author: William Dowling
Build Date: 23 February, 2018
Description: query netsuite for JSON data for a given order number,
				parse the data, create new document, copy necessary
				artwork to new document, input roster data
	
	
*/


#target Illustrator

function container()
{
	var valid = true;
	var scriptName = "build_spirit_prod_files";

	function getUtilities()
	{
		var result = [];
		var utilPath = "/Volumes/Customization/Library/Scripts/Script_Resources/Data/";
		var ext = ".jsxbin"

		//check for dev utilities preference file
		var devUtilitiesPreferenceFile = File("~/Documents/script_preferences/dev_utilities.txt");

		if (devUtilitiesPreferenceFile.exists)
		{
			devUtilitiesPreferenceFile.open("r");
			var prefContents = devUtilitiesPreferenceFile.read();
			devUtilitiesPreferenceFile.close();
			if (prefContents === "true")
			{
				utilPath = "~/Desktop/automation/utilities/";
				ext = ".js";
			}
		}

		if ($.os.match("Windows"))
		{
			utilPath = utilPath.replace("/Volumes/", "//AD4/");
		}

		result.push(utilPath + "Utilities_Container" + ext);
		result.push(utilPath + "Batch_Framework" + ext);

		if (!result.length)
		{
			valid = false;
			alert("Failed to find the utilities.");
		}
		return result;

	}

	var utilities = getUtilities();
	for (var u = 0, len = utilities.length; u < len; u++)
	{
		eval("#include \"" + utilities[u] + "\"");
	}

	if (!valid) return;

	if (user === "will.dowling")
	{
		DEV_LOGGING = true;
	}

	logDest.push(getLogDest());



	/*****************************************************************************/
	//=================================  Data  =================================//



	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//


	//first get the build prod file components

	var buildProdCompPath = componentsPath + "build_prod_file_beta";
	var buildProdCompDevPath = desktopPath + "automation/build_prod_file/components";
	var buildProdCompFiles = getComponents($.fileName.indexOf("Dev.jsx") > -1 ? buildProdCompDevPath : buildProdCompPath)
	// var buildProdCompFiles = getComponents(buildProdCompDevPath);

	if(!buildProdCompFiles || !buildProdCompFiles.length)
	{
		errorList.push("Failed to find the necessary components.");
		log.e("No components were found.");
		valid = false;
		return valid;
	}

	for (var cf = 0, len = buildProdCompFiles.length; cf < len; cf++)
	{
		curComponent = buildProdCompFiles[cf].fullName;
		eval("#include \"" + curComponent + "\"");
		log.l("included: " + buildProdCompFiles[cf].name);
	}





	var devComponents = desktopPath + "/automation/build_spirit/components";
	var prodComponents = componentsPath + "/build_spirit";

	var compFiles = getComponents($.fileName.indexOf("Dev.jsx") > -1 ? devComponents : prodComponents);

	if (compFiles && compFiles.length)
	{
		var curComponent;
		for (var cf = 0, len = compFiles.length; cf < len; cf++)
		{
			curComponent = compFiles[cf].fullName;
			eval("#include \"" + curComponent + "\"");
			log.l("included: " + compFiles[cf].name);
		}
	}
	else
	{
		errorList.push("Failed to find the necessary components.");
		log.e("No components were found.");
		valid = false;
		return valid;
	}



	//=============================  /Components  ===============================//
	/*****************************************************************************/




	/*****************************************************************************/
	//=================================  Procedure  =================================//

	var orderData;
	var garmentsNeeded;
	var jobFolderPath;
	var masterFile;
	var errorList = [];
	var messageList = [];


	var prepressFolderPath;
	var prepressFile;
	var prepressDoc;
	var ppLay; //prepress layer


	var prodFolderPath;
	var prodFolder;
	var prodFileSaveLocation;
	var pdfsPath;
	var pdfsFolder;


	var curGarment;
	var garCode;
	

	
	var prodDoc;
	var prodFile;



	if(valid)
	{
		var programId = getProgramId();
	}

	if(valid)
	{
		jobFolderPath = getJobFolderPath();
	}
	if(valid)
	{
		prepressFolderPath = jobFolderPath + "Prepress_" + programId + "/";

		if(!Folder(prepressFolderPath).exists)
		{
			errorList.push("No Prepress folder found.");
			valid = false;
		}
	}

	if(valid)
	{
		orderData = getSpiritData(programId);
		writeReadMe(Folder("~/Desktop/temp/"),JSON.stringify(orderData));
	}
	
	if(valid)
	{
		garmentsNeeded = parseSpiritData(orderData);
	}

	if(valid)
	{
		masterLoop(garmentsNeeded);
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if (errorList.length)
	{
		sendErrors(errorList);
	}

	if (messageList.length)
	{
		sendScriptMessages(messageList);
	}

	printLog();

	return valid;

}

container();