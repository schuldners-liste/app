import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-join',
  templateUrl: './join.component.html',
  styleUrls: ['./join.component.scss']
})
export class JoinComponent implements OnInit {

  private redirectUrl: string;

  constructor(private route: ActivatedRoute,
              private router: Router,
              private auth: AuthService) {
    this.redirectUrl = '';
  }

  ngOnInit(): void {
    this.route.queryParams.subscribe(queryParams => {
      this.redirectUrl = queryParams.redirectUrl ? queryParams.redirectUrl : '/entries';
    });
  }

}
