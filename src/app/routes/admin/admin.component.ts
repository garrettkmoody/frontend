import { Component, OnInit } from '@angular/core';
import { ElectionsRequestService } from 'src/shared-ng/services/services';
import { forkJoin } from 'rxjs';
import { CURRENT_YEAR } from 'src/shared-ng/config';

interface Election {
  id: string;
  election_type: string;
  start: string;
  end: string;
  show_results: string;
}

interface Position {
  id: string;
  position: string;
  election_type: string;
  active: boolean; // this may need to be a string
  order: number; // this may need to be a string
}

@Component({
  selector: 'app-admin',
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.css']
})
export class AdminComponent implements OnInit {

  electionsData: Election[] = [];
  positionsData: Position[] = [];

  constructor(private ers: ElectionsRequestService) { }

  ngOnInit() {
    const startDate: string = '20' + CURRENT_YEAR.slice(0, 2) + '-09-01 00:00:00.000000';
    const endDate: string = '20' + CURRENT_YEAR.slice(2, 4) + '-07-01 00:00:00.000000';
    const electionsObservable = this.ers.listElection({start_after: startDate, end_before: endDate});
    const positionsObservable = this.ers.get('elections/position');
    forkJoin([electionsObservable, positionsObservable]).subscribe(
      (data: [Election[], {positions: Position[]}]) => {
        this.electionsData = data[0];
        this.positionsData = data[1].positions;
      }, (err) => {
        window.alert('Unable to fetch data for elections and/or positions\n' + err.error.status);
      }
    );
  }
}
