import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
import * as path from 'path';
import { testDataSource } from './config/database.test';
import { TypeOrmModule } from '@nestjs/typeorm';

describe('App E2E Test', () => {
	let app: INestApplication;

	beforeAll(async () => {
		await testDataSource.initialize();

		const moduleFixture: TestingModule = await Test.createTestingModule({
			imports: [
				AppModule,
				TypeOrmModule.forRoot(testDataSource.options),
			],
		}).compile();

		app = moduleFixture.createNestApplication();
		await app.init();
	});

	it('should successfully upload the file', async () => {
		const csvFilePath = path.resolve(__dirname, 'data/movielist.csv');
		await request(app.getHttpServer())
			.post('/movies')
			.attach('movielist', csvFilePath)
			.expect(201);
	});	

	it('should return the producer with the largest interval between consecutive awards and both producers with fastest awards', async () => {
		const response = await request(app.getHttpServer())
			.get('/movies/intervals')
			.expect(200);

		expect(response.body.min).toHaveLength(2);
		expect(response.body.max).toHaveLength(1);
		expect(response.body.min[0].producer).toBe('Producer 3');
		expect(response.body.min[0].previousWin).toBe(2003);
		expect(response.body.min[0].followingWin).toBe(2006);
		expect(response.body.min[0].interval).toBe(3);
		expect(response.body.min[1].producer).toBe('Producer 2');
		expect(response.body.min[1].previousWin).toBe(2005);
		expect(response.body.min[1].followingWin).toBe(2008);
		expect(response.body.min[1].interval).toBe(3);
		expect(response.body.max[0].producer).toBe('Producer 33');
		expect(response.body.max[0].previousWin).toBe(2000);
		expect(response.body.max[0].followingWin).toBe(2013);
		expect(response.body.max[0].interval).toBe(13);
	});

	it('should return an error for incorrectly formatted CSV', async () => {
		const csvFilePath = path.resolve(__dirname, 'data/movielist_error.csv');
		const response = await request(app.getHttpServer())
			.post('/movies')
			.attach('movielist', csvFilePath)
			.expect(400);

		expect(response.body).toHaveProperty('message');
		expect(response.body.message).toContain('Error processing file.');
	});

	afterAll(async () => {
		await app.close();
	});
});
