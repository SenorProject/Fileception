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
import secrets

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

    choice = input("Would you like to use a keyfile to encrypt [Y/n]? ")
    if choice.lower() == 'y':
        key_file_path = input("Enter the path to the keyfile: ")
        key_file = open(key_file_path, 'rb')
        key = key_file.read()
    else:
        key = sym_key

    with open(file, "rb") as stream:
        data = stream.read()

    print ("Encrypting file", file, "\nWriting output to encrypted.pdf\n")

    #retrieve and remove IV
    iv = data[(-cphr.block_size):]
    data = data[:(-cphr.block_size)]

    cbc_e = cphr.new(key, cphr.MODE_CBC, iv)

    enc = cbc_e.encrypt(data)

    i = (enc.find(cryutil.b(pdfmagic), cphr.block_size))

    # insert dummy chunk ending and IV
    enc = enc[:i] + cryutil.b(chunk_end) + enc[i:] + iv

    with open("encrypted.pdf", "wb") as o:
        o.write(enc)

# decrypts result file
def dec(cfile):

    import_choice = input("Would you like to import a key [Y/n]? ")
    if import_choice.lower() == "y":
        key_file_path = input("Enter the path to the keyfile: ")
        key_file = open(key_file_path,"rb")
        key = key_file.read()
    else:
        key = sym_key

    with open(cfile, "rb") as stream:
        data = stream.read()

    print ("Decrypting file", cfile, "\nWriting output to file\n")

    # remove dummy chunk ending
    i = (data.find(cryutil.b(pdfmagic), cphr.block_size))
    dec = data[:(i - CHUNK_END_SIZE)] + data[i:]

    # retrieve and remove IV
    iv = dec[(-cphr.block_size):]
    dec = dec[:(-cphr.block_size)]

    cbc_d = cphr.new(key, cphr.MODE_CBC, iv)
    dec = cbc_d.decrypt(dec)
    
    header = str(dec[:14])
    #print(header)
    magics = {'PDF', 'PNG', 'JFIF', 'MZ', 'PK'}
    fileType = ''
    for t in magics:
        if t in header:
            fileType = t.lower()
            break
    
    #print(fileType)  
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
        print("Filetype not recognized. You may be using the wrong key, or are attempting to convert an unsupported file.")
        sys.exit(0)

# pads data to a multiple of cipher block size
def pad(fdata):
    return fdata + ((cphr.block_size - len(fdata) % cphr.block_size) * chr(cphr.block_size - len(fdata) % cphr.block_size)).encode()

#----------Begin main script----------

if(checkFlag(sys.argv)):
    print ("Successfully converted file!")

elif(checkArgs(sys.argv)):
    infile1, infile2, outfile = sys.argv[1:4]

    key_choice = input("Would you like to generate a unique key? (Note: if a unique key is used, it is required for decryption)\n[Y/n]:")
    if key_choice.lower() == 'y':
        key = secrets.token_bytes(32) # 32 byte AES key
        key_file = open("key.txt", "wb")
        key_file.write(key)
        print(key)
    else:
        key = sym_key

    with open(infile1, "rb") as data:
        infile1 = pad(data.read())

    with open(infile2, "rb") as data:
        infile2 = pad(data.read())

    ptxt = infile1[:cphr.block_size]

    ecb = cphr.new(key, cphr.MODE_ECB)
    c0 = ecb.decrypt(c0.encode())

    initV = ""

    for i in range(cphr.block_size):
        # x = ord(c0[i]) ^ ord(ptxt[i])
        x = c0[i] ^ ptxt[i]
        initV += chr(x)

    cbc_init = cphr.new(key, cphr.MODE_CBC, cryutil.tobytes(initV))

    combo = cbc_init.encrypt(infile1)

    combo = combo + cryutil.tobytes(chunk_end) + infile2 + cryutil.tobytes(initV)

    with open(outfile, "wb") as o:
        o.write(combo)

    print ("\nSuccessfully wrote combined file", outfile)

print("\nExiting...\n")

#-----------------End-----------------