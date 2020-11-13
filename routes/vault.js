var express = require('express');
var router = express.Router();
const sf = require('../skyflow')

const BASE_URL = 'https://sb.area51.vault.skyflowapis.com/'
const VAULT_ID = 'j5ab140014d511eb86221204b52839c4'
const VAULT_API_URL = BASE_URL + 'v1/vaults/' + VAULT_ID

/* get all data from PERSONS table */
router.get('/people', async function(req, res, next) {
    params = {
        method: 'post',
        url: (VAULT_API_URL + '/query'),
        headers: { 
            'Content-Type' : 'application/json',
        },
        data: {
            query: "select * from persons;"
        }
    }

    vault = await sf.sendVaultRequest(params)
    res.send(JSON.stringify(vault.data))
});

/* Get token data for PERSON skyflow_id */ 
router.get('/person/:id', async function(req, res, next) {
    console.log('sending req for: ' + req.params.id)
    
    params = {
        method: 'get',
        url: (VAULT_API_URL + '/persons/' + req.params.id + '?dlp=TOKEN'),
        headers: { 
            'Content-Type' : 'application/json',
        }
    }

    vault = await sf.sendVaultRequest(params)
    res.send(JSON.stringify(vault.data))
});


router.get('/query', function(req, res, next) {
    res.render('query')
})

/* submit custom QUERY */ 
router.post('/query', async function(req, res, next) {    
    console.log('query request received: ' + req.body.query)
    params = {
        method: 'post',
        url: (VAULT_API_URL + '/query'),
        headers: {
            'Content-Type' : 'application/json'
        },
        data: {
            vaultID: VAULT_ID,
            query: req.body.query
        }
    }
    try { 
        vault = await sf.sendVaultRequest(params)
        res.send(JSON.stringify(vault.data))
    } catch (error) {
        res.status(500).send()
    }
})

/* submit TOKEN */ 
router.post('/token', async function(req, res, next) {    
    console.log('token request received: ' + req.body.token)
    params = {
        method: 'get',
        url: (VAULT_API_URL + '/tokens/' + req.body.token + '?dlp=PLAIN_TEXT'),
        headers: {
            'Content-Type' : 'application/json',
        }
    }
    try { 
        vault = await sf.sendVaultRequest(params)
        res.send(JSON.stringify(vault.data))
    } catch (error) {
        console.log(error)
        res.status(500).send()
    }
})


/*
require('axios')

params = {
    method: 'post',
    url: (VAULT_API_URL + '/persons/' + PERSONS_ID + '?dlp=TOKEN'),
    headers: {
        'Content-Type' : 'application/json',
        'Authorization' : 'Bearer: ' + AUTH_TOKEN
    },
}
try { 
    res = await axios.get(params)
} catch (error) { 
    if (error.status == 401) {
        ...
    }
}
...
*/


/*
require('skyflow')

CIVault = skyflow.CustomerIdentityVault(WORKSPACE_URL, 
    VAULT_ID, FILEPATH_TO_CREDS.JSON)

res1 = await CIVault.getPerson(PERSON_ID)
*/



module.exports = router;
