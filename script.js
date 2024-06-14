document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const nameInput = document.getElementById('nameInput').value;
    const percentageSelect = document.getElementById('percentageSelect').value;
    const numberSelect = document.getElementById('numberSelect').value;

    if (file && nameInput.trim()) {
        alert('Please use only one method: either upload a file or enter names manually.');
        console.log('Both file and names entered');
        return;
    }

    if (!file && !nameInput.trim()) {
        alert('Please select a file or enter names.');
        console.log('No file selected and no names entered');
        return;
    }

    if (file) {
        handleFile(file, percentageSelect, numberSelect);
    } else {
        handleTextInput(nameInput, percentageSelect, numberSelect);
    }
});

document.getElementById('fileInput').addEventListener('change', function(event) {
    const file = event.target.files[0];
    if (file) {
        document.getElementById('removeFileButton').style.display = 'inline';
    }
});

document.getElementById('removeFileButton').addEventListener('click', function() {
    document.getElementById('fileInput').value = '';
    document.getElementById('removeFileButton').style.display = 'none';
});

function handleFile(file, percentage, number) {
    console.log('File selected:', file.name);

    // Show loading spinner
    document.getElementById('loadingSpinner').style.display = 'block';

    const reader = new FileReader();
    reader.onload = function(event) {
        console.log('File loaded');
        const data = new Uint8Array(event.target.result);
        try {
            const workbook = XLSX.read(data, { type: 'array' });
            const firstSheetName = workbook.SheetNames[0];
            const worksheet = workbook.Sheets[firstSheetName];
            const json = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

            // Assuming the first column contains the names
            const names = json.map(row => row[0]).filter(name => name);

            processNames(names, percentage, number);
        } catch (error) {
            console.error('Error processing file:', error);
            alert('An error occurred while processing the file. Please ensure it is a valid Excel file.');
        } finally {
            // Hide loading spinner
            document.getElementById('loadingSpinner').style.display = 'none';
        }
    };
    reader.onerror = function(event) {
        console.error('File could not be read! Code ' + event.target.error.code);
        alert('File could not be read');
        // Hide loading spinner
        document.getElementById('loadingSpinner').style.display = 'none';
    };
    reader.readAsArrayBuffer(file);
}

function handleTextInput(text, percentage, number) {
    console.log('Names entered:', text);

    const names = text.split('\n').map(name => name.trim()).filter(name => name);

    processNames(names, percentage, number);
}

function processNames(names, percentage, number) {
    if (names.length === 0) {
        alert('No valid names found.');
        return;
    }

    // Update total controllers count
    document.getElementById('totalControllers').textContent = names.length;

    // Display all names
    displayAllNames(names);

    // Determine number of selections
    let numToSelect = number ? parseInt(number) : Math.ceil(names.length * (percentage / 100));
    if (numToSelect > names.length) {
        numToSelect = names.length;
    }

    // Shuffle and select the required number
    const selectedPeople = selectRandom(names, numToSelect);

    // Update selected count
    document.getElementById('selectedCount').textContent = selectedPeople.length;

    // Display the result
    displaySelectedPeople(selectedPeople);
}

function selectRandom(names, numToSelect) {
    // Shuffle the array
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }

    // Select the required number
    return names.slice(0, numToSelect);
}

function displayAllNames(names) {
    const allList = document.getElementById('allList');
    allList.innerHTML = '';
    names.forEach((person, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index + 1);
        li.textContent = person;
        allList.appendChild(li);
    });
}

function displaySelectedPeople(selectedPeople) {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = '';
    selectedPeople.forEach((person, index) => {
        const li = document.createElement('li');
        li.setAttribute('data-index', index + 1);
        li.textContent = person;
        resultList.appendChild(li);
    });
}
