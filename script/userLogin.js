//If user logged in go to the suitable dashBoard
$(document).ready(function () {
    console.log("here is the user")
    console.log(JSON.parse(localStorage.getItem("user")))
    // Go to locao host and get user details
    const user = JSON.parse(localStorage.getItem("user"))
    if (user.role == "admin") {
        window.location.href = "./adminDashboard.html"
        
    }
    if (user.role == "user") {
        window.location.href = "./userDashboard.html"
    }
    if (!user || ((user.role !== "admin")&& (user.role !== "user"))) {
        window.location.href = "./user.Login.html"
    }

});


$('#userForm').on('submit', (e) => {
    e.preventDefault()
    const username = $('#username').val();
    const password = $('#password').val();
    const obj = {
        username,
        password
    }
    verification(obj);
})

const verification = (obj) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(obj);

    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/api/auth/login", requestOptions)
        .then((response) => response.json())
        .then(result => {
            // chendking the result

            console.log("result")
            console.log(result)
            console.log(result.id)
            // set result to local storage
            const storage = JSON.stringify(result)
            localStorage.setItem("user", storage)
            console.log(JSON.parse(localStorage.getItem("user")))
            // rout user to the right dashborad
            if (result.role == "admin") {
                window.location.href = "./adminDashboard.html"
                console.log(result.role)
            }
            else {
                window.location.href = "./userDashboard.html"
            }

        })
        .catch(error => {
            element.parentElement.innerHTML = `Error: ${error}`;
            console.error('There was an error!', error);
            alert("error login")
        });
}

