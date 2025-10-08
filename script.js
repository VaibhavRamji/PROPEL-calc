function solveExitMach(areaRatio, gamma = 1.37, initialGuess = 2.0, tolerance = 1e-6, maxIterations = 100) {
  function f(M) {
    return (
      (1 / M) *
      Math.pow(
        (2 / (gamma + 1)) * (1 + ((gamma - 1) / 2) * M * M),
        (gamma + 1) / (2 * (gamma - 1))
      ) - areaRatio
    );
  }

  function fPrime(M) {
    const term1 = (2 / (gamma + 1)) * (1 + ((gamma - 1) / 2) * M * M);
    const exponent = (gamma + 1) / (2 * (gamma - 1));
    const dTerm1 = (2 / (gamma + 1)) * (gamma - 1) * M;
    const dPower = exponent * Math.pow(term1, exponent - 1) * dTerm1;
    return -1 / (M * M) * Math.pow(term1, exponent) + (1 / M) * dPower;
  }

  let M = initialGuess;
  for (let i = 0; i < maxIterations; i++) {
    const delta = f(M) / fPrime(M);
    M -= delta;
    if (Math.abs(delta) < tolerance) break;
  }

  return M;
}

function exitPressureRatio(M, gamma = 1.37) {
  return Math.pow(1 + ((gamma - 1) / 2) * M * M, -gamma / (gamma - 1));
}

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
    document.getElementById("isp").textContent = "Please ensure all input fields contain valid numbers.";
    document.getElementById("cstar").textContent = "";
    document.getElementById("ve").textContent = "";
    document.getElementById("pe").textContent = "";
    document.getElementById("me").textContent = "";
    return;
  }

  // Specific Impulse
  const isp = thrust / (massflowrate * g0);

  // Characteristic Velocity (C*)
  const cStar = Math.sqrt(
  (specificgascontent * combustiontemp) / specificheatratio
) / Math.sqrt(
  Math.pow(
    (2 / (specificheatratio + 1)),
    ((specificheatratio + 1) / (specificheatratio - 1))
  )
);

  // Effective Exhaust Velocity (Ve)
  const ve = isp * g0;

  // Nozzle Exit Mach Number (Me)
  const me = solveExitMach(expansionratio, specificheatratio);

  // Nozzle Exit Pressure (Pe) using Me
  const pe = combustionpressure * exitPressureRatio(me, specificheatratio);

  // Format results
  const formattedisp = isp.toFixed(2);
  const formattedcStar = cStar.toFixed(2);
  const formattedVe = ve.toFixed(2);
  const formattedPe = pe.toFixed(2);
  const formattedMe = me.toFixed(4);

  // Display results
  document.getElementById("isp").textContent = `Isp: ${formattedisp} s`;
  document.getElementById("cstar").textContent = `Characteristic Velocity (C*): ${formattedcStar} m/s`;
  document.getElementById("ve").textContent = `Effective Exhaust Velocity (Ve): ${formattedVe} m/s`;
  document.getElementById("pe").textContent = `Nozzle Exit Pressure (Pe): ${formattedPe} Pa`;
  document.getElementById("me").textContent = `Nozzle Exit Mach Number (Me): ${formattedMe}`;

}

document.addEventListener("DOMContentLoaded", function () {
  // Define propellant data
  const propellantData = {
    "lh2/lox": { gamma: 1.20, R: 412 },
    "lng/lox": { gamma: 1.13, R: 370 },
    "rp1/lox": { gamma: 1.22, R: 355 },
    "mmh/n2o4": { gamma: 1.18, R: 330 }
  };

  // Listen for changes on all radio buttons
  document.querySelectorAll('input[name="vbtn-radi"]').forEach(radio => {
    radio.addEventListener("change", () => {
      const selected = document.querySelector('input[name="vbtn-radi"]:checked').value;
      const props = propellantData[selected];
      if (props) {
        document.getElementById("specificheatratio").value = props.gamma;
        document.getElementById("specificgascontent").value = props.R;
      }
    });
  });

  // Trigger autofill on page load if a radio is already selected
  const selected = document.querySelector('input[name="vbtn-radi"]:checked');
  if (selected) {
    const props = propellantData[selected.value];
    if (props) {
      document.getElementById("specificheatratio").value = props.gamma;
      document.getElementById("specificgascontent").value = props.R;
    }
  }
});

function saveResult() {
  const ispText = document.getElementById("isp").textContent;
  const cstarText = document.getElementById("cstar").textContent;
  const veText = document.getElementById("ve").textContent;
  const peText = document.getElementById("pe").textContent;
  const meText = document.getElementById("me").textContent;


  

  if (
    !ispText || ispText.includes("Please ensure") ||
    !cstarText || !veText || !peText || !meText
  ) {
    alert("No valid result to save.");
    return;
  }

  const resultText = `${ispText}\n${cstarText}\n${veText}\n${peText}\n${meText}`;

  const blob = new Blob([resultText], { type: "text/plain" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = "propelcalc_results.txt";
  link.click();
}


