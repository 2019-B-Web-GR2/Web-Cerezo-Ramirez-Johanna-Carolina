import { Controller } from '@nestjs/common';

import { DetailService } from './detail.service';

@Controller()
export class DetailController {

  constructor(
    private _detailService : DetailService,
  ) {
  }

}