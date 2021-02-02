/* ==========================================================
#															#
#	Define global variables by using var at creation		#
#															#
========================================================== */

var mergedPayload = "Nothing added to the mergedPayload varibale.";
var sentenceArray = [];
var earthCircumference = 6371000; // Define the circumference of the earth:

/* ==========================================================
#															#
#	Define Functions										#
#															#
========================================================== */

// Merge Key-Value pairs as defined
// https://stackoverflow.com/a/50985915/13849868
function keysReduce (nmeakey, nmeaInputArray){
	nmeaInputArray = nmeakey.reduce((obj, key, index) => (
		{ ...obj, [key]: nmeaInputArray[index] }
	), {})
	
	console.log('testReduce: ', nmeaInputArray )
};

function sentenceParserFunction (inputBlock) {

// Reassign inputBlock to sentenceArray for preservation
sentenceArray = inputBlock;
console.log('initial', sentenceArray)

// Foor loop to itterate through the array
for (let indexi = 0; indexi < sentenceArray.length ; indexi++) {
	if (sentenceArray[indexi]) {
		// For each object in the Array: slice out the talker and sentence type. Then, stick those back in.
		// sentenceArray[1].forEach(function(sentencei){
		// Separate the first value of each array in sentenceArray into talkerId and sentenceId values	
			let talkerId = sentenceArray[indexi][0].slice(0, 3);
			let sentenceType = sentenceArray[indexi][0].slice(3);
			console.log('1 line', sentenceArray[indexi])
			console.log("talkerId: " + talkerId);
			console.log("sentenceType: " + sentenceType);

		// and stick them at the front of sentenceArray
			sentenceArray[indexi].shift()
			sentenceArray[indexi].unshift(talkerId,sentenceType);
		
		// Separate last two elements of the array as second to last and checksum values:
			let penultimateID = sentenceArray[indexi][sentenceArray[indexi].length - 2]
			let checksum = sentenceArray[indexi][sentenceArray[indexi].length - 1]
		
		// Print the values to the command line for debug.
			console.log('penultimateID: ' + penultimateID);
			console.log('checksum:', checksum)

		// Define Keys to be paired, later
			const cfgKeys = [
				"talkerId",
				"sentenceType",
				"B",
				"C",
				"D",
				"E",
				"F",
				"G",
				"H",
				"I",
				"J",
				"K",
				"L",
				"M",
				"N",
				"O",
				"P",
				"Q",
				"R",
				"S",
				"T",
				"U",
				"V",
				"W",
				"X",
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

		// updated 1 line data
			console.log('1 line updated', sentenceArray[indexi])

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
					console.log(sentenceArray[indexi].length, ggaKeys.length)

				//  returns [{talkerId: '$GN', sentenceType: 'GGA', utcFromDevice: '...}]
				console.log('testReduce', sentenceArray[indexi] )

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
console.log('final', sentenceArray)
};
/*


	 /* ================================================== \
	=========================================================
#															#
#	C++ Functions by Jason									#
#															#
	=========================================================
	 \ =+================================================ */


function NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2){
	const Lat1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,2),NMEA_Get_Field(NMEA_Line1,3));
	const Lat2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,2),NMEA_Get_Field(NMEA_Line2,3));
	const Lon1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,4),NMEA_Get_Field(NMEA_Line1,5));
	const Lon2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,4),NMEA_Get_Field(NMEA_Line2,5));
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2);
}


function NMEA_LATLON_ToDecemal(NMEA_Line, coordinateRef){
	const coordinate = StrToDbl(NMEA_Line);
	
	let decimal = (int)(coordinate / 100) + ((coordinate - ((int)(coordinate / 100) * 100)) / 60);
	if (coordinateRef.charAt(0) == 'S' || coordinateRef.charAt(0) == 'W')
		{
			return -decimal;
		}
			else
		{
			return decimal;
		}
}


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
	const D = (earthCircumference * C);
	return D;
}

/* ==========================================================
#															#
#	End Defined functions and Begin Page Load				#
#															#
  ======================================================== */

const input = document.querySelector('input[type="file"]')

input.addEventListener('change', function (e) {
console.log(input.files)
const reader = new FileReader()
reader.onload = function () {
	let lines = reader.result.split('\n').map(function (line) {
		return line.match(/([$0-9.-\w])+/g)
	})
	sentenceParserFunction(lines);

	// Print everything or something
	console.log(mergedPayload);

	let div = document.createElement('div');			

	div.innerHTML = mergedPayload;
	document.body.append(div);
}
reader.readAsText(input.files[0])
}, false)