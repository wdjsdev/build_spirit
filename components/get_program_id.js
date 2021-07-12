function getProgramId()
{
	var programId;
	var prefPath = documentsPath + "build_spirit_prefs/"

	var idRegex = /[\da-z]{3}-[\da-z]{3}-[\da-z]{3}/i;

	//get the previous program id
	var prevProgramId = "";
	var prevProgramIdFile = File(prefPath + "prev_design_number.txt");
	prevProgramIdFile.open("r");
	prevProgramId = prevProgramIdFile.read();
	prevProgramIdFile.close();

	if(!prevProgramId || prevProgramId == "")
	{
		prevProgramId = "SFc-ETk-vcX-G8A";
	}
	
	var w = new Window("dialog","Enter Program ID");
		var topTxt = UI.static(w,"Enter the Program ID");
		var input = UI.edit(w,prevProgramId,17);
		var btnGroup = UI.group(w);
			var cancel = UI.button(btnGroup,"Cancel",function()
			{
				valid = false;
				w.close();
			})
			var submit = UI.button(btnGroup,"Submit",function()
			{
				var trimmedText = input.text.replace(/^\s*|\s*$/g,"");
				if(idRegex.test(trimmedText))
				{
					programId = trimmedText;
					w.close();
				}
				else
				{
					alert("Invalid Program Id. Try again.");
				}
				
			})
	w.show();

	return programId;

}