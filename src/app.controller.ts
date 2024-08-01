import { Controller, Get } from '@nestjs/common';
import { AppService } from './app.service';

@Controller()
export class AppController {
	constructor(private readonly appService: AppService) { }

	@Get('/health-check')
	async healthCheck() {
		return await this.appService.healthCheck()
	}
}
