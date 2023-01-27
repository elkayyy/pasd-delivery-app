import { Component, OnInit } from '@angular/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { catchError, forkJoin, Observable } from 'rxjs';
import { User } from 'src/app/model/interfaces/user';
import { AuthService } from 'src/app/services/auth.service';
import { UserService } from './user.service';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.scss'],
  providers: [ConfirmationService, MessageService],
})
export class UserListComponent implements OnInit {
  showUserDialog: boolean;
  creatingNew: boolean;
  userList$: Observable<User[]>;
  user: User;
  selectedUsers: User[];
  roles = ['admin', 'normal'];

  constructor(
    private userS: UserService,
    private messageService: MessageService,
    private confirmationService: ConfirmationService,
    public authS: AuthService
  ) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers = () => {
    this.userList$ = this.userS.getUserList();
  };

  openNew() {
    this.user = {
      id: '',
      name: '',
      role: 'normal',
    };
    this.showUserDialog = true;
    this.creatingNew = true;
  }

  deleteSelectedUsers = () => {
    this.confirmationService.confirm({
      message: 'Are you sure you want to delete the selected users?',
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        const deleteUserList$ = this.selectedUsers.map((user) =>
          this.userS.deleteUser(user.id)
        );
        forkJoin(deleteUserList$).subscribe(() => {
          this.selectedUsers = [];
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: 'Users Deleted',
            life: 3000,
          });
        });
      },
    });
  };

  showUser = (user: User) => {
    this.user = { ...user };
    this.showUserDialog = true;
  };

  editUser(user: User) {
    this.user = { ...user };
    this.showUserDialog = true;
    this.creatingNew = false;
  }

  deleteUser(user: User) {
    this.confirmationService.confirm({
      message: `Are you sure you want to delete this user(${user.id}) ?`,
      header: 'Confirm',
      icon: 'pi pi-exclamation-triangle',
      accept: () => {
        this.userS.deleteUser(user.id).subscribe(() => {
          this.loadUsers();
          this.messageService.add({
            severity: 'success',
            summary: 'Successful',
            detail: `User(${user.id}) Deleted`,
            life: 3000,
          });
        });
      },
    });
  }

  saveUser = (user: User) => {
    if (this.creatingNew) {
      this.userS
        .createUser(user)
        .pipe(
          catchError((e) => {
            this.messageService.add({
              severity: 'error',
              summary: 'Error',
              detail: 'Unable to create user',
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
          this.showUserDialog = false;
          this.loadUsers();
        });
      return;
    }
    this.userS
      .updateUser(user)
      .pipe(
        catchError((e) => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'Unable to update user',
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
        this.loadUsers();
        this.showUserDialog = false;
      });
  };
}
