import { Component, OnInit } from '@angular/core';
import { HeaderService } from '../../services/header.service';

@Component({
  selector: 'app-entries',
  templateUrl: './entries.component.html',
  styleUrls: [ './entries.component.scss' ]
})
export class EntriesComponent implements OnInit {

  constructor(private header: HeaderService) {
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.header.text = 'Entries';
    });
  }
}
