var firebaseConfig = {
    apiKey: "AIzaSyAoXw7oXbA8CFNnKPnFDspWpkGpCpq4UWs",
    authDomain: "temp-check-71824.firebaseapp.com",
    databaseURL: "https://temp-check-71824-default-rtdb.asia-southeast1.firebasedatabase.app",
    projectId: "temp-check-71824",
    storageBucket: "temp-check-71824.appspot.com",
    messagingSenderId: "1051249704571",
    appId: "1:1051249704571:web:6f70af317f4abb4035ecde",
    measurementId: "G-BHW5B26WFR"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
  firebase.analytics();
  const dbRef = firebase.database().ref();
  
function signIn(){
	console.log("SignIn Method");
	var email = document.getElementById("userSIEmail").value;
	var password = document.getElementById("userSIPassword").value;

	firebase.auth().signInWithEmailAndPassword(email, password).then((value) => {
	   	 window.location.replace("./temp_entry.html");
	}).then((error) => {
		console.log("Error While Signed In:"+error);
	});
}

function clear_field(){
    document.getElementById("employeeId").value = "";
    document.getElementById("temperature").value = "";
}

function modified_date(){
    const today = new Date()
    return today.getDate()+''+today.getMonth()+''+today.getFullYear()
}

function add_temp(in_data, in_struct_date, in_emp_id){
    dbRef.child("employe").child(in_struct_date).child(in_emp_id).set(in_data).then((res) =>{
        clear_field();
    }).catch((error) => {
        console.log("update error"+error);
        alert("Error While Add Employee Temperature");
    });
}

function temp_entry(){
	var emp_id = document.getElementById("employeeId").value;
	var temp = document.getElementById("temperature").value;
	var data = {"employee_id":emp_id, "temp_in":temp, "temp_out":"-"}
    let struct_date = modified_date();
    dbRef.child("employe").child(struct_date).get().then((result) =>{
        if(result.val() != null){
            let ext_keys = Object.keys(result.val());
            if (ext_keys.includes(emp_id)){
                dbRef.child("employe").child(struct_date).child(emp_id).update({"temp_out":temp}).then((res) =>{
                    clear_field();
                }).catch((error) => {
                    alert("Error While Update Employee Temperature");
                });
            }else{
                add_temp(data, struct_date, emp_id);
            }
        }else{
                add_temp(data, struct_date, emp_id);
        }
    }).catch((error) => {
        console.log("update errOR"+error);
    });
}

function get_details(){
    let arr = [0,0,0];
    let struct_date = modified_date();
    dbRef.child("employe").child(struct_date).get().then((result) =>{
        if(result.val() != null){
            let out_val = result.val();
            for(key in out_val){
                if (out_val[key]['temp_in'] >= 98){
                    arr[0] = arr[0] + 1;
                }else if(out_val[key]['temp_in'] >= 96 && out_val[key]['temp_in'] < 98){
                    arr[1] = arr[1] + 1;
                }else{
                    arr[2] = arr[2] + 1;
                }
            }
        }
        drawChart(arr);
    })
    }

google.charts.load("current", {packages:["corechart"]});
google.charts.setOnLoadCallback(get_details);
function drawChart(temp) {
    var data = google.visualization.arrayToDataTable([
    ['Employee Temperature', 'Count'],
    ['Above 98 F',     temp[0]],
    ['Above 96 F',      temp[1]],
    ['Below 96 F',  temp[2]]
]);

var options = {
  title: 'Employees Temperature',
  pieHole: 0.3,
  legend:{'position':'bottom'},
//  chartArea: {'right':10,'width': '500px', 'height': '80%'},
//  theme: 'maximized',

};

var chart = new google.visualization.PieChart(document.getElementById('donutchart'));
chart.draw(data, options);
}