const input = document.querySelector('input[type="file"]')
input.addEventListener('change', function (e) {
	console.log(input.files)
	const reader = new FileReader()
	reader.onload = function () {	
		const lines = reader.result.split('\n').map(function (line) {
			return line.split(',')
		})
		console.log(lines)

		// Reassign lines to sentenceArray
		const sentenceArray = lines;

		// MAJOR FIRST OBJECT Processing
		// For each object in the Array: slice out the talker and sentence type. Then, stick those back in.
		sentenceArray.forEach(function(sent){ 
			console.log(sent);		

		// Separate the first value of sentenceArray into talkerId and sentenceId values
			const talkerId = String(sent.slice(1, 3));
			console.log("talkerId: " + talkerId);
			const sentenceType = String(sent.slice(3));
			console.log("sentenceType: " + sentenceType);

			// Type debug stuff because it keeps grabbing the second object in the string and using that.
				if (typeof talkerId === 'string') {
					console.log("talkerId: " + talkerId + " is a string.");
				} else {
					console.log("talkerId: " + talkerId + " taint a string.");
				};

				if (typeof sentenceType === 'string') {
					console.log("sentenceType: " + sentenceType + " is a string.");
				} else {
					console.log("sentenceType: " + sentenceType + " taint a string.");
				};

		// and stick them at the front of sentenceArray
			sent.unshift({ talkerId }, { sentenceType });
		
		// Remove the last element of the array.
			const lastValue = sent.pop();
		
		// Print the values to the command line for debug.
			console.log('lastValue: ' + lastValue);
			console.log('lastElement Length: ' + lastElementLength);
			var lastElementLength = sent.length;
		
		// Separate last two elements of the array as second to last and checksum values:
			const lastElementLengthIsh = lastElementLength - 2;
			const penultimateElementStop = lastElementLength - 3;
			const penultimateID = lastValue.slice(0, penultimateElementStop);
			const checksum = lastValue.slice(4);
		
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
	// closes the for each in Array loop	
	});

		// Collapse the array and prepare to send out by assigning value to msg.payload
			const mergedPayload = sentenceArray.reduce((r,c) => ({...r,...c}), {})
			
			


		// Print everything or something
			console.log(mergedPayload);
			// msg.payload = mergedPayload

			let div = document.createElement('div');			
	
			div.innerHTML = mergedPayload;
			document.body.append(div);


	
	}
	reader.readAsText(input.files[0])
}, false)