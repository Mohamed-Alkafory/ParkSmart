import { Component, computed, effect, input, output, signal } from '@angular/core';

/**
 * Reusable image picker with instant client-side preview.
 * Shows the current image when set, otherwise the initial-letter
 * circle placeholder (same style as the profile pages).
 * Emits the chosen File — uploading stays the parent's job so each
 * page keeps its own loading/error signal pattern.
 */
@Component({
  selector: 'app-image-upload',
  standalone: true,
  templateUrl: './image-upload.component.html',
})
export class ImageUploadComponent {
  /** Resolved display URL of the current image (null = none yet). */
  readonly currentUrl = input<string | null>(null);
  /** Fallback letter shown when there is no image (e.g. user's initial). */
  readonly initial = input<string>('U');
  /** True while the parent is POSTing the file — shows a loading overlay. */
  readonly uploading = input(false);
  /** Button caption below the image. */
  readonly buttonLabel = input<string>('Change photo');
  /** 'circle' for avatars, 'wide' for parking images. */
  readonly variant = input<'circle' | 'wide'>('circle');

  /** The File the user just picked (parent POSTs it immediately or stores it). */
  readonly filePicked = output<File>();

  /** Instant local preview (data URL) — cleared once the real URL arrives. */
  readonly preview = signal<string | null>(null);
  readonly displayUrl = computed(() => this.preview() ?? this.currentUrl());

  constructor() {
    effect(() => {
      // A new server URL means the upload landed — drop the local preview.
      this.currentUrl();
      this.preview.set(null);
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    const file = input.files?.[0];
    // Reset so picking the same file twice still fires change.
    input.value = '';
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => this.preview.set(reader.result as string);
    reader.readAsDataURL(file);
    this.filePicked.emit(file);
  }
}
