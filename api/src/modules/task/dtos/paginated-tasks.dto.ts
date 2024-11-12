import { ObjectType } from '@nestjs/graphql';
import { PaginatedResultDto } from 'src/common/dtos/paginated-result.dto';
import { TaskDto } from './task.dto';

@ObjectType()
export class PaginatedTasksDto extends PaginatedResultDto(TaskDto) {}
