import { Controller, Get, Header } from '@nestjs/common';
import { ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';

@ApiTags('Health & Observability')
@Controller()
export class SimpleHealthController {
  @Get()
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @ApiOperation({
    summary: 'Root health check',
    description: 'Returns plain-text `ok` at the application root.',
  })
  @ApiOkResponse({
    description: 'Plain-text root response.',
    schema: { type: 'string', example: 'ok' },
  })
  root(): string {
    return 'ok';
  }

  @Get('healthcheck')
  @Header('Content-Type', 'text/plain; charset=utf-8')
  @ApiOperation({
    summary: 'Simple health check',
    description: 'Returns plain-text `ok` without checking any dependencies.',
  })
  @ApiOkResponse({
    description: 'Plain-text healthcheck response.',
    schema: { type: 'string', example: 'ok' },
  })
  healthcheck(): string {
    return 'ok';
  }
}
