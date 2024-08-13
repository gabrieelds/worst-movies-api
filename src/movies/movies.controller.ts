import { Controller, Post, UseInterceptors, UploadedFile, Get } from '@nestjs/common';
import { MoviesService } from './movies.service';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('movies')
export class MoviesController {
	constructor(private readonly moviesService: MoviesService) { }

	@Get('intervals')
    async getWinnersIntervals() {
        return await this.moviesService.getWinnersIntervals();
    }
}
