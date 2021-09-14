# importing all the required modules
import PyPDF2
import os

# Directory of main file
dir = os.path.dirname(__file__)

# creating an object 
file = open(dir + '\GF - Alien Hives v2.13.pdf', 'rb')

# creating a pdf reader object
fileReader = PyPDF2.PdfFileReader(file)

for page in fileReader.pages:
    print(page)
