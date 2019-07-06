// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `index.ts`, but if you do
// `ng build --env=prod` then `index.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  environment: 'DEV',
  appName: 'com.gentlespoon.uscis_case_query.electron',
  USCIS_API_URL: 'https://egov.uscis.gov/casestatus/mycasestatus.do',
  identityProvider: 'https://account.gentlespoon.com',
  gsApiUrl: 'https://api.gentlespoon.com',
};
