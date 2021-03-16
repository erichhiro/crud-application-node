


$("#add_user").submit(function (event) {
  alert("Data Inserted Successfully!");
})

$("#update_user").submit(function (event) {
  event.preventDefault();

  var unindexed_array = $(this).serializeArray();
  var data = {}
  
  $.map(unindexed_array, function(n,i){
    data[n['name']] = n['value']
  })

  console.log(data);

  var request = {
    "url": `http://localhost:3000/api/users/${data.id}`,
    "method": "PUT",
    "data": data
  }
  
  $.ajax(request).done(function(response){
    alert("Data Updated Successfully!");
  })

})

if(window.location.pathname == "/"){
  $ondelete = $(".table tbody td a.delete");
  $ondelete.click(function(){
    var id = $(this).attr("data-id")

    var request = {
      "url": `http://localhost:3000/api/users/${id}`,
      "method": "DELETE",
    }

    if(confirm("Do you really want to delete this record?")){
      $.ajax(request).done(function(response){
        alert("Data Deleted Successfully!");
        location.reload()
      })
    }

  })
}

/* table sorting */

$('table.table-sortable th.sort_item').on('click', function(e) {
  sortTableByColumn(this)
})

function sortTableByColumn(tableHeader) {
  // extract all the relevant details
  let table = tableHeader.closest('table')
  let index = tableHeader.cellIndex
  let sortType = tableHeader.dataset.sortType
  let sortDirection = tableHeader.dataset.sortDir || 'asc' // default sort to ascending

  // sort the table rows
  let items = Array.prototype.slice.call(table.rows);
  let sortFunction = getSortFunction(sortType, index, sortDirection)
  let sorted = items.sort(sortFunction)

  // remove and re-add rows to table
  for (let row of sorted) {
    let parent = row.parentNode
    let detatchedItem = parent.removeChild(row)
    parent.appendChild(row)
  }

  // reset heading values and styles
  for (let header of tableHeader.parentNode.children) {
    header.classList.remove('currently-sorted')
    delete header.dataset.sortDir
  }

  // update this headers's values and styles
  tableHeader.dataset.sortDir = sortDirection == 'asc' ? 'desc' : 'asc'
  tableHeader.classList.add('currently-sorted')
}

function getSortFunction(sortType, index, sortDirection) {
  let dir = sortDirection == 'asc' ? -1 : 1
  switch (sortType) {
    case 'text': return stringRowComparer(index, dir);
    case 'numeric': return numericRowComparer(index, dir);
    default: return stringRowComparer(index, dir);
  }
}

// asc = alphanumeric order - eg 0->9->a->z
// desc = reverse alphanumeric order - eg z->a->9->0
function stringRowComparer(index, direction) {
  return (a, b) => -1 * direction * a.children[index].textContent.localeCompare(b.children[index].textContent)
}

// asc = higest to lowest - eg 999->0
// desc = lowest to highest - eg 0->999
function numericRowComparer(index, direction) {
  return (a, b) => direction * (Number(a.children[index].textContent) - Number(b.children[index].textContent))
}