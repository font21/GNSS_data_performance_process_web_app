![Seirrowon Labs Logo](http://seirrowon.com/images/seirrowon_logo.png)

# GNSS Data Performance Process Web App

## Locations and URLs
[The full application URL](http://seirrowon.com/GNSS_data_performance_process_web_app/index.html)

[Static Test URL](http://seirrowon.com/GNSS_data_performance_process_web_app/static.html)

[David Fontenot Resume](https://docs.google.com/document/d/1WP2OgJBuHUMg81mueckJq3ZMlo6vZQf2NSAEx2ehSK0)

## Description
This program accepts multi-line GNSS log files, processes them and provides the output as a downloadable CSV file.

## The original email message containing instructions:
On Wed, Dec 30, 2020 at 5:13 PM "Jason OFlanagan" <jason@seirrowon.com> wrote:
> Rob and David,
>
> I need a program that can process GNSS data for performance. Needs to run in either Mac or PC
>
> Program 1 - Static test
> 	input - Single file - GGA, VTG and GST (data types) (ignore the VTG)
> 	Output - a File, Each line contains True Lat, True Lon, Max Distance to following 15 minutes(900 GGA Messages), GGA Field 6 (quality Indicator), GGA Field 7 (Number of sats), GGA Field 8 (HDOP), GST Field 6(sigma Lat), GST field 7(sigma Lon)
>
> 	Process - Start at the first GGA message - convert the GGA to true Lat and Lon, then for the following 900 GGA messages, one at a time convert them to true Lat and Lon then calculate the distance between them and the Current Lat and Lon, Keep the Maximum distance. Save the new line to a processed file then move the the next GGA message and repeat. At the end of the file you will run out of GGA messages. Just quit when there is not 15 minutes of data left.
>
>
> Program 2 - Dynamic test
> 	Input  - Two files - 1) Truth file(reference data), 2) Test file - GGA, VTG and GST (data types) (ignore the VTG)
> 	Output - Single file. Each line contains 1) true Lat Ref, 2)true Lon Ref, 3) Test True Lat, 4) Test True Lon, 5)  Distance between Ref and test, 6) Ref GGA Field 6 (quality Indicator), 7) Test GGA Field 7 (Number of sats), 8) ref GGA Field 8 (HDOP), 9)test GGA Field 8 (HDOP), 10) Ref GST Field 6(sigma Lat), 11) Ref GST field 7(sigma Lon), 12) Test GST Field 6(sigma Lat), 13) Test GST field 7(sigma Lon) 
>
> 	Process - Match the GGA time stamps (Field 1) convert the Truth and Test GGA messages to true Lat and Lon, then calculate the distance between them. 
>
> I will have a lat of data by the end of the weekend. If you can have this done soon I can start to process tests.
> Please note that the NMEA messages field 0 is $GPXXX.


## Sample Data
The original file attachments in the email message have been removed and uploaded to the Seirrowon Labs website:

* [1-Static PPP Dec16](http://seirrowon.com/GNSS_data_performance_process_web_app/1-Static_PPP_Dec16.log)

* [2-Static PPP Ublox DEC17 power fail](http://seirrowon.com/GNSS_data_performance_process_web_app/2-Static_PPP_Ublox_DEC17_power_fail.log)

* [3-STATIC SBAS TEST 1 DEC 13](http://seirrowon.com/GNSS_data_performance_process_web_app/3-STATIC_SBAS_TEST_1_DEC_13.log)

* [4-STATIC SBAS TEST 2 DEC 13](http://seirrowon.com/GNSS_data_performance_process_web_app/4-STATIC_SBAS_TEST_2_DEC_13.log)

## Program Log and Projections

### 2021-01-06
Created five buttons
Browse File 1
Upload File 1
Browse File 2
Upload File 2
Process.

After file 1 and file 2 have been uploded, the program will:
1) Reverse the order of each line in uploaded file 1 and uploaded file 2.
2) Create a new file called output-(timestamp).txt.
3) Add "Edited" at the top of the output.txt-(timestamp) file.
4) paste the reversed data of uploaded file 1 and uploaded file 2 into output.txt-(timestamp) file.

### 2021-01-07
Use parser from
* [Print_GPS_table_002 / Node-Red_NMEA-183-sentence_parser.js](https://github.com/font21/Print_GPS_table_002)
to parse the sentances.

### 2021-01-08

Use parser from
* [Print_GPS_table_002 / Node-Red_NMEA-183-sentence_parser.js](https://github.com/font21/Print_GPS_table_002)
to align time stamps for the data.

### 2021-01-26
The Parser Works. The program accepts a log file and can parse it for GNSS sentence data. It creates an array of the data and displays that to the console log.

## Next
### Convert four functions from C++ in SX_Lite to Javascript:

When the NMEA_GGA_Dist() function is called,
sx_lite/lib/GNSS_Functions/GNSS_Functions.h
	Line 37: double NMEA_GGA_Dist(String NMEA_Line1, String NMEA_Line2);
		it returns a double.

lib/GNSS_Functions/GNSS_Functions.cpp
### Line 193: NMEA_GGA_Dist()

```C++
// Define the circumference of the earth:
const float R = 6371000;

double GNSS_Function::NMEA_GGA_Dist(String NMEA_Line1, String NMEA_Line2){
	double Lat1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,2),NMEA_Get_Field(NMEA_Line1,3));
	double Lat2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,2),NMEA_Get_Field(NMEA_Line2,3));
	double Lon1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,4),NMEA_Get_Field(NMEA_Line1,5));
	double Lon2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,4),NMEA_Get_Field(NMEA_Line2,5));
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2);
}
```

It actually uses four other functions to calculate GNSS_Distance.

### Line 77: NMEA_LATLON_ToDecemal()

```C++
double GNSS_Function::NMEA_LATLON_ToDecemal(String NMEA_Line,String coordinateRef){
	double coordinate = StrToDbl(NMEA_Line);
	
	double decimal = (int)(coordinate / 100) + ((coordinate - ((int)(coordinate / 100) * 100)) / 60);
	if (coordinateRef.charAt(0) == 'S' || coordinateRef.charAt(0) == 'W')
		{
			return -decimal;
		}
			else
		{
			return decimal;
		}
}
```

### Line 55: NMEA_Get_Field()

```C++
const float R = 6371000;
String GNSS_Function::NMEA_Get_Field(String NMEA_Line,int Field) {
	int Count=0;
	int STGCount = 0;
	char STG[15]; 
	for( int i=0; i<=NMEA_Line.length(); i++ )
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
	if (Count<Field){
			return "";
		}
			else{
			return  STG;
		}
}
```

### Line 261: GNSS_Distance()

```C++
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
```

## TO DO:
Convert four `C++ functions` to `Javascript`.