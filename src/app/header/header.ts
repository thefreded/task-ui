import { Component, inject } from '@angular/core';
import { KeycloakHelper } from '../auth/keycloak-helper';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  imports: [RouterLink],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  #keycloakHelper = inject(KeycloakHelper);

  protected onLogout() {
    this.#keycloakHelper.logout();
  }
}
