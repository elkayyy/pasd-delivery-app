import { Component, OnInit} from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, forkJoin, Observable } from 'rxjs';
import { Order } from 'src/app/model/interfaces/order';
import { AuthService } from 'src/app/services/auth.service';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order-list',
  templateUrl: './order-list.component.html',
  styleUrls: ['./order-list.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class OrderListComponent implements OnInit {

  showOrderDialog: boolean;
  creatingNew: boolean;
  onlyInfo: boolean;
  orderList$: Observable<Order[]>;
  order: Order;
  selectedOrders: Order[];

  constructor(
    private orderS: OrderService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public authS: AuthService
  ) {}

  ngOnInit() {
    this.loadOrders();
  }

  loadOrders = () => {
    this.orderList$ = this.orderS.getOrderList();
  };

  openNew() {
    this.order = {
      id: '',
      profit: null,
      store_package: false,
      send_date: '',
      x_in_mm: null,
      y_in_mm: null,
      z_in_mm: null,
      is_breakable: false,
      is_perishable: false,
      sender_info: {
        name: '',
        street_and_number: '',
        zipcode: '',
        city: '',
        country: '',
      },
      receiver_info: {
        name: '',
        street_and_number: '',
        zipcode: '',
        city: '',
        country: '',
      },
    };
    this.showOrderDialog = true;
    this.creatingNew = true;
  }

  deleteSelectedOrders = () => {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected orders?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteOrderList$ = this.selectedOrders.map((order) =>
          this.orderS.deleteOrder(order.id)
        );
        forkJoin(deleteOrderList$).subscribe(() => {
          this.selectedOrders = [];
          this.loadOrders();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Orders Deleted',
            life: 3000,
          });
        });
      },
    });
  };

  showOrder = (order: Order) => {
    this.order = { ...order };
    this.showOrderDialog = true;
    this.onlyInfo = true;
  };

  editOrder(order: Order) {
    this.order = { ...order };
    this.showOrderDialog = true;
    this.creatingNew = false;
    this.onlyInfo = false;
  }

  deleteOrder(order: Order) {
      this.confirmationService.confirm({
      message: `Are you sure you want to delete this order(${order.id}) ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
          this.orderS.deleteOrder(order.id).subscribe(() => {
          this.loadOrders();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `Order(${order.id}) Deleted`,
            life: 3000,
          });
        });
      },
    });
  }

  saveOrder = (order: Order) => {
    if (this.creatingNew) {
      this.orderS
        .createOrder(order)
        .pipe(
          catchError((e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to create order',
              life: 3000,
            });
            return e;
          })
        )
        .subscribe(() => {
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            life: 3000,
          });
          this.showOrderDialog = false;
          this.loadOrders();
        });
      return;
    }
    this.orderS
      .updateOrder(order)
      .pipe(
        catchError((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to update order',
            life: 3000,
          });
          return e;
        })
      )
      .subscribe(() => {
        this.messageService.add({
          severity: 'success',
          summary: 'Successful',
          life: 3000,
        });
        this.loadOrders();
        this.showOrderDialog = false;
      });
  };

}
