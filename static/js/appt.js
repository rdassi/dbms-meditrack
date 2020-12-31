// const auth = require("../../routes/middleware/auth");
const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

$(function () {
    //LOADS APPOINTMENT INFO FOR DOCTOR AND PATIENT 

    var token = localStorage['atoken'];
    if (token) {
        var parsed_token = parseJwt(token);
        if (parsed_token) {

            fetch('/appointment/view/' + (parsed_token['role']), {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },

            }
            )
                .then(response => response.json())
                .then((response) => {

                    response.result.forEach((ele) => {
                        $("#app-list").append(`<tr>
                    <td>${ele.app_id}</td>
                    <td>${new Date(ele.app_slot).toString('YYYY-MM-dd')}</td>
                    <td>${ele.name}</td>
                    <td>${ele.reason}</td>
                    <td id="app-confirm-${ele.app_id}">${ele.app_confirm ? "Confirmed" : "Pending"}</td>
                    ${(parsed_token['role'] === "doctor") ? `<td><button class="btn btn-secondary btn-xs" id="edit-app-${ele.app_id}" data-title="Edit"><span class="glyphicon glyphicon-pencil"><i class="fas fa-edit"></i></button></td>` : ""}
                </tr>`)
                        $(`#edit-app-${ele.app_id}`).on("click",
                            () => {
                                // {!ele.app_confirm ? "Confirmed" : "Pending"}
                                const update = {
                                    app_id: ele.app_id,
                                    app_confirm: (!ele.app_confirm)
                                }
                                console.log(update);
                                fetch(('/appointment/edit/doctor'), {
                                    method: 'PUT',
                                    headers: {
                                        'Content-Type': 'application/json',
                                        'x-auth-token': localStorage['atoken']
                                        // 'Content-Type': 'application/x-www-form-urlencoded',
                                    },
                                    body: JSON.stringify(update)
                                }).then(response => {
                                    return new Promise((res, rej) => {
                                        // console.log(response);
                                        if (response.ok) {

                                            res(response);
                                            return
                                        }
                                        else {
                                            rej(new Error("Query Failed"));
                                        }
                                    })
                                })
                                    .then(response => response.json())
                                    .then(() => {
                                        alert("Appointment Status Changed!!")
                                        window.location.reload();
                                    }).catch((e) => { console.log(e); alert("Error"); });

                            }
                        )
                    })
                }).catch(() => { alert("Error"); });

        }
    }
});


$(function () {
    //LOADS LIST OF DOCTORS FOR PATIENTS ONLY

    var token = localStorage['atoken'];
    if (token) {
        var parsed_token = parseJwt(token);

        if (parsed_token['role'] === "patient") {

            fetch('/appointment/list/' + (parsed_token['role']), {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },

            }
            )
                .then(response => response.json())
                .then((response) => {
                    response.result.forEach((ele) => {
                        $("#doc-list").append(`<tr>
                    <td>${ele.d_id}</td>
                    <td>${ele.name}</td>
                    <td>${ele.specialization}</td>
                    <td>${ele.qualification}</td>
                    <td>${ele.address}</td>
                    <td><button class="bg-secondary text-white rounded" data-toggle="modal"                                        data-target="#portfolioModal1" id="doc-${ele.d_id}" >Book</button></td>
                </tr>`)
                        $(`#doc-${ele.d_id}`).on("click", () => {
                            console.log("cri is came");
                            $("#book-id").val(ele.d_id);

                        })
                    })
                }).catch(() => { alert("Error"); });

        }
        else {
            $("#avail-doc").hide();
        }
    }
});


$("#finish-book").on("click", () => {
    var token = localStorage['atoken'];
    if (token) {
        var parsed_token = parseJwt(token);

        if (parsed_token['role'] === "patient") {

            var appInfo = {
                // p_id: parsed_token['id'],
                d_id: document.getElementById("book-id").value,
                slot: document.getElementById("slot").value,
                reason: document.getElementById("reason").value,
                // app_confirm: false
            }

            fetch('/appointment/book/patient', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
                body: JSON.stringify(appInfo)
            }
            ).then(response => {
                return new Promise((res, rej) => {
                    // console.log(response);
                    if (response.ok) {

                        res(response);
                        return
                    }
                    else {
                        rej(new Error("kya hua tera vaada...P.S. Query Failed"));
                    }
                })
            })
                .then(response => response.json())
                .then(() => {
                    alert("Appointment Queued, Kindly check back for confirmation from the doctor's end.")
                    window.location.reload();
                }).catch(() => { alert("Error"); });
        }
    }

})
