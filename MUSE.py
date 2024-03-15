from dotenv import load_dotenv
import os
import base64
from requests import post, get
import json
import numpy as np
import pandas as pd

load_dotenv()
client_id = os.getenv("CLIENT_ID")
secret_client = os.getenv("CLIENT_SECRET")

def get_token():
    auth_string = client_id + ":" + secret_client
    auth_bytes = auth_string.encode("utf-8")
    auth_base64 = str(base64.b64encode(auth_bytes), "utf-8")


    url = "https://accounts.spotify.com/api/token"
    header = {
        "Authorization" : "Basic " + auth_base64,
        "Content-Type" : "application/x-www-form-urlencoded"
    }

    data = {"grant_type": "client_credentials"}
    result = post(url,headers = header, data =data)

    json_result = json.loads(result.content)
    token = json_result["access_token"]
    return token

def get_auth_header(token):
    return { "Authorization" : "Bearer " + token }

def searchARTISTS(token, artistNAME):
    url = "https://api.spotify.com/v1/search"
    header = get_auth_header(token)
    query = f"?q={artistNAME}&type=artist&limit=5"

    query_url = url + query

    result = get(query_url, headers = header)

    json_result = json.loads(result.content)["artists"]["items"]
    if len(json_result) == 0:
        print("This artist does not exists...Sadly")
        return None
    return json_result[0]

def getSONGS(token, artistID, countryID):
    url = f"https://api.spotify.com/v1/artists/{artistID}/top-tracks?country=" + countryID
    header = get_auth_header(token)
    result = get(url, headers = header)
    json_result = json.loads(result.content)["tracks"]
    return json_result

token = get_token()

userSEARCH = input("Search for an Artist:\n")
countryARR = np.array(["AO", "BW", "BI", "KM", "EG", "VM", "PH","KR", "US", "ES", "CA", "JP", "GB", "AU", "MX", "JM", "PR" ])
np.random.shuffle(countryARR)

result = searchARTISTS(token, userSEARCH)
artistID = result["id"]
songs = getSONGS(token, artistID, countryARR[0])

for idx, song in enumerate(songs):
    print(f"{idx + 1}. {song['name']}")
