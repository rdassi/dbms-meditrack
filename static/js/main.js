//MOVING PANES
const signUpButton = document.getElementById('signUp');
const signInButton = document.getElementById('signIn');
const container = document.getElementById('container');

signUpButton.addEventListener('click', () => {
    container.classList.add('right-panel-active');
});

signInButton.addEventListener('click', () => {
    container.classList.remove('right-panel-active');
});

//CONTINUATION OF THE SIGN UP FORM
document.getElementById("general").addEventListener('submit', details);

let formData = null;

function details(event) {
    event.preventDefault();

    formData = {
        "name": document.getElementById('name_sp').value,
        "email": document.getElementById('email_sp').value,
        "ph_no": document.getElementById('ph_sp').value,
        "dob": document.getElementById('dob_sp').value,
        "sex": document.getElementById('sex_sp').value,
        "role": document.getElementById('role_sp').value,
    }

    if (document.getElementById('role_sp').value === "doc") {

        document.getElementById("docInfo").style.display = "block";
        document.getElementById("patInfo").style.display = "none";
        document.getElementById("general_div").style.display = "none";

    }
    if (document.getElementById('role_sp').value === "pat") {
        document.getElementById("docInfo").style.display = "none";
        document.getElementById("patInfo").style.display = "block";
        document.getElementById("general_div").style.display = "none";
    }
}
//COMPLETE SIGN UP

// document.getElementsByName("sign-up").forEach((e)=>{
//     e.addEventListener('submit', signUp);
// })
// console.log("aaaaaaaaaaaaaaa");
document.getElementById("sign-up-pat").addEventListener('click', signUp);
document.getElementById("sign-up-doc").addEventListener('click', signUp);

function signUp() {

    console.log("SIGN UP FUNCTION WORKING");
    if (document.getElementById('role_sp').value === "doc") {

        formData.qualification = document.getElementById('qual_sp').value;
        formData.specialization = document.getElementById('spl_sp').value;
        formData.address = document.getElementById('add_sp_d').value;
        formData.time = document.getElementById('time_sp').value;
        formData.days = document.getElementById('days_sp').value;
        formData.pwd = document.getElementById('d_pwd').value;

        console.log("STARTING FETCH");

        fetch('/register/doctor', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(formData)
        }
        )
            .then(response => response.json())
            .then(data => console.log(data)).catch(() => { alert("Error"); });
    }
    if (document.getElementById('role_sp').value === "pat") {
        formData.address = document.getElementById('add_sp_p').value;
        formData.age = document.getElementById('age_sp').value;
        formData.height = document.getElementById('h_sp').value;
        formData.weight = document.getElementById('w_sp').value;
        formData.pwd = document.getElementById('p_pwd').value;

        console.log("STARTING FETCH");
        console.log(formData);
        fetch('/register/patient', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
                // 'Content-Type': 'application/x-www-form-urlencoded',
            },
            body: JSON.stringify(formData)
        })
            .then(response => response.json())
            .then(data => console.log(data)).catch(() => { alert("Error"); });
    }
}


//PREVENT REFRESHING OF PAGE
document.getElementById("pat-sign-up").addEventListener('submit', patSignUp);
document.getElementById("doc-sign-up").addEventListener('submit', docSignUp);

function patSignUp(event) {
    event.preventDefault();
}

function docSignUp(event) {
    event.preventDefault();
}

//LOGIN

document.getElementById("sign-in").addEventListener('submit', login);

// MOCK DATA FOR LOGIN FUNCTIONALITY
// var users_doc = [{ "email": "ABC@bleh.com", "pwd": "123" }, { "email": "DEF@bleh.com", "pwd": "456" }];
// var users_pat = [{ "email": "GHI@bleh.com", "pwd": "789" }];

async function login(event) {

    event.preventDefault();
    //GET EMAIL AND PWD VALUES FROM HTML FORM


    var userInfo = {
        email: document.getElementById("email").value,
        pwd: document.getElementById("pwd").value
    };
   
    if (document.getElementById('role-sign-in').value === "doc") {
      
        try {
            const result = await fetch('/login/doctor', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(userInfo)
            })
            if (!result.ok) {
                
                throw new Error('Something went wrong');
              }
            console.log(result);
            const resjson = await result.json()
            localStorage['atoken'] = resjson.atoken;
            window.location.replace("http://localhost:3000/home.html");

        }
        catch (e) { console.log("sdvs",e); alert("ENTER CORRECT CREDENTIALS!"); }


    }
    if (document.getElementById('role-sign-in').value === "pat") {
        
        try {
            const result = await fetch('/login/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(userInfo)
            })
            if (!result.ok) {
                
                throw new Error('Something went wrong');
              }
            const resjson = await result.json()
            localStorage['atoken'] = resjson.atoken;
            window.location.replace("http://localhost:3000/home.html");

        }
        catch (e) { alert(e); }
    }



}

// if (found === 1) {
    //     //console.log("condition true");
    //     alert("You are logged in");
    //     window.location.replace("http://localhost:3001/home.html");
    // }
    // else {
    //     alert("Invalid username, please try again or if you are new register");
    // }
// function findDoc(userInfo) {
//     //ADD API TO CHECK VALUES IN DATABASE

//     for (var i = 0; i < users_doc.length; i++) {
//         //console.log(users[i]);
//         if (userInfo[0] === users_doc[i].email && userInfo[1] === users_doc[i].pwd)
//             found = 1;
//     }
//     return found;

// }
// function findPat(userInfo) {
//     //ADD API TO CHECK VALUES IN DATABASE
//     var found = 0;
//     for (var i = 0; i < users_pat.length; i++) {
//         //console.log(users[i]);
//         if (userInfo[0] === users_pat[i].email && userInfo[1] === users_pat[i].pwd)
//             found = 1;
//     }
//     return found; }