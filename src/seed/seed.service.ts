import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { AbilitiesResponse } from './interfaces/AbilityResponse';
import { PokemonService } from 'src/pokemon/pokemon.service';
import { PokemonResponse } from './interfaces/pokemonResponse';
import { CreatePokemonDto } from 'src/pokemon/dto/create-pokemon.dto';
import { getRandomNumber, getRandomTrainer } from './utils/randomNumber';
import { AxiosAdapter } from 'src/common/adapters/axios.adapter';

@Injectable()
export class SeedService {
  constructor(
    private readonly pokemonService: PokemonService,
    private readonly http: AxiosAdapter,
  ) {}
  async executeSeed() {
    try {
      const [data, response] = await Promise.all([
        this.http.get<AbilitiesResponse>(
          'https://pokeapi.co/api/v2/ability/?offset=0&limit=400',
        ),
        this.http.get<PokemonResponse>(
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
