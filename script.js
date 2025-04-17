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
  
    // Validate input to check if any field is empty or invalid
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
      return; // Stop execution if validation fails
    }
  
    // Perform calculation
    const isp = thrust / (massflowrate * g0);
    
  
    // Format the result to two decimal places
    const formattedisp = isp.toFixed(2);
    // Display the result
    document.getElementById("isp").textContent = "isp: " + formattedisp;

    document.getElementById("result").textContent = "thing: " + formattedthing;
  }