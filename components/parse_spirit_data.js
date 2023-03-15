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
				var curStyleNum = gar.replace( /.*-/ig, "" ).replace( /[\s-_].*/ig, "" );
				var refOrder = curGar.reforder;
				curGN = {
					"groupName": gar,
					"mid": curMid,
					"designNumber": refOrder.match( /[a-z0-9]{12}/i ) ? refOrder.match( /[a-z0-9]{12}/i )[ 0 ] : null,
					"orderNumber": refOrder.match( /[0-9]{7}/i ) ? refOrder.match( /[0-9]{7}/i )[ 0 ] : null,
					"roster": {},
					"styleNum": curStyleNum,
					"garCode": curMid + "_" + curStyleNum,
					"age": gar.split( '_' )[ 0 ].match( /yg/i ) ? 'youth' : 'adult',
					"label": curGar.style
				};
				garmentsNeeded.push( curGN );
				log.l( "initialized garmentsNeeded[" + garmentsNeeded.length - 1 + "] = " + JSON.stringify( curGN ) );
			}

			curSize = curGar.itemtext.substring( curGar.itemtext.lastIndexOf( "-" ) + 1, curGar.itemtext.length );
			if ( curSize.match( /y/i ) )
			{
				curGN.age = "youth";
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


			curGN.roster[ curSize ].players.push( curPlayer );

			curGN.roster[ curSize ].qty = curGN.roster[ curSize ].players.length;
		} );
		playerLen = 0;
	}

	return garmentsNeeded;
}
