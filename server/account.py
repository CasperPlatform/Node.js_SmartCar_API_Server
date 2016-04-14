import database
import string
import hashlib
import os
import verification
import datetime

allowedCharactersUsername = set(string.ascii_letters + string.digits + ' ')

def login(username, password):

    conn = database.connect()
    c = conn.cursor()
    hash = hashlib.sha256()

    c.execute('select id, password, salt from users where upper(username)=upper(?)', (username, ))

    row = c.fetchone()
    if row is not None:
        userId = row[0]
        fetchedPassword = row[1]
        salt = row[2]
    else:
        return {'message': 'Wrong username or password!'}, 400

    hash.update(salt + password)

    hashedPassword = hash.digest()

    difference = len(hashedPassword) ^ len(fetchedPassword)

    for i in range(0, min([len(hashedPassword), len(fetchedPassword)])-1):
        difference |= (ord(hashedPassword[i]) ^ ord(fetchedPassword[i]))

    if difference == 0:

        token = verification.createToken(salt)
        token = token[:-48]
        print token

        c.execute('delete from tokens where userId=?', (userId, ))
        print datetime.datetime.now() + datetime.timedelta(minutes = 15)
        c.execute('insert into tokens values (?, ?, ?)', (userId, token, datetime.datetime.now() + datetime.timedelta(minutes = 15)))

        conn.commit()
        conn.close()
        return {'token': token}, 200
    else:
        return {'message': 'Wrong username or password!'}, 400

def createAccount(username, password):

    conn = database.connect()
    c = conn.cursor()
    hash = hashlib.sha256()

    #Start checking the input.

    # check length of username.
    if len(username) < 4 or len(username) > 15:
        return {'message': 'Username has to be between 4 and 15 characters.'}, 400

    if not set(username) <= allowedCharactersUsername:
        return {'message': 'Username can only consist of A-z, ' ' and 0-9'}, 400

    c.execute('select username from users where upper(username)=upper(?)', (username, ))

    row = c.fetchone()

    if row is not None:
        return {'message': 'Username allready exists.'}, 409

    #Check the password length.
    if len(password) < 6 or len(password) > 20:
        return {'message': 'Password has to be between 6 and 20 characters.'}, 400

    salt = os.urandom(32)
    hash.update(salt + password)

    hashedPassword = hash.digest()

    c.execute("insert into users (username, password, salt) values (?, ?, ?)", (username, buffer(hashedPassword), buffer(salt)))

    conn.commit()
    conn.close()

    return {'message' : 'Account created succesfully!'}, 201
def removeAccount(username, password, token):
    return None

def getToken(username):
    conn = database.connect()
    c = conn.cursor()

    c.execute("select userId, token, expiration from tokens, users where users.id=tokens.userId and upper(username)=upper(?)", (username, ))

    row = c.fetchone()

    if row is not None:
        now = datetime.datetime.now()
        print now > row[2]

        return {'userId': row[0], 'token': row[1], 'expiration':str(row[2])}, 200
    else:
        return {'message' : 'Something went wrong'}, 400
