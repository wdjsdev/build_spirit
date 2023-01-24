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

function container ()
{
	var valid = true;
	var scriptName = "build_spirit_offering";

	ffunction getUtilities()
	{
		var utilNames = [ "Utilities_Container" ]; //array of util names
		var utilFiles = []; //array of util files
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( devUtilitiesPreferenceFile.exists && readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			var devUtilPath = "~/Desktop/automation/utilities/";
			utilFiles = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
			return utilFiles;
		}

		var dataResourcePath = customizationPath + "Library/Scripts/Script_Resources/Data/";

		for ( var u = 0; u < utilNames.length; u++ )
		{
			var utilFile = new File( dataResourcePath + utilNames[ u ] + ".jsxbin" );
			if ( utilFile.exists )
			{
				utilFiles.push( utilFile );
			}

		}

		if ( !utilFiles.length )
		{
			alert( "Could not find utilities. Please ensure you're connected to the appropriate Customization drive." );
			return [];
		}


		return utilFiles;

	}
	var utilities = getUtilities();

	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}

	if ( !valid || !utilities.length ) return;

	DEV_LOGGING = user === "will.dowling";

	logDest.push( getLogDest() );



	/*****************************************************************************/
	//=================================  Data  =================================//



	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//

	var devComponents = desktopPath + "/automation/build_spirit/components";
	var prodComponents = componentsPath + "/build_spirit";

	var compFiles = getComponents( $.fileName.match( /dev/i ) ? devComponents : prodComponents );
	if ( !compFiles || !compFiles.length )
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
		valid = false;
		return valid;
	}

	var curComponent;
	for ( var cf = 0, len = compFiles.length; cf < len; cf++ )
	{
		curComponent = compFiles[ cf ].fullName;
		eval( "#include \"" + curComponent + "\"" );
		log.l( "included: " + compFiles[ cf ].name );
	}



	//=============================  /Components  ===============================//
	/*****************************************************************************/




	/*****************************************************************************/
	//=================================  Procedure  =================================//

	app.userInteractionLevel = UserInteractionLevel.DISPLAYALERTS;

	var filesToClose = []; //these are the youth files that are not needed after merging with adult

	if ( valid )
	{
		var programId = getProgramId();
	}


	if ( valid )
	{

		if ( documents.length && app.activeDocument.name.match( programId ) )
		{
			var masterFile = app.activeDocument;
		}
		else
		{
			var masterFile = openMaster( programId );
		}

	}

	if ( valid )
	{
		buildOffering();
	}

	if ( valid && filesToClose.length )
	{
		for ( var x = filesToClose.length - 1; x >= 0; x-- )
		{
			filesToClose[ x ].close( SaveOptions.DONOTSAVECHANGES );
		}
	}


	//=================================  /Procedure  =================================//
	/*****************************************************************************/

	if ( errorList.length )
	{
		sendErrors( errorList );
	}

	if ( messageList.length )
	{
		sendScriptMessages( messageList );
	}

	printLog();

	return valid;

}

container();