import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faBars } from '@fortawesome/free-solid-svg-icons';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss']
})
export class HeaderComponent implements OnInit {

  text: string;
  icon: IconProp = faBars;

  constructor(private header: HeaderService) {
    this.text = this.header.text;
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.header.getTextAsObservable().subscribe(text => {
        this.text = text;
      });
    });
  }
}
