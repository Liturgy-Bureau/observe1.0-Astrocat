import { Component, OnDestroy, OnInit } from '@angular/core';
import { LoaderService } from '../../services/loader.service';
import { ViewshelperService } from 'src/app/services/viewshelper.service';

@Component({
  selector: 'app-loader',
  templateUrl: './loader.component.html',
  styleUrls: ['./loader.component.less']
})
export class LoaderComponent implements OnInit, OnDestroy {

  loading = false;
  shouldMainContainerExpand = false; // FOR THE SIDEBAR MIN/MAX BUTTON

  constructor(
    private viewsHelper: ViewshelperService,
    private loaderService: LoaderService
  ) {
    this.loaderService.isLoading.subscribe((v) => {
      console.log(v);
      this.loading = v;
    });
   }

   currentWindowWidth = 0; // INIT - THE CURRENT (OPENED) SCREEN SIZE

ngOnInit(): void {

  this.currentWindowWidth = window.innerWidth; // GET THE CURRENT SCREEN WIDTH
  // HAVE A CHECK FOR THE MINIMIZE/MAXIMIZED BUTTON PRESSED AND EXPAND OR COMPRESS THE SIDEBAR
  this.viewsHelper.shouldMainContainerExpand.subscribe( value => {
    this.shouldMainContainerExpand = value;
    // console.log(this.shouldMainContainerExpand);
   });

  }

  ngOnDestroy(): void {

    this.viewsHelper.shouldMainContainerExpand.unsubscribe();

  }


}
