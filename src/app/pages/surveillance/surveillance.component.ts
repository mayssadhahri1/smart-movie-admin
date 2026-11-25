import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-surveillance',
  standalone: true,
  imports: [CommonModule, NavbarComponent, SidebarComponent],
  templateUrl: './surveillance.component.html',
  styleUrls: ['./surveillance.component.css']
})
export class SurveillanceComponent implements OnInit {

  activities: any[] = [];
  connexions: any[] = [];
  loading = true;
  tmdbStatus = false;

  constructor(private adminService: AdminService) {}

  ngOnInit() {
    this.loadData();
  }

  loadData() {
    this.loading = true;

    this.adminService.getActiviteRecente().subscribe({
      next: (data: any[]) => {
        this.activities = data;
        this.loading = false;
      },
      error: () => { this.loading = false; }
    });

    this.adminService.getLastConnexions().subscribe({
      next: (data) => { this.connexions = data; }
    });

    this.adminService.getTmdbStatus().subscribe({
      next: (status: boolean) => { this.tmdbStatus = status; },
      error: () => { this.tmdbStatus = false; }
    });
  }

  getActivityColor(type: string): string {
    switch (type) {
      case 'connexion': return 'blue';
      case 'inscription': return 'green';
      case 'favori': return 'red';
      default: return 'gray';
    }
  }
}
