#!/usr/bin/python

import sys, getopt
import os
import fileinput

# Global Variables
global inputfile
global outputfile
global ggaDict
global gstDict
global vtgDict


def main(argv):
	# https://www.tutorialspoint.com/python/python_command_line_arguments.htm

	inputfile = ''
	outputfile = ''

	ggaDict = {}
	gstDict = {}
	vtgDict = {}

	staticLineList = []
	ggaList = []
	gstList = []
	vtgList = []

	try:
		opts, args = getopt.getopt(argv,"hi:o:",["ifile=","ofile="])
	except getopt.GetoptError:
		print 'test.py -i <inputfile> -o <outputfile>'
		sys.exit(2)
	for opt, arg in opts:
		if opt == '-h':
			print 'test.py -i <inputfile> -o <outputfile>'
			sys.exit()
		elif opt in ("-i", "--ifile"):
			inputfile = arg
			#try:
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
				i = i + 1
				
			# print(ggaList)
			# print(gstList)
			# print(vtgList)
			# File In clean up
			print('File In section complete.')
			inFile.close()
	
			#except:
			#	print('Path ' + inputfile + ' does not exist.')

		elif opt in ("-o", "--ofile"):
			outputfile = arg
			outputfileContents = 'GGA Sentences: \n' + str(ggaList) + '\n\nGST Sentences: \n' + str(gstList) + '\n\nVTG Sentences: \n' + str(vtgList)
			print(outputfileContents)
			#try:
			wOut = open(outputfile, "w")
			# wOut.write("Hello World")
			wOut.write(outputfileContents)
		
			# File Out clean up
			print('File Out section complete.')
			wOut.close()

			#except:
			#	print('Path ' + outputfile + ' does not exist.')

	print 'Input file is',inputfile
	print 'Output file is',outputfile

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


def splitty(inputString):
	# https://docs.python.org/3/library/stdtypes.html#str.splitlines
	# for line in fileinput.input():
	#	process(line)

	lineList = inputString.splitlines()
	
	return linesList


if __name__ == "__main__":
	main(sys.argv[1:])