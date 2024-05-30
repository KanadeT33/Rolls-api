import { Injectable } from '@nestjs/common';
import { CreateAnimeDto } from './dto/create-anime.dto';
import { UpdateAnimeDto } from './dto/update-anime.dto';
import { HttpService } from '@nestjs/axios';

const querystring = require('querystring');
const axios = require('axios');
const crypto = require('crypto');

const clientId='8bce3d413e7a6f1578d4b63eb450d034'
let codeVerifier = ''
const clientSecret='a9245cda8eb0606d099b431e3def11d648e4bddc0cfc74f1095ac8768688441b'
let token= 'eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6Ijg5MWM2MTQxZWJlYjgxYTY3OTBiNmJlNzI1N2RjZjg4M2M3OWNlNTllODZmMWY0NDM1OTQzODdhYWNkMzRiZDhhODc5YzA3MTc5ODNkYzA0In0.eyJhdWQiOiI4YmNlM2Q0MTNlN2E2ZjE1NzhkNGI2M2ViNDUwZDAzNCIsImp0aSI6Ijg5MWM2MTQxZWJlYjgxYTY3OTBiNmJlNzI1N2RjZjg4M2M3OWNlNTllODZmMWY0NDM1OTQzODdhYWNkMzRiZDhhODc5YzA3MTc5ODNkYzA0IiwiaWF0IjoxNzEzNzI4MjY0LCJuYmYiOjE3MTM3MjgyNjQsImV4cCI6MTcxNjMyMDI2NCwic3ViIjoiODI0NTg3NCIsInNjb3BlcyI6W119.f5UeOrM9ydLEniw9gwv5D6rULAUD2ebF9VmYn857BnKwOMd6Lq3pRQZv6J3FUvomb7M2kLfKojNo4a_JX7x8GNmPO_2Gb5VgaBTq-tH5o32EaiXDlX0Dvg6ImwgUM6X44U8ssI4GoSyBk1bXKMoSbny-6q_Gr8jKePoDdq004WcTSQTlYFNvsmFcTFT1ix3HcPOBy7aq4zVS1mUyYfJo-jtH_GqDsD2VWS6YyslAfOIYZInlkO4xcpxiQcjtGykHNAZrcGOgYLm6MxzSKt5MFR1SVQ7q9zxN3L2nqFSRZ-jWqqR2ec4c6o8JkO0jXuXeoKgXOo72LKNuUjgktxw_LQ'


@Injectable()
export class AnimesService {
  constructor(private httpService: HttpService ) {}
  create(createAnimeDto: CreateAnimeDto) {
    return 'This action adds a new anime';
  }

  findAll() {
    return `this thing works as expected`;
  }

  findOne(id: number) {
    return `This action returns a #${id} anime`;
  }
  async verifyMalUser () {
    const generateCodeVerifierAndChallenge=()=>{
      const codeVerifier= crypto.randomBytes(32).toString('hex')
      const codeChallenge= codeVerifier
      return {codeVerifier, codeChallenge}
    }
    const code= generateCodeVerifierAndChallenge()
    codeVerifier= code.codeVerifier
    
    const params = new URLSearchParams({
      response_type: 'code',
      client_id: clientId,
      code_challenge: code.codeChallenge,
    }).toString();
    const url = `https://myanimelist.net/v1/oauth2/authorize?${params}`;
    return url
  }
  async exchangeAuthorizationCodeForTokens(code: string,client_secret: string, code_verifier:string) {
   
    const authHeader = Buffer.from(`${clientId}:${client_secret}`).toString('base64');
    const data = querystring.stringify({
        client_id: clientId,
        grant_type: 'authorization_code',
        client_secret: client_secret,
        code,
        code_verifier 
    });

    const config = {
        headers: {
            'Authorization': `Basic ${authHeader}`,
            'Content-Type': 'application/x-www-form-urlencoded'
        }
    };

    try { 
        const response = await axios.post('https://myanimelist.net/v1/oauth2/token', data, config);
        return response.data;
    } catch (error) {
        console.error('Failed to exchange authorization code:', error);
        throw error;
    }
}

  async getUserAccessToken(auth_code: string) {
    const response= await this.exchangeAuthorizationCodeForTokens(auth_code, clientSecret, codeVerifier)
   return response
    
  }
  async deleteAnime(animeId) {
    const config = {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    };
    
    try {
        const response = await axios.delete(`https://api.myanimelist.net/v2/anime/${animeId}/my_list_status`, config);
        console.log(response.status);
        
    } catch (error) {
        console.error('Failed to delete anime:', error);
        throw error; 
    }
}

 
  update(id: number, updateAnimeDto: UpdateAnimeDto) {
    return `This action updates a #${id} anime`;
  }

  remove(id: number) {
    return `This action removes a #${id} anime`;
  }
  async poblarArray(user) {
    
    const animes= []
    const headers = {
      'X-MAL-CLIENT-ID': '8bce3d413e7a6f1578d4b63eb450d034',
    };
    const response = await this.httpService.get(`https://api.myanimelist.net/v2/users/${user}/animelist?status=plan_to_watch&limit=1000`, {headers}).toPromise();
    
    response.data.data.map(x=>{
      animes.push(x.node.title)
    })
    return animes;

  }
}
