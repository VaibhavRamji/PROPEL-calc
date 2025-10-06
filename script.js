function calculateCombustion() {
  // Retrieve and parse input values
  let combustiontemp = parseFloat(document.getElementById("combustiontemp").value);
  let combustionpressure = parseFloat(document.getElementById("combustionpressure").value);
  let specificheatratio = parseFloat(document.getElementById("specificheatratio").value);
  let specificgascontent = parseFloat(document.getElementById("specificgascontent").value);
  let expansionratio = parseFloat(document.getElementById("expansionratio").value);
  let massflowrate = parseFloat(document.getElementById("massflowrate").value);
  let thrust = parseFloat(document.getElementById("thrust").value);
  let g0 = parseFloat(document.getElementById("g0").value);

  // Validate input
  if (
    isNaN(combustiontemp) ||
    isNaN(combustionpressure) ||
    isNaN(specificheatratio) ||
    isNaN(specificgascontent) ||
    isNaN(expansionratio) ||
    isNaN(massflowrate) ||
    isNaN(thrust) ||
    isNaN(g0)
  ) {
    document.getElementById("isp").textContent =
      "Please ensure all input fields contain valid numbers.";
    return;
  }

  // Perform calculation
  const isp = thrust / (massflowrate * g0);
  const formattedisp = isp.toFixed(2);
  document.getElementById("isp").textContent = "isp: " + formattedisp;
}

// ✅ Define this outside so it's globally accessible
function saveResult() {
  const resultText = document.getElementById("isp").textContent;

  if (!resultText || resultText.includes("Please ensure")) {
    alert("No valid result to save.");
    return;
  }

  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "propelcalc_result.txt";
  link.click();
}

