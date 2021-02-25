#!/usr/bin/python

import sys, getopt
import os
import fileinput

def main(argv):
	# https://www.tutorialspoint.com/python/python_command_line_arguments.htm
	
	inputfile = ''
	outputfile = ''
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
			try:
				# https://www.guru99.com/reading-and-writing-files-in-python.html
				inputfile = arg
				f = open(inputfile, "r")
				staticInputFileContents = f.read()
				# Debug - after file contents assign
				# print(staticInputFileContents)
				staticLineList = staticInputFileContents.splitlines()
				# Debug - after line split to list
				# print(staticLineList)
				for line in fileinput.input():
	
			except:
				print('Path ' + inputfile + ' does not exist.')
		elif opt in ("-o", "--ofile"):
			outputfile = arg
	print 'Input file is ', inputfile
	print 'Output file is ', outputfile

# Prints elements starting from zero position till 2nd
def talkerId(inString):
	return inString[0:2]

# Prints elements starting from 3rd element
def sentenceType(inString):
	return inString[3:]


def splitty(inputString):
	# https://docs.python.org/3/library/stdtypes.html#str.splitlines
	# for line in fileinput.input():
	#	process(line)

	lineList = inputString.splitlines()
	
	return linesList


if __name__ == "__main__":
	main(sys.argv[1:])