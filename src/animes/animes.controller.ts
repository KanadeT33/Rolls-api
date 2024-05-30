import { Controller, Get, Post, Body, Patch, Param, Delete, Query } from '@nestjs/common';
import { AnimesService } from './animes.service';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { TokenExchangeDto } from './dto/token-exchange.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';

@Controller('animes')
export class AnimesController {
  constructor(private readonly animesService: AnimesService) {}

  @Post()
  create(@Body() createAnimeDto: CreateAnimeDto) {
    return this.animesService.create(createAnimeDto);
  }

  @Get('rolls/:user')
  findAll() {
    return '0'
  }

  @Get(':user')
  findOne(@Param('user') user: string) {
    return this.animesService.poblarArray(user);
  }
  @Get('mal/verify')
  auth() {
    return this.animesService.verifyMalUser();
  }
  @Get('delete/:animeId')
  deleteAnime2(@Param('animeId') animeId: number) {
    return this.animesService.deleteAnime(animeId);
  }
  @Get('malAuth/codes')
  malGetUserAccessToken(@Query('code') code: string) {
      return this.animesService.getUserAccessToken(code);
  }
  @Post('idk/here2')
  auth2(@Body() tokenExchangeDto: TokenExchangeDto) {
    return this.animesService.exchangeAuthorizationCodeForTokens(
        tokenExchangeDto.code,
        tokenExchangeDto.client_secret,
        tokenExchangeDto.code_verifier,
    );
}


  @Patch(':id')
  update(@Param('id') id: string, @Body() updateAnimeDto: UpdateAnimeDto) {
    return this.animesService.update(+id, updateAnimeDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.animesService.remove(+id);
  }
}
