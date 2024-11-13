import {
  BadRequestException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreatePokemonDto } from './dto/create-pokemon.dto';
import { UpdatePokemonDto } from './dto/update-pokemon.dto';
import { Pokemon } from './entities/pokemon.entity';
import { isValidObjectId, Model } from 'mongoose';
import { InjectModel } from '@nestjs/mongoose';
import { PaginationDto } from 'src/common/dto/paginationDto';

@Injectable()
export class PokemonService {
  constructor(
    @InjectModel(Pokemon.name)
    private readonly pokenmonModel: Model<Pokemon>,
  ) {}
  async create(createPokemonDto: CreatePokemonDto) {
    try {
      createPokemonDto.name = createPokemonDto.name.toUpperCase();
      return await this.pokenmonModel.create(createPokemonDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in the database ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        'Error creating pokemon - check logs',
      );
    }
  }
  async insertMany(createPokemonDto: CreatePokemonDto[]) {
    try {
      createPokemonDto.forEach((pokemon) => {
        pokemon.name = pokemon.name.toUpperCase();
      });
      return await this.pokenmonModel.insertMany(createPokemonDto);
    } catch (error) {
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in the database ${JSON.stringify(error.keyValue)}`,
        );
      }
      console.log(error);
      throw new InternalServerErrorException(
        'Error creating pokemon - check logs',
      );
    }
  }

  findAll(queryParameters: PaginationDto) {
    const { limit = 10, offset = 0 } = queryParameters;
    return this.pokenmonModel
      .find()
      .limit(limit)
      .skip(offset)
      .sort({
        name: 1,
      })
      .select('-__v');
  }

  async findOne(term: string) {
    try {
      const query = isValidObjectId(term)
        ? { _id: term }
        : { name: term.toUpperCase().trim() };
      const pookemon = await this.pokenmonModel.findOne(query);
      if (!pookemon) {
        throw new BadRequestException('Pokemon not found');
      }
      return pookemon;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error finding pokemon - check logs ${JSON.stringify(error)}`,
      );
    }
  }

  async update(term: string, updatePokemonDto: UpdatePokemonDto) {
    try {
      const query = isValidObjectId(term)
        ? { _id: term }
        : { name: term.toUpperCase().trim() };
      const pokemon = await this.pokenmonModel.findOne(query);
      if (!pokemon) {
        throw new BadRequestException('Pokemon not found');
      }
      updatePokemonDto.name = updatePokemonDto.name.toUpperCase();
      return await this.pokenmonModel.findOneAndUpdate(
        query,
        updatePokemonDto,
        {
          new: true,
        },
      );
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      if (error.code === 11000) {
        throw new BadRequestException(
          `Pokemon already exists in the database ${JSON.stringify(error.keyValue)}`,
        );
      }
      throw new InternalServerErrorException(
        `Error updating pokemon - check logs ${JSON.stringify(error)}`,
      );
    }
  }

  async remove(id: string) {
    try {
      const result = await this.pokenmonModel.findByIdAndDelete(id);
      if (!result) {
        throw new BadRequestException('Pokemon not found');
      }
      return result;
    } catch (error) {
      if (error instanceof BadRequestException) {
        throw error;
      }
      throw new InternalServerErrorException(
        `Error deleting pokemon - check logs ${JSON.stringify(error)}`,
      );
    }
  }
}
