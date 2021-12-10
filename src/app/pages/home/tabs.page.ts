import { Component, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { Tabs } from 'src/app/components/tabs/tabs';
import { AdDirective } from 'src/app/directives/ad.directive';
import { UtilService } from 'src/app/services/util.service';
import { EventService } from '../../services/event.service';
import { AboutComponent } from './about/about.component';
import { Tab1Page } from './tab1/tab1.page';

@Component({
  selector: 'app-tabs',
  templateUrl: 'tabs.page.html',
  styleUrls: ['tabs.page.scss']
})
export class TabsPage implements OnInit, OnDestroy{

  public tabs: Tabs[] = [{
    title: "Inicio",
    icon: "rocket",
    active: true,
    component: Tab1Page,
    url: "inicio",
    reload: true
  },{
    title: "Acerca de",
    icon: "apps",
    active: false,
    component: AboutComponent,
    url: "inicio",
    reload: true
  }];

  @ViewChild(AdDirective, { static: true }) adHost!: AdDirective;

  private suscription:Subscription;

  constructor(
    private utilService: UtilService,
    private router: Router,
    private translateService: TranslateService,
    private eventService: EventService
  ) { 
   //console.log("---->");
    
  }

  ngOnInit(){
    this.suscription = this.eventService.get("tabChange").subscribe((data: any) => {
      this.tabSelect(this.tabs[data]);
    });
  }

  ngOnDestroy(){
    this.suscription.unsubscribe();
  }

  tabSelect(tab: Tabs) {
    this.tabs.forEach(element => {
      element.active = false;
    });

    tab.active = true;

    tab.data = { ...tab };
    if (tab.url) {
      this.router.navigate([tab.url]);
    }
   //console.log(this.adHost);
    
    this.utilService.renderDynamicComponent(tab.component, this.adHost, tab.data);
  }
}
