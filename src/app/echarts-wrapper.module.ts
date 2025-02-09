// src/app/shared/echarts-wrapper.module.ts
import { NgModule } from '@angular/core';
import { NgxEchartsModule } from 'ngx-echarts';

@NgModule({
  imports: [NgxEchartsModule],
  exports: [NgxEchartsModule],
})
export class EchartsWrapperModule {}
