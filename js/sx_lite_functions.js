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