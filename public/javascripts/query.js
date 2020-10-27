
function submitQuery() {        
    $.ajax({
        url: '/vault/query',
        type: 'post',
        dataType: 'json',
        contentType: 'application/json',
        success: function(data) {
            $('#results').text(JSON.stringify(data))
        },
        error: function(data) {
            $('#results').text('bad query! try again!')
        },
        data: JSON.stringify({'query' : $('#query').val()})
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