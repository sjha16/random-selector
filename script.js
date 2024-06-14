document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    const nameInput = document.getElementById('nameInput').value;

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
        handleFile(file);
    } else {
        handleTextInput(nameInput);
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

function handleFile(file) {
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

            processNames(names);
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

function handleTextInput(text) {
    console.log('Names entered:', text);

    const names = text.split('\n').map(name => name.trim()).filter(name => name);

    processNames(names);
}

function processNames(names) {
    if (names.length === 0) {
        alert('No valid names found.');
        return;
    }

    // Update total controllers count
    document.getElementById('totalControllers').textContent = names.length;

    // Display all names
    displayAllNames(names);

    // Shuffle and select 25%
    const selectedPeople = selectRandom25Percent(names);

    // Update selected count
    document.getElementById('selectedCount').textContent = selectedPeople.length;

    // Display the result
    displaySelectedPeople(selectedPeople);
}

function selectRandom25Percent(names) {
    // Shuffle the array
    for (let i = names.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [names[i], names[j]] = [names[j], names[i]];
    }

    // Calculate 25% of the total and round up
    const numToSelect = Math.ceil(names.length * 0.25);
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
