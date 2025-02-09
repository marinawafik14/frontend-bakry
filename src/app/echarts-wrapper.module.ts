
import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';


@NgModule({

  imports: [CommonModule, NgxEchartsModule],

  exports: [NgxEchartsModule],
})
export class EchartsWrapperModule {}
