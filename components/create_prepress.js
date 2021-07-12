function createPrepress(files,paramGroup)
{
	var master;
	for(var x=0;x<files.length;x++)
	{
		app.open(files[x]);
		if(x===0)
		{
			master = app.activeDocument;
		}
		else
		{
			filesToClose.push(app.activeDocument);
			mergeTemplate(master);
		}
	}

	master.activate();
	app.executeMenuCommand("fitall");

	setPrepressVis(master.layers,true);

	if(paramGroup)
	{
		recolorPrepress(paramGroup.duplicate(master))
	}

	setPrepressVis(master.layers,false);

	return master;


	function recolorPrepress(paramGroup)
	{
		var tmpLay = master.layers.add();
		var tmpItem;
		var curPath;
		paramGroup.moveToBeginning(tmpLay);
		var curItem,curName,curSel,curGs;
		for(var x=0;x<paramGroup.pageItems.length;x++)
		{
			curItem = paramGroup.pageItems[x];
			curName = curItem.name.substring(curItem.name.indexOf("-")+1,curItem.name.length);
			graphicStyleFromItem(curItem,curName);
			curGs = master.graphicStyles[curName];
			master.selection = null;
			
			master.defaultFillColor = makeNewSpotColor(curName).color;
			app.executeMenuCommand("Find Fill Color menu item");
			for(var y=0;y<master.selection.length;y++)
			{
				curSel = master.selection[y];
				dig(curSel)
			}


		}

		tmpLay.remove();

		function dig(curItem)
		{
			if(curItem.typename === "PathItem")
			{
				curGs.applyTo(curItem);
			}
			else if(curItem.typename === "CompoundPathItem" && curItem.pathItems.length)
			{
				if(curItem.groupItems && curItem.groupItems.length)
				{
					for(var g=0,len=curItem.groupItems.length;g<len;g++)
					{
						dig(curItem.groupItems[g]);
					}
				}
				if(curItem.pathItems && curItem.pathItems.length)
				{
					curGs.applyTo(curItem.pathItems[0]);
				}
			}
			else if(curItem.typename === "CompoundPathItem" && curItem.groupItems)
			{
				for(var g=0,len=curItem.groupItems.length;g<len;g++)
				{
					dig(curItem.groupItems[g]);
				}
			}
			else if(curItem.typename === "GroupItem")
			{
				for(var g=0,len=curItem.pageItems.length;g<len;g++)
				{
					dig(curItem.pageItems[g]);
				}
			}
			else{
				// debugger;
				log.l("found a weird compound path.. can't recolor this item..");
			}
		}
	}

	function setPrepressVis(layers,bool)
	{
		var curPpLay
		for(var x=0;x<layers.length;x++)
		{
			curPpLay = getPPLay(layers[x]);

			if(!curPpLay)continue;

			curPpLay.locked = false;
			curPpLay.visible = bool;
		}
	}
		
}