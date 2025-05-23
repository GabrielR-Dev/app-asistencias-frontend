import { Component, OnInit } from '@angular/core';
import {Router} from '@angular/router'

@Component({
  selector: 'app-page-public',
  templateUrl: './page-public.page.html',
  styleUrls: ['./page-public.page.scss'],
  standalone: false,
})
export class PagePublicPage implements OnInit {

  constructor(private router: Router) { }

  ngOnInit() {
  }

  irLoginRegistro(){
    this.router.navigate(['/login']);
  }
}
