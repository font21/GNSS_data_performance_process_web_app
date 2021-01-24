/* ==========================================================
#															#
#	Define Functions										#
#															#
========================================================== */

function sentenceParserFunction (inputBlock) {

	// Reassign inputBlock to sentenceArray for preservation
		let sentenceArray = inputBlock;

	// Foor loop to itterate through the array
		for (let indexi = 0; i > sentenceArray.length; i--) {

	sentenceArray[indexi].forEach(function(elementii, indexii, arrayii) {
				
	// console.log(sentenceArray)
		console.log('sentenceArray[0] = ' + sentenceArray[indexi]);
		console.log('sentenceArray[0][0] = ' + sentenceArray[indexi][indexii]);
		console.log('sentenceArray[0][0][0] = ' + sentenceArray[1][0][0]);

		console.log('sentenceArray[1] = ' + sentenceArray[1]);
		console.log('sentenceArray[1][0] = ' + sentenceArray[1][0]);
		console.log('sentenceArray[1][0][0] = ' + sentenceArray[1][0][0]);


		// For each object in the Array: slice out the talker and sentence type. Then, stick those back in.
		// sentenceArray[1].forEach(function(sentencei){

			
		// DeBug: Print sentencei position
			console.log('Debug: forEach(sentencei)')

			console.log(`Debug: sentenceArray[${indexi}] = ${sentenceArray[elementi]}`);
			console.log(`Debug: sentenceArray[${indexi}][${indexii}] = ` + sentenceArray[indexi][indexii]);

		// Separate the first value of sentenceArray into talkerId and sentenceId values
			
			let talkerId = sentenceArray[indexi][indexii].slice(1, 3);
			console.log("talkerId: " + talkerId);
			let sentenceType = sentenceArray[indexi][indexii].slice(3);
			console.log("sentenceType: " + sentenceType);

		// and stick them at the front of sentenceArray
			sentenceii[sentencei].unshift({ talkerId }, { sentenceType });
		
		// Remove the last element of the array.
			let lastValue = sentenceii[sentencei].pop();
		
		// Print the values to the command line for debug.
			console.log('lastValue: ' + lastValue);
			console.log('lastElement Length: ' + lastElementLength);
			let lastElementLength = sentenceii.length;
		
		// Separate last two elements of the array as second to last and checksum values:
			let lastElementLengthIsh = lastElementLength - 2;
			let penultimateElementStop = lastElementLength - 3;
			let penultimateID = lastValue.slice(0, penultimateElementStop);
			let checksum = lastValue.slice(4);
		
		// Print the values to the command line for debug.
			console.log('penultimateID: ' + penultimateID);
			console.log('checksum: ' + checksum);
		
		// Then, push those two values at the end of sentenceArray.
			sentenceArray.push({ penultimateID }, { checksum });
		
		
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
		
		
		// If statement depending on the second element in the array (sentenceType), prepare for sending to InfluxDB.
		if ( sentenceArray[1] == "$CFG" ) {
		
			// Do CFG things
				console.log('Doing CFG things.');
		
			// Merge Key-Value pairs as defined above
			// https://stackoverflow.com/a/50985915/13849868
				const sentenceArray = cfgKeys.reduce(
					(arr, key, index) => [...arr, { [key]: values[index] }],
					[]
				); //  returns [{talkerId: '$GN'},{sentenceType: 'GGA'},{utcFromDevice: '...]
		
		}
		else if ( sentenceArray[1] == "$GGA" ) {
			
			// Do GGA things
				console.log('Doing GGA things.');
		
			// Merge Key-Value pairs as defined above
			// https://stackoverflow.com/a/50985915/13849868
				const sentenceArray = ggaKeys.reduce(
					(arr, key, index) => [...arr, { [key]: values[index] }],
					[]
				); //  returns [{talkerId: '$GN'},{sentenceType: 'GGA'},{utcFromDevice: '...]
		
				if(sentenceArray.latitudeDirection === 'S') {
					sentenceArray.latitude = '-'+ sentenceArray.latitude
				}
				
				if(sentenceArray.longitudeDirection === 'W') {
					sentenceArray.longitude = '-'+ sentenceArray.longitude
				}
		
		}
		else if ( sentenceArray[1] == "$GST" ) {
			
			// Do GST things
				console.log('Doing GST things.');
		
			// Merge Key-Value pairs as defined above
			// https://stackoverflow.com/a/50985915/13849868
				const sentenceArray = gstKeys.reduce(
					(arr, key, index) => [...arr, { [key]: values[index] }],
					[]
				); //  returns [{talkerId: '$GN'},{sentenceType: 'GST'},{TcOfAssociatedGgaFix: '...]
		
		}
		else if ( sentenceArray[1] == "$VTG" ) {
			
			// Do VTG things
				console.log('Doing VTG things.');
		
			// Merge Key-Value pairs as defined above
			// https://stackoverflow.com/a/50985915/13849868
				const sentenceArray = vtgKeys.reduce(
					(arr, key, index) => [...arr, { [key]: values[index] }],
					[]
				); //  returns [{talkerId: '$GN'},{sentenceType: 'VTG'},{CourseOverGroundDegreesTrue: '...]
		
		}
		else if ( sentenceArray[1] == "$ZDA" ) {
			
			// Do ZDA things
				console.log('Doing ZDA things.');
		
			// Merge Key-Value pairs as defined above
			// https://stackoverflow.com/a/50985915/13849868
				const sentenceArray = zdaKeys.reduce(
					(arr, key, index) => [...arr, { [key]: values[index] }],
					[]
				); //  returns [{talkerId: '$GN'},{sentenceType: 'ZDA'},{utc: '...]
			
		}
		else {
			console.log('Sentence type failed.');
		}
		// closes the for each sentenceii in Array loop.
	)};
	// closes the for each sentencei in Array loop.
		};

		// Collapse the array and prepare to send out by assigning value to msg.payload
			const mergedPayload = sentenceArray.reduce((r,c) => ({...r,...c}), {})

// };


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
			return line.split(',')
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