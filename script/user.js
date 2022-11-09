//If user logged in go to the suitable dashBoard.
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


$('#userRegForm').on('submit', (e) => {
    e.preventDefault();
    const firstName = $('#firstName').val();
    const lastName = $('#lastName').val();
    const username = $('#username').val();
    const password = $('#password').val();
    const j = {
        firstName,
        lastName,
        username,
        password,
        role: "user",
    };
    console.log(j)
    uregistration(j);

})


const uregistration = (i) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    const raw = JSON.stringify(i);
    console.log(raw)
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };
    console.log(i)
    fetch("http://localhost:3000/api/auth/register", requestOptions)
        .then(response => response.text())
        .then(result => {
            result = JSON.parse(result)
            // registration(i)
            // alert(result.message)
            // if (result.message === "Saved")
            //     window.location.href = '../html/userLogin.html'
            console.log("result")
            console.log(result.firstName)
            console.log(result)
            console.log("result.token")
            console.log(result.token)
            window.location.href = '../html/userLogin.html'
        })
        .catch(error => console.log('error', error));
}



const registration = (i) => {
    const myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    const obj = {
        name: i.name,
        email: i.email
    }
    const raw = JSON.stringify(obj);
    const requestOptions = {
        method: 'POST',
        headers: myHeaders,
        body: raw,
        redirect: 'follow'
    };

    fetch("http://localhost:3000/user/info", requestOptions)
        .then(response => response.text())
        .then(result => console.log(result))
        .catch(error => console.log('error', error));
}
