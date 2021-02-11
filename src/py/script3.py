#!/usr/bin/python
#
# Fileception: Angecryption CLI tool
#
# Written for Python 3
#
# Pedro Sicilia, Mustafa Mohamed, Jacob Frank, Kevin Thomas, Omar Nasir
# CIS4914 Senior Project
#
#
# Usage: ./script3 [hidden.pdf] [cover.pdf] [combined.pdf]
#       -Output file combined.pdf will contain encrypted data from hidden.pdf
#               but will display as cover.pdf, can be decrypted to show hidden.pdf
#
# Encrypt: ./script3 -e [combined.pdf]
#       -intakes user-specified file and encrypts to reveal the other pdf
#
# Decrypt: ./script3 -d [combined.pdf]
#       -intakes user-specified file and decrypts to reveal the other pdf
#

import sys
from Crypto.Cipher import AES
import Crypto.Util.py3compat as cryutil

c0 =  "%PDF-obj\nstream\n"
chunk_end = "\nendstream\nendobj\n"
CHUNK_END_SIZE = len(chunk_end)
cphr = AES
pdfmagic = "%PDF-"
sym_key = b'ABCDEFGHIJKLMNOP'
EOF = "%%EOF"
EOF_SIZE = len(EOF)

# takes argument vector as parameter
def checkArgs(v):
    if(len(v) == 4):
        return True
    elif(len(v) > 4):
        print ("Error: excess arguments\n")
    elif(len(v) < 3):
        print ("Error: missing arguments\n")

    return False

# takes argument vector as parameter
def checkFlag(v):
    if(len(v) > 1 and v[1][0] != '-'):
        return False
    else:
        if(len(v) != 3):
            print ("Error: number of arguments\n")
            return False
        else:
            if(v[1] == "-e"):
                enc(v[2])
            elif(v[1] == "-d"):
                dec(v[2])
            else:
                print ("Error: unknown flag\n")
                return False

        return True

# encrypts result file
def enc(file):
    with open(file, "rb") as input:
        data = input.read()

    print ("Encrypting file", file, "\nWriting output to encrypted.pdf\n")

    #retrieve and remove IV
    iv = data[(-cphr.block_size):]
    data = data[:(-cphr.block_size)]

    cbc_e = cphr.new(sym_key, cphr.MODE_CBC, iv)

    enc = cbc_e.encrypt(data)

    i = (enc.find(cryutil.b(pdfmagic), cphr.block_size))

    # insert dummy chunk ending and IV
    enc = enc[:i] + cryutil.b(chunk_end) + enc[i:] + iv

    with open("encrypted.pdf", "wb") as o:
        o.write(enc)

# decrypts result file
def dec(cfile):
    with open(cfile, "rb") as input:
        data = input.read()

    print ("Decrypting file", cfile, "\nWriting output to file\n")

    # remove dummy chunk ending
    i = (data.find(cryutil.b(pdfmagic), cphr.block_size))
    dec = data[:(i - CHUNK_END_SIZE)] + data[i:]

    # retrieve and remove IV
    iv = dec[(-cphr.block_size):]
    dec = dec[:(-cphr.block_size)]

    cbc_d = cphr.new(sym_key, cphr.MODE_CBC, iv)
    dec = cbc_d.decrypt(dec)
    
    header = str(dec[:14])
    print(header)
    magics = {'PDF', 'PNG', 'JFIF', 'MZ', 'PK'}
    fileType = ''
    for t in magics:
        if t in header:
            fileType = t.lower()
            break
    
    print(fileType)  
    if fileType == 'jfif':
        fileType = 'jpg'
    elif fileType == 'mz':
        fileType = 'exe'
    elif fileType == 'pk':
        fileType = 'zip'
    
    if fileType != '':
        dec += iv
        fileName = "decrypted." + fileType
        with open(fileName, "wb") as o:
            o.write(dec)

        print("File Saved as:",fileName)
    else:
        print("Filetype not recognized")

# pads data to a multiple of cipher block size
def pad(fdata):
    return fdata + ((cphr.block_size - len(fdata) % cphr.block_size) * chr(cphr.block_size - len(fdata) % cphr.block_size)).encode()

#----------Begin main script----------

if(checkFlag(sys.argv)):
    print ("Successfully converted file!")

elif(checkArgs(sys.argv)):
    infile1, infile2, outfile = sys.argv[1:4]

    with open(infile1, "rb") as input:
        infile1 = pad(input.read())

    with open(infile2, "rb") as input:
        infile2 = pad(input.read())

    ptxt = infile1[:cphr.block_size]

    ecb = cphr.new(sym_key, cphr.MODE_ECB)
    c0 = ecb.decrypt(c0.encode())

    initV = ""

    for i in range(cphr.block_size):
        # x = ord(c0[i]) ^ ord(ptxt[i])
        x = c0[i] ^ ptxt[i]
        initV += chr(x)

    cbc_init = cphr.new(sym_key, cphr.MODE_CBC, cryutil.tobytes(initV))

    combo = cbc_init.encrypt(infile1)

    combo = combo + cryutil.tobytes(chunk_end) + infile2 + cryutil.tobytes(initV)

    with open(outfile, "wb") as o:
        o.write(combo)

    print ("\nSuccessfully wrote combined file", outfile)

print("\nExiting...\n")

#-----------------End-----------------
