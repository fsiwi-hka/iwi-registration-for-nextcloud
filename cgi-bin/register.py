#! /usr/bin/python3
from parameters import *
import base64
import cgi
import cgitb
import json
import sys
import requests
import hashlib
from register import getBearerToken, callRESTapi

#cgitb.enable(display=0, logdir="/var/log/webauth/")

form = cgi.FieldStorage()


user = form.getvalue('user').lower()
pw = form.getvalue('pw')
displayname = str(form.getvalue('dn')).strip()
email = form.getvalue('email')

def respond(statusCode, reason):
    data = { 'status': statusCode, 'reason': reason }

    print("Content-type: application/json\n")
    print(json.dumps(data))


def insertNewUserNextcloud(user_name, auth, url, header, e_mail, group_names):
    url += "/users"
    return requests.request("POST", url, headers=header, auth=auth,
                            data={'userid': str(user_name), 'email': str(e_mail), 'groups[]': group_names})


def updateDisplayNameNextcloud(user_name, auth, url, header, display_name):
    url += "/users/" + user_name
    return requests.request("PUT", url, headers=header, auth=auth,
                            data={'key': "displayname", 'value': str(display_name)})


def buildbase64auth(user_name, password):
    # convert input name and pw to Basic base64 encoded auth string
    message = user_name + ':' + password
    message_bytes = message.encode('ascii')
    base64_bytes = base64.b64encode(message_bytes)
    return base64_bytes.decode('ascii')

def checkresponseIWIAPI(response):
    if response.status_code != 200:
        respond(response.status_code, "CallToIwiApiFailed")
        sys.exit(response.status_code)


def checkresponseNEXTCLOUD(response):
    if response.status_code != 200:
        respond(response.status_code, "CallToNextCloudApiFailed")
        sys.exit(response.status_code)


def responseIfUserExistsNextcloud(user_name, auth, url, header):
    url += '/users/' + user_name + '?format=json'
    return requests.request("GET", url, headers=header, auth=auth)


# Holt Daten von der IWI REST-API
bearer = getBearerToken(user, pw, IWI_API)
response_iwi = callRESTapi(bearer, IWI_API)
checkresponseIWIAPI(response_iwi)
response_iwi = json.loads(response_iwi.text)

# Die Überlegung war das RZ-Kürzel zu hashen da sonst eventuell Datenschutztechnische Probleme entstehen könnten.
# Die Praktikabilität ist damit aber hin, man könnte die Benutzer nur noch über die E-Mail identifizieren oder müsste händisch das
# RZ-Kürzel hashen um dann die Benutzer zu finden.
# Sollte dieses Thema ein Problem darstellen kann das Hashen mit den folgenden zwei Zeilen umgesetzt werden.
# user = user.encode()
# user = hashlib.sha256(user).hexdigest()


response_nextcloud = responseIfUserExistsNextcloud(user, (NEXTCLOUD_API_USER, NEXTCLOUD_API_PW), NEXTCLOUD_API,
                                                   NEXTCLOUD_API_HEADER)
checkresponseNEXTCLOUD(response_nextcloud)
response_nextcloud = json.loads(response_nextcloud.text)

# Break if user not in IWI or not a student/or maybe not oktavian
if response_iwi['role'] != "ROLE_STUDENT":
    respond(403, "NotAStudent")
    sys.exit(403)

if response_iwi['student']['faculty'] != "IWI":
    respond(412, "NotFromIwiFaculty")
    sys.exit(412)

if response_nextcloud['ocs']['meta']['statuscode'] == 100:
    respond(413, "AlreadyRegistered")
    sys.exit(413)


# Benutzer einfügen
insert_nextcloud = insertNewUserNextcloud(user, (NEXTCLOUD_API_USER, NEXTCLOUD_API_PW), NEXTCLOUD_API,
                                          NEXTCLOUD_API_HEADER,
                                          email, NEXTCLOUD_STD_GROUPS)
checkresponseNEXTCLOUD(insert_nextcloud)

# Anzeigename des Benutzers setzten
update_DisplayName_Nextcloud = updateDisplayNameNextcloud(user, (NEXTCLOUD_API_USER, NEXTCLOUD_API_PW), NEXTCLOUD_API,
                                                          NEXTCLOUD_API_HEADER, displayname)
checkresponseNEXTCLOUD(update_DisplayName_Nextcloud)

respond(200, "Success")
sys.exit(0)
