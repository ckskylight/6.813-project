$(document).ready(function() {
    //localStorage['one'] = '1';
    var foo = localStorage['one'];
    console.log(foo);

    $("#partyTime").click(function(){
  	var a = document.getElementById("partyTime");
  	a.type="time";  
  	});

  	$("#partyDate").click(function(){
  	var a = document.getElementById("partyTime");
  	a.type="date";  
  	});

  	$("#partyDate").click(function(){
  	var a = document.getElementById("partyTime");
  	a.type="number";  
  	});

});