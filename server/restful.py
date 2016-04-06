from flask import Flask, request
from flask_restful import Resource, Api, reqparse
from json import dumps
import account

app = Flask(__name__)
api = Api(app)

#Parser that parses incoming messages.
userParser = reqparse.RequestParser()
userParser.add_argument('username', help='The username the user wants to register.')
userParser.add_argument('password', help='The password the user wants to register.')
userParser.add_argument('token', help='User token to be verified by the system')

# The Login endpoint
class Login(Resource):
    def post(self):

        #Parse the message.
        args = userParser.parse_args()

        #Separate the message into variables.
        username = args['username']
        password = args['password']

        bytePassword = password.encode('utf-8')

        return account.login(username, bytePassword)

# The Create User endpoint.
class CreateAccount(Resource):
    def post(self):

        #Parse the message.
        args = userParser.parse_args()

        #Separate the message into variables.
        username = args['username']
        password = args['password']

        bytePassword = password.encode('utf-8')

        return account.createAccount(username, bytePassword)

api.add_resource(Login, '/login')
api.add_resource(CreateAccount, '/create-account')

if __name__ == '__main__':
    app.run()
