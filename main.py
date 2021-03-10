#!/usr/bin/python

import fileinput
import math
import os
import sys, getopt

# Global Variables
theBigDlist = []

def main(argv):
	global outputfileContents
	global helpText
	global inputfile
	global outputfile
	global theBigD
	global theBigDlist

	inputfile = ''
	outputfile = ''
	helpText = 'static.py -i <inputfile> -o <outputfile>'

	staticLineList = []
	ggaList = []
	gstList = []
	vtgList = []
	zdaList = []

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
			while stepPrime < (len(ggaList) - 900):
				thisLine = ggaList[stepPrime]

				global step9Hundo
				step9Hundo = 1

				global stepCompar
				stepCompar = stepPrime + step9Hundo

				while (step9Hundo < 900):
					thisLine = ggaList[stepPrime]
					nextline = ggaList[stepCompar]
					NMEA_GGA_Dist(thisLine, nextline)

					# print('step9Hundo: ' + str(step9Hundo))
					# print('stepCompar: ' + str(stepCompar))

					step9Hundo = step9Hundo + 1
					stepCompar = stepCompar + 1

				outputStr = '\nThis Distance: ' + str(D)
				outputfileContents += outputStr

				stepPrime = int(stepPrime + 1)

			# Exit stepPrime
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
	theBigDlist.append(D)
	return D
	
	return theNewD


def MATH_D2R(Degrees):
	PI = math.pi
	return (Degrees*PI/180)


if __name__ == "__main__":
	main(sys.argv[1:])