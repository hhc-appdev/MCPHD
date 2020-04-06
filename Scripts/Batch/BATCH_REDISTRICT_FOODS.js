/*------------------------------------------------------------------------------------------------------/
| Program: BATCH_REDISTRICT_FOODS.js  Trigger: BATCH
| Client: Chrome
| Description: This script is designed to be run in Accela - Batch Engine to redistrict foods records
|
| Version 1.0 - Initial - Jake Cox
|
/------------------------------------------------------------------------------------------------------*/
/*------------------------------------------------------------------------------------------------------/
|
| START: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
emailText = "";
debug = "";
message = "";
br = "<br>";
capId = null;
/*------------------------------------------------------------------------------------------------------/
| BEGIN Includes
/------------------------------------------------------------------------------------------------------*/
SCRIPT_VERSION = 3.0;
var useCustomScriptFile = true;  			// if true, use Events->Custom Script, else use Events->Scripts->INCLUDES_CUSTOM

//add include files
eval(getScriptText("INCLUDES_ACCELA_FUNCTIONS", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_CUSTOM", null, useCustomScriptFile));
eval(getScriptText("INCLUDES_BATCH", null, false));

function getScriptText(vScriptName, servProvCode, useProductScripts) {
    if (!servProvCode) servProvCode = aa.getServiceProviderCode();
    vScriptName = vScriptName.toUpperCase();
    var emseBiz = aa.proxyInvoker.newInstance("com.accela.aa.emse.emse.EMSEBusiness").getOutput();
    try {
        if (useProductScripts) {
            var emseScript = emseBiz.getMasterScript(aa.getServiceProviderCode(), vScriptName);
        } else {
            var emseScript = emseBiz.getScriptByPK(aa.getServiceProviderCode(), vScriptName, "ADMIN");
        }
        return emseScript.getScriptText() + "";
    } catch (err) {
        return "";
    }
}

/*------------------------------------------------------------------------------------------------------/
|
| END: USER CONFIGURABLE PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var showDebug = true;
var useAppSpecificGroupName = false;
if (String(aa.env.getValue("showDebug")).length > 0) {
    showDebug = aa.env.getValue("showDebug").substring(0, 1).toUpperCase().equals("Y");
}

showDebug = true;
showMessage = true;

sysDate = aa.date.getCurrentDate();
batchJobResult = aa.batchJob.getJobID();
batchJobName = "" + aa.env.getValue("BatchJobName");
batchJobID = 0;
if (batchJobResult.getSuccess()) {
    batchJobID = batchJobResult.getOutput();
    //logDebug("Batch Job " + batchJobName + " Job ID is " + batchJobID);
} else {
    //logDebug("Batch job ID not found " + batchJobResult.getErrorMessage());
}

/*----------------------------------------------------------------------------------------------------/
|
| Start: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
//var fromDate = getParam("fromDate"); // Hardcoded dates.   Use for testing only
//var toDate = getParam("toDate"); // ""
//var dFromDate = aa.date.parseDate(fromDate); //
//var dToDate = aa.date.parseDate(toDate); //
//var pFrequency = getParam("Frequency");
var lookAheadDays = aa.env.getValue("lookAheadDays"); // Number of days from today
var daySpan = aa.env.getValue("daySpan"); // Days to search (6 if run weekly, 0 if daily, etc.)
var emailTemplate = aa.env.getValue("emailTemplate");
var testEmail = aa.env.getValue("testEmail");
var emailFrom = aa.env.getValue("emailFrom");

/*----------------------------------------------------------------------------------------------------/
|
| End: BATCH PARAMETERS
|
/------------------------------------------------------------------------------------------------------*/
var startDate = new Date();

var startTime = startDate.getTime(); // Start timer
var systemUserObj = aa.person.getUser("ADMIN").getOutput(); // run as admin

/*------------------------------------------------------------------------------------------------------/
| <===========Main=Loop================>
|
/-----------------------------------------------------------------------------------------------------*/

//logDebug("Start of Job");

try {
    mainProcess();
} catch (err) {
    logDebug("ERROR: " + err.message + " In " + batchJobName + " Line " + err.lineNumber);
    logDebug("Stack: " + err.stack);
}

logDebug("End of Job: Elapsed Time : " + elapsed() + " Seconds");
aa.print(debug);
//if (emailAddress.length)
//	aa.sendMail("noreply@accela.com", emailAddress, "", batchJobName + " Results", emailText);

/*------------------------------------------------------------------------------------------------------/
| <===========END=Main=Loop================>
/-----------------------------------------------------------------------------------------------------*/

function mainProcess() {
    var numToProcess = 2500;
    var countTotal = 0;
    var countProcessed = 0;
    // get all capids
    var conn = new db();
    var sql = "select b.b1_per_id1, b.b1_per_id2, b.b1_per_id3, b.b1_per_sub_type from b1permit b where b.b1_per_type = 'Food' and b.b1_per_sub_type != 'Complaint' and b.b1_appl_status != 'Closed' and b.serv_prov_code = 'MCPHD'";
    var ds = conn.dbDataSet(sql, numToProcess);
    // foreach cap in capid list
	for (var r in ds) {
    //while(recordsProcessed < numToProcess) {
        //var r = recordsProcessed;
        var s_capResult = aa.cap.getCapID(String(ds[r]["B1_PER_ID1"]), String(ds[r]["B1_PER_ID2"]), String(ds[r]["B1_PER_ID3"]));

        if (s_capResult.getSuccess()) {
            var tCapId =  s_capResult.getOutput();
            capId = tCapId;
            cap = aa.cap.getCap(capId).getOutput();
            //exploreObject(tCapId);

            
            
            if (cap && capId) {
                //logDebug('Processing: ' + capId.getCustomID());
                var recType = String(ds[r]["B1_PER_TYPE"]);
                var zone = null;

                if (recType == 'SharedKitchenUser' || recType == 'MobileUnit'){
                    if (recType == 'SharedKitchenUser') {
                        zone = '55';
                    } else {
                        zone = '88';
                    }
                } else {
                    var estType = getAppSpecific('Type of Establishment', capId);
                    var estDistrict = getAppSpecific('District', capId);

                    if (estType == 'Shared Kitchen') {
                        zone = '55';
                    } else if (estDistrict == '7') {
                        zone = '7';
                    } else if (estDistrict == '99') {
                        zone = '99';
                    } else {
                        zone = getGISInfo("MCPHD", 'FoodsDistrict', 'district');
                    }
                }

                if (zone) {
                    var assignTo = lookupNoLog('GIS - Foods EHS', zone);

                    if (assignTo && assignTo != 'NOT IN ACCELA' && assignTo != 'UNASSIGNED') {
                        assignCapNoLog(assignTo, capId);
                    }
                    editAppSpecificNoLog('District', zone, capId);
                    countProcessed++;
                }
                //logDebug('Zone: ' + zone);
            }
        }
        countTotal++;
        logDebug('Processed: ' + countTotal);
        //logDebug('Updated: ' + countProcessed);
    }

    logDebug('Total Contacts Checked: ' + countTotal);
    logDebug('Total Contacts Updated: ' + countProcessed);
    logDebug('');
}

function db() {
	this.version = function () {
		return 1.0;
	}

    /**
     * Executes a sql statement and returns rows as dataset
     * @param {string} sql 
     * @param {integer} maxRows 
     * @return {string[]}
     */
	this.dbDataSet = function (sql, maxRows) {
		var dataSet = new Array();
		if (maxRows == null) {
			maxRows = 100;
		}
		try {
			var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
			var ds = initialContext.lookup("java:/AA");
			var conn = ds.getConnection();
			var sStmt = conn.prepareStatement(sql);
			sStmt.setMaxRows(maxRows);
			var rSet = sStmt.executeQuery();
			while (rSet.next()) {
				var row = new Object();
				var maxCols = sStmt.getMetaData().getColumnCount();
				for (var i = 1; i <= maxCols; i++) {
					row[sStmt.getMetaData().getColumnName(i)] = rSet.getString(i);
				}
				dataSet.push(row);
			}
			rSet.close();
			conn.close();
		}
		catch (err) {
			throw ("dbDataSet: " + err);
		}
		return dataSet;
	}

    /**
     * Executes a sql statement and returns nothing
     * @param {string} sql 
     */
	this.dbExecute = function (sql) {
		try {
			var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
			var ds = initialContext.lookup("java:/AA");
			var conn = ds.getConnection();
			var sStmt = conn.prepareStatement(sql);
			sStmt.setMaxRows(1);
			var rSet = sStmt.executeQuery();
			rSet.close();
			conn.close();
		}
		catch (err) {
			throw ("deExecute: " + err);
		}
	}

    /**
     * Returns first row first column of execute statement
     * @param {string} sql
     * @returns {object}  
     */
	this.dbScalarExecute = function (sql) {
		var out = null;
		try {
			var initialContext = aa.proxyInvoker.newInstance("javax.naming.InitialContext", null).getOutput();
			var ds = initialContext.lookup("java:/AA");
			var conn = ds.getConnection();
			var sStmt = conn.prepareStatement(sql);
			sStmt.setMaxRows(1);
			var rSet = sStmt.executeQuery();

			if (rSet.next()) {
				out = rSet.getString(1);
			}
			rSet.close();
			conn.close();
		}
		catch (err) {
			throw ("dbScalarValue: " + err);
		}
		return out;
	}
	return this;
}

function lookupNoLog(stdChoice,stdValue) 
{
	var strControl;
	var bizDomScriptResult = aa.bizDomain.getBizDomainByValue(stdChoice,stdValue);
	
   	if (bizDomScriptResult.getSuccess())
   		{
		var bizDomScriptObj = bizDomScriptResult.getOutput();
		strControl = "" + bizDomScriptObj.getDescription(); // had to do this or it bombs.  who knows why?
		//logDebug("lookup(" + stdChoice + "," + stdValue + ") = " + strControl);
		}
	else
		{
		//logDebug("lookup(" + stdChoice + "," + stdValue + ") does not exist");
		}
	return strControl;
}

function assignCapNoLog(assignId) // option CapId
{
	var itemCap = capId
	if (arguments.length > 1) itemCap = arguments[1]; // use cap ID specified in args

	var cdScriptObjResult = aa.cap.getCapDetail(itemCap);
	if (!cdScriptObjResult.getSuccess()) {
        return false;
    }

	var cdScriptObj = cdScriptObjResult.getOutput();

	if (!cdScriptObj){
        return false; 
    }

	cd = cdScriptObj.getCapDetailModel();

	iNameResult  = aa.person.getUser(assignId);

	if (!iNameResult.getSuccess()){ 
        return false; 
    }

	iName = iNameResult.getOutput();

	cd.setAsgnDept(iName.getDeptOfUser());
	cd.setAsgnStaff(assignId);

	cdWrite = aa.cap.editCapDetail(cd)
}

function editAppSpecificNoLog(itemName,itemValue)  // optional: itemCap
{
	var itemCap = capId;
	var itemGroup = null;
  	
   	var appSpecInfoResult = aa.appSpecificInfo.editSingleAppSpecific(itemCap,itemName,itemValue,itemGroup);
}
