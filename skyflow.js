const jwt = require('jsonwebtoken')
const axios = require('axios')
const fs = require('fs')
const utf8 = require('utf8')

const CREDS_FILE = './credentials.json'
var BEARER_TOKEN = null

function getSignedJWT(credsFile) {
    let credsRaw = fs.readFileSync(credsFile)
    let creds = JSON.parse(credsRaw)

    claims = {
        'iss' : creds['clientID'],
        'key' : creds['keyID'],
        'aud' : creds['tokenURI'],
        'exp' : Math.floor(Date.now()/1000) + 60,
        'sub' : creds['clientID']
    }

    privateKey = creds['privateKey'].toString('utf8')

    signedJWT = utf8.encode(jwt.sign(claims, privateKey, { 'algorithm' : 'RS256' }))
    return [signedJWT, creds]
}

async function refreshBearerToken() {
    [signedJWT, creds] = getSignedJWT(CREDS_FILE)

    body = {
        'grant_type' : 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' : signedJWT
    }

    tokenURI = creds['tokenURI']
    
    // console.log(signedJWT) 
    // console.log(tokenURI)
    try{ 
        res = await axios({
            method: 'post',
            url: tokenURI,
            headers: { 'Content-Type' : 'application/json' },
            data: body
        })

        BEARER_TOKEN = res.data.accessToken
        return
    } catch (error) {
        console.log("ERROR: " + error)
    }
}

async function getBearerToken(forceRefresh = 0) {
    if (BEARER_TOKEN == null || forceRefresh) {
        await refreshBearerToken()
    }

    return BEARER_TOKEN
}

async function sendVaultRequest(params) { 
    authToken = await getBearerToken()
    params.headers['Authorization'] = 'Bearer ' + authToken

    try {
        res = await axios(params)
        return res 
    } catch (error) { 
        if (error.response) {
            if(error.response.status == 403) {
                await refreshBearerToken(forceRefresh = 1)
                return sendVaultRequest(params)
            }
            console.log('Server responded with error: ' + error.response.status)
        } else if (error.request) {
            console.log('Error with request: ' + error.request)
            throw error
        } else {
            console.log('Unknown error: ' + error)
            throw error
        }
    }
}


module.exports = {
    getBearerToken : getBearerToken,
    sendVaultRequest : sendVaultRequest
}