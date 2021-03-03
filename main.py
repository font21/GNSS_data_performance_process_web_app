#!/usr/bin/python

import fileinput
import math
import os
import sys, getopt



# Global Variables
global inputfile
global outputfile
global ggaDict
global gstDict
global vtgDict
global helpText
global earthRadius
global D

global Lat1
global Lon1
global Lat2
global Lon2

global earthRadius
earthRadius = 6371000

def main(argv):
	# https://www.tutorialspoint.com/python/python_command_line_arguments.htm

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
			
			# Move NMEA-183 sentences whose second element is GGA, GST, VTG, or ZDA into another list, ggaList, gstList, vtgList, and zdaList respectively.
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
			outputfileContents = 'Sentences: \n' \
				+ '\n\nGGA Sentences: \n' + str(ggaList) \
				+ '\n\nGST Sentences: \n' + str(gstList) \
				+ '\n\nVTG Sentences: \n' + str(vtgList) \
				+ '\n\nZDA Sentences: \n' + str(zdaList)
			
			i = 0
			while i < (len(ggaList) - 1):
				thisLine = ggaList[i]
				nextline = ggaList[i+1]
				print('\n\n')
				print('Line: ', i)
				print(thisLine)
				print(nextline)
				NMEA_GGA_Dist(thisLine, nextline)
				i = i+1

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
	print('sepSentence() function started. Whole line is:')
	print(inList)
	print('inList[3:6] is:')	
	print(inList[3:6])

	if inList[3:6] == 'GGA':
		ggaList.append(inList)
	elif inList[3:6] == 'GST':
		gstList.append(inList)
#	elif inList[3:6] == 'VTG':
#		vtgList.append(inList)
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
	Lat1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 2 ), NMEA_Get_Field( NMEA_Line1, 3 ))
	Lat2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 2 ), NMEA_Get_Field( NMEA_Line2, 3 ))
	Lon1 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line1, 4 ), NMEA_Get_Field( NMEA_Line1, 5 ))
	Lon2 = NMEA_LATLON_ToDecemal( NMEA_Get_Field( NMEA_Line2, 4 ), NMEA_Get_Field( NMEA_Line2, 5 ))
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2)

def NMEA_LATLON_ToDecemal(NMEA_Line, coordinateRef):
	# print('Debug: NMEA_LATLON_ToDecemal(): NMEA_Line: ', NMEA_Line)
	# print('Debug: NMEA_LATLON_ToDecemal(): coordinateRef: ', coordinateRef)

	NMEA_Line.replace('\x00', '').strip()
	NMEA_Line.replace('\x00', '')
	coordinate = int(float(NMEA_Line))
	# print('coordinate: ', coordinate)
	decimal = ((coordinate / 100) + ((coordinate - ((coordinate / 100) * 100)) / 60))
	if ((coordinateRef == str('S')) or (coordinateRef == str('W'))):
		decimal = -(abs(decimal))
		# print('Debug: ', coordinateRef, ': NMEA_LATLON_ToDecemal() and decimal: ', decimal)
		return decimal
	else:
		# print('Debug: ', coordinateRef, ': NMEA_LATLON_ToDecemal() and decimal: ', decimal)
		return decimal

def NMEA_Get_Field(NMEA_Line, Field):
	NMEA_Line_List = NMEA_Line.split(',')
	STG = NMEA_Line_List[int(Field)]
	return STG

def GNSS_Distance(Lat1, Lon1, Lat2, Lon2):
	# https://www.studytonight.com/post/trigonometric-function-in-python
	LA1 = MATH_D2R(Lat1)
	LA2 = MATH_D2R(Lat2)
	DLAT = MATH_D2R(Lat2-Lat1)
	DLON = MATH_D2R(Lon2-Lon1)
	A = math.sin(DLAT/2)*math.sin(DLAT/2)+math.cos(LA1)*math.cos(LA2)*math.sin(DLON/2)*math.sin(DLON/2)
	C = 2 * math.atan2(math.sqrt(A) ,math.sqrt(1-A))
	D = (earthRadius * C)
	print('Distance: ', D)
	return D

def MATH_D2R(Degrees):
	PI = math.pi
	return (Degrees*PI/180)

if __name__ == "__main__":
	main(sys.argv[1:])