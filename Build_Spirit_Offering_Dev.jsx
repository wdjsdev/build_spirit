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

	function getUtilities ()
	{
		//check for dev mode
		var devUtilitiesPreferenceFile = File( "~/Documents/script_preferences/dev_utilities.txt" );
		var devUtilPath = "~/Desktop/automation/utilities/";
		var devUtils = [ devUtilPath + "Utilities_Container.js", devUtilPath + "Batch_Framework.js" ];
		function readDevPref ( dp ) { dp.open( "r" ); var contents = dp.read() || ""; dp.close(); return contents; }
		if ( readDevPref( devUtilitiesPreferenceFile ).match( /true/i ) )
		{
			$.writeln( "///////\n////////\nUsing dev utilities\n///////\n////////" );
			return devUtils;
		}






		var utilNames = [ "Utilities_Container" ];

		//not dev mode, use network utilities
		var OS = $.os.match( "Windows" ) ? "pc" : "mac";
		var ad4 = ( OS == "pc" ? "//AD4/" : "/Volumes/" ) + "Customization/";
		var drsv = ( OS == "pc" ? "O:/" : "/Volumes/CustomizationDR/" );
		var ad4UtilsPath = ad4 + "Library/Scripts/Script_Resources/Data/";
		var drsvUtilsPath = drsv + "Library/Scripts/Script_Resources/Data/";


		var result = [];
		for ( var u = 0, util; u < utilNames.length; u++ )
		{
			util = utilNames[ u ];
			var ad4UtilPath = ad4UtilsPath + util + ".jsxbin";
			var ad4UtilFile = File( ad4UtilsPath );
			var drsvUtilPath = drsvUtilsPath + util + ".jsxbin"
			var drsvUtilFile = File( drsvUtilPath );
			if ( drsvUtilFile.exists )
			{
				result.push( drsvUtilPath );
			}
			else if ( ad4UtilFile.exists )
			{
				result.push( ad4UtilPath );
			}
			else
			{
				alert( "Could not find " + util + ".jsxbin\nPlease ensure you're connected to the appropriate Customization drive." );
				alert( "Using util path: " + drsvUtilsPath )
				valid = false;
			}
		}

		return result;

	}



	var utilities = getUtilities();




	for ( var u = 0, len = utilities.length; u < len && valid; u++ )
	{
		eval( "#include \"" + utilities[ u ] + "\"" );
	}


	if ( !valid ) return;


	if ( user === "will.dowling" )
	{
		DEV_LOGGING = true;
	}

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