	 /* ================================================= \
	========================================================
															#
Define global variables by using var at creation			#
															#
	========================================================
	 \ ================================================= */

// Reusing the same array name used to export in Node-Red via MQTT
var mergedPayload = [];

// working array
var sentenceArray = [];

// Create an array to hold all $xxGGA sentences
var ggaArray = [];

// Create an array to hold all $xxVTG sentences
var vtgArray = [];

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





// create an array of GGA Messages
function makeGgaArray (wholeArray) {
	for (let indexi = 0; indexi < wholeArray.length ; indexi++) {
		if ( wholeArray[indexi][1] == "GGA" ) {
			ggaArray[element][2].push()
		}
		return ggaArray;
	}
};


// Array of GST Messages
function makeGgaArray (wholeArray) {
	for (let indexi = 0; indexi < wholeArray.length ; indexi++) {
		if ( wholeArray[indexi][1] == "GGA" ) {
			ggaArray[element][2].push()
		}
		return ggaArray;
	}
};


// Flatten Object and push the flattened nmeaInputArray into mergedPayload
// by Fernando Ghisi on
// https://stackoverflow.com/questions/44134212/best-way-to-flatten-js-object-keys-and-values-to-a-single-depth-array/59787588
function flattenObject(obj, prefix = '') {
	return Object.keys(obj).reduce((acc, k) => {
	  const pre = prefix.length ? prefix + '.' : '';
	  if (typeof obj[k] === 'object') Object.assign(acc, flattenObject(obj[k], pre + k));
	  else acc[pre + k] = obj[k];
	  return acc;
	}, {});
  }

function fatten(inArr){
	// mergedPayload = JSON.stringify(inArr);
	mergedPayload = JSON.stringify(inArr);
	return mergedPayload
};







// Download file creation function
function fileDownload(filename, text) {
	// https://ourcodeworld.com/articles/read/189/how-to-create-a-file-and-generate-a-download-with-javascript-in-the-browser-without-a-server
		// Usage
		// fileDownload("hello.txt","This is the content of my file :)");

	// Create outside wrapper container element to apply id and styles
	var OutputDnlBtnWrapper = document.createElement('div');

	// Create a tag to make a button
	var OutputDnlBtnElement = document.createElement('a');
	
	OutputDnlBtnElement.innerText = "Download Output";
	OutputDnlBtnElement.setAttribute('href', 'data:text/plain;charset=utf-8,' + encodeURIComponent(text));
	OutputDnlBtnElement.setAttribute('download', filename);
	document.body.appendChild(OutputDnlBtnElement);
	
	// Wrapper
	// https://plainjs.com/javascript/manipulation/wrap-an-html-structure-around-an-element-28/
	// insert wrapper before element in the DOM tree
	OutputDnlBtnElement.parentNode.insertBefore(OutputDnlBtnWrapper, OutputDnlBtnElement);
	
	// move OutputDnlBtnElement element into wrapper
	OutputDnlBtnWrapper.appendChild(OutputDnlBtnElement);

	// Apply id and styles to outside wrapper
	OutputDnlBtnWrapper.setAttribute("id", "OutputDnlBtn");
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

function sentenceParserFunction (inputBlock) {

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

	// Attempt to collate the data to send out.
	console.log('Printing at the end of sentenceParserFunction(): ', sentenceArray)
	mergedPayload = fatten(sentenceArray);

	// Export mergedPayload array to file fordownload.
	fileDownload("output.txt", mergedPayload);
};




	  /* ================================================ \
	========================================================
															#
C++ Functions by Jason										#
															#
	========================================================
	  \ ================================================ */

/* original C++
function NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2){
	const Lat1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,3),NMEA_Get_Field(NMEA_Line1,4));
	const Lat2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,3),NMEA_Get_Field(NMEA_Line2,4));
	const Lon1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,5),NMEA_Get_Field(NMEA_Line1,6));
	const Lon2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,5),NMEA_Get_Field(NMEA_Line2,6));
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
		break;
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
reader.onload = function () {
	let lines = reader.result.split('\n').map(function (line) {
		return line.match(/([$0-9.-\w])+/g)
	})
	sentenceParserFunction(lines);

	// Append to page instead of sending to the Console Log. // console.log(mergedPayload);
	let mergedPayloadDiv = document.createElement('div');
	mergedPayloadDiv.innerHTML = mergedPayload;
	document.body.append(mergedPayloadDiv);
}
reader.readAsText(input.files[0])
}, false)