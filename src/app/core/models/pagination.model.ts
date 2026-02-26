export interface PaginationParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';
}

export interface TableState extends PaginationParams {
  filters?: { [key: string]: any };
  globalFilter?: string;
}

export class Pagination implements PaginationParams {
  page: number;
  pageSize: number;
  sortField?: string;
  sortOrder?: 'asc' | 'desc';

  constructor(
    page: number = 1,
    pageSize: number = 10,
    sortField?: string,
    sortOrder: 'asc' | 'desc' = 'asc'
  ) {
    this.page = page;
    this.pageSize = pageSize;
    this.sortField = sortField;
    this.sortOrder = sortOrder;
  }

  toQueryParams(): { [key: string]: string } {
    const params: { [key: string]: string } = {
      page: this.page.toString(),
      pageSize: this.pageSize.toString(),
    };

    if (this.sortField) {
      params['sortField'] = this.sortField;
      params['sortOrder'] = this.sortOrder || 'asc';
    }

    return params;
  }
}
