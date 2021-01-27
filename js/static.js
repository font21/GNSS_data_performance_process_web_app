/* ==========================================================
#															#
#	Define global variables by using var at creation		#
#															#
========================================================== */

var mergedPayload = "Nothing added to the mergedPayload varibale.";
var sentenceArray = [];

/* ==========================================================
#															#
#	Define Functions										#
#															#
========================================================== */

function keysReduce (nmeakey, nmeaInputArray){
	// Merge Key-Value pairs as defined above
	// https://stackoverflow.com/a/50985915/13849868
	nmeaInputArray = nmeakey.reduce((obj, key, index) => (
		{ ...obj, [key]: nmeaInputArray[index] }
	), {})
	//  returns [{talkerId: '$GN', sentenceType: 'GGA', utcFromDevice: '...}]
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
				"Reference station ID", // this key was missing......
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
				// Apply NMEA-a83 Keys to each array element
					keysReduce (cfgKeys, sentenceArray[indexi]);
			} 
			else if ( sentenceArray[indexi][1] == "GGA" ) {	
				// Do GGA things
					console.log('Doing GGA things.');
					console.log(sentenceArray[indexi].length, ggaKeys.length)
			
				// Merge Key-Value pairs as defined above
				// https://stackoverflow.com/a/50985915/13849868
				sentenceArray[indexi] = ggaKeys.reduce((obj, key, index) => (
					{ ...obj, [key]: sentenceArray[indexi][index] }	
				), {})
				//  returns [{talkerId: '$GN', sentenceType: 'GGA', utcFromDevice: '...}]
				console.log('testReduce', sentenceArray[indexi] )

					if(sentenceArray[indexi].latitudeDirection === 'S') {
						sentenceArray[indexi].latitude = '-'+ sentenceArray[indexi].latitude
					}
					
					if(sentenceArray[indexi].longitudeDirection === 'W') {
						sentenceArray[indexi].longitude = '-'+ sentenceArray[indexi].longitude
					}
			
			}
			else if ( sentenceArray[indexi][1] == "GST" ) {
				// Do GST things
					console.log('Doing GST things.');
			
				// Merge Key-Value pairs as defined above
				// https://stackoverflow.com/a/50985915/13849868
				sentenceArray[indexi] = gstKeys.reduce((obj, key, index) => (
					{ ...obj, [key]: sentenceArray[indexi][index] }	
				), {})
				//  returns [{talkerId: '$GN', sentenceType: 'GST', TcOfAssociatedGgaFix: '...}]
			
			}
			else if ( sentenceArray[indexi][1] == "VTG" ) {	
				// Do VTG things
					console.log('Doing VTG things.');
			
				// Merge Key-Value pairs as defined above
				// https://stackoverflow.com/a/50985915/13849868
				sentenceArray[indexi] = vtgKeys.reduce((obj, key, index) => (
					{ ...obj, [key]: sentenceArray[indexi][index] }	
				), {})
				//  returns [{talkerId: '$GN', sentenceType: 'VTG', CourseOverGroundDegreesTrue: '...}]
		
			}
			else if ( sentenceArray[indexi][1] == "ZDA" ) {
				// Do ZDA things
					console.log('Doing ZDA things.');
			
				// Merge Key-Value pairs as defined above
				// https://stackoverflow.com/a/50985915/13849868
				sentenceArray[indexi] = zdaKeys.reduce((obj, key, index) => (
					{ ...obj, [key]: sentenceArray[indexi][index] }	
				), {})
				//  returns [{talkerId: '$GN', sentenceType: 'ZDA', utc: '...]
				
			}
			else {
				console.log('Sentence type failed.');
			}
	}
}
console.log('final', sentenceArray)
};

// Collapse the array and prepare to send out by assigning value to msg.payload
// to export for Node-Red
// mergedPayload = sentenceArray.reduce((r,c) => ({...r,...c}), {})

/* ==========================================================
#															#
#	End Defined functions and Begin Page Load				#
#															#
========================================================== */

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
	// msg.payload = mergedPayload

	let div = document.createElement('div');			

	div.innerHTML = mergedPayload;
	document.body.append(div);
}
reader.readAsText(input.files[0])
}, false)