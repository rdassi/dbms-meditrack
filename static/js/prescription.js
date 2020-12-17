

$(function() {
$("#addMore").click(function(e) {
    console.log("innn")
    var med_name= '<div class="row">    <div class="col-sm-6"> <legend>Name</legend>     <input class="form-control" name="name" placeholder="Ibuprofen"  /></div> </div>'
    var dosage= '<div class="row">    <div class="col-sm-6">  <legend>Dosage</legend>    <input class="form-control" name="dosage" placeholder="ml/number of tablets"  {% if prescription %}value="{{ prescription.dosage }}" {% endif %}/> </div> </div>'
    var directions= '<div class="row">  <div class="col-sm-12">   <legend>Directions</legend>    <input class="form-control" name="directions" placeholder="Take twice a day while symptoms persist." {% if prescription %}value="{{ prescription.directions }}" {% endif %}/>  </div> </div>'
    
      e.preventDefault();
    //   $("#prescription").append("<li>&nbsp;</li>");
    $("#prescription").append('<br> <br> <div class=row> <div class="col-sm-6"><h4> Next Medicine<h4></div> </div><br>');
    $("#prescription").append(med_name);
    $("#prescription").append(dosage);
    $("#prescription").append(directions);
    
  });
});