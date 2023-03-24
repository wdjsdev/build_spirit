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
				// var curStyleNum = gar.replace( /.*-/ig, "" ).replace( /[\s-_].*/ig, "" );
				var curStyleNum = gar.match( /\d{4,5}/ig );
				curStyleNum = curStyleNum ? curStyleNum[ curStyleNum.length - 1 ] : null;
				var colorsCalledOut = curGar.style.match( /-([\s\-a-z]*$)/i ) ? curGar.style.match( /-([\s\-a-z]*$)/i )[ 1 ] + "_" : "";


				var refOrder = curGar.reforder || "";

				curGN = {
					"groupName": gar,
					"mid": curMid,
					"designNumber": refOrder.match( /[a-z0-9]{12}/i ) ? refOrder.match( /[a-z0-9]{12}/i )[ 0 ] : null,
					"orderNumber": refOrder.match( /[0-9]{7}/i ) ? refOrder.match( /[0-9]{7}/i )[ 0 ] : null,
					"roster": {},
					"styleNum": curStyleNum,
					"garCode": curMid + "_" + curStyleNum,
					"age": gar.split( "_" )[ 0 ].match( /yg/i ) ? "youth" : "adult",
					"label": curGar.style,
					"cco": colorsCalledOut.replace( /^-/, "" )
				};
				garmentsNeeded.push( curGN );
				log.l( "initialized garmentsNeeded[" + ( garmentsNeeded.length - 1 ) + "] = " + JSON.stringify( curGN ) );
			}

			curSize = curGar.itemtext.substring( curGar.itemtext.lastIndexOf( "-" ) + 1, curGar.itemtext.length );
			if ( curSize.match( /y/i ) )
			{
				curGN.age = "youth";
				curGN.mid = curGN.mid.match( /[wg]$/i ) ? curGN.mid.replace( /w$/i, "G" ) : curGN.mid + "Y";
				curGN.garCode = curGN.mid + "_" + curGN.styleNum;
			}

			if ( !curGN.roster[ curSize ] )
			{
				curGN.roster[ curSize ] = { "players": [] };
			}

			curPlayer = {
				name: curGar.playername || "",
				number: curGar.playernumber || ""
			};

			curPlayer.label = ( curPlayer.name || "(no_name)" ) + " " + ( curPlayer.number || "(no_number)" ) + ( curPlayer.extraInfo ? " " + curPlayer.extraInfo : "" );

			var blah = curGN;
			curGN.roster[ curSize ].players.push( curPlayer );

			curGN.roster[ curSize ].qty = curGN.roster[ curSize ].players.length;
		} );
		playerLen = 0;
	}

	return garmentsNeeded;
}
