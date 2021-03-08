#!/usr/bin/python

import fileinput
import math
import os
import sys, getopt

# Global Variables

global outputfileContents
global outputObj

def main(argv):
	# https://www.tutorialspoint.com/python/python_command_line_arguments.htm

	global helpText

	global inputfile
	global outputfile
	global ggaDict
	global gstDict
	global vtgDict
	
	inputfile = ''
	outputfile = ''
	helpText = 'static.py -i <inputfile> -o <outputfile>'

	ggaDict = {}
	gstDict = {}
	vtgDict = {}
	zdaDict = {}

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
			
			# https://www.guru99.com/reading-and-writing-files-in-python.html	
			inFile = open(inputfile, "r")
			staticInputFileContents = inFile.read()
			
			# Move NMEA-183 sentences whose second element is GGA, GST, VTG, or ZDA
			#  into another list, ggaList, gstList, vtgList, and zdaList respectively.
			# Debug - after file contents assign
			# print(staticInputFileContents)
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
			
			# concatenate all four groups of sentences (no longer needed)
			# outputfileContents = []
			#	outputfileContents = 'Sentences: \n' \
			#		+ '\n\nGGA Sentences: \n' + str(ggaList) \
			#		+ '\n\nGST Sentences: \n' + str(gstList) \
			#		+ '\n\nVTG Sentences: \n' + str(vtgList) \
			#		+ '\n\nZDA Sentences: \n' + str(zdaList)
			
			outputfileContents = ''
			stepPrime = 0
			while stepPrime < (len(ggaList) - 1):
				thisLine = ggaList[stepPrime]

				# Output
				print('\n')
				print('\n')
				print('Line: ' + str(stepPrime))
				# print(thisLine)
				# print(nextline)
				outputStr = '\n      ##############################' \
					+ '\n    ##################################' \
					+ '\n  ######################################' \
					+ '\n            This Working Line Number: ' + str(stepPrime) \
					+ '\n  ######################################' \
					+ '\n    ##################################' \
					+ '\n      ##############################' \
					+ '\n\nWorking Line: ' + str(thisLine) \
					+ '\n\n'
				outputfileContents += outputStr
				
				global step9Hundo
				step9Hundo = 1

				global stepCompar
				stepCompar = stepPrime + step9Hundo

				while (step9Hundo < 900):
					# thisLine = ggaList[stepCompar]
					thisLine = ggaList[stepPrime]
					nextline = ggaList[stepCompar]
					NMEA_GGA_Dist(thisLine, nextline)

					# Output
					# print('\n')
					# print('\n')
					# print('Line: ' + str(stepCompar))
					# print(thisLine)
					# print(nextline)
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

				stepPrime = stepPrime + 1

			theBigDtxt = '\n      **********************************************' \
				+ '\n      **     Largest distance: ' + str(theBigD) + '   **' \
				+ '\n      **********************************************\n\n' \

			print(theBigDtxt)
			outputfileContents += theBigDtxt

			wOut = open(outputfile, "w")
			wOut.write(outputfileContents)
			
			# File Out clean up
			print('File Out section complete.')
			wOut.close()

	print('Input file is ', inputfile)
	print('Output file is ', outputfile)

# Prints elements starting from zero position till 2nd
def findTalkerSent(inString):
	firstElement = inString.pop(1)
	talkerId = firstElement[0:2]
	SentenceType = firstElement[3:]
	return inString

# Function to move sentences whose second element is GGA, GST, or VTG
# into another list, ggaList, gstList, and vtgList, respectivly.
def sepSentence(inList):
	# print('sepSentence() function started. Whole line is:')
	# print(inList)
	# print('inList[3:6] is:')	
	# print(inList[3:6])

	if inList[3:6] == 'GGA':
		ggaList.append(inList)
	elif inList[3:6] == 'GST':
		gstList.append(inList)
	elif inList[3:6] == 'VTG':
		vtgList.append(inList)
	elif inList[3:6] == 'ZDA':
		zdaList.append(inList)
	return

def splitty(inputString):
	# https://docs.python.org/3/library/stdtypes.html#str.splitlines
	# for line in fileinput.input():
	#	process(line)
	lineList = inputString.splitlines()
	return linesList

def NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2):
	global Lat1
	global Lat2
	global Lon1
	global Lon2

	Lat1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 2 ), NMEA_Get_Field( NMEA_Line1, 3 ))
	Lat2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 2 ), NMEA_Get_Field( NMEA_Line2, 3 ))
	Lon1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 4 ), NMEA_Get_Field( NMEA_Line1, 5 ))
	Lon2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 4 ), NMEA_Get_Field( NMEA_Line2, 5 ))
	
	# print('Debug: This Line: ', str(NMEA_Line1))
	# print('Next Line: ', str(NMEA_Line2))

	disty = GNSS_Distance(Lat1,Lon1,Lat2,Lon2)
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2)

def NMEA_LATLON_ToDecemal(NMEA_Line, coordinateRef):
	print('Debug: NMEA_LATLON_ToDecemal(): NMEA_Line: ', NMEA_Line)
	print('Debug: NMEA_LATLON_ToDecemal(): coordinateRef: ', coordinateRef)

	# NMEA_Line.replace('\x00', '').strip()
	# coordinate = int(float(NMEA_Line))
	coordinate = float(NMEA_Line)
	print('Debug: coordinate: ', coordinate)
	# print('coordinate: ', coordinate)
	# float(int(coordinate / 100) + ((coordinate - (int(coordinate / 100) * 100)) / 60))
	centiCoordinate = int(coordinate / 100)
	print('Debug: centiCoordinate: ', centiCoordinate)
	decimal = float(centiCoordinate + ((coordinate - (centiCoordinate * 100)) / 60))
	
	if ((coordinateRef == str('S')) or (coordinateRef == str('W'))):
		decimal = -(abs(decimal))
		print('Debug: decimal: ', decimal)
		return decimal
	else:
		print('Debug: decimal: ', decimal)
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

	# https://www.studytonight.com/post/trigonometric-function-in-python
	LA1 = MATH_D2R(Lat1)
	LA2 = MATH_D2R(Lat2)
	DLAT = MATH_D2R(Lat2-Lat1)
	DLON = MATH_D2R(Lon2-Lon1)
	A = math.sin(DLAT/2)*math.sin(DLAT/2)+math.cos(LA1)*math.cos(LA2)*math.sin(DLON/2)*math.sin(DLON/2)
	C = 2 * math.atan2(math.sqrt(A) ,math.sqrt(1-A))
	D = (earthRadius * C)
	theBiggestD(D)
	return D

def theBiggestD(theNewD):
	global theBigD
	theBigD = 0
	if (theNewD > theBigD):
		theBigD = theNewD
	else:
		pass


def MATH_D2R(Degrees):
	PI = math.pi
	return (Degrees*PI/180)

if __name__ == "__main__":
	main(sys.argv[1:])