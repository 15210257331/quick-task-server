import { Body, Controller, Get, Param, ParseIntPipe, Post, Query, Request, UseGuards, UsePipes } from '@nestjs/common';
import { NoteService } from './note.service';
import { ValidationPipe } from '../../common/pipe/validation.pipe';
import { AuthGuard } from '@nestjs/passport';
import { ApiTags } from '@nestjs/swagger';
import { NoteAddDTO } from './dto/note-add.dto';

@ApiTags('笔记相关接口')
@Controller('/note')
export class NoteController {
    constructor(
        private readonly noteService: NoteService,
    ) { }

    // 添加笔记
    @Post('/add')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async add(@Body() roleAddDTO: NoteAddDTO, @Request() request: any): Promise<any> {
        return this.noteService.add(roleAddDTO, request);
    }

    // 笔记详情
    @Get('/detail')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async detail(@Query('noteId', new ParseIntPipe()) noteId: number): Promise<any> {
        return this.noteService.detail(noteId);
    }

    // 查询笔记不分页
    @Get('/list')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async list(@Query('keywords') keywords?: string): Promise<any> {
        return this.noteService.list(keywords);
    }

    // 删除笔记
    @Get('/delete/:id')
    @UsePipes(new ValidationPipe())
    @UseGuards(AuthGuard('jwt'))
    public async delete(@Param('id') id: number | string): Promise<any> {
        return this.noteService.delete(id);
    }

}