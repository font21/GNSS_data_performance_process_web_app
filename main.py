#!/usr/bin/python

import sys, getopt
import os
import fileinput
import math

# Global Variables
global inputfile
global outputfile
global ggaDict
global gstDict
global vtgDict
global helpText
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
			try:
				# https://www.guru99.com/reading-and-writing-files-in-python.html	
				inFile = open(inputfile, "r")
				staticInputFileContents = inFile.read()
				# Debug - after file contents assign
				# print(staticInputFileContents)
				staticLineList = staticInputFileContents.splitlines()
				# Debug - after line split to list
				# print(staticLineList)
				i = 0
				while i < len(staticLineList):
					thisLine = staticLineList[i]
					# print(thisLine)
					# sepSentence(staticLineList[i])

					if thisLine[3:6] == 'GGA':
						ggaList.append(thisLine)
					elif thisLine[3:6] == 'GST':
						gstList.append(thisLine)
					elif thisLine[3:6] == 'VTG':
						vtgList.append(thisLine)
					elif thisLine[3:6] == 'ZDA':
						zdaList.append(thisLine)
					i = i + 1
					
				# print(ggaList)
				# print(gstList)
				# print(vtgList)
				# print(zdaList)

				# File In clean up
				print('File In section complete.')
				inFile.close()
	
			except:
				print('Path ' + inputfile + ' does not exist.')

		elif opt in ("-o", "--ofile"):
			outputfile = arg
			outputfileContents = 'GGA Sentences: \n' + str(ggaList) + '\n\nGST Sentences: \n' + str(gstList) + '\n\nVTG Sentences: \n' + str(vtgList) + '\n\nZDA Sentences: \n' + str(vtgList)

			# print(outputfileContents)
			try:
				wOut = open(outputfile, "w")
				wOut.write(outputfileContents)
			
				# File Out clean up
				print('File Out section complete.')
				wOut.close()

			except:
				print('Path ' + outputfile + ' does not exist.')

	print('Input file is ',inputfile)
	print('Output file is ',outputfile)

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
	elif inList[3:6] == 'VTG':
		vtgList.append(inList)
	return

def NMEA_Get_Fields(NMEA_Line, Field):
	NMEA_Line_List = NMEA_Line.split(',')
	STG = NMEA_Line_List[int(Field)]
	return STG

def splitty(inputString):
	# https://docs.python.org/3/library/stdtypes.html#str.splitlines
	# for line in fileinput.input():
	#	process(line)
	lineList = inputString.splitlines()
	return linesList

def NMEA_LATLON_ToDecimal(NMEA_Line, coordinateRef):
	coordinate = NMEA_Line[coordinateRef]
	decimal = ((coordinate / 100) + ((coordinate - ((coordinate / 100) * 100)) / 60))
	if ((coordinateRef == 'S') or (coordinateRef == 'W')):
		decimal = -(abs(decimal))
		return decimal
	else:
		return decimal

def NMEA_GGA_Dist(NMEA_Line1, NMEA_Line2):
	Lat1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,2),NMEA_Get_Field(NMEA_Line1,3))
	Lat2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,2),NMEA_Get_Field(NMEA_Line2,3))
	Lon1 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line1,4),NMEA_Get_Field(NMEA_Line1,5))
	Lon2 = NMEA_LATLON_ToDecemal(NMEA_Get_Field(NMEA_Line2,4),NMEA_Get_Field(NMEA_Line2,5))
	return GNSS_Distance(Lat1,Lon1,Lat2,Lon2)

def GNSS_Distance(Lat1, Lon1, Lat2, Lon2):
	# https://www.studytonight.com/post/trigonometric-function-in-python
	LA1 = MATH_D2R(Lat1)
	LA2 = MATH_D2R(Lat2)
	DLAT = MATH_D2R(Lat2-Lat1)
	DLON = MATH_D2R(Lon2-Lon1)
	A = sin(DLAT/2)*sin(DLAT/2)+cos(LA1)*cos(LA2)*sin(DLON/2)*sin(DLON/2)
	C = 2 * atan(math.sqrt(A) ,math.sqrt(1-A))
	D = (earthRadius * C)
	return D

def MATH_D2R(Degrees):
	return (Degrees*PI/180)

if __name__ == "__main__":
	main(sys.argv[1:])