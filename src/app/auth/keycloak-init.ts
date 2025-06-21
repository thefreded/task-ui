import {
  AutoRefreshTokenService,
  createInterceptorCondition,
  INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
  IncludeBearerTokenCondition,
  provideKeycloak,
  UserActivityService,
  withAutoRefreshToken,
} from 'keycloak-angular';

export const provideKeycloakInitConfig = () =>
  provideKeycloak({
    config: {
      url: 'http://localhost:8080',
      realm: 'myrealm',
      clientId: 'uiclient',
    },
    initOptions: {
      onLoad: 'login-required',
    },
    features: [
      withAutoRefreshToken({
        onInactivityTimeout: 'logout',
        sessionTimeout: 1200000,
      }),
    ],
    providers: [AutoRefreshTokenService, UserActivityService],
  });

const urlCondition = createInterceptorCondition<IncludeBearerTokenCondition>({
  urlPattern: /^(http:\/\/localhost:8086)(\/.*)?$/i,
  bearerPrefix: 'Bearer',
});

export const provideKeycloakInterceptor = () => {
  return {
    provide: INCLUDE_BEARER_TOKEN_INTERCEPTOR_CONFIG,
    useValue: [urlCondition],
  };
};
