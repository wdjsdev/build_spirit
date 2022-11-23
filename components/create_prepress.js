function createPrepress ( files, paramGroup )
{
	var master;
	var curGs;
	for ( var x = 0; x < files.length; x++ )
	{
		app.open( files[ x ] );
		if ( x === 0 )
		{
			master = app.activeDocument;
		}
		else
		{
			filesToClose.push( app.activeDocument );
			mergeTemplate( master );
		}
	}

	master.activate();
	app.executeMenuCommand( "fitall" );

	setPrepressVis( master.layers, true );

	if ( paramGroup )
	{
		recolorPrepress( paramGroup.duplicate( master ) )
	}

	setPrepressVis( master.layers, false );

	return master;


	function recolorPrepress ( paramGroup )
	{
		var tmpLay = master.layers.add();

		paramGroup.moveToBeginning( tmpLay );

		//remove all the existing graphic styles to prevent collisions
		afc( master, "graphicStyles" ).forEach( function ( gs )
		{
			gs.remove();
		} )

		afc( paramGroup, "pageItems" ).forEach( function ( item )
		{
			master.selection = null;
			var curName = item.name.replace( /^[^-]*-/, "" );
			graphicStyleFromItem( item, curName );
			curGs = master.graphicStyles[ curName ];
			item.selected = true;
			master.defaultFillColor = makeNewSpotColor( curName ).color;
			app.executeMenuCommand( "Find Fill Color menu item" );
			getSel().forEach( function ( selItem )
			{
				dig( selItem );
			} );

		} );
		// var curItem,curName,curSel,curGs;
		// for(var x=0;x<paramGroup.pageItems.length;x++)
		// {
		// 	curItem = paramGroup.pageItems[x];
		// 	curName = curItem.name.substring(curItem.name.indexOf("-")+1,curItem.name.length);

		// 	graphicStyleFromItem(curItem,curName);
		// 	curGs = master.graphicStyles[curName];
		// 	master.selection = null;

		// 	master.defaultFillColor = makeNewSpotColor(curName).color;
		// 	app.executeMenuCommand("Find Fill Color menu item");
		// 	for(var y=0;y<master.selection.length;y++)
		// 	{
		// 		curSel = master.selection[y];
		// 		dig(curSel)
		// 	}

		tmpLay.remove();
	}



	function dig ( curItem )
	{
		if ( curItem.typename.match( /pathitem/i ) )
		{
			curGs.applyTo( curItem );
		}
		else if ( curItem.typename === "GroupItem" )
		{
			for ( var g = 0, len = curItem.pageItems.length; g < len; g++ )
			{
				dig( curItem.pageItems[ g ] );
			}
		}
		else
		{
			// debugger;
			log.l( "found a weird compound path.. can't recolor this item.." );
		}
	}


	function setPrepressVis ( layers, bool )
	{
		var curPpLay
		for ( var x = 0; x < layers.length; x++ )
		{
			curPpLay = getPPLay( layers[ x ] );

			if ( !curPpLay ) continue;

			curPpLay.locked = false;
			curPpLay.visible = bool;
		}
	}

}