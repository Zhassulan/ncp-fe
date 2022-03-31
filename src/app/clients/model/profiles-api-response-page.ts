import {PaymentDto} from '../../payment/dto/paymentDto';
import {Profile} from './profile';

export class ProfilesApiResponsePage {

  content: Profile [];

  pageable: {
    sort: {
      empty: boolean,
      sorted: boolean,
      unsorted: boolean
    },
    offset: number,
    pageNumber: number,
    pageSize: number,
    paged: boolean,
    unpaged: boolean
  };

  last: boolean;
  totalPages: number;
  totalElements: number;
  number: number;
  size: number;

  sort: {
    empty: boolean,
    sorted: boolean,
    unsorted: boolean
  };

  first: boolean;
  numberOfElements: number;
  empty: boolean;
}
