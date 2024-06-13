var myVar;

function myFunction() {
  myVar = setTimeout(showPage, 1000);
}

function showPage() {
  document.getElementById("cover").style.display = "none";
  document.getElementById("loader").style.display = "none";
}