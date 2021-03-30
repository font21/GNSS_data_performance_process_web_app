#!/usr/bin/python

import fileinput
import math
import os
from progressbar import Bar, BouncingBar, ETA, AdaptiveETA, Percentage, ProgressBar
import sys, getopt
import time


# Global Variables
theBigDlist = [] # The main/whole Distance List
step9HundoDList = [] # The 900 Distance list that will be cleared every 900 turns of step9HundoDList


# Functions
def main(argv):
	
	global helpText
	global inputfile # Holds the path to the input file that will eventually be split into staticInputFileContents string.
	global step9HundoDList # The 900 Distance list that will be cleared every 900 turns of step9HundoDList
	global theBigD # Variable to hold the largest Distance (the largest vaiable in the theBigDlist list).
	global theBig9D # Variable to hold the largest 900Distance in the 900 Distance list (step9HundoDList)
	global outputfile # Holds the path to the output file that will eventually be written to and spit out.
	global outputfileContents
	global outputStr

	inputfile = ''
	outputfile = ''
	helpText = 'static.py -i <inputfile> -o <outputfile>'
	outputfileContents = ''

	staticLineList = [] # Holds all the lines after they have been split from the staticInputFileContents string pulled from the input file.
	ggaList = [] # Holds only the GGA sentences.
	gstList = [] # Holds only the GST sentences.
	vtgList = [] # Holds only the VTG sentences.
	zdaList = [] # Holds only the ZDA sentences.

	# The beginning of the file manipulation
	try:
		# Get arguments passed from the commandline
		opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])

	except getopt.GetoptError:
		# If there are no expected/matching command line arguments, fail and print instructions/help
		print(helpText)
		sys.exit(2)

	for opt, arg in opts:
		# This requests to print instructions/help
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
			## Create gstList
			gstList = [i for i in staticLineList if i[3:6] == 'GST']
			## Create vtgList
			vtgList = [i for i in staticLineList if i[3:6] == 'VTG']

			## Create zdaList
			zdaList = [i for i in staticLineList if i[3:6] == 'ZDA']
			# File In clean up
			print('File In section complete.')
			inFile.close()
	
		elif opt in ("-o", "--ofile"):
			outputfile = arg
			outputfileContents = ''
			stepPrime = 0

			# Progress bar's driver code
			widgets = [Percentage(),
						' ', Bar(),
						' ', ETA(),
						' ', AdaptiveETA()]
			pbar = ProgressBar(widgets=widgets, maxval=len(ggaList))
			pbar.start()

			# Header Line (Top Line in file)
			outputStr = 'True Latitute,True Longitude,Max Distance (following 900 Messages),Quality,Number of sats,HDOP,Sigma Lat,Sigma Lon' \
					+ '\n'

			# Once the variable outputStr is populated correctly, concatenate itself with outputfileContents
			outputfileContents += outputStr

			# Begin main loop (with ggaList) using stepPrime as an iterator
			while stepPrime < (len(ggaList) - 900):

				# Progress bar's advance code
				pbar.update(stepPrime + 1)

				thisLine = ggaList[stepPrime]

				# Make step9Hundo and stepCompar global within the function so that they survive being passed.
				global step9Hundo
				step9Hundo = 1

				# The variable stepCompar assists the iterator (stepCompar) by pointing to the correct sentence/line to compare to.
				global stepCompar

				# stepCompar is calculated by adding stepPrime (the main iterator) to the step9Hundo (the nested iterator)
				stepCompar = stepPrime + step9Hundo

				# Zero out the Distance variable before commencing the nested loop
				Distance = 0.0

				# GGA Field 6 (quality Indicator)
				qIndicator = NMEA_Get_Field( thisLine, 6 )

				# GGA Field 7 (Number of sats)
				numoSats = NMEA_Get_Field( thisLine, 7 )

				# GGA Field 8 (HDOP)
				HDOP = NMEA_Get_Field( thisLine, 8 )

				# GST Field 6 (sigma Lat)
				GSTSigmaLat = NMEA_Get_Field( gstList[stepPrime], 6 )

				# GST Field 7 (sigma Lon)
				GSTSigmaLon = NMEA_Get_Field( gstList[stepPrime], 7 )

				# Begin nested loop (for 900 lines) using step9Hundo as an iterator
				while (step9Hundo < 900):
					nextline = ggaList[stepCompar]
					Distance2 = NMEA_GGA_Dist(thisLine, nextline)
					if (Distance < Distance2):
						Distance = Distance2

					step9Hundo = step9Hundo + 1
					stepCompar = stepCompar + 1
					# Exit nested loop (step9Hundo for 900 lines)

				outputStr = str(Lat1) + ',' \
					+ str(Lon1) + ',' \
					+ str(Distance) + ',' \
					+ str(qIndicator) + ',' \
					+ str(numoSats) + ',' \
					+ str(HDOP) + ',' \
					+ str(GSTSigmaLat) + ',' \
					+ str(GSTSigmaLon) \
					+ '\n'

				outputfileContents += outputStr

				stepPrime = int(stepPrime + 1)
				# Exit stepPrime (main loop)

			# Progress bar's finish code (Make it 100%)
			pbar.finish()

			# Assign the contents of outputfileContents to outputfile
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
	return disty


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

	return D


def MATH_D2R(Degrees):
	PI = math.pi
	return (Degrees*PI/180)


if __name__ == "__main__":
	main(sys.argv[1:])