//Admin protection
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

let dataPintsFromDatabase = []
let dataPintsFromDatabase2 = []

$(document).ready(function () {

    $.getJSON("http://localhost:3000/api/categories/products/agg", function (categories) {
        // console.log(categories);
        $.each(categories, function (i, field) {

            // let option = $(`<option id =${field.id} class="category" value=${field.id}>${field.name}</option>`)
            dataPintsFromDatabase.push( { y:+`${field.count}`, label: `${field.name}`})
            console.log(i, field, field.name, field.count )
        });
    });
    console.log("dataPintsFromDatabase",dataPintsFromDatabase )

    $.getJSON("http://localhost:3000/api/categories/products/agg-supllier", function (categories) {
        // console.log(categories);
        $.each(categories, function (i, field) {

            // let option = $(`<option id =${field.id} class="category" value=${field.id}>${field.name}</option>`)
            dataPintsFromDatabase2.push( { label: `${field.name}`, y:+`${field.count}`})
            console.log(i, field, field.name, field.count )
        });
    });
    console.log("dataPintsFromDatabase2",dataPintsFromDatabase2 )

    const myTimeout = setTimeout(createGraph, 500);

    function createGraph() {

        var options = {
            title: {
                text: "Products Number By Categories"
            },
            subtitles: [{
                text: "As of November, 2017"
            }],
            animationEnabled: true,
            data: [{
                type: "pie",
                startAngle: 40,
                toolTipContent: "<b>{label}</b>: {y}%",
                showInLegend: "true",
                legendText: "{label}",
                indexLabelFontSize: 16,
                indexLabel: "{label} --- {y} products",
                dataPoints: dataPintsFromDatabase
                // dataPoints: [
                //     { y: 48.36, label: "Windows 7" },
                //     { y: 26.85, label: "Windows 10" },
                //     { y: 1.49, label: "Windows 8" },
                //     { y: 6.98, label: "Windows XP" },
                //     { y: 6.53, label: "Windows 8.1" },
                //     { y: 2.45, label: "Linux" },
                //     { y: 3.32, label: "Mac OS X 10.12" },
                //     { y: 4.03, label: "Others" }
                // ]
            }]
        };
        $("#chartContainer").CanvasJSChart(options);
        
        
        var options2 = {
            animationEnabled: true,
            title: {
		text: "Products By Suppliers"
	},
	axisY: {
        title: "מספר המוצרים לפי ספק",
		suffix: ""
	},
	axisX: {
		title: "שם הספק"
	},
	data: [{
		type: "column",
		yValueFormatString: "#,##0.0#"%"",
		dataPoints: dataPintsFromDatabase2
		// dataPoints: [
            // 	{ label: "Iraq", y: 10.09 },	
            // 	{ label: "Turks & Caicos Islands", y: 9.40 },	
            // 	{ label: "Nauru", y: 8.50 },
            // 	{ label: "Ethiopia", y: 7.96 },	
            // 	{ label: "Uzbekistan", y: 7.80 },
            // 	{ label: "Nepal", y: 7.56 },
            // 	{ label: "Iceland", y: 7.20 },
            // 	{ label: "India", y: 7.1 }
			
            // ]
        }]
    };
    $("#chartContainer2").CanvasJSChart(options2);
    
    clearTimeout(myTimeout);
  }
    
});

// Code based on :   https://canvasjs.com/jquery-charts/animated-chart/
