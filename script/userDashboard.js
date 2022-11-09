const logout = document.getElementById('logout')
const form = document.getElementById('searchByName')
const inputValue = $('#name')
const cont = $('#cont')


//No user protection.
$(document).ready(function () {
    console.log("here is the user")
    console.log(JSON.parse(localStorage.getItem("user")))
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
        window.location.href = "./userLogin.html"
    }
    
});


//logout Butoon
$(document).ready(function () {
    $("#logOut").on("click", function () {
        console.log("LogOut");
        localStorage.removeItem("user");
        window.location.href = "./userLogin.html"

    });
});


//Get categoris for category search
let categoryList = [];
$(document).ready(function () {

    $.getJSON("http://localhost:3000/api/categories", function (categories) {
        // console.log(categories);
        categoryList = categories;
    });

});

let saveAllProducts = [];

$(document).ready(function () {
    $.getJSON("http://localhost:3000/api/products", function (result) {
        saveAllProducts = result;
        ShowProducts(result);

    });
});

function ShowProducts(result) {
    $('#product-card-list').empty()
    $.each(result, function (i, field) {
        let card = $(`<div class="card" style="width: 18rem;">
        <div class="card-body">
          <h4 class="card-title">${field.name} </h4>
  <img class="card-img-top" src= "http://localhost:3000/api/products/images/${field.imageName}" alt="Card image cap">
    <p class="card-text">מחיר ${field.price} &#8362; </p>
  </div>
</div>`)
        console.log(i, field)
        $('#product-card-list').append(card)
    });
}


let showSearchBar = 0

async function searchCattgory() {
    if (showSearchBar == 1) {
        ShowProducts(saveAllProducts);
        $('#catSearch').empty();
        showSearchBar = 0;
        return;

    }
    console.log("searchCattgory");
    console.log(categoryList);
    let serchForm = `<h1>חפש בקטגוריה לפי מחיר מינימום ומחיר מקסימום</h1> <form>
    <select type="text" id="categoryId" value="" placeholder="category"><option class="category" value="" disabled selected>Category</option>`;

    await $.each(categoryList, function (i, field) {
        serchForm += `<option id =${field.id} class="category" value=${field.id}>${field.name}</option>`;
    });

    serchForm += "</select>";
    serchForm +=
        `<label id="minPriceLable">
        <input type="number" id="minPrice" value="" placeholder="Min Price ">
        </label>
        <label id="maxPriceLable">
        <input type="number" id="maxPrice" value="" placeholder="Max Price ">
        </label>
        <button type="button" id ="searchInCategories" class="taskBtn btn-l bi bi-x-square-fill")">חפש מוצרים </button> 
        </form>`

    console.log(serchForm);
    let catSearch = $(serchForm);
    $('#catSearch').append(catSearch);

    $("#searchInCategories").on("click", function () {
        showSerchCategories()
    });

    showSearchBar = 1;
}

function showSerchCategories() {
    console.log("searchInCategories");
    let categorySearchId = $('#categoryId').val()
    let minPrice = $('#minPrice').val()
    if (!minPrice) {
        minPrice = 0;
    }
    let maxPrice = $('#maxPrice').val()
    if (!maxPrice) {
        maxPrice = 1000000;
    }

    let apiCallAddress = `http://localhost:3000/api/categories/${categorySearchId}/${minPrice}/${maxPrice}`
    console.log("apiCallAddress");
    console.log(apiCallAddress);

    $.getJSON(apiCallAddress, function (searchResults) {
        console.log(searchResults);
        ShowProducts(searchResults)
    });

}

//Handling Sockets

var socket = io('http://localhost:3000');
socket.on('connect', function () {
    console.log("socket connected")
});
socket.on("admin-add-product", function (data) {
    saveAllProducts.push(data);
    ShowProducts(saveAllProducts)
    console.log("new productd added from socket");

});


socket.on("admin-update-product", function (data) {
    const foundIndex = saveAllProducts.findIndex(x => x._id == data._id);
    saveAllProducts[foundIndex] = data;
    ShowProducts(saveAllProducts)
    console.log("new productd updated from socket");
});

socket.on("admin-delete-product", function (data) {
    saveAllProducts = saveAllProducts.filter(function( obj ) {
        return obj.id !== data;
      });
    ShowProducts(saveAllProducts)
    console.log("A productd was deleted from socket");
});

socket.on('disconnect', function () { });




