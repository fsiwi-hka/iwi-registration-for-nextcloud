import requests
import json

def getBearerToken(user, password, link):
    data = {'login': user, 'password': password}
    headers = {'accept': 'application/json', 'Content-Type': 'application/json'}
    response = requests.request("POST", link + '/credential/authentication', json=data, headers=headers)
    return json.loads(response.text)['accessToken']

def callRESTapi(bearer, link):
    # Make request to get infos
    headers = {'Authorization': 'Bearer ' + bearer}
    return requests.request("GET", link + '/credential/v2/info', headers=headers)
