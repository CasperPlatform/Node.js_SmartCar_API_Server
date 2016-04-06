import hashlib
import os

def createToken(userSalt):
    print 'in createToken'
    hash = hashlib.sha256()
    salt = os.urandom(32)
    hash.update(salt)
    hash.update(userSalt)

    return hash.hexdigest()
