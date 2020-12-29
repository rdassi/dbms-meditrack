// const { response } = require("express");

const parseJwt = (token) => {
    try {
      return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
      return null;
    }
  };

$(function () {
    var token = localStorage['atoken'];
    console.log(token);
    if (token) {
        var parsed_token = parseJwt(token);
        console.log(parsed_token);
        if (parsed_token['role'] === "patient") {
            $("#prof-doc").hide();
            // $("#profile-qual").hide();
            // $("#profile-time").hide();
            // $("#profile-days").hide();
        }
        else {
            $("#prof-pat").hide();
            // $("#profile-weight").hide();

        }
        // console.log("FWTCHHHH");
        fetch('/profile/view/' + (parsed_token['role']), {
            method: 'GET',
            headers: {
                'x-auth-token': localStorage['atoken']
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },

        }
        )
            .then(response => response.json())
            .then((res) => {
                const response = res.result;
                console.log(response);
                console.log(parsed_token['role']);
                if (parsed_token['role'] === "patient") {
                    console.log("pls");
                    $("#profile-id").val(response['p_id']);
                    $("#profile-name").val(response['name']);
                    $("#profile-email").val(response['email']);
                    $("#profile-ph").val(response['ph_no']);
                    $("#pat").prop("checked", true);
                    

                    if(response['sex']==="male"){
                        $("#male").prop("checked", true);
                        
                    }
                    else if (response['sex']==="female"){
                        $("#female").prop("checked", true);;
                    }
                    else{
                        $("#intersex").prop("checked", true);
                    }
                    $("#profile-add").val(response['address']);
                    $("#profile-height").val(response['height']);
                    $("#profile-weight").val(response['weight']);
                    // SLICING DATE TO MAKE IT ADHERE TO FORMAT NEEDED IN CALENDER
                    var date= response['dob'].slice(0,10);
                    $("#profile-dob").val(date);
                }
                else {
                    $("#profile-id").val(response['d_id']);
                    $("#profile-name").val(response['name']);
                    $("#profile-email").val(response['email']);
                    $("#profile-ph").val(response['ph_no']);
                    $("#doc").prop("checked", true);

                    console.log(response['sex']==="female");
                    if(response['sex']==="male"){
                        $("#male").prop("checked", true);
                        
                    }
                    else if (response['sex']==="female"){
                        $("#female").prop("checked", true);;
                    }
                    else{
                        $("#intersex").prop("checked", true);
                    }
                    $("#profile-add").val(response['address']);
                    // $("#profile-dob").val(response['dob']);
                    $("#profile-spl").val(response['specialization']);
                    $("#profile-qual").val(response['qualification']);
                    $("#profile-timing").val(response['timing']);
                    // SLICING DATE TO MAKE IT ADHERE TO FORMAT NEEDED IN CALENDER
                    $("#profile-days").val(response['days']);
                    var date= response['dob'].slice(0,10)
                    $("#profile-dob").val(date);
        
                }
            console.log(response);    
                
                
            }).catch((e) => { alert("Error"); console.log(e); });

    }

});


$("#save-profile").click(function(){
    
    var token = localStorage['atoken'];
    // console.log(token);
    if (token) {
        var parsed_token = parseJwt(token);
        // console.log(parsed_token);
        if (parsed_token['role'] === "patient") {
            // $("#prof-doc").hide();
            var profileInfo ={
                id: document.getElementById("profile-id").value,
                email: document.getElementById("profile-email").value,
                name: document.getElementById("profile-name").value,
                ph_no: document.getElementById("profile-ph").value,
                height: document.getElementById("profile-height").value,
                weight: document.getElementById("profile-weight").value,
                dob: document.getElementById("profile-dob").value,
                address: document.getElementById("profile-address").value,
                sex: $('input[name="sex"]:checked').val()
            } 
        }
        else {
            console.log(document.getElementById("profile-dob"));
            // $("#prof-pat").hide();
            var profileInfo ={
                id: document.getElementById("profile-id").value,
                email: document.getElementById("profile-email").value,
                name: document.getElementById("profile-name").value,
                specialization: document.getElementById("profile-spl").value,
                qualification: document.getElementById("profile-qual").value,
                timing: document.getElementById("profile-timing").value,
                ph_no: document.getElementById("profile-ph").value,
                days: document.getElementById("profile-days").value,
                dob: document.getElementById("profile-dob").value,
                address: document.getElementById("profile-add").value,
                sex: $('input[name="sex"]:checked').val()
            }
        }
        
        fetch(('/profile/edit/' + parsed_token['role']), {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
                'x-auth-token': localStorage['atoken']
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(profileInfo)
        })
            .then(response => response.json())
            .then( response => alert("Profile Updated!!") ).catch((e) => { console.log(e); alert("Error"); });
    }
    
});

$("#del-profile").click(function(){
    
    var token = localStorage['atoken'];
    
    if (token) {
        var parsed_token = parseJwt(token);
        // console.log(parsed_token);
        var Id= document.getElementById("profile-id").value;

        if(confirm("Do you want to delete your account?")){
            fetch(('/profile/delete/' + parsed_token['role']), {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify({id: Id})
            })
                .then(response => response.json())
                .then( response =>{ alert("Profile Deleted!!")
                localStorage['atoken']= undefined;
                        window.location.href="/"; }).catch((e) => { console.log(e); alert("Error"); });
        }
        }
        
        
        
    
});

