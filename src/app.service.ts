import { Injectable } from '@nestjs/common';
import { HealthCheckService, HttpHealthIndicator, TypeOrmHealthIndicator } from '@nestjs/terminus';

@Injectable()
export class AppService {
	constructor(
		private health: HealthCheckService,
		private http: HttpHealthIndicator,
		private db: TypeOrmHealthIndicator,
	) { }

	async healthCheck() {
		return this.health.check([
			async () => this.db.pingCheck('database'),
			async () => this.http.pingCheck('nestjs', 'http://nestjs.com'),
		]);
	}
}
