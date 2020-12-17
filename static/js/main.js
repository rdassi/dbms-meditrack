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

function details(event) {
    event.preventDefault();
    if (document.getElementById('role').value === "doc") {
        document.getElementById("docInfo").style.display = "block";
        document.getElementById("patInfo").style.display = "none";
        document.getElementById("general_div").style.display = "none";

    }
    if (document.getElementById('role').value === "pat") {
        document.getElementById("docInfo").style.display = "none";
        document.getElementById("patInfo").style.display = "block";
        document.getElementById("general_div").style.display = "none";
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
var users_doc = [{ "email": "ABC@bleh.com", "pwd": "123" }, { "email": "DEF@bleh.com", "pwd": "456" }];
var users_pat = [{ "email": "GHI@bleh.com", "pwd": "789" }];

function login(event) {

    event.preventDefault();
    //GET EMAIL AND PWD VALUES FROM HTML FORM

    var userEmail = document.getElementById("email").value;
    var userPwd = document.getElementById("pwd").value;
    var userInfo = [userEmail, userPwd];
    console.log(userInfo);
    var found = 0;
    if (document.getElementById('role-sign-in').value === "doc") {
        found = findDoc(userInfo);
    }
    if (document.getElementById('role-sign-in').value === "pat") {
        found = findPat(userInfo);
    }

    if (found === 1) {
        //console.log("condition true");
        alert("You are logged in");
        window.location.replace("http://localhost:3001/home.html");
    }
    else {
        alert("Invalid username, please try again or if you are new register");
    }

}

function findDoc(userInfo) {
    //ADD API TO CHECK VALUES IN DATABASE

    for (var i = 0; i < users_doc.length; i++) {
        //console.log(users[i]);
        if (userInfo[0] === users_doc[i].email && userInfo[1] === users_doc[i].pwd)
            found = 1;
    }
    return found;
    
}
function findPat(userInfo) {
    //ADD API TO CHECK VALUES IN DATABASE
    var found = 0;
    for (var i = 0; i < users_pat.length; i++) {
        //console.log(users[i]);
        if (userInfo[0] === users_pat[i].email && userInfo[1] === users_pat[i].pwd)
            found = 1;
    }
    return found;
}