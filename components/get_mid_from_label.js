//examples of correct labels

// FD-692_FD-692-FD-692Y-1034
// FD-1873_FD-1873-FD-1873Y-1027
// FD-163_FD-163-FD-163Y-1064
// FD-477_FD-477-FD-477Y-1010
// FD-477_FD-477-FD-477Y-1007
// FD-487_FD-487-FD-487Y-1000
// FD-6062_FD-6062-FD-6062Y-1007
// FD-6063_FD-6063-FD-6063Y-1007
// FD-3016W_FD-3016W-1002
// FD-163Y_FD-163-FD-163Y-1064
// FD-487Y_FD-487-FD-487Y-1000
// FD-2076W_FD-2076W-1001


//examples of incorrect labels

// FD-692_FD-872-FD-872Y-1032
// FD-692Y_FD-872-FD-872Y-1032
// FD-163_FD-161-FD-161Y-1073
// FD-163Y_FD-161-FD-161Y-1073
// FD-692Y_FD-872-FD-872Y-1023
// FD-163W_FD-161W-FD-161G-1073

function getMidFromLabel ( label )
{
	var result;

	var firstCode = label.substring( 0, label.indexOf( "_" ) );
	var secondCode = label.substring( label.indexOf( "_" ) + 1, label.length );

	var garmentCodes = label.match( /[fdpsbm]{2,3}-[0-9]{3,5}[wyg]?/ig );

	if ( garmentCodes.length === 3 )
	{
		var youthFlag = garmentCodes[ 0 ].match( /[yg]/i );
		if ( garmentCodes[ 0 ].replace( /[yg]$/i ) === garmentCodes[ 1 ] )
		{
			result = garmentCodes[ 0 ];
		}
		else
		{
			result = garmentCodes[ 1 ] + ( youthFlag ? youthFlag[ 0 ] : "" )
		}

	}
	else
	{
		result = garmentCodes[ 0 ];
	}


	// if ( !secondCode.match( firstCode ) || firstCode.match( /[yg]/i ) )
	// {
	// 	result = secondCode.substring( 0, nthIndex( secondCode, "-", 2 ) );
	// }
	// else
	// {
	// 	result = firstCode;
	// }
	return result;
}

function nthIndex ( str, pat, n )
{
	var L = str.length, i = -1;
	while ( n-- && i++ < L )
	{
		i = str.indexOf( pat, i );
		if ( i < 0 ) break;
	}
	return i;
}