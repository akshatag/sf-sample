const db = require('./config');
const fs = require('fs')
const sf = require('./skyflow')

const BASE_URL = 'https://sb.area51.vault.skyflowapis.com/'
const VAULT_ID = 'j5ab140014d511eb86221204b52839c4'
const VAULT_API_URL = BASE_URL + 'v1/vaults/' + VAULT_ID

/* data dump of heroku postgresql DB main table */ 
async function downloadHerokuDB() { 
    // results = await db.query('SELECT * FROM sample_pii')
    // fs.writeFileSync('herokuDB.json', JSON.stringify(results.rows))
}

/* add migrated column */
function addMigratedColumn() { 
    // herokudb = JSON.parse(fs.readFileSync('herokuDB.json'))
    // var i = 0; 
    // herokudb.forEach(element => {
    //     element['migrated'] = 0;
    // });
    // fs.writeFileSync('herokudb.json', JSON.stringify(herokudb))
}

async function insertIdentifier(id) {
    params = {
        method: 'post',
        url: (VAULT_API_URL + '/identifiers'),
        headers: { 
            'Content-Type' : 'application/json',
        },
        data: {
            'vaultID' : VAULT_ID,
            'records' : id
        }
    }

    vault = await sf.sendVaultRequest(params)
    // console.log(JSON.stringify(vault.data))
    return vault.data.records[0].skyflow_id
}

async function insertPerson(person) {
    params = {
        method: 'post',
        url: (VAULT_API_URL + '/persons'),
        headers: { 
            'Content-Type' : 'application/json',
        },
        data: {
            'vaultID' : VAULT_ID,
            'records' : person
        }
    }

    vault = await sf.sendVaultRequest(params)
    // console.log(JSON.stringify(vault.data))
    return vault.data.records[0].skyflow_id
}

async function migrateRecord(record) { 
    identifier = [{"fields" : {
        "ssn" : record.ssn
    }}]

    identifier_skyflow_id = await insertIdentifier(identifier)

    person = [{"fields" : { 
       "name" : {
           "first_name" : record.first_name,
           "middle_name" : "",
           "last_name" : record.last_name
       },
       "date_of_birth" : record.birthdate,
       "gender" : record.gender == 'm' ? "MALE" : "FEMALE",
       "addresses" : [{
           "line_1" : record.address,
           "city" : record.city,
           "state" : record.state,
           "zip_code" : record.zip_code
       }],
       "emails" : [{
           "value" : record.email
       }],
       "identifiers_skyflow_id" : identifier_skyflow_id
    }}]

    person_skyflow_id = await insertPerson(person)

    return person_skyflow_id;
}

async function migrateToSkyflow(db) { 
    records = JSON.parse(fs.readFileSync(db))
    
    for(i=0; i < records.length; i++){
        r = records[i]
        if(r.migrated) {
            continue
        } else {
            try {
                skyflow_id = await migrateRecord(r)
                r.migrated = 1
                r.skyflow_id = skyflow_id
                console.log('migrated record, new skyflow_id: ' + skyflow_id)
                fs.writeFileSync(db, JSON.stringify(records))
            }
            catch (error) {
                console.log("Error: " + error)
            }
        }
    }
}

// migrateToSkyflow('herokudb_test.json')
migrateToSkyflow('herokudb.json')