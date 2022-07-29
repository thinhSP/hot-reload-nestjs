import {
  Body,
  CacheInterceptor,
  CACHE_MANAGER,
  Controller,
  Get,
  HttpStatus,
  Inject,
  Param,
  Post,
  Res,
  UseInterceptors,
} from '@nestjs/common';
import { Book } from './book.model';
import { LibraryService } from './library.service';
import { Cache } from 'cache-manager';
// import { LibraryService } from "./library.service";

@UseInterceptors(CacheInterceptor)
@Controller('books')
export class LibraryController {
  randomNumDbs = () => Math.floor(Math.random() * 10);

  constructor(
    private readonly libraryService: LibraryService,
    @Inject(CACHE_MANAGER) private cacheManager: Cache,
  ) {}

  @Post()
  async createBook(@Res() response, @Body() book: Book) {
    const newBook = await this.libraryService.createBook(book);
    return response.status(HttpStatus.CREATED).json({
      newBook,
    });
  }

  @Get()
  async fetchAll(@Res() response) {
    const books = await this.libraryService.findAll();
    return response.status(HttpStatus.OK).json({
      books,
    });
  }

  // @Get('/:id')
  // async findById(@Res() response, @Param('id') id) {
  //   const book = await this.libraryService.findOne(id);
  //   return response.status(HttpStatus.OK).json({
  //     book,
  //   });
  // }

  @Get('get-number-cache')
  async getNumber(): Promise<any> {
    // const val = await this.cacheManager.get('number');
    // if (val) {
    //   return {
    //     data: val,
    //     FromRedis: 'this is loaded from redis cache',
    //   };
    // }

    // if (!val) {
    // await this.cacheManager.set('number', this.randomNumDbs, { ttl: 5 });
    return {
      data: this.randomNumDbs(),
      FromRandomNumDbs: 'this is loaded from randomNumDbs',
    };
    // }
  }
}
