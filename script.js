document.getElementById('uploadForm').addEventListener('submit', function(event) {
    event.preventDefault();
    console.log('Form submitted');

    const fileInput = document.getElementById('fileInput');
    const file = fileInput.files[0];
    if (!file) {
        alert('Please select a file');
        console.log('No file selected');
        return;
    }
    console.log('File selected:', file.name);

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
        } catch (error) {
            console.error('Error processing file:', error);
            alert('An error occurred while processing the file. Please ensure it is a valid Excel file.');
        }
    };
    reader.onerror = function(event) {
        console.error('File could not be read! Code ' + event.target.error.code);
        alert('File could not be read');
    };
    reader.readAsArrayBuffer(file);
});

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
        li.textContent = `${index + 1}. ${person}`;
        allList.appendChild(li);
    });
}

function displaySelectedPeople(selectedPeople) {
    const resultList = document.getElementById('resultList');
    resultList.innerHTML = '';
    selectedPeople.forEach((person, index) => {
        const li = document.createElement('li');
        li.textContent = `${index + 1}. ${person}`;
        resultList.appendChild(li);
    });
}
