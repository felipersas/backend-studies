import { Body, Controller, Post } from '@nestjs/common';
import { SavePostUseCase } from '../../../application/ports/in/save-post.use-case';
import { SavePostRequest } from './save-post.request';
import { SavePostCommand } from '../../../application/ports/in/save-post.command';

@Controller('save-post')
export class SavePostController {
  constructor(private readonly savePostUseCase: SavePostUseCase) {}

  @Post()
  async save(@Body() request: SavePostRequest) {
    const command: SavePostCommand = request.toCommand();
    await this.savePostUseCase.savePost(command);
  }
}
