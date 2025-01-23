document.addEventListener('DOMContentLoaded'), (event) => {
    const runButton = document.getElementById('run-simulation-button')}
    
    runButton.addEventListener('click'), function() {
        // getting user input values back
        const gamma = parseFloat(document.getElementById('gamma').value);
        const combustionTemp = parseFloat(document.getElementById('combustionTemp').value);
        const chamberPressure = parseFloat(document.getElementById('chamberPressure').value);
        const specificGasContent = parseFloat(document.getElementById('specificGasContent').value);
        const expansionRatio = parseFloat(document.getElementById('expansionRatio').value);
        const massFlowRate = parseFloat(document.getElementById('massFlowRate').value);
        const nozzleExitPressure = parseFloat(document.getElementById('nozzleExitPressure').value);}