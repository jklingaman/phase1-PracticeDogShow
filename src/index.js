
function buildDog(dog) {
    const tr = document.createElement('tr');
    const tableBody = document.querySelector('#table-body');

    tr.innerHTML = `
    <td>${dog.name}</td>
    <td>${dog.breed}</td>
    <td>${dog.sex}</td>
    <td style='padding: 2px;'><button style='width: 100%;'>Edit Dog</button></td>
    `

    tr.dataset.id = dog.id;

    tableBody.appendChild(tr)

    const dogNameInput = document.querySelector('#dog-form input[name = "name"]');
    const breedInput = document.querySelector('#dog-form input[name = "breed"]');
    const sexInput = document.querySelector('#dog-form input[name = "sex"]');
    const hiddenId = document.querySelector('#dog-form input[name="id"]');
    

    // const name = dogNameInput.value;
    // const breed = breedInput.value;
    // const sex = sexInput.value; these are only being kept to show that when un-hidden theyre unused below in the eventListener that is because the values that they are using are in formSubmit.

    const btn = tr.querySelector('button');

    btn.addEventListener('click', (e) => {
        e.preventDefault()

        dogNameInput.value = dog.name;
        breedInput.value = dog.breed; // this code pre-fills the form when the button is clicked!
        sexInput.value = dog.sex;
        hiddenId.value = dog.id;

    })
}

function formSubmit() {
    const form = document.querySelector('#dog-form');
    const dogNameInput = document.querySelector('#dog-form input[name = "name"]');
    const breedInput = document.querySelector('#dog-form input[name = "breed"]');
    const sexInput = document.querySelector('#dog-form input[name = "sex"]');
    const formId = form.querySelector('input[name="id"]');
    
    form.addEventListener('submit', (e) => {
        e.preventDefault()

        const dog = {
            name: dogNameInput.value,
            breed: breedInput.value,
            sex: sexInput.value,
            id: formId.value
        };

        if (dog.id) {
            dogPatch(dog)
        } else {
            formPost(dog)
        }
  
        dogNameInput.value = '';
        breedInput.value = '';
        sexInput.value = '';
        formId.value = '';
    }) 
}

function formPost(dog) {
    fetch('http://localhost:3000/dogs', {
        'method': 'POST',
        'headers': {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            name: dog.name,
            breed: dog.breed,
            sex: dog.sex
        })
    })
    .then((res) => res.json())
    .then((dogInfo) => buildDog(dogInfo)) 
}

function dogPatch(dog) {
    fetch(`http://localhost:3000/dogs/${dog.id}`, {
        'method': 'PATCH',
        'headers': {
            'Content-Type': 'application/json',
        },
        body:JSON.stringify({
            name: dog.name,
            breed: dog.breed,
            sex: dog.sex
        })
    })
    .then((res) => res.json())
    .then((dogInfo) => {
        const oldRow = document.querySelector(`tr[data-id="${dogInfo.id}"]`);
        if (oldRow) oldRow.remove();

        buildDog(dogInfo)
    }); 
}

function fetchDogs() {
    fetch('http://localhost:3000/dogs')
    .then((res) => res.json())
    .then((data) => {
        data.forEach((dog) => {
            buildDog(dog)
        })
    })
}

function Init() {
    fetchDogs()
    formSubmit()
}

document.addEventListener('DOMContentLoaded', () => {Init()})