import { WriteResponseBase } from '@elastic/elasticsearch/lib/api/types';
import { ElasticsearchService } from '@nestjs/elasticsearch';

export abstract class BaseSearchService {
  protected readonly indexEntity: string;

  constructor(protected readonly elasticsearchService: ElasticsearchService) {}

  abstract search(query: string): Promise<unknown[]>;

  abstract index(id: string, payload: unknown): Promise<WriteResponseBase>;
}
