var doit=function() {
	var res=fs.readFile("test.txt");
	document.getElementById("out").innerHTML=">"+res;
}