/*
 * @copyright   Copyright (C) 2022 AesirX. All rights reserved.
 * @license     GNU General Public License version 3, see LICENSE.
 */

import { makeAutoObservable, runInAction } from 'mobx';
import { PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY } from 'aesirx-lib';
import moment from 'moment';
import { PAGE_STATUS, notify } from 'aesirx-uikit';

class BrandListViewModel {
  formStatus = PAGE_STATUS.READY;
  brandListViewModel = {};
  items = [];
  filter = {};
  successResponse = {
    state: false,
    content_id: '',
    listPublishStatus: [],
    1: [],
    filters: {
      'list[limit]': 10,
    },
    listBrands: [],
    pagination: null,
    listBrandsWithoutPagination: [],
  };

  constructor(brandStore) {
    makeAutoObservable(this);
    this.brandStore = brandStore;
  }

  setForm = (brandListViewModel) => {
    this.brandListViewModel = brandListViewModel;
  };

  initializeData = async () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
    const data = await this.brandStore.getList(this.successResponse.filters);

    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, '');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  initializeAllData = async () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
    const data = await this.brandStore.getListWithoutPagination(this.successResponse.filters);

    runInAction(() => {
      if (!data?.error) {
        this.callbackOnSuccessGetBrandsHandler(data?.response);
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  getListByFilter = async (key, value) => {
    value ? (this.successResponse.filters[key] = value) : delete this.successResponse.filters[key];

    //pagination
    if (key != 'list[start]' && key != 'list[limit]') {
      delete this.successResponse.filters['list[start]'];
    } else {
      if (
        key == 'list[limit]' &&
        value * this.successResponse.pagination.page >= this.successResponse.pagination.totalItems
      ) {
        this.successResponse.filters['list[start]'] =
          Math.ceil(this.successResponse.pagination.totalItems / value - 1) * value;
      } else if (
        key == 'list[limit]' &&
        value * this.successResponse.pagination.page < this.successResponse.pagination.totalItems
      ) {
        this.successResponse.filters['list[start]'] =
          (this.successResponse.pagination.page - 1) * value;
      }
    }

    const data = await this.brandStore.getList(this.successResponse.filters);
    runInAction(() => {
      if (!data?.error) {
        this.onSuccessHandler(data?.response, '');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  onSuccessHandler = (result, message) => {
    if (result && message) {
      notify(message, 'success');
    }
    if (result?.listItems) {
      this.successResponse.listBrands = this.transform(result?.listItems);
      this.successResponse.pagination = result?.pagination;
      this.items = result?.listItems;
    }
    if (result?.listPublishStatus) {
      this.successResponse.listPublishStatus = result?.listPublishStatus;
    }
  };

  onErrorHandler = (error) => {
    Array.isArray(error?._messages) && error?._messages[0]?.message
      ? notify(error._messages[0]?.message, 'error')
      : error.message && notify(error.message, 'error');
    this.successResponse.state = false;
    this.successResponse.content_id = error.result;
    this.formStatus = PAGE_STATUS.READY;
  };

  transform = (data) => {
    return data.map((o) => {
      const date = moment(o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.MODIFIED_TIME]).format(
        'DD MMM, YYYY'
      );
      return {
        brand: {
          id: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.ID],
          name: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.NAME],
          // level: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.LEVEL],
        },
        // brandParent: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.PARENT_NAME]
        //   ? o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.PARENT_NAME]
        //   : 'ROOT',
        lastModified: {
          status: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.PUBLISHED],
          dateTime: date ?? '',
          author: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.CREATED_USER_NAME],
        },
        published: {
          state: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.PUBLISHED],
          id: o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.ID],
        },
      };
    });
  };

  deleteBrands = async (arr) => {
    const data = await this.brandStore.delete(arr);
    runInAction(async () => {
      if (!data?.error) {
        await this.initializeData();
        this.onSuccessHandler(data?.response, 'Deleted successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
      this.successResponse.state = true;
    });
  };

  setPublished = async ({ id, name }, state = 0) => {
    const data = await this.brandStore.update({
      id: id.toString(),
      brand_name: name,
      published: state.toString(),
    });
    runInAction(async () => {
      if (!data?.error) {
        await this.initializeData();
        this.onSuccessHandler(data?.response, 'Updated successfully');
      } else {
        this.onErrorHandler(data?.response);
      }
    });
  };

  callbackOnSuccessGetBrandsHandler = (result) => {
    this.successResponse.listBrandsWithoutPagination = result.listItems.map((o) => {
      let dash = '';
      for (let index = 1; index < o.level; index++) {
        dash += '- ';
      }
      return { value: o?.id, label: `${dash}${o[PIM_PRODUCT_TYPE_DETAIL_FIELD_KEY.NAME]}` };
    });
  };

  isLoading = () => {
    runInAction(() => {
      this.successResponse.state = false;
    });
  };
}

export default BrandListViewModel;
