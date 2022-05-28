import { Component, Inject, OnInit } from '@angular/core';
import { MAT_SNACK_BAR_DATA } from '@angular/material/snack-bar';
import { Feedback } from '../../models/models';

@Component({
  selector: 'app-feedback',
  templateUrl: './feedback.component.html',
  styleUrls: [ './feedback.component.scss' ]
})
export class FeedbackComponent implements OnInit {

  constructor(@Inject(MAT_SNACK_BAR_DATA) public readonly data: Feedback[]) {
  }

  ngOnInit(): void {
  }
}
