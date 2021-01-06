# GNSS_data_performance_process_web_app
## 2020.12.30
## Jason's Original emailed instructions

---------- Forwarded message ---------
From: Jason OFlanagan <jason@seirrowon.com>
Date: Wed, Dec 30, 2020 at 5:13 PM
Subject: Processing File data
To: David Font <font21@gmail.com>, <font21@seirrowon.com>


Rob and David,
I need a program that can process GNSS data for performance. Needs to run in either Mac or PC
Program 1 - Static test	input - Single file - GGA, VTG and GST (data types) (ignore the VTG)	Output - a File, Each line contains True Lat, True Lon, Max Distance to following 15 minutes(900 GGA Messages), GGA Field 6 (quality Indicator), GGA Field 7 (Number of sats), GGA Field 8 (HDOP), GST Field 6(sigma Lat), GST field 7(sigma Lon)
	Process - Start at the first GGA message - convert the GGA to true Lat and Lon, then for the following 900 GGA messages, one at a time convert them to true Lat and Lon then calculate the distance between them and the Current Lat and Lon, Keep the Maximum distance. Save the new line to a processed file then move the the next GGA message and repeat. At the end of the file you will run out of GGA messages. Just quit when there is not 15 minutes of data left.
 Program 2 - Dynamic test	Input  - Two files - 1) Truth file(reference data), 2) Test file - GGA, VTG and GST (data types) (ignore the VTG)	Output - Single file. Each line contains 1) true Lat Ref, 2)true Lon Ref, 3) Test True Lat, 4) Test True Lon, 5)  Distance between Ref and test, 6) Ref GGA Field 6 (quality Indicator), 7) Test GGA Field 7 (Number of sats), 8) ref GGA Field 8 (HDOP), 9)test GGA Field 8 (HDOP), 10) Ref GST Field 6(sigma Lat), 11) Ref GST field 7(sigma Lon), 12) Test GST Field 6(sigma Lat), 13) Test GST field 7(sigma Lon) 
	Process - Match the GGA time stamps (Field 1) convert the Truth and Test GGA messages to true Lat and Lon, then calculate the distance between them. 

I will have a lat of data by the end of the weekend. If you can have this done soon I can start to process tests.Please note that the NMEA messages field 0 is $GPXXX.https://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_GGA.htmlhttps://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_GST.htmlhttps://www.trimble.com/OEM_ReceiverHelp/V4.44/en/NMEA-0183messages_VTG.html


Cheers
Jason O'Flanagan
C.E.O.
Cell + 1 512 913 9857
Jason@Seirrowon.com www.Seirrowon.com

# 2021.01.06
## Sample Data
The original file attachments in the email message have been removed and uploaded to the Seirrowon Labs website:

http://seirrowon.com/GNSS_data_performance_process_web_app/1-Static PPP Dec16.log
http://seirrowon.com/GNSS_data_performance_process_web_app/2-Static PPP Ublox DEC17 power fail.log
http://seirrowon.com/GNSS_data_performance_process_web_app/3-STATIC SBAS TEST 1 DEC 13.log
http://seirrowon.com/GNSS_data_performance_process_web_app/4-STATIC SBAS TEST 2 DEC 13.log

# 2021.01.06
## Deliverable for 3:00 PM CT, today:
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

# 2021.01.07
## Deliverable for Thursday 5:00 PM CT:

	Use parser from [Print_GPS_table_002 / Node-Red_NMEA-183-sentence_parser.js](https://github.com/font21/Print_GPS_table_002) to parse the sentances.

# 2021.01.08
## Deliverable for Friday 5:00 PM CT:

	Use parser from [Print_GPS_table_002 / Node-Red_NMEA-183-sentence_parser.js](https://github.com/font21/Print_GPS_table_002) to align time stamps for the data.
