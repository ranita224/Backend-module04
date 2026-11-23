import { Public } from '../auth/decorators/public.decorator.js';
import {
  Body,
  Controller,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Query,
  Res,
} from '@nestjs/common';
import { CreateEventDto } from './dto/create-event.dto.js';
import { FindEventsQueryDto } from './dto/find-events-query.dto.js';
import { EventsService } from './events.service.js';

/** Only what we need from the response object (to set a header). */
interface HeaderSetter {
  setHeader(name: string, value: string): void;
}


@Controller('events')
export class EventsController {
  constructor(private readonly eventsService: EventsService) {}

  @Public()
  @Get()
  findAll(
    @Query() query: FindEventsQueryDto,
    @Res({ passthrough: true }) res: HeaderSetter,
  ) {
    const result = this.eventsService.findAll(query);
    res.setHeader('X-Total-Count', String(result.total));
    return result;
  }

  @Public()
  @Get('upcoming')
  findUpcoming() {
    return this.eventsService.findUpcoming();
  }

  @Public()
  @Get('published') 
  findPublished() {
    return this.eventsService.findPublished();
  }

  @Public()
  @Get(':id/sessions/:sessionId')
  findOneSession(
    @Param('id') id: string,
    @Param('sessionId') sessionId: string,
  ) {
    return this.eventsService.findSession(id, sessionId);
  }

  @Public()
  @Get(':id/sessions')
  findSessions(@Param('id') id: string) {
    return this.eventsService.findSessions(id);
  }

  @Public()
  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.eventsService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED) 
  create(@Body() body: CreateEventDto) {
    return this.eventsService.create(body);
  }
}
