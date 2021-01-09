const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

//DOWNLOAD BLOB
/**
 * @param {Blob} blob
 * @param {string} name
 */
function downloadBlob(blob, name) {
    // Convert your blob into a Blob URL (a special url that points to an object in the browser's memory)
    const blobUrl = URL.createObjectURL(blob);

    // Create a link element
    const link = document.createElement("a");

    // Set link's href to point to the Blob URL
    link.href = blobUrl;
    link.download = name;

    // Append link to the body
    document.body.appendChild(link);

    // Dispatch click event on the link
    // This is necessary as link.click() does not work on the latest firefox
    link.dispatchEvent(
        new MouseEvent('click', {
            bubbles: true,
            cancelable: true,
            view: window
        })
    );

    // Remove link from body
    document.body.removeChild(link);
}



// FUNCTION TO GET LIST OF PATIENTS IN SELECT OPTION
$(function () {
    var token = localStorage['atoken'];
    if (token) {
        var parsed_token = parseJwt(token);
        if (parsed_token['role'] == "doctor") {
            //DISABLE UPLOAD REPORT OPTION
            $("#pat-test-upload").hide();

            //CALLED FROM PATIENT PRESCRPTION COZ API ALREADY EXISTS THERE
            fetch('/prescription/view/patientlist', {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            })
                .then(response => response.json())
                .then((response) => {

                    response.result.forEach((ele) => {
                        $("#patient-list").append(`<option>${ele.p_id} : ${ele.name}  </option>`);
                    })
                }

                )
                .catch(() => { alert("Error"); });
        }
        else {
            $("#pat-selection").hide();
            fetch('/testreport/view/patient', {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },
            }
            )
                .then(response => response.json())
                .then((response) => {
                    $("#view-test tr").remove();
                    response.result.forEach((ele) => {
                        $("#view-test").append(`<tr>
                    <td>${new Date(ele.date).toDateString()}</td>
                    <td>${ele.test_name}</td>
                    <td><button class="bg-secondary text-white rounded" id="view-tr-${ele.tr_id}">View</button></td>
                    <td><button class="btn btn-danger btn-xs" id="del-tr-${ele.tr_id}" ><span class="glyphicon glyphicon-trash"><i class="fas fa-trash-alt"></i></button></td>
                    </tr>`)
                        $(`#view-tr-${ele.tr_id}`).on("click",
                            async () => {
                                console.log('hi')
                                // DOWNLOAD REPORT FROM MONGO BY QUERYING IT FROM THERE
                                const res = await fetch('/testreport/download/patient/' + ele.tr_id, {
                                    method: 'GET',
                                    headers: {
                                        'x-auth-token': localStorage['atoken']

                                    }
                                })
                                if (res.status !== 200) {
                                    alert('Cannot download!');
                                } else {
                                    const resJson = await res.json();
                                    // DOWNLOAD DATAAAAAA
                                    console.log(resJson);
                                    //json data -> uint array -> blob -> download blob
                                    const { data } = resJson;
                                    const uarray = new Uint8Array(data);
                                    const blob = new Blob([uarray]);
                                    // let jsonBlob = new Blob(['{"name": "test"}'])
                                    // downloadBlob(jsonBlob, 'myfile.json');

                                    downloadBlob(blob, resJson.name);
                                }
                            }
                        )
                        $(`#del-tr-${ele.tr_id}`).on("click",
                            () => {//FUNCTION TO DELETE REPORT FOR PATIENT
                                if (confirm("Do you want to delete this test report?")) {
                                    fetch('/testreport/delete/patient/' + ele.tr_id, {
                                        method: 'DELETE',
                                        headers: {
                                            'x-auth-token': localStorage['atoken']
                                            // 'Content-Type': 'application/x-www-form-urlencoded',
                                        },
                                    })
                                        .then(response => response.json())
                                        .then((response) => {
                                            alert("Report Deleted Successfully!");
                                            window.location.reload();
                                        }
                                        )
                                        .catch(() => { alert("Error"); });
                                }
                            }
                        )
                    })
                })
        }
    }
});

$("#test-rec").on("submit", function (event) {
    event.preventDefault();
    // console.log(event.target.filebig.files[0]);
    const fileLocation = event.target.filebig.files[0];
    console.log(fileLocation);
    const reader = new FileReader();
    reader.readAsArrayBuffer(fileLocation);
    reader.onload = async () => {
        console.log(fileLocation.name);
        const body = {
            test_name: event.target.tname.value,
            file_name: fileLocation.name,
            bufferData: [...(new Uint8Array(reader.result))]
        }
        console.log(body);
        // console.log([...(new Uint8Array(reader.result))])
        const res = await fetch('/testreport/upload/patient', {
            method: 'POST',
            headers: {
                'x-auth-token': localStorage['atoken'],
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(body)
        })
        if (res.status !== 200) {
            console.log('error', await res.json());
            alert('error');
        } else {
            alert('Uploaded successfully!');
            window.location.reload();
        }
    }

})



$("#patient-list").on("change", () => {
    //LOADS TEST REPORT INFO FOR DOC
    var token = localStorage['atoken'];
    const patId = document.getElementById("patient-list").value;
    if (token) {
        var parsed_token = parseJwt(token);
        if (parsed_token) {

            fetch('/testreport/view/doctor/' + patId, {
                method: 'GET',
                headers: {
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                },

            }
            )
                .then(response => response.json())
                .then((response) => {
                    if (parsed_token['role'] == "doctor") {
                        $('#view-test tr').remove();
                        response.result.forEach((ele) => {
                            $("#view-test").append(`<tr>
                                <td>${new Date(ele.date).toDateString()}</td>
                                <td>${ele.test_name}</td>
                                <td><button class="bg-secondary text-white rounded" id="view-tr-${ele.tr_id}" data-toggle="modal" data-target="#portfolioModal2">View/Download</button></td>
                                </tr>`)
                            $(`#view-tr-${ele.tr_id}`).on("click",
                                async () => {
                                    console.log('hi')
                                    // DOWNLOAD REPORT FROM MONGO BY QUERYING IT FROM THERE
                                    const res = await fetch('/testrecord/download/doctor/' + ele.tr_id, {
                                        method: 'GET',
                                        headers: {
                                            'x-auth-token': localStorage['atoken']

                                        }
                                    })
                                    if (res.status !== 200) {
                                        alert('Cannot Download!');
                                    } else {
                                        const resJson = await res.json();
                                        // DOWNLOAD DATAAAAAA
                                        console.log(resJson);
                                        //json data -> uint array -> blob -> download blob
                                        const { data } = resJson;
                                        const uarray = new Uint8Array(data);
                                        const blob = new Blob([uarray]);
                                        downloadBlob(blob, resJson.name);
                                    }

                                }
                            )
                        })
                    }
                }).catch(() => { alert("Error"); });

        }
    }
});