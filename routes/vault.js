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

/* test endpoint */ 
router.get('/test', async function(req, res, next) {
    params = {
        method: 'get',
        url: (VAULT_API_URL + '/persons/73850804-14d5-11eb-965f-b295f05263ab?dlp=TOKEN'),
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
            // 'accept' : 'application/json, text/plain, */*',
            // 'x-request-id' : req.body.token
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

module.exports = router;
