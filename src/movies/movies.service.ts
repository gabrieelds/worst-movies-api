import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Movie } from './entities/movie.entity';
import { Repository } from 'typeorm';
import { finished } from 'stream/promises';
import * as fastcsv from 'fast-csv';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MoviesService {
	constructor(
		@InjectRepository(Movie)
		private movieRepository: Repository<Movie>,
	) { }

	private async uploadMovies() {
		//garantimos que o banco é limpo antes de inserir os dados
		await this.movieRepository.clear();
		const movies: Movie[] = [];

		const csvPath = path.join(process.cwd(), 'src', 'movies', 'data', 'movielist.csv');
	
		try {
			const readableStream = fs.createReadStream(csvPath)
			const csvStream = fastcsv.parseStream(readableStream, { headers: true, delimiter: ';' });

			for await (const row of csvStream) {
				movies.push({
					year: row['year'],
					title: row['title'],
					studios: row['studios'],
					producers: row['producers'],
					winner: row['winner'] == 'yes' ? true : false,
				} as Movie);
			}
	
			// Só pra garantir que o stream foi finalizado
			await finished(readableStream);
	
			await this.movieRepository.save(movies)
		} catch (e) {
			throw new HttpException(`Error processing file. ${e.message}`, HttpStatus.BAD_REQUEST);
		}
	}

	async getWinnersIntervals() {
		await this.uploadMovies()
		const winnersMovies = await this.movieRepository.find({ where: { winner: true }, order: { year: 'ASC' } });

		const winnerProducers = new Map<string, number[]>();

		for (const winner of winnersMovies) {
			// Pode haver mais de um produtor por filme, e aparentemente são separados por ',' OU 'and'
			const producers = winner.producers.split(/,\s*|\s+and\s+/);

			for (const producer of producers) {
				const trimmedProducer = producer.trim();
				if (!winnerProducers.has(trimmedProducer)) {
					winnerProducers.set(trimmedProducer, []);
				}
				winnerProducers.get(trimmedProducer)!.push(winner.year);
			}
		}

		let minInterval = Infinity;
		let maxInterval = -Infinity;
		const minIntervals = [];
		const maxIntervals = [];

		for (const [producer, years] of winnerProducers) {
			years.sort((a, b) => a - b);

			for (let i = 1; i < years.length; i++) {
				const prevYear = years[i - 1];
				const currYear = years[i];
				const interval = currYear - prevYear;

				if (interval < minInterval) {
					minInterval = interval;
					minIntervals.length = 0;
					minIntervals.push({ producer, interval, previousWin: prevYear, followingWin: currYear });
				} else if (interval === minInterval) {
					minIntervals.push({ producer, interval, previousWin: prevYear, followingWin: currYear });
				}

				if (interval > maxInterval) {
					maxInterval = interval;
					maxIntervals.length = 0;
					maxIntervals.push({ producer, interval, previousWin: prevYear, followingWin: currYear });
				} else if (interval === maxInterval) {
					maxIntervals.push({ producer, interval, previousWin: prevYear, followingWin: currYear });
				}
			}
		}

		return {
			min: minIntervals,
			max: maxIntervals,
		};
	}
}
