function parseSpiritData ( data )
{


	var garmentsNeeded = [];

	var curGarGroup;
	var curSize, curPlayer;
	var curGN;
	var playerLen = 0;
	for ( var gar in data ) 
	{
		//sample gar value = "FD-1873_FD-1873-FD-1873Y-1027"
		log.l( "gar = " + gar );
		curGarGroup = data[ gar ];
		curGN = null;


		//curGarGroup is the array of objects for the current garment
		//each object represents a garment and includes the size and roster info
		curGarGroup.forEach( function ( curGar, x )
		{
			if ( !curGN )
			{
				var curMid = curGar.style.match( /[fdbmps]{2,3}[-_][0-9]{3,5}[wyg]?/i ) ? curGar.style.match( /[fdbmps]{2,3}[-_][0-9]{3,5}[wyg]?/i )[ 0 ] : null;

				var styleMatch = curGar.style.split( /[-_\s]/ ).filter( function ( el ) { return el.match( /^\d{4,5}$/ ); } )
				var curStyleNum = styleMatch ? styleMatch[ styleMatch.length - 1 ] : null;
				curStyleNum ? ( curStyleNum = curStyleNum.replace( /[-_\s]/g, "" ) ) : null;

				var cgStyle = curGar.style.replace( /[-_\s][a-z0-9]{12}/i, "" );
				var colorsCalledOut = cgStyle.match( /-?([\s\-a-z]*$)/i ) ? cgStyle.match( /-?([\s\-a-z]*$)/i )[ 1 ] + "_" : "";
				colorsCalledOut = colorsCalledOut.replace( /^[-_]/, "" )
				var refOrder = curGar.reforder || "";

				var curPlayersString, curRoster;

				curGN = {
					"groupName": gar,
					"mid": curMid,
					"designNumber": refOrder.match( /[a-z0-9]{12}/i ) ? refOrder.match( /[a-z0-9]{12}/i )[ 0 ] : "",
					"orderNumber": refOrder.match( /[0-9]{7}/i ) ? refOrder.match( /[0-9]{7}/i )[ 0 ] : "",
					"roster": {},
					"styleNum": curStyleNum,
					"garCode": curMid + "_" + curStyleNum,
					"age": gar.split( "_" )[ 0 ].match( /yg/i ) ? "youth" : "adult",
					"label": curGar.style.replace( /_[a-z0-9]{12}/i, "" ),
					"cco": colorsCalledOut
				};
				garmentsNeeded.push( curGN );
			}

			//check if this garment is a bag
			//if so, use the size "ONE PIECE"
			//otherwise, parse the size from the itemtext field
			if ( isBagCode( curGN.mid ) )
			{
				curSize = "ONE PIECE";
			}
			else 
			{
				curSize = curGar.itemtext.replace( /.*-/, "" );
				if ( curSize.match( /y/i ) && !curGN.mid.match( /[yg]$/i ) )
				{
					curGN.age = "youth";
					curGN.mid = curGN.mid.match( /[wg]$/i ) ? curGN.mid.replace( /w$/i, "G" ) : curGN.mid + "Y";
					curGN.garCode = curGN.mid + "_" + curGN.styleNum;
				}

			}

			curSize = curSize.replace( /\//g, "-" );

			if ( curGar.inseam )
			{
				curGN.var = true; //this garment has a variable inseam
				var curWaist = curSize;
				curSize = curGar.inseam;
				curGN.roster[ curSize ] = curGN.roster[ curSize ] || {};
				curGN.roster[ curSize ][ curWaist ] = curGN.roster[ curSize ][ curWaist ] || { "players": "" };
				curRoster = curGN.roster[ curSize ][ curWaist ];
			}
			else
			{
				if ( !curGN.roster[ curSize ] )
				{
					curGN.roster[ curSize ] = { "players": "" };
				}
				curRoster = curGN.roster[ curSize ];
			}

			curPlayer = ( curGar.playernumber ? curGar.playernumber : "(no number)" ) + " ";
			curPlayer += curGar.playername ? curGar.playername : "(no name)";
			curRoster.players += curPlayer + "\n";

			curRoster.qty = curRoster.players.split( "\n" ).length - 1;
		} );
		log.l( "curGN = " + JSON.stringify( curGN ) );
		playerLen = 0;
	}

	return garmentsNeeded;
}
