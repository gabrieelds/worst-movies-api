import { Test, TestingModule } from '@nestjs/testing';
import * as request from 'supertest';
import { AppModule } from '../src/app.module';
import { INestApplication } from '@nestjs/common';
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

	it('should return the producer with the largest interval between consecutive awards and both producers with fastest awards', async () => {
		const response = await request(app.getHttpServer())
			.get('/movies/intervals')
			.expect(200);

		expect(response.body.min).toHaveLength(1);
		expect(response.body.max).toHaveLength(1);
		expect(response.body.min[0].producer).toBe('Joel Silver');
		expect(response.body.min[0].previousWin).toBe(1990);
		expect(response.body.min[0].followingWin).toBe(1991);
		expect(response.body.min[0].interval).toBe(1);
		expect(response.body.max[0].producer).toBe('Matthew Vaughn');
		expect(response.body.max[0].previousWin).toBe(2002);
		expect(response.body.max[0].followingWin).toBe(2015);
		expect(response.body.max[0].interval).toBe(13);
	});

	afterAll(async () => {
		await app.close();
	});
});
