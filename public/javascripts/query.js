
function submitQuery() {        
    $.ajax({
        url: 'https://piidata.encrypt.evervault.com/vault/query',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            $('#results').text(JSON.stringify(data))
        },
        error: function(data) {
            $('#results').text('bad query! try again!')
        },
        data: JSON.stringify({'query' : $('#query').val(), 'pii' : 'Akshat'})
    });
}

function submitToken() { 
    $.ajax({
        url: '/vault/token',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            $('#results').text(JSON.stringify(data))
        },
        error: function(data) {
            $('#results').text('bad query! try again!')
        },
        data: JSON.stringify({'token' : $('#query').val()})
    });
}

function submitPersonId() {
    $.ajax({
        url: '/vault/person/' + $('#query').val(),
        type: 'get',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            $('#results').text(JSON.stringify(data))
        },
        error: function(data) {
            $('#results').text('bad query! try again!')
        }
    });
}