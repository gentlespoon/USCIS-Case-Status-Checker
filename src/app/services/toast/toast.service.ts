import { Injectable, TemplateRef } from "@angular/core";

@Injectable({
  providedIn: "root"
})
export class ToastService {
  public toasts: any[] = [];

  show(textOrTpl: string | TemplateRef<any>, options: any = {}) {
    this.toasts.push({ textOrTpl, ...options });
  }

  remove(toast) {
    this.toasts = this.toasts.filter(t => t !== toast);
  }

  enableAutoHide(toast) {
    this.toasts[this.toasts.indexOf(toast)].autohide = true;
  }

  disableAutoHide(toast) {
    this.toasts[this.toasts.indexOf(toast)].autohide = false;
  }
}
