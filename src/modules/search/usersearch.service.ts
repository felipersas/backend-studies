import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';

import { CreateUserDto } from '../user/dto/create-user.dto';
import { BaseSearchService } from './base.search.service';

@Injectable()
export class UserSearchService extends BaseSearchService {
  protected readonly indexEntity = 'users';

  constructor(protected readonly elasticsearchService: ElasticsearchService) {
    super(elasticsearchService);
  }

  async search(search: string) {
    const { hits } = await this.elasticsearchService.search({
      index: this.indexEntity,
      query: {
        multi_match: {
          query: search,
          fields: ['name', 'email'],
          fuzziness: 'AUTO', // Permite correspondência aproximada
        },
      },
    });
    return hits.hits.map((item) => item._source);
  }

  async index(id: string, payload: CreateUserDto) {
    return await this.elasticsearchService.index({
      index: this.indexEntity,
      id: id,
      body: payload,
    });
  }
}
