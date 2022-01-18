import { User } from './../../common/entity/user.entity';
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Note } from '../../common/entity/note.entity';
import { Like, Repository } from 'typeorm';
import { NoteAddDTO } from './dto/note-add.dto';
import { Message } from '../../common/entity/message.entity';

@Injectable()
export class NoteService {
    constructor(
        @InjectRepository(Note) private readonly noteRepository: Repository<Note>,
        @InjectRepository(User) private readonly userRepository: Repository<User>,
        @InjectRepository(Message) private readonly messageRepository: Repository<Message>,
    ) { }

    async add(noteAddDTO: NoteAddDTO, request: any): Promise<any> {
        const note = new Note();
        note.title = noteAddDTO.title;
        note.cover = noteAddDTO.cover;
        note.overview = noteAddDTO.overview;
        note.content = noteAddDTO.content;
        const user = await this.userRepository.findOne(request.user.userId);
        note.owner = user;
        const doc = await this.noteRepository.save(note);

        const message = new Message();
        message.title = '新建笔记';
        message.avatar = user.avatar;
        message.content = `<b>${user.nickname}</b>
                            新添加了一条笔记:
                            <b style="color:black;">${noteAddDTO.title}</b>`;
        await this.messageRepository.save(message)
        return {
            data: doc,
        };
    }

    async list(body: any): Promise<any> {
        const { keywords, page, size } = body;
        const total = await this.noteRepository.count();
        const doc = await this.noteRepository.find({
            where: [
                {
                    'title': Like(`%${keywords}%`),
                },
                {
                    'overview': Like(`%${keywords}%`),
                }
            ],
            relations: ["owner", "belong"],
            cache: true,
            order: {
                createDate: 'DESC'
            },
            skip: (page - 1) * size,
            take: size,
        });
        return {
            data: {
                list: doc,
                total: total
            },
        };
    }

    async delete(id: number | string): Promise<any> {
        const doc = await this.noteRepository.delete(id)
        return {
            data: doc,
        };
    }

    // 笔记详情
    async detail(noteId: number): Promise<any> {
        // const doc = await this.taskRepository.createQueryBuilder('task')
        //     .where('task.groupId = :id', { groupId })
        //     .setParameter("id", groupId)
        // .leftJoinAndSelect('task.principal', 'principal')
        // .select(`
        // principal.avatar as avatar
        // `)
        // .getMany()

        const doc = await this.noteRepository.findOne(noteId, {
            relations: ["owner",]
        })
        return {
            data: doc,
        };
    }

}
