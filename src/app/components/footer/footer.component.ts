import { Component, OnInit } from '@angular/core';
import { IconProp } from '@fortawesome/fontawesome-svg-core';
import { faClipboardList, faPlus, faTrashAlt } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-footer',
  templateUrl: './footer.component.html',
  styleUrls: [ './footer.component.scss' ]
})
export class FooterComponent implements OnInit {

  icons: { url: string, icon: IconProp }[] = [
    {
      url: '',
      icon: faTrashAlt
    },
    {
      url: '',
      icon: faClipboardList
    },
    {
      url: '',
      icon: faPlus
    }
  ];

  constructor() {
  }

  ngOnInit(): void {
  }
}
