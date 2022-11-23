/*

Script Name: Build_Spirit_Prod_Files
Author: William Dowling
Build Date: 23 February, 2018
Description: query netsuite for JSON data for a given order number,
				parse the data, create new document, copy necessary
				artwork to new document, input roster data
	
	
*/


#target Illustrator

function container ()
{
	var valid = true;
	var scriptName = "build_spirit_prod_files";

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

	log.l( "Using Utilities: " + utilities );


	if ( !valid ) return;

	if ( user === "will.dowling" )
	{
		DEV_LOGGING = true;
	}

	logDest.push( getLogDest() );

	var scriptTimer = new Stopwatch();
	scriptTimer.logStart();



	/*****************************************************************************/
	//=================================  Data  =================================//



	//=================================  /Data  =================================//
	/*****************************************************************************/



	/*****************************************************************************/
	//==============================  Components  ===============================//


	//first get the build prod file components
	scriptTimer.beginTask( "getComponents" );

	var buildProdCompPath = componentsPath + "build_prod_file_beta";
	var buildProdCompDevPath = desktopPath + "automation/build_prod_file/components";
	var buildProdCompFiles = getComponents( $.fileName.indexOf( "Dev.jsx" ) > -1 ? buildProdCompDevPath : buildProdCompPath )
	// var buildProdCompFiles = getComponents(buildProdCompDevPath);

	if ( !buildProdCompFiles || !buildProdCompFiles.length )
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
		valid = false;
		return valid;
	}

	for ( var cf = 0, len = buildProdCompFiles.length; cf < len; cf++ )
	{
		curComponent = buildProdCompFiles[ cf ].fullName;
		eval( "#include \"" + curComponent + "\"" );
		log.l( "included: " + buildProdCompFiles[ cf ].name );
	}





	var devComponents = desktopPath + "/automation/build_spirit/components";
	var prodComponents = componentsPath + "/build_spirit";

	var compFiles = getComponents( $.fileName.indexOf( "Dev.jsx" ) > -1 ? devComponents : prodComponents );

	if ( compFiles && compFiles.length )
	{
		var curComponent;
		for ( var cf = 0, len = compFiles.length; cf < len; cf++ )
		{
			curComponent = compFiles[ cf ].fullName;
			eval( "#include \"" + curComponent + "\"" );
			log.l( "included: " + compFiles[ cf ].name );
		}
	}
	else
	{
		errorList.push( "Failed to find the necessary components." );
		log.e( "No components were found." );
		valid = false;
		return valid;
	}

	scriptTimer.endTask( "getComponents" );


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



	if ( valid )
	{
		var programId = getProgramId();
	}

	if ( valid )
	{
		jobFolderPath = getJobFolderPath();
	}
	if ( valid )
	{
		prepressFolderPath = jobFolderPath + "Prepress_" + programId + "/";

		if ( !Folder( prepressFolderPath ).exists )
		{
			errorList.push( "No Prepress folder found." );
			valid = false;
		}
	}

	if ( valid )
	{
		orderData = getSpiritData( programId );
		// writeReadMe( Folder( "~/Desktop/temp/" ), JSON.stringify( orderData ) );
	}

	if ( valid )
	{
		garmentsNeeded = parseSpiritData( orderData );
	}

	if ( valid )
	{
		masterLoop( garmentsNeeded );
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