/*

Script Name: Build_Spirit_Offering
Author: William Dowling
Build Date: 01 April, 2021
Description: query netsuite for JSON data for a given order number,
				parse the data, 
				for each garment in the data
					locate "Converted_Template" file
					open file and save to local job folder
					recolor the document per the paramcolors in master file
					save document
	
	
*/


#target Illustrator

function container()
{
	var valid = true;
	var scriptName = "build_spirit_offering";

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

	var devComponents = desktopPath + "/automation/build_spirit/components";
	var prodComponents = componentsPath + "/build_spirit";

	var compFiles;
	if($.fileName.indexOf("Dev.jsx") > -1)
	{
		compFiles = includeComponents(devComponents, devComponents, true);
	}
	else
	{
		compFiles = includeComponents(prodComponents, prodComponents, true);
	}

	// var compFiles = includeComponents(devComponents, prodComponents, false);
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


	// if(!app.documents.length)
	// {
	// 	alert("Please open the Master File First.");
	// 	valid = false;
	// 	return valid;
	// }


	var filesToClose = []; //these are the youth files that are not needed after merging with adult

	if(valid)
	{
		var programId = getProgramId();	
	}
	

	if (valid)
	{
		var data = getSpiritData();
		if (!data) valid = false;
	}

	if (valid)
	{
		var garmentsNeeded = parseSpiritData(data);
		if (!garmentsNeeded) valid = false;
	}

	if (valid)
	{
		var masterFile = openMaster(programId);

		//dev mode to speed things up
		// var masterFile = app.activeDocument;
	}

	if (valid && garmentsNeeded)
	{
		buildOffering(garmentsNeeded);
	}

	if(valid && filesToClose.length)
	{
		for(var x= filesToClose.length-1;x>=0;x--)
		{
			filesToClose[x].close(SaveOptions.DONOTSAVECHANGES);
		}
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