// const logout = document.getElementById('logout')
const form = document.getElementById('searchByName')
const inputValue = $('#name')


//User/Admin protection
$(document).ready(function () {
    console.log("here is the user")
    console.log(JSON.parse(localStorage.getItem("user")))
    const user = JSON.parse(localStorage.getItem("user"))
    if (!user) {
        window.location.href = "./userLogin.html"
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


// const locations = [
//     { lat: -31.56391, lng: 147.154312 },
//     { lat: -33.718234, lng: 150.363181 },
//     { lat: -33.727111, lng: 150.371124 },
//     { lat: -33.848588, lng: 151.209834 },
//     { lat: -33.851702, lng: 151.216968 },
//     { lat: -34.671264, lng: 150.863657 },
//     { lat: -35.304724, lng: 148.662905 },
//     { lat: -36.817685, lng: 175.699196 },
//     { lat: -36.828611, lng: 175.790222 },
//     { lat: -37.75, lng: 145.116667 },
//     { lat: -37.759859, lng: 145.128708 },
//     { lat: -37.765015, lng: 145.133858 },
//     { lat: -37.770104, lng: 145.143299 },
//     { lat: -37.7737, lng: 145.145187 },
//     { lat: -37.774785, lng: 145.137978 },
//     { lat: -37.819616, lng: 144.968119 },
//     { lat: -38.330766, lng: 144.695692 },
//     { lat: -39.927193, lng: 175.053218 },
//     { lat: -41.330162, lng: 174.865694 },
//     { lat: -42.734358, lng: 147.439506 },
//     { lat: -42.734358, lng: 147.501315 },
//     { lat: -42.735258, lng: 147.438 },
//     { lat: -43.999792, lng: 170.463352 },
//   ];

function initMap() {
    // The location of Israel
    const israel = { lat:  32.7760904, lng: 35.0220546 };
    // The map, centered at Israel
    const map = new google.maps.Map(document.getElementById("map"), {
        zoom: 7,
        center: israel,
    });
    // The marker, positioned at Israel
    // const marker = new google.maps.Marker({
    //     position: israel,
    //     map: map,
    // });
  

    $(document).ready(function () {

        $.getJSON("http://localhost:3000/api/markers", function (markers) {
            console.log(markers);
            markersList = markers;
    
            $.each(markersList, function (i, field) {
                console.log(i, field.lat, field.lng, field.label);
                
                // const marker2 = new google.maps.Marker({
                    new google.maps.Marker({
                        position: { lat: +`${field.lat}`, lng: +`${field.lng}` },
                        label: `סניף ${field.label}`,
                        map: map,
                    });
                });
    
    
        });
    
    });
    

    
}



window.initMap = initMap;


//Get categoris for category search
let markersList = [];