function calculateCombustion() {
    // Retrieve and parse input values
    const combustiontemp = parseFloat(document.getElementById("combustiontemp").value);
    const combustionpressure = parseFloat(document.getElementById("combustionpressure").value);
    const specificheatratio = parseFloat(document.getElementById("specificheatratio").value);
    const specificgascontent = parseFloat(document.getElementById("specificgascontent").value);
    const expansionratio = parseFloat(document.getElementById("expansionratio").value);
    const massflowrate = parseFloat(document.getElementById("massflowrate").value);
    const thrust = parseFloat(document.getElementById("thrust").value);
    const g0 = parseFloat(document.getElementById("g0").value);
  
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
      document.getElementById("result").textContent =
        "Please ensure all input fields contain valid numbers.";
      return; // Stop execution if validation fails
    }
  
    // Perform calculation
    const result = thrust / (massflowrate * g0);
  
    // Format the result to two decimal places
    const formattedResult = result.toFixed(2);
  
    // Display the result
    document.getElementById("result").textContent = "Result: " + formattedResult;
  }