	 /* ================================================= \
	========================================================
															#
Define GLOBAL variables and arrays by using var			#
															#
	========================================================
	 \ ================================================= */

// Reusing the same array name used to export in Node-Red via MQTT. Will be used as a final array name to be displayed and sent to file.
var mergedPayload;

// working array. Will be used as an incomming array name to be processed.
var sentenceArray = [];

// Array that will hold the initial file data split by carriage return.
var lines = [];

// Create global arrays to hold only $xxGGA, $xxVTG, $xxGST, and $xxZDA sentences to be filled by the groupSentenceType() function.
var ggaArray = [];
var vtgArray = [];
var gstArray = [];
var zdaArray = [];


// Define the radius of the earth:
var earthRadius = 6371000;

// Define variables used in the C++ Functions by Jason
var Lat1;
var Lon1;
var Lat2;
var Lon2;


	 /* ================================================= \
	========================================================
															#
Define Functions											#
															#
	========================================================
	 \ ================================================= */


// function to split out sentences by type in their own arrays: ggaArray, vtgArray, gstArray, zdaArray
function groupSentenceType(wholeArray, sentenceType) {
	console.log('running groupSentenceType().')
	console.log(wholeArray)
	for (let indexi = 0; indexi < wholeArray.length ; indexi++) {
		
		console.log('wholeArray[0][2] is ' + wholeArray[0][2])
		console.log('wholeArray[1][2] is ' + wholeArray[1][2])
		console.log('wholeArray[2][2] is ' + wholeArray[2][2])
		if ( 		wholeArray[indexi][2] == 'GGA' ) {
			ggaArray.push(wholeArray[indexi]);	
		} else if (	wholeArray[indexi][2] == 'VTG' ) {
			vtgArray.push(wholeArray[indexi]);
		} else if (	wholeArray[indexi][2] == 'GST' ) {
			gstArray.push(wholeArray[indexi]);
		} else if (	wholeArray[indexi][2] == 'ZDA' ) {
			zdaArray.push(wholeArray[indexi]);
		} else {
			// DeBug
			console.log('Skipping line : ' + indexi + ' because it does not equal' + sentenceType + '.');
			console.log('Contents: ' + wholeArray[indexi][1]);
		}
	}
	return;
};


// Flatten Object and push the flattened nmeaInputArray into mergedPayload
// by Fernando Ghisi on
// https://stackoverflow.com/questions/44134212/best-way-to-flatten-js-object-keys-and-values-to-a-single-depth-array/59787588
function flattenObject(obj, prefix = '') {
	return Object.keys(obj).reduce((mergedPayload, k) => {
	  const pre = prefix.length ? prefix + '.' : '';
	  if (typeof obj[k] === 'object') Object.assign(mergedPayload, flattenObject(obj[k], pre + k));
	  else mergedPayload[pre + k] = obj[k];
	  return mergedPayload;
	}, {});
  }

// Convert an array of objects and flatten the contents of the array into a flat string in preperation to be made the contents of an output file.
function fatten(arrayToFatten){
	// mergedPayload = JSON.stringify(inArr);

	// https://stackoverflow.com/questions/14615669/convert-objects-properties-and-values-to-array-of-key-value-pairs
	for(var i of arrayToFatten) {
		var key = Object.keys(i).toString();
	return mergedPayload
	};
	
};

// Download file creation function
function outputFileDownload(filename, filenameText, idText) {
	// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
		// Usage
		// outputFileDownload("hello.txt","This is the content of my file :)");

	// Create outside wrapper container element to apply id and styles
	var OutputDnlBtnWrapper = document.createElement('div');

	// Create a tag to make a button
	var OutputDnlBtnElement = document.createElement('a');
	
	OutputDnlBtnElement.innerText = "Download Output";
	OutputDnlBtnElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(filenameText));
	OutputDnlBtnElement.setAttribute('download', filename);
	document.body.appendChild(OutputDnlBtnElement);
	
	// Wrapper
	// https://plainjs.com/javascript/manipulation/wrap-an-html-structure-around-an-element-28/
	// insert wrapper before element in the DOM tree
	OutputDnlBtnElement.parentNode.insertBefore(OutputDnlBtnWrapper, OutputDnlBtnElement);
	
	// move OutputDnlBtnElement element into wrapper
	OutputDnlBtnWrapper.appendChild(OutputDnlBtnElement);

	// Apply id and styles to outside wrapper
	OutputDnlBtnWrapper.setAttribute("id", idText);

	// Additional Javascript FileAPI reading:
	// https://javascript.info/file
	// https://www.w3.org/TR/FileAPI/
}

// Merge Key-Value pairs as defined
function keysReduce (nmeakey, nmeaInputArray){
	// https://stackoverflow.com/a/50985915/13849868

	nmeaInputArray = nmeakey.reduce((obj, key, index) => (
		{ ...obj, [key]: nmeaInputArray[index] }
	), {})
	
	// Debug
	// console.log('testReduce: ', nmeaInputArray )	
};

function sentenceParserFunction(inputBlock) {

	// Reassign inputBlock to sentenceArray for preservation
	sentenceArray = inputBlock;
	
	// Debug
	// console.log('initial', sentenceArray)

	// For loop to itterate through the array
	for (let indexi = 0; indexi < sentenceArray.length ; indexi++) {
		if (sentenceArray[indexi]) {
			// For each object in the Array: slice out the talker and sentence type. Then, stick those back in.
			// Separate the first value of each array in sentenceArray into talkerId and sentenceId values	
				let talkerId = sentenceArray[indexi][0].slice(0, 3);
				let sentenceType = sentenceArray[indexi][0].slice(3);
				
				// Debug 
				// console.log('1 line', sentenceArray[indexi])
				// console.log("talkerId: " + talkerId);
				// console.log("sentenceType: " + sentenceType);

			// and stick them at the front of sentenceArray
				sentenceArray[indexi].shift()
				sentenceArray[indexi].unshift(talkerId,sentenceType);
			
			// Separate last two elements of the array as second to last and checksum values:
				let penultimateID = sentenceArray[indexi][sentenceArray[indexi].length - 2]
				let checksum = sentenceArray[indexi][sentenceArray[indexi].length - 1]
			
			// Debug:
			// Print the values to the command line for debug.
				// console.log('penultimateID: ' + penultimateID);
				// console.log('checksum:', checksum)

			// Define Keys to be paired, later
				const cfgKeys = [
					"talkerId",
					"sentenceType",
					"VERSION",
					"BOOTMODE",
					"RECEIVER_TYPE",
					"CONFIG_MODE",
					"SERIAL1_CONFIG",
					"SERIAL2_CONFIG",
					"SERIAL1_OUTPUT",
					"SERIAL2_OUTPUT",
					"NMEA_FORMAT",
					"NMEA_RATE",
					"WIFI_SSID",
					"WIFI_PW",
					"NTRIP_ADDRESS",
					"NTRIP_UN",
					"NTRIP_PW",
					"NTRIP_PORT",
					"CORR_SOURCE",
					"NTRIP_MOUNT",
					"TILT",
					"HEIGHT",
					"INCHES",
					"SUPPORT",
					"HEADING_VECT",
					"DUAL_ANT_LOC",
					"RADAR_CAL",
					"checksum"
				];
				
				const ggaKeys = [
					"talkerId",
					"sentenceType",
					"utcFromDevice",
					"latitude",
					"latitudeDirection",
					"longitude",
					"longitudeDirection",
					"gpsQuality",
					"satellitesInUse",
					"dilutionOfPrecision",
					"antennaAltitude",
					"antennaAltitudeUnit",
					"geoidalSeparation",
					"geoidalSeparationUnit",
					"ageOfData",
					"Reference station ID",
					"checksum",
				];
					
				const gstKeys = [
					"talkerId",
					"sentenceType",
					"TcOfAssociatedGgaFix",
					"StandardDeviationMetersOfSemiMajor",
					"StandardDeviationMetersOfSemiMinor",
					"OrientationOfSemiMajorAxisOfErrorEllipse",
					"StandardDeviationMetersOfLatitudeError",
					"StandardDeviationMetersOfLongitudeError",
					"StandardDeviationMetersOfAltitudeError",
					"checksum",
				];
					
				const vtgKeys = [
					"talkerId",
					"sentenceType",
					"CourseOverGroundDegreesTrue",
					"T",
					"CourseOverGroundDegreesMagnetic",
					"M",
					"SpeedOverGroundKnots",
					"N",
					"SpeedOverGroundKmh",
					"K",
					"FaaModeIndicator",
					"checksum",
				];
				
				const zdaKeys = [
					"talkerId",
					"sentenceType",
					"utc",
					"Day",
					"Month",
					"Year",
					"LocalZone",
					"LocalZoneMinutes",
					"checksum",
				];

			// Print to the command line which line is being processed.
				console.log('Row ' + sentenceArray[indexi] + ' updated:')

			// If statement depending on the second element in the array (sentenceType), prepare for sending to InfluxDB.
			if ( sentenceArray[indexi][1] == "CFG" ) {
				// Do CFG things
					console.log('Doing CFG things.');
				// Merge NMEA-183 Key-Value pairs as defined above in to each array element
					keysReduce (cfgKeys, sentenceArray[indexi]);
				//  returns [{talkerId: '$GN', sentenceType: 'CFG'...}]
					
			} 
			else if ( sentenceArray[indexi][1] == "GGA" ) {
				// Do GGA things
					console.log('Doing GGA things.');
					
					// Debug:
					// console.log(sentenceArray[indexi].length, ggaKeys.length)

				//  returns [{talkerId: '$GN', sentenceType: 'GGA', utcFromDevice: '...}]
					// Debug:
					// console.log('testReduce', sentenceArray[indexi] )

				// c++ transalated
					NMEA_GGA_Dist(sentenceArray[indexi], sentenceArray[indexi-1])

					if(sentenceArray[indexi].latitudeDirection === 'S') {
						sentenceArray[indexi].latitude = '-'+ sentenceArray[indexi].latitude
					}
					
					if(sentenceArray[indexi].longitudeDirection === 'W') {
						sentenceArray[indexi].longitude = '-'+ sentenceArray[indexi].longitude
					}
				
				// Merge NMEA-183 Key-Value pairs as defined above in to each array element
					keysReduce (ggaKeys, sentenceArray[indexi]);
			
			}
			else if ( sentenceArray[indexi][1] == "GST" ) {
				// Do GST things
					console.log('Doing GST things.');
			
				// Merge NMEA-183 Key-Value pairs as defined above in to each array element
					keysReduce (gstKeys, sentenceArray[indexi]);
				
				//  returns [{talkerId: '$GN', sentenceType: 'GST', TcOfAssociatedGgaFix: '...}]
			
			}
			else if ( sentenceArray[indexi][1] == "VTG" ) {	
				// Do VTG things
					console.log('Doing VTG things.');
			
				// Merge NMEA-183 Key-Value pairs as defined above in to each array element
					keysReduce (vtgKeys, sentenceArray[indexi]);
				
				//  returns [{talkerId: '$GN', sentenceType: 'VTG', CourseOverGroundDegreesTrue: '...}]
		
			}
			else if ( sentenceArray[indexi][1] == "ZDA" ) {
				// Do ZDA things
					console.log('Doing ZDA things.');

				// Merge NMEA-183 Key-Value pairs as defined above in to each array element
					keysReduce (zdaKeys, sentenceArray[indexi]);

				//  returns [{talkerId: '$GN', sentenceType: 'ZDA', utc: '...]

			}
			else {
				console.log('Sentence type failed.');
			}
		}
	}
	return sentenceArray
};




function mainsss(mainsArray) {
	console.log("The Mains function began to run.")
	
	// reader.readAsText(input.files[0])

	sentenceParserFunction(mainsArray);

	// Append to page in addition to sending to the Console Log. // console.log(mergedPayload);
	let mergedPayloadDiv = document.createElement('div');
	mergedPayloadDiv.innerHTML = mergedPayload;
	document.body.append(mergedPayloadDiv);

	// Pass the whole array and print out the four arrays spit out: ggaArray vtgArray, gstArray, zdaArray
	
	
	// separate out GGA sentences an stick them into ggaArray
	groupSentenceType(mainsArray, 'GGA');
	// Print the contents of ggaArray to the console log and the page
	console.log(ggaArray);
	document.body.append(ggaArray);
	// Export ggaArray to file for download
	outputFileDownload("ggaOutput.txt", ggaArray, "ggaOutputDnlBtn");


	// separate out VTG sentences an stick them into vtgArray
	groupSentenceType(mainsArray, 'VTG');
	// Print the contents of vtgArray to the console log and the page
	console.log(vtgArray);
	document.body.append(vtgArray);
	// Export vtgArray to file for download
	outputFileDownload("vtgOutput.txt", vtgArray, "vtgOutputDnlBtn");





	

	// Attempt to collate the data to send out.
	console.log('Printing at the end of sentenceParserFunction(): sentenceArray')
	mergedPayload = fatten(sentenceArray);

	

	console.log("The Mains function completed its run.")
}

	  /* ================================================ \
	========================================================
															#
C++ Functions by Jason										#
															#
	========================================================
	  \ ================================================ */

/* Original untouched C++ code by Jason
function NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2){
	double Lat1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,2),NMEA_Get_Field(NMEA_Line1,3));
	double Lat2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,2),NMEA_Get_Field(NMEA_Line2,3));
	double Lon1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,4),NMEA_Get_Field(NMEA_Line1,5));
	double Lon2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,4),NMEA_Get_Field(NMEA_Line2,5));
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2);
}
*/


function NMEA_Dist(sentenceType, NMEA_Line1, NMEA_Line2){
	// Verify that both objects match the expected incomming sentence type before proceding.
	if ((NMEA_Line1[2] == sentenceType) && (NMEA_Line2[2] == sentenceType)) {
		const Lat1 = NMEA_LATLON_ToDecimal(NMEA_Line1[3],NMEA_Line1[4]);
		const Lat2 = NMEA_LATLON_ToDecimal(NMEA_Line2[3],NMEA_Line2[4]);
		const Lon1 = NMEA_LATLON_ToDecimal(NMEA_Line1[5],NMEA_Line1[6]);
		const Lon2 = NMEA_LATLON_ToDecimal(NMEA_Line2[5],NMEA_Line2[6]);
		return GNSS_Distance(Lat1,Lon1,Lat2,Lon2);
	} else {
		// Debug
		console.log(NMEA_Line1[2] + 'does not equal ' + sentenceType);
	}
}


function NMEA_LATLON_ToDecimal(NMEA_Line, coordinateRef){
	const coordinate = NMEA_Line;
	
	let decimal = ((coordinate / 100) + ((coordinate - ((coordinate / 100) * 100)) / 60));
	if (coordinateRef == 'S' || coordinateRef == 'W')
		{
			return -Math.abs(decimal);
		}
			else
		{
			return decimal;
		}
}

// --=[ NOT NEEDED ]=--
// Takes the whole text line and takes out the field form each line.
// Not needed bc now everything is objects
function NMEA_Get_Field(NMEA_Line, Field) {
	let Count=0;
	let STGCount = 0;
	let STG;
	for( let i=0; i <= NMEA_Line.length(); i++ )
		{
			if (NMEA_Line.charAt(i)==',' ){
			Count++;
			}
			if ((Count==Field) && (NMEA_Line.charAt(i)!=',')){
			STG[STGCount]=NMEA_Line.charAt(i);
			STGCount++;
			}
		}
	STG[STGCount]=0;
	if (Count < Field){
			return "";
		}
			else{
			return  STG;
		}
}

/* --=[ Original untouched C++ code by Jason ]=--
double GNSS_Function::MATH_D2R(double Deg){
	return (Deg*PI/180);
}

double GNSS_Function::GNSS_Distance(double Lat1,double Lon1,double Lat2,double Lon2){
      double LA1 = MATH_D2R(Lat1);
      double LA2 = MATH_D2R(Lat2);
      double DLAT = MATH_D2R(Lat2-Lat1);
      double DLON = MATH_D2R(Lon2-Lon1);
      double A = sin(DLAT/2)*sin(DLAT/2)+cos(LA1)*cos(LA2)*sin(DLON/2)*sin(DLON/2);
      double C = 2 * atan2(sqrt(A) ,sqrt(1-A));
      double D = (R * C);
      return D;
    }
*/

function MATH_D2R(Degrees){
	return (Degrees*PI/180);
}

function GNSS_Distance(Lat1, Lon1, Lat2, Lon2){
	const LA1 = MATH_D2R(Lat1);
	const LA2 = MATH_D2R(Lat2);
	const DLAT = MATH_D2R(Lat2-Lat1);
	const DLON = MATH_D2R(Lon2-Lon1);
	const A = sin(DLAT/2)*sin(DLAT/2)+cos(LA1)*cos(LA2)*sin(DLON/2)*sin(DLON/2);
	const C = 2 * atan2(sqrt(A) ,sqrt(1-A));
	const D = (earthRadius * C);
	return D;
}


	 /* ================================================= \
	========================================================
															#
End Defined functions and Begin Page Load					#
															#
	========================================================
	 \ ================================================= */

const input = document.querySelector('input[type="file"]')

input.addEventListener('change', function (e) {
console.log(input.files)
const reader = new FileReader()

reader.readAsText(input.files[0])

reader.onload = function () {
	var lines = reader.result.split('\n').map(function (line) {
		return line.match(/([$0-9.-\w])+/g)
	});
}
console.log(lines)
mainsss(lines);

console.log("after mains.");

}, false);