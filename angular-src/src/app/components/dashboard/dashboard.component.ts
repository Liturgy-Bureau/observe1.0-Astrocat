import { Component, OnInit } from '@angular/core';
import { SocketioService } from 'src/app/services/socketio.service';

import { AuthService } from '../../services/auth.service';
import { ViewshelperService } from '../../services/viewshelper.service';


@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  template: '',
  styleUrls: ['./dashboard.component.less']
})
export class DashboardComponent implements OnInit {

  currentUserProfile: any;

  avatar: any;

  /* Global gauge parameters */
  gaugethick = 3;
  gaugesize = 96;
  gaugeType = 'semi';

  thresholdConfig = {
    0: {color: 'rgba(0, 0, 252, 0.45)'},
    60: {color: 'rgba(126, 0, 252, 0.45)'},
    85: {color: 'rgba(252, 0, 252, 0.45)'}
};

  gauge1Value = 28.3;
  gauge1Label = 'Speed';
  gauge1AppendText = 'km/hr';

  gauge2Value = 63.9;
  gauge2Label = 'Speed';
  gauge2AppendText = 'km/hr';

  gauge3Value = 89.6;
  gauge3Label = 'Speed';
  gauge3AppendText = 'km/hr';

  // Chart data
  colorScheme = 'nightLights';
  // curve = shape.curveCardinal;
  saleData = [
    {
      name: this.gauge3Label,
      series: [
        {
          value: 15,
          name: '2016-09-19T10:56:56.929Z'
        },
        {
          value: 36,
          name: '2016-09-18T11:08:45.442Z'
        },
        {
          value: 70,
          name: '2016-09-22T20:09:25.540Z'
        },
        {
          value: 54,
          name: '2016-09-15T18:25:43.576Z'
        },
        {
          value: 67,
          name: '2016-09-19T04:54:20.509Z'
        }
      ]
    }
  ];


  constructor(
    private auth: AuthService,
    private viewsHelper: ViewshelperService,
    private socketService: SocketioService
  ) {   }

  ngOnInit(): void {
      // console.log(this.currentUserProfile);
  }

  /* NOT USED FOR NOW
  // UPON DESTROY DISCONNECT FROM USELESS AND CONSUMING SERVICES EX. SUBJECTS, SOCKETS ETC
  // tslint:disable-next-line: use-lifecycle-interface
  ngOnDestroy(): void {
    this.socketService.disconnect();
  }
  */

}
