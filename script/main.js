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
    // if (!user || ((user.role !== "admin")&& (user.role !== "user"))) {
    //     window.location.href = "./user.Login.html"
    // }

});