import { Component, OnInit, OnDestroy, ViewChild, ViewContainerRef } from '@angular/core';
import { ModalService } from 'src/app/services/modal.service';
import { Subscription } from 'rxjs';

import { SocketioService } from 'src/app/services/socketio.service';


@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.less']
})
export class ManagerComponent implements OnInit, OnDestroy {

  sub: any;
  activesno = '';
  olUsers = [];
  showMore: any;
  down: any = false;

  constructor(
    private socketService: SocketioService,
    private modalService: ModalService
  ) { }

  // For opening modals on the fly
  @ViewChild('modal', { read: ViewContainerRef })
  entry!: ViewContainerRef;
  modalsub!: Subscription;

  ngOnInit(): void {
    this.socketService.adminConnect();
    this.sub = this.socketService.adminReceiveMsg().subscribe((res: any) => {
      this.activesno = res.activesno;
      this.olUsers = res.actives;
      console.log(res.activesno);
      console.log(res.actives);
    });
  }

  ngOnDestroy(): void {
    this.sub.unsubscribe();
    if (this.modalsub) { this.modalsub.unsubscribe(); }
  }

  toggleMore(i: any) {
    this.down = !this.down;
    this.showMore = i;
  }

  createModal() {
    this.modalsub = this.modalService
      .openModal(this.entry, 'please confirm', '<a>you are abou..</a>')
      .subscribe((v) => {
        // your logic
      });
  }

}
