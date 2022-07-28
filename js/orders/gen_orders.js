function showform_order(dowhat) {
    /*
    * four DIVS: browse, insert, update, delete
    * this function sets one visible the others not
    */
    if (dowhat == 'insert_order'){
        document.getElementById('browse_order').style.display = 'none';
        document.getElementById('insert_order').style.display = 'block';
        document.getElementById('update_order').style.display = 'none';
        document.getElementById('delete_order').style.display = 'none';
    }
    else if (dowhat == 'update_order'){
        document.getElementById('browse_order').style.display = 'none';
        document.getElementById('insert_order').style.display = 'none';
        document.getElementById('update_order').style.display = 'block';
        document.getElementById('delete_order').style.display = 'none';
    }
    else if (dowhat == 'delete_order'){
        document.getElementById('browse_order').style.display = 'none';
        document.getElementById('insert_order').style.display = 'none';
        document.getElementById('update_order').style.display = 'none';
        document.getElementById('delete_order').style.display = 'block';
    }
    else if (dowhat == 'all_order'){
        document.getElementById('browse_order').style.display = 'block';
        document.getElementById('insert_order').style.display = 'block';
        document.getElementById('update_order').style.display = 'block';
        document.getElementById('delete_order').style.display = 'block';
    }
    else { //by default display browse
        document.getElementById('browse_order').style.display = 'block';
        document.getElementById('insert_order').style.display = 'none';
        document.getElementById('update_order').style.display = 'none';
        document.getElementById('delete_order').style.display = 'none';
    }
}

function newOrder() { showform_order('insert_order'); }
function updateOrder(oid) { showform_order('update_order'); }
function deleteOrder(oid) { showform_order ('delete_order'); }
function browseOrder() { showform_order ('browse_order'); }
function showAll_order() { showform_order ('all_order'); }