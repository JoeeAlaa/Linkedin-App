import { Component, computed, Inject, inject, OnInit, PLATFORM_ID } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NetworkService } from './core/services/network.service';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { FlowbiteService } from './core/services/flowbite.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet,NgxSpinnerComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit{

  private readonly _NetworkService = inject(NetworkService);
  readonly online = computed(() => this._NetworkService.isOnline());
  constructor(@Inject(PLATFORM_ID) private platformId: Object,@Inject(DOCUMENT) private document: Document,private _FlowbiteService:FlowbiteService) {
    if (isPlatformBrowser(this.platformId)) {
      const theme = localStorage.getItem('theme');
      if (theme === 'dark') {
        this.document.documentElement.classList.add('dark');
      }
    }
  }
  
  toggleTheme() {
    const html = this.document.documentElement;
    const isDark = html.classList.contains('dark');
    html.classList.toggle('dark');
    localStorage.setItem('theme', isDark ? 'light' : 'dark');
  }
  
  ngOnInit(): void {
    this._FlowbiteService.loadFlowbite(flowbite =>{
      console.log('Flowbite loaded',flowbite);
    })
  }

}

