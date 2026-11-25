import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { NavbarComponent } from '../../components/navbar/navbar.component';
import { SidebarComponent } from '../../components/sidebar/sidebar.component';
import { AdminService } from '../../services/admin.service';

interface Toast {
  id: number;
  type: 'success' | 'error';
  title: string;
  message: string;
}

@Component({
  selector: 'app-films',
  standalone: true,
  imports: [CommonModule, FormsModule, NavbarComponent, SidebarComponent],
  templateUrl: './films.component.html',
  styleUrls: ['./films.component.css']
})
export class FilmsComponent implements OnInit {

  topVues: any[] = [];
  topFavoris: any[] = [];
  catalogue: any[] = [];

  filteredFilms: any[] = [];
  selectedFilm: any = null;
  loading = false;
  activeTab = 'vues';
  searchQuery = '';

  // ── Formulaire Ajout / Édition (même modal, deux modes) ─────
  modeAjout = false;
  modeEdition = false;
  filmEnEditionId: number | null = null;
  isModalClosing = false;
  posterPreviewValide = true;

  nouveauFilm = {
    titre: '',
    synopsis: '',
    note: '',
    duree: '',
    dateSortie: '',
    posterUrl: '',
    backdropUrl: '',
    genres: ''
  };
  fichierVideoNouveau: File | null = null;
  ajoutEnCours = false;
  ajoutErreur: string | null = null;

  // ── Toasts ──────────────────────────────────────────────────
  toasts: Toast[] = [];
  private toastIdSeq = 0;

  constructor(private adminService: AdminService) {}

  ngOnInit(): void {
    this.loadFilms();
  }

  loadFilms(): void {
    this.loading = true;
    this.selectedFilm = null;

    switch (this.activeTab) {
      case 'vues':
        this.adminService.getTopFilmsVues().subscribe({
          next: (data) => { this.topVues = data; this.filteredFilms = [...data]; this.loading = false; },
          error: () => { this.loading = false; }
        });
        break;

      case 'favoris':
        this.adminService.getTopFilmsFavoris().subscribe({
          next: (data) => { this.topFavoris = data; this.filteredFilms = [...data]; this.loading = false; },
          error: () => { this.loading = false; }
        });
        break;

      case 'catalogue':
        this.adminService.getFilmsPlateforme().subscribe({
          next: (data) => { this.catalogue = data; this.filteredFilms = [...data]; this.loading = false; },
          error: () => { this.loading = false; }
        });
        break;
    }
  }

  switchTab(tab: string): void {
    this.activeTab = tab;
    this.searchQuery = '';
    this.selectedFilm = null;
    this.filteredFilms = [];
    this.loadFilms();
  }

  search(): void {
    const q = this.searchQuery.trim().toLowerCase();
    let source: any[] = [];

    switch (this.activeTab) {
      case 'vues': source = this.topVues; break;
      case 'favoris': source = this.topFavoris; break;
      case 'catalogue': source = this.catalogue; break;
    }

    this.filteredFilms = !q ? [...source] : source.filter(f => f.titre?.toLowerCase().includes(q));
  }

  viewFilm(film: any): void {
    this.selectedFilm = this.selectedFilm?.id === film.id ? null : film;
  }

  closeDetail(): void {
    this.selectedFilm = null;
  }

  get currentFilms(): any[] {
    return this.filteredFilms;
  }

  // ══════════════════════════════════════════════════════════
  // ✏️ MODIFIER (Update)
  // ══════════════════════════════════════════════════════════
  ouvrirEdition(film: any, event: Event): void {
    event.stopPropagation();
    this.ajoutErreur = null;

    this.adminService.getFilmDetail(film.id).subscribe({
      next: (detail) => {
        this.modeEdition = true;
        this.filmEnEditionId = film.id;
        this.nouveauFilm = {
          titre: detail.titre || '',
          synopsis: detail.synopsis || '',
          note: detail.note || '',
          duree: detail.duree || '',
          dateSortie: detail.dateSortie || '',
          posterUrl: detail.posterUrl || '',
          backdropUrl: detail.backdropUrl || '',
          genres: detail.genres && detail.genres.length ? detail.genres.join(', ') : ''
        };
        this.fichierVideoNouveau = null;
        this.modeAjout = true;
      },
      error: () => {
        this.showToast('error', 'Erreur', "Impossible de charger les détails du film.");
      }
    });
  }

  // ══════════════════════════════════════════════════════════
  // 🗑️ SUPPRIMER (Delete réel, avec confirmation + toast)
  // ══════════════════════════════════════════════════════════
  supprimerFilm(id: number, event: Event): void {
    event.stopPropagation();
    const film = this.currentFilms.find(f => f.id === id);
    const confirmation = confirm(
      `Supprimer définitivement « ${film?.titre ?? 'ce film'} » ?\n\nCette action est irréversible : le film et son fichier vidéo seront supprimés du serveur.`
    );
    if (!confirmation) return;

    this.adminService.supprimerFilm(id).subscribe({
      next: () => {
        this.showToast('success', 'Film supprimé', `« ${film?.titre ?? 'Le film'} » a été supprimé définitivement.`);
        if (this.selectedFilm?.id === id) this.closeDetail();
        this.loadFilms();
      },
      error: () => {
        this.showToast('error', 'Erreur', 'Impossible de supprimer ce film pour le moment.');
      }
    });
  }

  // ── Modal Ajout / Édition ───────────────────────────────────
  toggleModeAjout(): void {
    if (this.ajoutEnCours) return;

    if (this.modeAjout) {
      this.isModalClosing = true;
      setTimeout(() => {
        this.modeAjout = false;
        this.isModalClosing = false;
        this.ajoutErreur = null;
        this.modeEdition = false;
        this.filmEnEditionId = null;
        this.resetFormulaire();
      }, 200);
    } else {
      this.modeAjout = true;
      this.modeEdition = false;
      this.filmEnEditionId = null;
      this.ajoutErreur = null;
    }
  }

  onBackdropClick(): void {
    this.toggleModeAjout();
  }

  @HostListener('document:keydown.escape')
  onEscapeKey(): void {
    if (this.modeAjout && !this.ajoutEnCours) {
      this.toggleModeAjout();
    }
  }

  resetFormulaire(): void {
    this.nouveauFilm = { titre: '', synopsis: '', note: '', duree: '', dateSortie: '', posterUrl: '', backdropUrl: '', genres: '' };
    this.fichierVideoNouveau = null;
  }

  onFichierVideoNouveauSelectionne(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.fichierVideoNouveau = input.files[0];
      this.ajoutErreur = null;
    }
  }

  onDropVideo(event: DragEvent): void {
    event.preventDefault();
    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.fichierVideoNouveau = files[0];
      this.ajoutErreur = null;
    }
  }

  formatFileSize(bytes: number): string {
    if (bytes < 1024) return `${bytes} o`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} Ko`;
    if (bytes < 1024 * 1024 * 1024) return `${(bytes / (1024 * 1024)).toFixed(1)} Mo`;
    return `${(bytes / (1024 * 1024 * 1024)).toFixed(2)} Go`;
  }

  soumettreAjout(): void {
    if (!this.nouveauFilm.titre.trim()) {
      this.ajoutErreur = 'Le titre est obligatoire';
      return;
    }
    if (!this.modeEdition && !this.fichierVideoNouveau) {
      this.ajoutErreur = 'Vous devez choisir un fichier vidéo (mp4, mkv, webm)';
      return;
    }

    this.ajoutEnCours = true;
    this.ajoutErreur = null;
    const titre = this.nouveauFilm.titre.trim();

    const requete$ = this.modeEdition && this.filmEnEditionId
      ? this.adminService.modifierFilmManuel(this.filmEnEditionId, this.nouveauFilm, this.fichierVideoNouveau)
      : this.adminService.ajouterFilmManuel(this.nouveauFilm, this.fichierVideoNouveau!);

    requete$.subscribe({
      next: () => {
        this.ajoutEnCours = false;
        this.showToast(
          'success',
          this.modeEdition ? 'Film modifié ✏️' : 'Film ajouté 🎬',
          this.modeEdition
            ? `« ${titre} » a été mis à jour avec succès.`
            : `« ${titre} » a été ajouté au catalogue avec succès.`
        );
        const idModifie = this.filmEnEditionId;
        this.toggleModeAjout();
        this.loadFilms();
        if (idModifie && this.selectedFilm?.id === idModifie) this.closeDetail();
      },
      error: (err) => {
        this.ajoutEnCours = false;
        this.ajoutErreur = err?.error || "Erreur lors de l'enregistrement du film";
        this.showToast('error', 'Échec', this.ajoutErreur ?? 'Une erreur est survenue.');
      }
    });
  }

  getStreamUrl(filmId: number): string {
    return this.adminService.getStreamUrl(filmId);
  }

  // ── Toasts ──────────────────────────────────────────────────
  showToast(type: 'success' | 'error', title: string, message: string): void {
    const id = ++this.toastIdSeq;
    this.toasts.push({ id, type, title, message });
    setTimeout(() => this.removeToast(id), 4000);
  }

  removeToast(id: number): void {
    this.toasts = this.toasts.filter(t => t.id !== id);
  }
}
