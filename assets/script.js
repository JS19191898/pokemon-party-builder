// global Variables
var searchTextEl = document.querySelector("#searchbar");
var generationSelectEl = document.querySelector("#select-generation");
var typeSelectEl = document.querySelector("#select-type");
var strengthSelectEl = document.querySelector("#select-strength");
var textUserInputEl = document.querySelector("#pokemon");
var baseUrl = "https://pokeapi.co/api/v2/";
var searchFormEl = document.querySelector("#search-form");
var containerEl = document.querySelector("#container");

//functions that perform search citeria ------------------------->
//Generates pokemon result from the input in the Search bar
function generatePokemon(pokemon) {
  var baseUrl = `https://pokeapi.co/api/v2/pokemon/${pokemon}/`;
  console.log(pokemon);
  fetch(baseUrl)
    .then((response) => {
      console.log(response);
      return response.json();
    })
    .then((data) => {
      console.log(data);
      generateCard(data);
    });
}
//generates pokemon results from "Generation" input

//generates pokemon results from "type" input

//generates pokemon results from "effective against" input

//TODO: function that saves pokemon (into local storage) after user selects it -----------
//(this will need to make the container results clickable with an eventlistener, and saving to the local storage)

// ad.eventlistener to 'click' submit button

// API from PokeAPI var baseUrl https://pokeapi.co/api/v2/type/{id or name}/

// grabs parent div to generate card from given types of search options
function generateCard(data) {
  var div = document.createElement("div");
  div.class = "tile is-ancestor";
  div.innerHTML = ` <div class="tile is-parent">

  <div class="card coulmn tile is-child is-3">
      <div class="card-image">
          <figure class="image is-4by3">
              <img src="https://www.serebii.net/swordshield/pokemon/001.png" alt="Bulbasaur">
          </figure>
      </div>
      <div class="card-content">
          <div class="media">
              <div class="media-left">
                  <p class="title is-3">Bulbasaur</p>
                  <p class="subtitle is-5">The Seed Pokemon</p>
              </div>
              <div class="media-content ">

                  <div class="type-image title is-pulled-right is-4">
                      <p class="type grass">Grass</p>
                      <p class="type poison">Poison</p>
                  </div>    
                  <div class="subtitle is-pulled-right">
                  </div>
              </div>
          </div>
          <div class="content">
              For some time after its birth, it grows by taking nourishment from the seed on its back.
              <p> type:${data.type}
              </p>
          </div>

          
      </div>
  </div>
  </div>`;

  // clears out search
  containerEl.innerHTML = "";

  containerEl.appendChild(div);
}
// generatePokemon();

searchFormEl.addEventListener("submit", function (event) {
  event.preventDefault();
  // console.log("clicky click")
  generatePokemon(textUserInputEl.value);
  // console.log(textUserInputEl.value);
});

//function that lets user take a photo of their entire selected party (OPTIONAL)
