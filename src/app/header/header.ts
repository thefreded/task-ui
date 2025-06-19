import { Component, inject } from '@angular/core';
import { KeycloakHelper } from '../auth/keycloak-helper';

@Component({
  selector: 'app-header',
  imports: [],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  #keycloakHelper = inject(KeycloakHelper);

  protected onLogout() {
    this.#keycloakHelper.logout();
  }
}
