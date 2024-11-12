import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { File } from './file.entity';
import { Repository } from 'typeorm';
import { unlink, writeFile } from 'fs/promises';
import { join } from 'path';

export const FILE_DESTINATION = join(process.cwd(), 'uploads');

@Injectable()
export class FileService {
  constructor(
    @InjectRepository(File) private fileRepository: Repository<File>,
  ) {}

  async findOneById(fileId: string) {
    return await this.fileRepository.findOneBy({
      id: fileId,
    });
  }

  async save(file: Express.Multer.File) {
    const newFile = await this.fileRepository.create({
      filename: file.originalname,
      mimetype: file.mimetype,
      path: FILE_DESTINATION,
    });
    await this.fileRepository.save(newFile);
    await writeFile(`${FILE_DESTINATION}/${newFile.id}`, file.buffer);

    return newFile;
  }

  async delete(id: string) {
    const file = await this.fileRepository.findOneByOrFail({ id });
    await unlink(file.path);
    await this.fileRepository.delete(file);
  }
}
