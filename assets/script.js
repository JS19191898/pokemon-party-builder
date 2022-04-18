// global Variables
var searchTextEl = document.querySelector("#searchbar");
var generationSelectEl = document.querySelector("#generation-select");
var typeSelectEl = document.querySelector("#select-type");
var strengthSelectEl = document.querySelector("#select-strength");
var textUserInputEl = document.querySelector("#pokemon");
var baseUrl = "https://pokeapi.co/api/v2/";
var searchFormEl = document.querySelector("#search-form");
var containerEl = document.querySelector("#container");
var modalAlertEl = document.querySelector("#modal-js-example");
var closeModalEl = document.querySelector("#close-modal");
console.log(closeModalEl);
console.log(modalAlertEl);

//functions that perform search citeria ------------------------->
//Generates pokemon result from the input in the Search bar
function generatePokemon(pokemon) {

  var baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;
  console.log(pokemon);
  fetch(baseUrl)
    .then((response) => {
      console.log(response.status);
      if (response.status === 404) {
        console.log(response.status);
        modalAlert();
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      generateCard(data);
    })
    .catch(error => {
      console.error('Error:', error);
    });
}

//converts name to id THEN calls generatePokemon
function convertToID(pokemon) {
  var baseUrl = `https://pokeapi.co/api/v2/pokemon-species/${pokemon}/`;
  console.log(pokemon);

  fetch(baseUrl)
    .then((response) => {
      console.log(response.status);
      return response.json();
    })
    .then((data) => {
      // console.log("Fetched ID result: ")
      // console.log(data.id);
      generatePokemon(data.id);
    });

  //return Pokeid;
}

function findGeneration(generation) {
  //debugger

  var baseUrl = `https://pokeapi.co/api/v2/generation/${generation}/`;
  console.log(generation);

  fetch(baseUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data.pokemon_species);

      data.pokemon_species.forEach((element) => {
        console.log(element.name);
        convertToID(element.name);
      });

      // for(var i = 0; i < data.pokemon_species.length; i++) {
      //   console.log(data.pokemon_species[i].name);
      //   generatePokemon(data.pokemon_species[i].name);
      // }

      // console.log(data.pokemon_species[0].name);
      // generatePokemon(data.pokemon_species[0].name);
    });
}

function modalAlert() {
  modalAlertEl.classList.add("is-active");
}

function closeModal() {
  modalAlertEl.classList.remove("is-active");
}

//generates pokemon results from "type" input

//generates pokemon results from "effective against" input

//TODO: function that saves pokemon (into local storage) after user selects it -----------
//(this will need to make the container results clickable with an eventlistener, and saving to the local storage)

// API from PokeAPI var baseUrl https://pokeapi.co/api/v2/type/{id or name}/

// grabs parent div to generate card from given types of search options
function generateCard(data) {
  // clears out previous results
  containerEl.innerHTML = "";

  //Fetch call to get the pokedex description
  var baseUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.id}/`;
  console.log(data.name);
  fetch(baseUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((specData) => {
      console.log(specData);

      //Small loop to cycle through the types array
      var types = "";
      data.types.forEach((element) => {
        console.log(element.type.name);

        types += `<p class="type ${element.type.name}">${element.type.name}</p>`;
        console.log(types);
      });

      var div = document.createElement("div");
      div.classList.add("card");
      div.classList.add("column");
      div.classList.add("is-2");
      div.classList.add("m-1");
      div.classList.add("is-flex-glow-1");
      div.classList.add("is-flex-shrink-0");
      div.innerHTML =
        `
        <div class="card-image">
          <figure class="image is-4by3">
              <img src=${data.sprites.other["official-artwork"].front_default} alt="${data.name}">
          </figure>
        </div>
        <div class="card-content">
            <div id="pokemon-title" class="media">
              <div class="media-left">
                  <p class="title">${data.name}</p>
                  <p class="subtitle ">${specData.genera[7].genus}</p>
              </div>
              <div class="media-content ">

                  <div class="type-image title is-pulled-right is-4">` +
        types +
        `</div>    
              </div>
            </div>
            <div class="content">
            ${specData.flavor_text_entries[6].flavor_text}
            </div>
        </div>
  <button  class="button is-primary" id="addPokemon">Add to Party!</button>
  <button  class="button is-primary">Remove from Party!</button>
  <button  class="button is-primary">Clear Party!</button>`;
      //establishing the click function for the "add to party" button
      // $("#addPokemon").on("click", function () {
      //   var selectedPokemon = $(this).parent().attr("#pokemonResult");
      //   // var time = $(this).parent().attr("id");
      //   //puts the items from the user into the local storage
      //   localStorage.setItem(selectedPokemon);
      //   });
      containerEl.appendChild(div);
    });
}
// generatePokemon();
searchFormEl.addEventListener("submit", function (event) {
  //debugger
  event.preventDefault();
  // console.log("clicky click")
  //generatePokemon(textUserInputEl.value);

  convertToID(textUserInputEl.value.toLowerCase());
});

generationSelectEl.addEventListener("submit", function (event) {
  //debugger

  event.preventDefault();
  //console.log(event.target.value);

  findGeneration(event.target.value);
});



closeModalEl.addEventListener("click", closeModal);

//function that lets user take a photo of their entire selected party (OPTIONAL)

// !<-------------------------------->
// // Saving to local storage
// localStorage.setItem():

// Remove Data from Local Storage
// localStorage.removeItem(key)

// Remove All (Clear Local Storage)
// localStorage.clear();
