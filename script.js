function calculateCombustion() {
const combustiontemp = parseFloat(document.getElementById("combustiontemp").value);
const combustionpressure = parseFloat(document.getElementById("combustionpressure").value);
const specificheatratio = parseFloat(document.getElementById("specificheatratio").value);
const specificgascontent= parseFloat(document.getElementById("specificgascontent").value);
const expansionratio= parseFloat(document.getElementById("expansionratio").value);
const massflowrate= parseFloat(document.getElementById("massflowrate").value);
const thrust= parseFloat(document.getElementById("thrust").value);
const g0= parseFloat(document.getElementById("g0").value);

const result=thrust/(massflowrate*g0);
  
// Display the result
document.getElementById("result").textContent = "Result: " + result;
}