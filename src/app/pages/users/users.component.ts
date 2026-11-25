import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-users',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css']
})
export class UsersComponent implements OnInit {

  users: any[] = [];
  filteredUsers: any[] = [];
  selectedUser: any = null;
  loading = true;
  searchQuery = '';

  // Edit mode
  editMode = false;
  editForm = { nom: '', email: '', role: '' };
  editLoading = false;
  editSuccess = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() { this.loadUsers(); }

  loadUsers() {
    this.loading = true;
    this.adminService.getAllUsers().subscribe({
      next: (data: any[]) => {
        this.users = data;
        this.filteredUsers = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });
  }

  search() {
    const q = this.searchQuery.trim().toLowerCase();
    if (!q) { this.filteredUsers = this.users; return; }
    this.filteredUsers = this.users.filter(u =>
      u.nom.toLowerCase().includes(q) ||
      u.email.toLowerCase().includes(q)
    );
  }

  viewUser(user: any) {
    this.selectedUser = this.selectedUser?.id === user.id ? null : user;
    this.editMode = false;
    this.editSuccess = false;
  }

  closeDetail() {
    this.selectedUser = null;
    this.editMode = false;
  }

  openEdit() {
    this.editForm = {
      nom: this.selectedUser.nom,
      email: this.selectedUser.email,
      role: this.selectedUser.role
    };
    this.editMode = true;
    this.editSuccess = false;
  }

  cancelEdit() {
    this.editMode = false;
  }

  saveEdit() {
    if (!this.editForm.nom || !this.editForm.email) return;
    this.editLoading = true;

    this.adminService.updateUser(
      this.selectedUser.id, this.editForm).subscribe({
      next: () => {
        // Mettre à jour localement
        const update = (list: any[]) => {
          const i = list.findIndex(u => u.id === this.selectedUser.id);
          if (i !== -1) list[i] = {
            ...list[i],
            nom: this.editForm.nom,
            email: this.editForm.email,
            role: this.editForm.role
          };
        };
        update(this.users);
        update(this.filteredUsers);
        this.selectedUser = {
          ...this.selectedUser,
          nom: this.editForm.nom,
          email: this.editForm.email,
          role: this.editForm.role
        };
        this.editMode = false;
        this.editLoading = false;
        this.editSuccess = true;
        setTimeout(() => this.editSuccess = false, 3000);
      },
      error: () => { this.editLoading = false; }
    });
  }

  toggleUser(user: any) {
    if (!confirm(`${user.actif ? 'Désactiver' : 'Activer'} 
      le compte de ${user.nom} ?`)) return;

    this.adminService.toggleUserStatus(user.id).subscribe({
      next: () => {
        const update = (list: any[]) => {
          const i = list.findIndex(u => u.id === user.id);
          if (i !== -1) list[i] = { ...list[i], actif: !list[i].actif };
        };
        update(this.users);
        update(this.filteredUsers);
        if (this.selectedUser?.id === user.id) {
          this.selectedUser = {
            ...this.selectedUser,
            actif: !this.selectedUser.actif
          };
        }
      },
      error: (err: any) => console.error(err)
    });
  }

  deleteUser(id: number) {
    if (!confirm('Confirmer la suppression ?')) return;
    this.adminService.deleteUser(id).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== id);
        this.filteredUsers = this.filteredUsers.filter(u => u.id !== id);
        if (this.selectedUser?.id === id) this.selectedUser = null;
      },
      error: (err: any) => console.error(err)
    });
  }
}
