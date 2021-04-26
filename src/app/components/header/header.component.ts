import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  text: string[] = [];

  constructor(private header: HeaderService) {
  }

  ngOnInit(): void {
    this.header.text.subscribe(text => {
      this.text = text;
    });
  }
}