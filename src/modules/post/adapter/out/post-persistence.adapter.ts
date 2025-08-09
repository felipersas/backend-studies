import { Injectable } from '@nestjs/common';
import { PostPersistencePort } from '../../application/ports/out/post-persistence.port';
import { PrismaService } from 'src/modules/prisma/prisma.service';
import { PostDomain } from '../../domain/post';
import { Post } from '@prisma/client';

@Injectable()
export class PostPersistenceAdapter implements PostPersistencePort {
  constructor(private readonly prismaService: PrismaService) {}

  async persistPost(post: PostDomain): Promise<Post> {
    return await this.prismaService.post.create({
      data: post,
    });
  }

  async existsBySlug(slug: string): Promise<boolean> {
    const post = await this.prismaService.post.findUnique({
      where: { slug },
    });
    return !!post;
  }
}
