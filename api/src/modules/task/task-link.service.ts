import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { TaskLink } from './task-link.entity';
import { In, Repository } from 'typeorm';
import { TaskLinkInput } from './dtos/task-link.input';

@Injectable()
export class TaskLinkService {
  constructor(
    @InjectRepository(TaskLink)
    private linkRepository: Repository<TaskLink>,
  ) {}
  async add(link: TaskLinkInput) {
    const newLink = this.linkRepository.create(link);
    return await this.linkRepository.save(newLink);
  }
  async addMany(links: TaskLinkInput[]) {
    const newLinks = this.linkRepository.create(links);
    return await this.linkRepository.save(newLinks);
  }
  async delete(link: TaskLink) {
    return await this.linkRepository.delete(link.id);
  }
  async deleteMany(links: TaskLink[]) {
    return await this.linkRepository.delete(links.map((x) => x.id));
  }
  // e.g. task update
  // delete diverging oldLinks, create new Links, return actual links
  async alignLinks(oldLinks: TaskLink[], linkInputs: TaskLinkInput[]) {
    // delete all existing links, if input is empty
    if (!linkInputs?.length) {
      if (oldLinks?.length) {
        await this.deleteMany(oldLinks);
      }
      return [];
    }
    const newLinkInputs = linkInputs.filter((l) => !l.id) ?? [];
    const newLinks = await this.addMany(newLinkInputs);
    const existingLinks = await this.linkRepository.find({
      where: {
        id: In(linkInputs.filter((l) => !!l.id).map((l) => l.id)),
      },
    });
    const toDelete = oldLinks.filter(
      (l) => ![...newLinks, ...existingLinks].map((x) => x.id).includes(l.id),
    );
    if (toDelete.length) {
      await this.deleteMany(toDelete);
    }
    return [...newLinks, ...existingLinks];
  }
}
