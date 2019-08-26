import { Component, OnInit, OnChanges, OnDestroy } from '@angular/core';
import { PokemonListService } from './pokemon-list.service';
import { Ipokemon } from './pokemon';

@Component({
  selector: 'app-pokemon-list',
  templateUrl: './pokemon-list-component.html',
  styleUrls: ['./pokemon-list-component.scss'],
  providers: [ PokemonListService ]
})
export class PokemonListComponent implements OnInit {

  pokemonList: Ipokemon[] = [];
  config: any;
  count: any;
  pokemonListPreferences: any = [];

  constructor(
      private pokemonListService: PokemonListService
  ) {
    this.pokemonListPreferences = JSON.parse(localStorage.getItem('pokemonListPreferences')) || [];
  }

  ngOnInit() {
    this.loadPokemons();
  }

  loadPokemons() {
    this.pokemonListService.getPokemons().subscribe(
      ({count, results}: any) => {
        this.count = count;

        this.pokemonList = results.map(({name}) => ({
          name,
          favorited: this.pokemonListPreferences.length && this.pokemonListPreferences.indexOf(name) !== -1
        }));
      }
    );

    this.config = {
      itemsPerPage: 10,
      currentPage: 1,
      totalItems: this.count
    };
  }

  pageChanged(event) {
    this.config.currentPage = event;
  }

  favoritePokemon(pokemonName) {
    const pokemonIndex = this.pokemonListPreferences.indexOf(pokemonName);

    if (pokemonIndex !== -1) {
      this.pokemonListPreferences.splice(pokemonIndex, 1);
    } else {
      this.pokemonListPreferences.push(pokemonName);
    }

    localStorage.setItem('pokemonListPreferences', JSON.stringify(this.pokemonListPreferences));
  }
}
