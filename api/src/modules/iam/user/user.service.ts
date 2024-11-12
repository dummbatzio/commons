import { Injectable } from '@nestjs/common';
import User from './user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { ProfileService } from 'src/modules/profile/profile.service';

@Injectable()
export class UserService {
  constructor(
    private readonly profileService: ProfileService,
    @InjectRepository(User)
    private userRepository: Repository<User>,
  ) {}

  async create(user: CreateUserDto): Promise<User> {
    const newUser = await this.userRepository.create(user);
    const profile = await this.profileService.createEmptyProfile();

    newUser.profile = profile;

    await this.userRepository.save(newUser);

    return newUser;
  }

  async findAll(): Promise<User[]> {
    return this.userRepository.find();
  }

  async findOneBy(where: any): Promise<User | null> {
    return this.userRepository.findOneBy(where);
  }

  async findOneByOrFail(where: any): Promise<User | null> {
    return this.userRepository.findOneByOrFail(where);
  }
}
