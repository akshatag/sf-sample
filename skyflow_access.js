const jwt = require('jsonwebtoken')
const axios = require('axios')
const fs = require('fs')
const utf8 = require('utf8')

const CREDSFILE = './credentials.json'

function getSignedJWT(credsFile) {
    let credsRaw = fs.readFileSync(credsFile)
    let creds = JSON.parse(credsRaw)

    claims = {
        'iss' : creds['clientID'],
        'key' : creds['keyID'],
        'aud' : creds['tokenURI'],
        'exp' : Date.now() + 3600,
        'sub' : creds['clientID']
    }

    signedJWT = utf8.encode(jwt.sign(claims, creds['privateKey'], { 'algorithm' : 'RS256' }))
    return [signedJWT, creds]
}

function getBearerToken() {
    [signedJWT, creds] = getSignedJWT(CREDSFILE)

    body = {
        'grant_type' : 'urn:ietf:params:oauth:grant-type:jwt-bearer',
        'assertion' : signedJWT
    }

    tokenURI = creds['tokenURI']
    
    console.log(signedJWT) 
    console.log(tokenURI)

    axios.post(tokenURI, body)
        .then(response => console.log(response))
        .catch(err => console.log(err.response.status))
}

getBearerToken()

// module.exports = {
//     getAPIAccessToken : getBearerToken
// }