import { Injectable, InternalServerErrorException } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AbilitiesResponse } from './interfaces/AbilityResponse';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonResponse } from './interfaces/pokemonResponse';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { getRandomNumber, getRandomTrainer } from './utils/randomNumber';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;

  constructor(private readonly pokemonService: PokemonService) {}
  async executeSeed() {
    try {
      const [{ data }, { data: response }] = await Promise.all([
        this.axios.get<AbilitiesResponse>(
          'https://pokeapi.co/api/v2/ability/?offset=0&limit=400',
        ),
        this.axios.get<PokemonResponse>(
          'https://pokeapi.co/api/v2/pokemon/?offset=0&limit=400',
        ),
      ]);

      const abilities = data.results.map((ability) => {
        return ability.name;
      });
      const getRandomAbilities = (count: number) => {
        const shuffled = abilities.sort(() => 0.5 - Math.random());
        return shuffled.slice(0, count);
      };
      const pokemonArray = [];
      response.results.forEach(async (pokemon) => {
        const randomAbilities = getRandomAbilities(3);
        const pokemonInserted: CreatePokemonDto = {
          name: pokemon.name,
          level: getRandomNumber(),
          abilities: randomAbilities,
          trainer: getRandomTrainer(),
        };
        pokemonArray.push(pokemonInserted);
      });
      const pokemons = await this.pokemonService.insertMany(pokemonArray);

      return pokemons;
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }
}
