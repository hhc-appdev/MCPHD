function HHC_VIOLATIONS_LOOP() 
{
	try{
		loadASITable('VIOLATIONS');
			if (tableHasRows('VIOLATIONS')) {
				fixVIOLATIONS = loadASITable('VIOLATIONS');
				removeASITable('VIOLATIONS');
			}
			if (tableHasRows('VIOLATIONS')) {
				for(i in fixVIOLATIONS) {
					eachrow = fixVIOLATIONS[i];
					if (matches(eachrow['Status'],'Open', 'Court')) {
						fixVIOLATIONS[i]['Status'] ='Final';
					}

				}

			}

		if (tableHasRows('VIOLATIONS')) {
			addASITable('VIOLATIONS',fixVIOLATIONS);
		}
	}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: HHC_VIOLATIONS_LOOP:  " + err.message);
		logDebug(err.stack);
	}
}
	
function HHC_GET_ADDRESS() 
{
	try{

		var addrResult = aa.address.getAddressByCapId(capId);
		var addrArray = new Array();
		var addrArray = addrResult.getOutput();
		var streetName = addrArray[0].getStreetName();
		var hseNum = addrArray[0].getHouseNumberStart();
		var streetSuffix = addrArray[0].getStreetSuffix();
		var streetDir = addrArray[0].getStreetDirection();
			if (streetSuffix == null || streetSuffix == '' || streetSuffix == 'undefined') {
				streetSuffix = ' ';
				}

			if (streetDir == null || streetDir == '' || streetDir == 'undefined') {
				streetDir == ' ';
				}

			comment ('The Address is: '+hseNum+' '+streetDir+' '+streetName+' '+streetSuffix);
			if (streetDir == null) {
				editAppName(hseNum+' '+streetName+' '+streetSuffix);
				}

			if (streetDir != null) {
				editAppName(hseNum+' '+streetDir+' '+streetName+' '+streetSuffix);
				}

			}
	catch(err)
		{
			logDebug("A JavaScript Error occurred: HHC_GET_ADDRESS:  " + err.message);
			logDebug(err.stack);
		}
}
function HHC_GET_ADDRESS_FOR_CHILD() 
{
	try{

		var addrResult = aa.address.getAddressByCapId(capId);
		var addrArray = new Array();
		var addrArray = addrResult.getOutput();
		var streetName = addrArray[0].getStreetName();
		var hseNum = addrArray[0].getHouseNumberStart();
		var streetSuffix = addrArray[0].getStreetSuffix();
		var streetDir = addrArray[0].getStreetDirection();
			if (streetSuffix == null || streetSuffix == '' || streetSuffix == 'undefined') {
				streetSuffix = ' ';
				}

			if (streetDir == null || streetDir == '' || streetDir == 'undefined') {
				streetDir == ' ';
				}

			comment ('The Address is: '+hseNum+' '+streetDir+' '+streetName+' '+streetSuffix);
			if (streetDir == null) {
				editAppName(hseNum+' '+streetName+' '+streetSuffix,newChildID);
				comment('The Child ID is: '+newChildID);
				}

			if (streetDir != null) {
				editAppName(hseNum+' '+streetDir+' '+streetName+' '+streetSuffix,newChildID);
				comment('The Child ID is: '+newChildID);
				}
				}
	catch(err)
		{
			logDebug("A JavaScript Error occurred: HHC_GET_ADDRESS_FOR_CHILD:  " + err.message);
			logDebug(err.stack);
		}
}
function HHC_CONTACTS_PROCESS() 
{
	try{
		cContactResult = AInfo[''];
		cContactsExist = false;
		cContactAry = new Array();
		y = 0;
		addCourtCase = false;
		prevName = 'Start';
		cTempAry = new Array();
		nextNameArr = new Array();
		myComplainer = '';
		cContactResult = aa.people.getCapContactByCapID(newChildID);
			if (cContactResult.getSuccess()) {
				cContactsExist = true;
				}

			if (cContactsExist) {
				cContactAry = cContactResult.getOutput();
				cc = cContactAry.length;
				}

			if (cContactsExist) {
				showMesage = true;
				comment('The number of contacts is '+cc);
				}

			if (cContactsExist) 
				{
					for(yy in cContactAry) 

					{
						showMessage=true;
						appName = cContactAry[yy].getCapContactModel().getPeople().getFullName();
						appConType = cContactAry[yy].getCapContactModel().getContactType();
						appPhoneNum = cContactAry[yy].getPeople().phone1;
						appSeqNum = cContactAry[yy].getCapContactModel().getPeople().getContactSeqNumber();
						cContactDelete = false;
							if (appConType == 'Complainant') {
								cContactDelete = true;
								}

							if (cContactDelete) {
								cTempAry[yy] = [[appName],[appConType],[appPhoneNum]];
								}

							if (cContactDelete) {
								comment(cTempAry[yy][1]+' - '+cTempAry[yy][0]+' - '+cTempAry[yy][2]);
								myComplainer = cTempAry[yy][1]+': '+cTempAry[yy][0]+' - '+cTempAry[yy][2];
								}

							if (cContactDelete) {
								cCapContactModel = cContactAry[yy].getCapContactModel();
								}

							if (cContactDelete) {
								cPeopleModel = cCapContactModel.getPeople();
								}

							if (cContactDelete) {
								cContactSeqNumber = parseInt(appSeqNum);
								}

							if (cContactDelete) {
								aa.people.removeCapContact(newChildID, cContactSeqNumber);
								}
						}
					}

			if (cContactsExist) {
				createCapComment(myComplainer,newChildID);
				}

			}
	catch(err)
		{
			logDebug("A JavaScript Error occurred: HHC_CONTACTS_PROCESS:  " + err.message);
			logDebug(err.stack);
		}
}

function HHC_VIOLATIONS_LOOP_COURT() 
{
	try{
		loadASITable('VIOLATIONS');
		AllFinaled = false;
		if (tableHasRows('VIOLATIONS')) {
			fixVIOLATIONS = loadASITable('VIOLATIONS');
			iRows = fixVIOLATIONS.length;
			iFins = 0;
			removeASITable('VIOLATIONS');
		}

		if (tableHasRows('VIOLATIONS')) {
			for(i in fixVIOLATIONS) {
				eachrow = fixVIOLATIONS[i];
				{
					if (matches(eachrow['Status'],'Final')) {
					iFins=iFins+1;
					}
				}
					if (matches(eachrow['Status'],'Open')) {
					fixVIOLATIONS[i]['Status'] ='Court';
					}
			}
		}

		if (tableHasRows('VIOLATIONS')) {
		addASITable('VIOLATIONS',fixVIOLATIONS);
		}
	}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: HHC_VIOLATIONS_LOOP_COURT:  " + err.message);
		logDebug(err.stack);
	}
}

function HHC_ASSIGN_NEW_LEHS() {
	try{
		var ctLead = AInfo['ParcelAttribute.CensusTract'];
		var newUserIDfull = lookup('Census - Lead EHS',AInfo['ParcelAttribute.CensusTract']);
			newUserID = convertForAssignedTo(newUserIDfull);
			if (AInfo['Assigned To'] != null && AInfo['Assigned To'] != AInfo['Previous Assigned To']) {
				var newUserID = AInfo['Assigned To'];
				}

			if (checkInspectionResult('Initial Lead Inspection', 'Scheduled') == true) {
				inspNum=getScheduledInspId('Initial Lead Inspection');
				}

			if (checkInspectionResult('Reinspection', 'Scheduled') == true) {
				inspNum=getScheduledInspId('Reinspection');
				}
				editAppSpecific('Previous Assigned To', newUserID);
				editAppSpecific('Assigned To', newUserID);
				editAppSpecific('Census Tract', ctLead);
				assignCap(newUserIDfull);
				
			if (checkInspectionResult('Initial Lead Inspection', 'Scheduled')) {
				assignInspection(inspNum, newUserIDfull);
				}

			if (checkInspectionResult('Reinspection', 'Scheduled')) {
				assignInspection(inspNum, newUserIDfull);
				}

		}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: HHC_VIOLATIONS_LOOP_COURT:  " + err.message);
		logDebug(err.stack);
	}
}
function hhc_getTheCensusTract(capId)
{
		try {
	//This section gets the parcel information from the case.  We need the Census Tract to determine the Team Leader for the Case.
	var fcapParcelObj = null; //This holds the parcel information
	var capParcelResult = aa.parcel.getParcelandAttribute(capId, null);
		if (capParcelResult.getSuccess())
		{
			var fcapParcelObj = capParcelResult.getOutput().toArray();
			var thisCensusTract = fcapParcelObj[0].getCensusTract();  //Use the Census Tract to get the Team Leader for the Case.
		}
		else
		{
			logDebug("**ERROR: Failed to get Parcel object: " + capParcelResult.getErrorType() + ":" +capParcelResult.getErrorMessage());
		}
		
	return thisCensusTract;
			}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getTheCensusTract:  " + err.message);
		logDebug(err.stack);
	}
}

function hhc_getTheAddress(capId)
{
	try {
       var capAddResult = aa.address.getAddressByCapId(capId);
       if (capAddResult.getSuccess())
              {
                     var addrArray = new Array();
                     var addrArray = capAddResult.getOutput();
                     var hseNum = "";
                     var streetDir = "";
                     var streetName = "";
                     var streetSuffix = "";
                     var zip = "";
                     if (addrArray[0].getHouseNumberStart() != null)
                           hseNum= addrArray[0].getHouseNumberStart();
                     if (addrArray[0].getStreetDirection() != null)
                           streetDir = addrArray[0].getStreetDirection();
                     if (addrArray[0].getStreetName() != null)
                           streetName = addrArray[0].getStreetName();
                     if (addrArray[0].getStreetSuffix() != null)
                           streetSuffix = addrArray[0].getStreetSuffix();
                     if (addrArray[0].getZip() != null)
                           zip = addrArray[0].getZip();
              }
       else
              {
                     logDebug("**ERROR: Failed to get Address object: " + capAddResult.getErrorType() + ":" +capAddResult.getErrorMessage());
              }
                     thisCapAddress = hseNum + " " + ltrim(streetDir+" ") + streetName + " " + streetSuffix;
                     return thisCapAddress;
		}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: hhc_getTheAddress:  " + err.message);
		logDebug(err.stack);
	}
}

function CreateLarvicideSite_IfBreeding(capId){
	try{
		gName = "VC_LARVICIDE";
		gItem = "SITE INFORMATION";
		asiGroup = "VC_LVCCKLST";
		asiSubGroup = "LARVICIDE";
		asiLabel = "Is Site Breeding";
		var myResult = getGuidesheetASIValue(inspId,gName,gItem,asiGroup,asiSubGroup, asiLabel);
			if(myResult=="Yes"){
			//Create the Larvicide Site Case
			newChildID = createChild('EnvHealth','VC','LarvicideSite','NA','');
			// Add Case and Data Fields Info
			copyAppSpecific(newChildID);
						}
}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: CreateLarvicideSite_IfBreeding:  " + err.message);
		logDebug(err.stack);
	}
}

//Vector Zone Translation (15 zones)
function getVectorZone(capId){
	var vZone = "";
	var zoneNum = "";
	try{
		x = getGISInfo("MCPHD","VectorZones","vectorzone");
		zoneNum = x.toString();
		if (x<10){
		vZone = "Vector Zone 0"+zoneNum;
		}
		else
		{vZone = "Vector Zone "+zoneNum;}
			return vZone;
			}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getVectorZone:  " + err.message);
		logDebug(err.stack);
	}
}

//Adulticide Zone Translation (6 zones) 
function getAdulticideZone(capId){
	var aZone = "";
	
	try{
		z1 = getGISInfo("MCPHD","fogging1","foggingname");
		z2 = getGISInfo("MCPHD","fogging2","foggingname");
		z3 = getGISInfo("MCPHD","fogging3","foggingname");
		z4 = getGISInfo("MCPHD","fogging4","foggingname");
		z5 = getGISInfo("MCPHD","fogging5","foggingname");
		z6 = getGISInfo("MCPHD","fogging6","foggingname");
				if (z1 == 1){
		aZone = "Adulticide Zone 01";	
		}
				if (z2 == 2){
		aZone = "Adulticide Zone 02";	
		}
				if (z3 == 3){
		aZone = "Adulticide Zone 03";	
		}
				if (z4 == 4){
		aZone = "Adulticide Zone 04";	
		}
				if (z5 == 5){
		aZone = "Adulticide Zone 05";	
		}
				if (z6 == 6){
		aZone = "Adulticide Zone 06";	
		}
			return aZone;
		}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getAdulticideZone:  " + err.message);
		logDebug(err.stack);
	}
}

//Vector Zone Number (15 zones)
function getVectorZoneNum(capId){
	var vZone = "";
	var zoneNum = "";
	try{
		x = getGISInfo("MCPHD","VectorZones","vectorzone");
			return x;
			}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getVectorZone:  " + err.message);
		logDebug(err.stack);
	}
}

//Adulticide Zone Number (6 zones) 
function getAdulticideZoneNum(capId){
	var aZone = "";
	
	try{
		z1 = getGISInfo("MCPHD","fogging1","foggingname");
		z2 = getGISInfo("MCPHD","fogging2","foggingname");
		z3 = getGISInfo("MCPHD","fogging3","foggingname");
		z4 = getGISInfo("MCPHD","fogging4","foggingname");
		z5 = getGISInfo("MCPHD","fogging5","foggingname");
		z6 = getGISInfo("MCPHD","fogging6","foggingname");
				if (z1 == 1){
					aZone = z1;	
		}
				if (z2 == 2){
					aZone = z2;
		}
				if (z3 == 3){
					aZone = z3;
		}
				if (z4 == 4){
					aZone = z4;
		}
				if (z5 == 5){
					aZone = z5;
		}
				if (z6 == 6){
					aZone = z6;
		}
			return aZone;
		}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getAdulticideZone:  " + err.message);
		logDebug(err.stack);
	}
}
function getTSIfieldValue(TSIfieldName, workflowTask) {
	try{
		workflowResult = aa.workflow.getTasks(capId); 
        wfObj = workflowResult.getOutput();
        var useTaskSpecificGroupName = true;
		itemCap = capId;
		var itemName = TSIfieldName;
        var stepnumber = 0;
        var taskName = "";
        var taskStatus = "";
        var procCode = "";
		var processID = ""; 
	for (i in wfObj){ 
		stepnumber = wfObj[i].getStepNumber();
		taskName = wfObj[i].getTaskDescription();
		taskStatus = wfObj[i].getDisposition();
		procCode = wfObj[i].getProcessCode();
		processID = wfObj[i].getProcessID();
if (workflowTask == taskName) {		
			TSIResult = aa.taskSpecificInfo.getTaskSpecifiInfoByDesc(itemCap,processID,stepnumber,itemName);
 			if (TSIResult.getSuccess())
 				{
	 			var TSI = TSIResult.getOutput();
				if (TSI != null)
					{
					var TSIArray = new Array();
					TSInfoModel = TSI.getTaskSpecificInfoModel();
					var myValue = TSInfoModel.getChecklistComment();
					logDebug(" Item= " + itemName + " myValue=" + myValue);
					var useTaskSpecificGroupName = false;
					return myValue;
					}	
				}
			}
		}
	}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getTSIfieldValue:  " + err.message);
		logDebug(err.stack);
	}	
}
function addTrashTicketFee() {
	try{
	var tFee='H_T';
		tFee+=AInfo['Ticket Fee'];
			if (!feeExists(tFee,'INVOICED')) {
				updateFee(tFee,'H_TRA','FINAL',1,'Y');	
	}
	}
	catch(err)
	{
		logDebug("A JavaScript Error occurred: getTSIfieldValue:  " + err.message);
		logDebug(err.stack);
	}

}
function convertForAssignedTo(areaInspector){
	try{
	var newAreaInspector = '';
	var str = '';
	var res = '';	
	str = areaInspector;
	var xx = str.indexOf("@");
	if (str.indexOf("@")>-1){
		res = str.substring(0, xx);
	}
	else{
		res = str;
		}
		return res;
	}
		
		catch(err)
	{
		logDebug("A JavaScript Error occurred: convertForAssignedTo:  " + err.message);
		logDebug(err.stack);
	}
}
function tableHasRows(t) {
	try{
		eval("if (typeof(" + t + ") != \"undefined\" ) var o = " + t);
			if (typeof(o) == "object" && o.length > 0) {
				return true;
	} 		else {
				return false;
	}
	}
	catch(err)
		{
		logDebug("A JavaScript Error occurred: tableHasRows:  " + err.message);
		logDebug(err.stack);
		}
	
}
