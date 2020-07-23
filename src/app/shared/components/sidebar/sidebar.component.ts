import { Component, OnInit } from '@angular/core';

interface SidebarItem {
  label: string;
  link: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.scss']
})
export class SidebarComponent implements OnInit {
  public sidebarItems: SidebarItem[] = [];

  constructor() {
    this.sidebarItems = [
      { label: 'Apartaments management', link: '/apartments', icon: 'apartment' },
      { label: 'Users management', link: '/users', icon: 'people' }
    ];
  }

  ngOnInit(): void {
  }

}
