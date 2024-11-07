import { Injectable } from '@nestjs/common';
import axios, { AxiosInstance } from 'axios';
import { AbilitiesResponse } from './interfaces/AbilityResponse';

@Injectable()
export class SeedService {
  private readonly axios: AxiosInstance = axios;
  async executeSeed() {
    const { data } = await this.axios.get<AbilitiesResponse>(
      'https://pokeapi.co/api/v2/ability/?offset=0&limit=400',
    );
    return data.results;
  }
}
