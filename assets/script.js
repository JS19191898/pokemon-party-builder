// global Variables
var searchTextEl = document.querySelector("#searchbar");
var generationSelectEl = document.querySelector("#select-generation");
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
        modalAlert();
      }

      return response.json();
    })
    .then((data) => {
      console.log(data);
      generateCard(data);
    });
}

function modalAlert() {
  modalAlertEl.classList.add("is-active");
}

function closeModal() {
  modalAlertEl.classList.remove("is-active");
}
//generates pokemon results from "Generation" input

//generates pokemon results from "type" input

//generates pokemon results from "effective against" input

//TODO: function that saves pokemon (into local storage) after user selects it -----------
//(this will need to make the container results clickable with an eventlistener, and saving to the local storage)


// grabs parent div to generate card from given types of search options
function generateCard(data) {
  //Fetch call to get the pokedex description
  var baseUrl = `https://pokeapi.co/api/v2/pokemon-species/${data.name}/`;
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
      div.class = "tile is-ancestor";
      div.innerHTML =
        ` <div class="tile is-parent">

  <div class="card coulmn tile is-child is-3">
      <div class="card-image">
          <figure class="image is-4by3">
              <img src=${data.sprites.other["official-artwork"].front_default} alt="Bulbasaur">
          </figure>
      </div>
      <div class="card-content">
          <div id="pokemon-title" class="media">
              <div class="media-left">
                  <p class="title is-3">${data.species.name}</p>
                  <p class="subtitle is-5">${specData.genera[7].genus}</p>
              </div>
              <div class="media-content ">

                  <div class="type-image title is-pulled-right is-4">` +
        types +
        `</div>    

                  <div class="subtitle is-pulled-right">
                  </div>
              </div>
          </div>
          <div class="content">
              ${specData.flavor_text_entries[8].flavor_text}
          </div>
          
      </div>
  </div>
  </div>
  <button  class="button is-primary">Add to Party!</button>`;

      // clears out search
      containerEl.innerHTML = "";

      containerEl.appendChild(div);
    });
}
// generatePokemon();

searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  // console.log("clicky click")
  generatePokemon(textUserInputEl.value);
  // console.log(textUserInputEl.value);
});

closeModalEl.addEventListener("click", closeModal);

//function that lets user take a photo of their entire selected party (OPTIONAL)

// !<-------------------------------->
// // Saving to local storage
// localStorage.setItem():

// make an array 
// save data

// Remove Data from Local Storage
// localStorage.removeItem(key)

// Remove All (Clear Local Storage)
// localStorage.clear();
