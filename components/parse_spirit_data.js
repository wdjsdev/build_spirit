function parseSpiritData ( data )
{


	var garmentsNeeded = {};

	var curGarGroup, curGar;
	var curSize, curStyleNum, curPlayer;
	var curGN, curMid;
	var playerLen = 0;
	for ( var gar in data ) 
	{
		//sample gar value = "FD-1873_FD-1873-FD-1873Y-1027"
		$.writeln( "gar = " + gar );
		curStyleNum = gar.substring( gar.lastIndexOf( "-" ) + 1, gar.length );
		curStyleNum = curStyleNum.replace( /[\s-_].*/ig, "" );
		curGarGroup = data[ gar ];
		curGN = null;


		//curGarGroup is the array of objects for the current garment
		//each object represents a garment and includes the size and roster info
		for ( var x = 0; x < curGarGroup.length; x++ )
		{
			curGar = curGarGroup[ x ];
			curMid = curGar.mid || getMidFromLabel( gar );
			if ( !curGN )
			{
				curGN = garmentsNeeded[ curMid + "_" + curStyleNum ] = {};
				curGN.mid = curMid;
				curGN.roster = {};
			}

			curGN.styleNum = curStyleNum;

			curSize = curGar.itemtext.substring( curGar.itemtext.lastIndexOf( "-" ) + 1, curGar.itemtext.length );

			if ( !curGN.roster[ curSize ] )
			{
				curGN.roster[ curSize ] = { "players": [] };
			}

			curPlayer = { name: "", number: "" };



			if ( curGar.playername )
			{
				curPlayer.name = curGar.playername;
			}

			if ( curGar.playernumber )
			{
				curPlayer.number = curGar.playernumber;
			}

			curGN.roster[ curSize ].players.push( curPlayer );

			curGN.roster[ curSize ].qty = x + 1;
		}
		playerLen = 0;
	}

	return garmentsNeeded;
}
