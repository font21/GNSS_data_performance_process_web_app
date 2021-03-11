#!/usr/bin/python

import fileinput
import math
import os
import sys, getopt


# Global Variables
theBigDlist = [] # The main/whole Distance List
step9HundoDList = [] # The 900 Distance list that will be cleared every 900 turns of step9HundoDList


# Functions
def main(argv):
	global outputfileContents
	global helpText
	global inputfile
	global outputfile
	global theBigD # Variable to hold the largest Distance
	global theBigDlist # The main/whole Distance List
	global theBig9D # Variable to hold the largest Distance in the 900 Distance list (step9HundoDList)
    global step9HundoDList # The 900 Distance list that will be cleared every 900 turns of step9HundoDList

	inputfile = ''
	outputfile = ''
	helpText = 'static.py -i <inputfile> -o <outputfile>'

	staticLineList = [] # Holds all the lines after they have been split from the staticInputFileContents string.
	ggaList = []
	gstList = []
	vtgList = []
	zdaList = []

	# The beginning of the file manipulation
	try:
		opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
	except getopt.GetoptError:
		print(helpText)
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print(helpText)
			sys.exit()
		elif opt in ("-i", "--ifile"):
			inputfile = arg
			
			inFile = open(inputfile, "r")
			staticInputFileContents = inFile.read()
			
			staticLineList = staticInputFileContents.splitlines()

			## Create ggaList
			ggaList = [i for i in staticLineList if i[3:6] == 'GGA']
			### Explictly filter out other non-GGA sentences because sometimes those got through.
			ggaList = [x for x in ggaList if x[3:6] != 'GST']
			ggaList = [x for x in ggaList if x[3:6] != 'VTG']
			ggaList = [x for x in ggaList if x[3:6] != 'ZDA' ]

			## Create gstList
			gstList = [i for i in staticLineList if i[3:6] == 'GST']
			### Explictly filter out other non-GST sentences because sometimes those got through.
			gstList = [x for x in ggaList if x[3:6] != 'GGA']
			gstList = [x for x in ggaList if x[3:6] != 'VTG']
			gstList = [x for x in ggaList if x[3:6] != 'ZDA' ]

			## Create vtgList
			vtgList = [i for i in staticLineList if i[3:6] == 'VTG']
			### Explictly filter out other non-VTG sentences because sometimes those got through.
			vtgList = [x for x in ggaList if x[3:6] != 'GGA']
			vtgList = [x for x in ggaList if x[3:6] != 'GST']
			vtgList = [x for x in ggaList if x[3:6] != 'ZDA' ]

			## Create zdaList
			zdaList = [i for i in staticLineList if i[3:6] == 'ZDA']
			### Explictly filter out other non-ZDA sentences because sometimes those got through.
			zdaList = [x for x in ggaList if x[3:6] != 'GGA']
			zdaList = [x for x in ggaList if x[3:6] != 'GST']
			zdaList = [x for x in ggaList if x[3:6] != 'VTG' ]

			# File In clean up
			print('File In section complete.')
			inFile.close()
	
		elif opt in ("-o", "--ofile"):
			outputfile = arg
			outputfileContents = ''
			stepPrime = 0

			# Begin main loop (with ggaList) using stepPrime as an iterator
			while stepPrime < (len(ggaList) - 900):
				thisLine = ggaList[stepPrime]

				# Fill the variable outputStr with content to keep each step separated, for debugging.
				# This is a large obvious header for each main line compared.
				outputStr = '\n      ##############################\n    ##################################\n  ######################################' \
					+ '\n            This Working Line Number: ' + str(stepPrime) \
					+ '\n  ######################################\n    ##################################\n      ##############################' \
					+ '\n\nWorking Line: ' + str(thisLine) \
					+ '\n\n'
				
				# Once the variable outputStr is populated correctly, concatenate it with outputfileContents
				outputfileContents += outputStr
				
				# Make step9Hundo and stepCompar global within the function so that they survive being passed.
				global step9Hundo
				step9Hundo = 1

				# The variable stepCompar assists the iterator (stepCompar) by pointing to the correct sentence/line to compare to.
				global stepCompar

				# stepCompar is calculated by adding stepPrime (the main iterator) to the step9Hundo (the nested iterator)
				stepCompar = stepPrime + step9Hundo

				# Begin nested loop (for 900 lines) using step9Hundo as an iterator
				while (step9Hundo < 900):
					# 
					thisLine = ggaList[stepPrime]
					nextline = ggaList[stepCompar]
					NMEA_GGA_Dist(thisLine, nextline)

					# print('step9Hundo: ' + str(step9Hundo))
					# print('stepCompar: ' + str(stepCompar))

					# Fill the variable outputStr with content to keep each step separated, for debugging.
					# This is a smaller obvious header for each stepped line compared.
					outputStr = '\n      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' \
						+ '\n            This Compared Line Number: ' + str(stepCompar) \
						+ '\n      @@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@@' \
						+ '\n\nThis Line: ' + str(thisLine) \
						+ '\nNext Line: ' + str(nextline) \
						+ '\nLA1: ' + str(LA1) \
						+ '\nLA2: ' + str(LA2) \
						+ '\nLon1: ' + str(Lon1) \
						+ '\nLon2: ' + str(Lon2) \
						+ '\nLat1: ' + str(Lat1) \
						+ '\nLon1: ' + str(Lon1) \
						+ '\nLat2: ' + str(Lat2) \
						+ '\nLon2: ' + str(Lon2) \
						+ '\nDistance: ' + str(D) \
						+ '\n\n'
					outputfileContents += outputStr

					step9Hundo = step9Hundo + 1
					stepCompar = stepCompar + 1
					# Exit nested loop (step9Hundo for 900 lines)

				# Clear step9HundoDList (Nested 900 Loop)				
				step9HundoDList.sort()
				theBig9D = step9HundoDList[-1]
				step9HundoDList.clear()
				
				# -=:::::::::::::::::::::::::THE EMAILED INSTRUCTIONs FROM JASON:::::::::::::::::::::::::=-
				# True Lat, True Lon, Max Distance to following 15 minutes(900 GGA Messages), 
                # GGA Field 6 (quality Indicator), GGA Field 7 (Number of sats), 
                # GGA Field 8 (HDOP), GST Field 6(sigma Lat), GST field 7(sigma Lon)
				# -=:::::::::::::::::::::::::THE EMAILED INSTRUCTIONs FROM JASON:::::::::::::::::::::::::=-
                
				outputStr = '\nLargest Distance of this 900 line comparison: ' + str(theBig9D)
				outputfileContents += outputStr

				stepPrime = int(stepPrime + 1)
				# Exit stepPrime (main loop)

			
			# print(theBigDlist)
			theBigDlist.sort()
			theBigD = theBigDlist[-1]
			
			# printing the last element 
			print("Largest element is:", theBigDlist[-1])

			theBigDtxt = '\n      **********************************************' \
				+ '\n      **     Largest distance: ' + str(theBigD) \
				+ '\n      **********************************************\n\n' \

			# print(theBigDtxt)
			outputfileContents += theBigDtxt

			wOut = open(outputfile, "w")
			wOut.write(outputfileContents)
			
			# File Out clean up
			print('File Out section complete.')
			wOut.close()

	print('Input file is ' + str(inputfile))
	print('Output file is ' + str(outputfile))


def NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2):
	global Lat1
	global Lat2
	global Lon1
	global Lon2

	Lat1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 2 ), NMEA_Get_Field( NMEA_Line1, 3 ))
	Lat2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 2 ), NMEA_Get_Field( NMEA_Line2, 3 ))
	Lon1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 4 ), NMEA_Get_Field( NMEA_Line1, 5 ))
	Lon2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 4 ), NMEA_Get_Field( NMEA_Line2, 5 ))

	disty = GNSS_Distance(Lat1,Lon1,Lat2,Lon2)
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2)


def NMEA_LATLON_ToDecemal(NMEA_Line, coordinateRef):
	coordinate = float(NMEA_Line)
	centiCoordinate = int(coordinate / 100)
	decimal = float(centiCoordinate + ((coordinate - (centiCoordinate * 100)) / 60))
	
	if ((coordinateRef == str('S')) or (coordinateRef == str('W'))):
		decimal = -(abs(decimal))
		return decimal
	else:
		return decimal


def NMEA_Get_Field(NMEA_Line, Field):
	NMEA_Line_List = NMEA_Line.split(',')
	STG = NMEA_Line_List[int(Field)]
	return STG


def GNSS_Distance(Lat1, Lon1, Lat2, Lon2):
	global LA1
	global LA2
	global DLAT
	global DLON
	global D
	global earthRadius
	earthRadius = 6371000

	LA1 = MATH_D2R(Lat1)
	LA2 = MATH_D2R(Lat2)
	DLAT = MATH_D2R(Lat2-Lat1)
	DLON = MATH_D2R(Lon2-Lon1)
	A = math.sin(DLAT/2)*math.sin(DLAT/2)+math.cos(LA1)*math.cos(LA2)*math.sin(DLON/2)*math.sin(DLON/2)
	C = 2 * math.atan2(math.sqrt(A) ,math.sqrt(1-A))
	D = (earthRadius * C)

	# Push the current calculated distance to both the main/whole Distance List and the 900 Distance List
	theBigDlist.append(D)
	step9HundoDList.append(D)
	return D
	
	return theNewD


def MATH_D2R(Degrees):
	PI = math.pi
	return (Degrees*PI/180)


if __name__ == "__main__":
	main(sys.argv[1:])
