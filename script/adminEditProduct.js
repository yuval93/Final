//Admin protection.
$(document).ready(function () {
    console.log("here is the user")
    console.log(JSON.parse(localStorage.getItem("user")))
    // Go to locao host and get user details
    // If user is not admin go to user area, If there is no user, go to login page
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
        window.location.href = "./user.Login.html"
    }
    if (user.role !== "admin") {
        if (user.role == "user") {
            window.location.href = "./userDashboard.html"
        }
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

$(document).ready(function () {

    $.getJSON("http://localhost:3000/api/categories", function (categories) {
        // console.log(categories);
        $.each(categories, function (i, field) {
            let option = $(`<option id =${field.id} class="category" value=${field.id}>${field.name}</option>`)
            $('#categoryId').append(option)
            console.log(i, field)
        });
    });

});



// Get products and present them on secreen
$(document).ready(function () {
    const productId = JSON.parse(localStorage.getItem("productToAdd"))

    $.getJSON(`http://localhost:3000/api/products/${productId}`, function (result) {
        console.log("Here is our product");
        console.log(result);
        $(`#${result.categoryId}`).prop( "disabled", true );
        $('#name').prop( "value", result.name) ;
        $('#price').prop( "value", result.price) ;
        $("#previewImg").attr("src", `http://localhost:3000/api/products/images/${result.imageName}`);
        $('#productId').prop( "innerText", result.id) ;
        console.log("inner text");
        console.log($('#productId').text());


        });
});



$('#addProductForm').on('submit', (e) => {
    e.preventDefault();

    let formData = new FormData();
    // formData.image = $('#image').get(0).files[0];
    formData.append("name", $('#name').val());
    formData.append("categoryId", $('#categoryId').val());
    formData.append("price", $('#price').val());

    const file = $("input[type=file]").get(0).files[0];
    if (file) {
        formData.append("image", $('#image').get(0).files[0]);
        formData.append("imageName", $('#image').val());
    }


    console.log(formData);
    const productId = $('#productId').text();


    $.ajax({
        type: 'PATCH',
        url: `http://localhost:3000/api/products/${productId}`,
        data: formData,
        success: function () {
            alert('Form Submitted!');
            window.location.href = "./adminDashboard.html"

        },
        processData: false,
        contentType: false,
        cache: false,
        error: function () {
            alert("error in ajax form submission");
        }
    });


})


function previewFile(input) {
    const file = $("input[type=file]").get(0).files[0];

    if (file) {
        const reader = new FileReader();

        reader.onload = function () {
            $("#previewImg").attr("src", reader.result);
        }

        reader.readAsDataURL(file);
    }
}



