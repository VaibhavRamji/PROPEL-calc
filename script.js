function calculateCombustion() {
  // Retrieve and parse input values
  let combustiontemp = parseFloat(document.getElementById("combustiontemp").value); // Tc
  let combustionpressure = parseFloat(document.getElementById("combustionpressure").value); // Pc
  let specificheatratio = parseFloat(document.getElementById("specificheatratio").value); // γ
  let specificgascontent = parseFloat(document.getElementById("specificgascontent").value); // R
  let expansionratio = parseFloat(document.getElementById("expansionratio").value); // ε
  let massflowrate = parseFloat(document.getElementById("massflowrate").value); // ṁ
  let thrust = parseFloat(document.getElementById("thrust").value); // F
  let g0 = parseFloat(document.getElementById("g0").value); // gravity

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
    document.getElementById("cstar").textContent = "";
    document.getElementById("ve").textContent = "";
    document.getElementById("pe").textContent = "";
    return;
  }

  // Specific Impulse
  const isp = thrust / (massflowrate * g0);

  // Characteristic Velocity (C*)
  const cStar = Math.sqrt(
    (specificgascontent * combustiontemp) /
      specificheatratio *
      Math.pow(
        (2 / (specificheatratio + 1)),
        ((specificheatratio + 1) / (specificheatratio - 1))
      )
  );

  // Effective Exhaust Velocity (Ve)
  const ve = isp * g0;

  // Nozzle Exit Pressure (Pe) using isentropic relation
  const pe =
    combustionpressure *
    Math.pow(
      1 / expansionratio,
      (2 * specificheatratio) / (specificheatratio - 1)
    );

  // Format results
  const formattedisp = isp.toFixed(2);
  const formattedcStar = cStar.toFixed(2);
  const formattedVe = ve.toFixed(2);
  const formattedPe = pe.toFixed(2);

  // Display results
  document.getElementById("isp").textContent = `Isp: ${formattedisp} s`;
  document.getElementById("cstar").textContent = `Characteristic Velocity (C*): ${formattedcStar} m/s`;
  document.getElementById("ve").textContent = `Effective Exhaust Velocity (Ve): ${formattedVe} m/s`;
  document.getElementById("pe").textContent = `Nozzle Exit Pressure (Pe): ${formattedPe} Pa`;
}

function saveResult() {
  const ispText = document.getElementById("isp").textContent;
  const cstarText = document.getElementById("cstar").textContent;
  const veText = document.getElementById("ve").textContent;
  const peText = document.getElementById("pe").textContent;

  if (
    !ispText || ispText.includes("Please ensure") ||
    !cstarText || !veText || !peText
  ) {
    alert("No valid result to save.");
    return;
  }

  const resultText = `${ispText}\n${cstarText}\n${veText}\n${peText}`;

  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "propelcalc_results.txt";
  link.click();
}


