const parseJwt = (token) => {
  try {
    return JSON.parse(atob(token.split('.')[1]));
  } catch (e) {
    return null;
  }
};
// ADDING FIELDS TO ACCOMODATE >1 MEDICINE IN MEDS MODAL
$(function () {
  $("#addMore").click(function (e) {
    console.log("innn")

    var newMed = `<div class="row">
                    <div class="col-sm-6">
                        <legend>Name</legend>
                        <input class="form-control" name="medicine" placeholder="Ibuoprofen" type="text" />
                    </div>
                    <div class="col-sm-6">
                        <legend>Dosage</legend>
                        <input class="form-control" name="dosage" placeholder=" x ml/no. of tablets" />
                    </div>
                  </div>
                  <div class="row">
                      <div class="col-sm-12">
                        <legend>Directions</legend>
                        <input class="form-control" name="directions" placeholder="Take twice a day while symptoms persist."/>
                      </div>
                    </div>`


    e.preventDefault();

    $("#meds").append('<br> <br> <div class=row> <div class="col-sm-6"><h4> Next Medicine<h4></div> </div><br>');
    $("#meds").append(newMed);
    // $("#meds").append(dosage);
    // $("#meds").append(directions);

  });
});

// FUNCTION TO GET LIST OF PATIENTS IN SELECT OPTION
$(async function () {
  var token = localStorage['atoken'];

  if (token) {
    var parsed_token = parseJwt(token);
    // VIEW PRESCRIPTIONS (AND MEDS) FOR SELECTED PATIENT
    if (parsed_token['role'] == "doctor") {
      $("#patient-list").on("change", ViewPrescriptionDoc);

      try {
        const res = await fetch('/prescription/view/patientlist', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage['atoken']

          }
        });
        const { result } = await res.json();//const result = (await res.json()).result
        // console.log(resJson)
        for (const ele of result) {
          $("#patient-list").append(`<option>${ele.p_id} : ${ele.name}  </option>`);
        }
      } catch (e) { console.log('error', e); alert('error'); }

    }
    else {
      // TODO attach some other function
      $("#patient-list").on("change", ViewPrescriptionPat);
      //patient
      try {
        $("#add-pres").hide();
        const res = await fetch('/prescription/view/doctorlist', {
          method: 'GET',
          headers: {
            'x-auth-token': localStorage['atoken']
          },
        });
        const resJson = await res.json();
        const { result } = resJson;// const result = resJson.result
        for (const ele of result) {
          $("#patient-list").append(`<option value='${ele.d_id}'>${ele.d_id} : ${ele.name}  </option>`);
        }
      }
      catch (e) {
        console.log('SKREE', e); alert('error loading');
      }
    }
  }
});


function ViewPrescriptionPat() {
  const patId = document.getElementById("patient-list").value;
  // console.log(patId);

  var token = localStorage['atoken'];
  if (token) {
    var parsed_token = parseJwt(token);
    if (parsed_token['role'] == "patient") {

      fetch('/prescription/view/pres/patient/' + patId, {
        method: 'GET',
        headers: {
          'x-auth-token': localStorage['atoken']
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then((response) => {
          $("#view-pres tr").remove();
          $("#med-table tr").remove();
          response.result.forEach((ele) => {
            // console.log(`${ele.pres_id}`);
            $("#view-pres").append(`
            <tr>
              <td>${ele.name}</td>
              <td>${new Date(ele.date).toDateString('YYYY-MM-dd')} </td>
              <td>${ele.symptoms}</td>
              <td>${ele.disease}</td>
              <td>${ele.comments}</td>
              <td><button class="bg-secondary text-white rounded" id="view-med-${ele.pres_id}">View Meds</button></td>
            </tr>`)


            //FUNCTION TO LOAD MEDS IN MEDS TABLE FROM DATABASE
            $(`#view-med-${ele.pres_id}`).on("click",
              () => {
                const presId = ele.pres_id;
                // console.log(presId);
                var token = localStorage['atoken'];
                if (token) {
                  var parsed_token = parseJwt(token);
                  if (parsed_token) {

                    fetch('/prescription/view/meds/patient/' + presId, {
                      method: 'GET',
                      headers: {
                        'x-auth-token': localStorage['atoken']
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
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
                      .then((response) => {
                        $("#med-table tr").remove();
                        // console.log(response);
                        response.result.forEach((ele) => {
                          console.log("working");
                          $("#med-table").append(`
                           <tr>
                          <td>${ele.medicine}</td>
                          <td>${ele.dosage} </td>
                          <td>${ele.directions}</td>
                        </tr >  `)
                        })
                      })
                      .catch((e) => { console.log(e); alert("Error"); });
                  }
                }
              }

            );

          })
        }

        )
        .catch((e) => { console.log(e); alert("Error"); });
    }
  }
}



function ViewPrescriptionDoc() {
  const patId = document.getElementById("patient-list").value;
  // console.log(patId);

  var token = localStorage['atoken'];
  if (token) {
    var parsed_token = parseJwt(token);
    if (parsed_token['role'] === "doctor") {

      fetch('/prescription/view/pres/doctor/' + patId, {
        method: 'GET',
        headers: {
          'x-auth-token': localStorage['atoken']
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
      })
        .then(response => response.json())
        .then((response) => {
          $("#view-pres tr").remove();
          $("#med-table tr").remove();
          response.result.forEach((ele) => {
            // console.log(`${ele.pres_id}`);
            $("#view-pres").append(`
            <tr>
              <td>${ele.name}</td>
              <td>${new Date(ele.date).toDateString('YYYY-MM-dd')} </td>
              <td>${ele.symptoms}</td>
              <td>${ele.disease}</td>
              <td>${ele.comments}</td>
              <td><button class="bg-secondary text-white rounded" id="view-med-${ele.pres_id}">View Meds</button></td>
              <td><button class="bg-secondary text-white rounded" data-toggle="modal" data-target="#medsModal" id="add-med-${ele.pres_id}">Add Meds</button></td>
              <td><button id="del-pres-${ele.pres_id}" class="btn btn-danger btn-xs" data-title="Delete"><span class="glyphicon glyphicon-trash"><i class="fas fa-trash-alt"></i></button></td>
            </tr>`)



            // FUNCTION TO DELETE PRESCRIPTION FROM PRESCRIPTIONS TABLE
            $(`#del-pres-${ele.pres_id}`).on("click", () => {
              const presId = ele.pres_id;
              // console.log(presId);
              var token = localStorage['atoken'];
              if (token) {
                var parsed_token = parseJwt(token);

                if (confirm("Do you want to delete this prescription?")) {
                  fetch('/prescription/delete/pres/doctor', {
                    method: 'DELETE',
                    headers: {
                      'Content-Type': 'application/json',
                      'x-auth-token': localStorage['atoken']
                      // 'Content-Type': 'application/x-www-form-urlencoded',
                    },
                    body: JSON.stringify({ presId: presId })
                  })
                    .then(response => response.json())
                    .then(response => {
                      alert("Prescription Successfully Deleted!!")
                      window.location.reload();
                    }).catch((e) => { console.log(e); alert("Prescription Deletion Failed!"); })
                }
              }

            })

            //ADD MEDS TO DATABASE
            $("#save-meds").on("click", () => {
              let med = document.getElementsByName("medicine");
              let dos = document.getElementsByName("dosage");
              let dir = document.getElementsByName("directions");
              let medArray = []
              let dosArray = []
              let dirArray = []
              let combined = []
              med.forEach((ele) => { medArray.push(ele.value) })
              dos.forEach((ele) => { dosArray.push(ele.value) })
              dir.forEach((ele) => { dirArray.push(ele.value) })
              console.log(medArray.length, dosArray.length, dirArray.length)
              var i = 0;
              for (i = 0; i < medArray.length; i++) {
                combined[i] = {
                  medicine: medArray[i],
                  dosage: dosArray[i],
                  directions: dirArray[i],
                  pres_id: ele.pres_id
                }
              }
              console.log(combined);
              combined.forEach((obj) => {
                console.log(obj)
                fetch('/prescription/upload/meds/doctor', {
                  method: 'POST',
                  headers: {
                    'Content-Type': 'application/json',
                    'x-auth-token': localStorage['atoken']
                    // 'Content-Type': 'application/x-www-form-urlencoded',
                  },
                  body: JSON.stringify(obj)
                }
                ).then(response => {
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
                    // alert("Medicines Successfully Added!")
                    window.location.reload();
                  }).catch((e) => { console.log(e); alert("Error in Adding Medicines"); });
              }

              )
              //  console.log(document.getElementById("new-meds").value)
              // Object.assign(medArray[array.length],{"med": ele})
              // console.log(medArray);
            })

            //FUNCTION TO LOAD MEDS IN MEDS TABLE FROM DATABASE
            $(`#view-med-${ele.pres_id}`).on("click",
              () => {
                const presId = ele.pres_id;
                // console.log(presId);
                var token = localStorage['atoken'];
                if (token) {
                  var parsed_token = parseJwt(token);
                  if (parsed_token) {

                    fetch('/prescription/view/meds/doctor/' + presId, {
                      method: 'GET',
                      headers: {
                        'x-auth-token': localStorage['atoken']
                        // 'Content-Type': 'application/x-www-form-urlencoded',
                      },
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
                      .then((response) => {
                        $("#med-table tr").remove();
                        // console.log(response);
                        response.result.forEach((ele) => {
                          console.log("working");
                          $("#med-table").append(`
                           <tr>
                          <td>${ele.medicine}</td>
                          <td>${ele.dosage} </td>
                          <td>${ele.directions}</td>
                          <td><button type="button" id="del-med-${ele.med_id}" class="btn btn-danger btn-xs" data-title="Delete"><span class="glyphicon glyphicon-trash"><i class="fas fa-trash-alt"></i></button></td>
                        </tr >  `)

                          $(`#del-med-${ele.med_id}`).on('click', async () => {

                            //delete a medicine
                            // debugger;
                            const medId = ele.med_id;
                            console.log('I>mdId', medId)
                            // console.log(presId);
                            var token = localStorage['atoken'];
                            if (token) {
                              var parsed_token = parseJwt(token);

                              if (confirm("Do you want to delete this medicine?")) {
                                // alert('going to fetch');
                                try {
                                  const res = await fetch('/prescription/delete/meds/doctor/' + medId, {
                                    method: 'DELETE',
                                    headers: {
                                      'x-auth-token': localStorage['atoken']
                                    },
                                  })
                                  if (res.status !== 200) throw new Error('Incorrect 200');
                                  const resJson = await res.json();
                                  // alert('delet');
                                  window.location.reload()
                                } catch (e) {
                                  console.log(e);
                                }
                                // .then(response => response.json())
                                // .then(response => {
                                //   alert("Medicine Successfully Deleted!!")
                                //   window.location.reload();
                                // }).catch((e) => { console.log(e); alert("Prescription Deletion Failed!"); })
                              }
                            }

                          })
                        })
                      })
                      .catch((e) => { console.log(e); alert("Error in View PRescription"); });
                  }
                }
              }

            );

          })
        }

        )
        .catch((e) => { console.log(e); alert("Error"); });
    }
  }
}



//ADD PRESCRIPTIONS
$("#save-pres").on("click", () => {

  var token = localStorage['atoken'];
  if (token) {
    var parsed_token = parseJwt(token);



    const presDetails = {
      p_id: document.getElementById("patient-list").value.slice(0, 1),
      symptoms: document.getElementById("symptoms").value,
      disease: document.getElementById("disease").value,
      comments: document.getElementById("comments").value
    }

    fetch('/prescription/upload/pres/doctor', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-auth-token': localStorage['atoken']
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify(presDetails)
    }
    ).then(response => {
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
        alert("Prescription Successfully Added!")
        window.location.reload();
      }).catch(() => { alert("Error"); });

  }

}
)