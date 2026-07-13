function convertTemperature() {
    const tempInput = document.getElementById('temperature').value;
    const fromUnit = document.querySelector('input[name="fromUnit"]:checked').value;
    const toUnit = document.querySelector('input[name="toUnit"]:checked').value;
    const resultSection = document.getElementById('resultSection');
    const errorSection = document.getElementById('errorSection');
    const resultText = document.getElementById('resultText');
    const errorText = document.getElementById('errorText');

    if (tempInput === '' || isNaN(tempInput)) {
        errorSection.style.display = 'block';
        resultSection.style.display = 'none';
        errorText.textContent = 'Please enter a valid number!';
        return;
    }

    const temperature = parseFloat(tempInput);
    let result;

    if (fromUnit === toUnit) {
        result = temperature;
    } else if (fromUnit === 'celsius' && toUnit === 'fahrenheit') {
        result = (temperature * 9/5) + 32;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'celsius') {
        result = (temperature - 32) * 5/9;
    } else if (fromUnit === 'celsius' && toUnit === 'kelvin') {
        result = temperature + 273.15;
    } else if (fromUnit === 'kelvin' && toUnit === 'celsius') {
        result = temperature - 273.15;
    } else if (fromUnit === 'fahrenheit' && toUnit === 'kelvin') {
        result = (temperature - 32) * 5/9 + 273.15;
    } else if (fromUnit === 'kelvin' && toUnit === 'fahrenheit') {
        result = (temperature - 273.15) * 9/5 + 32;
    }

    result = Math.round(result * 100) / 100;

    const unitSymbol = {
        'celsius': '°C',
        'fahrenheit': '°F',
        'kelvin': 'K'
    };

    errorSection.style.display = 'none';
    resultSection.style.display = 'block';
    resultText.textContent = `${temperature} ${unitSymbol[fromUnit]} = ${result} ${unitSymbol[toUnit]}`;
}

document.getElementById('temperature').addEventListener('keypress', function(event) {
    if (event.key === 'Enter') {
        convertTemperature();
    }
});
