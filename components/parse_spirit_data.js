function parseSpiritData ( data )
{


	var garmentsNeeded = [];

	var curGarGroup;
	var curSize, curStyleNum, curPlayer;
	var curGN, curMid, curAge;
	var playerLen = 0;
	for ( var gar in data ) 
	{
		//sample gar value = "FD-1873_FD-1873-FD-1873Y-1027"
		log.l( "gar = " + gar );
		curStyleNum = gar.substring( gar.lastIndexOf( "-" ) + 1, gar.length );
		curStyleNum = curStyleNum.replace( /[\s-_].*/ig, "" );
		curGarGroup = data[ gar ];
		curGN = null;
		curMid = getMidFromLabel( gar );
		curAge = gar.split( '_' )[ 0 ].match( /yg/i ) ? 'youth' : 'adult';


		//curGarGroup is the array of objects for the current garment
		//each object represents a garment and includes the size and roster info
		curGarGroup.forEach( function ( curGar, x )
		{
			if ( !curGN )
			{
				var refOrder = curGar.reforder;
				curGN = {
					"groupName": gar,
					"mid": curMid,
					"designNumber": refOrder.match( /[a-z0-9]{12}/i ) ? refOrder.match( /[a-z0-9]{12}/i )[ 0 ] : null,
					"orderNumber": refOrder.match( /[0-9]{7}/i ) ? refOrder.match( /[0-9]{7}/i )[ 0 ] : null,
					"roster": {},
					"styleNum": curStyleNum,
					"garCode": curMid + "_" + curStyleNum,
					"age": curAge
				};
				garmentsNeeded.push( curGN );
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


			curGN.roster[ curSize ].players.push( curPlayer );

			curGN.roster[ curSize ].qty = x + 1;
		} );
		playerLen = 0;
	}

	return garmentsNeeded;
}
