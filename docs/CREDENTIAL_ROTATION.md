# Credential Rotation Record

Never record a credential value in this file. Store only provider metadata and evidence.

## Google API key previously committed to Git

**Status:** Completed on 2026-07-15

- Google Cloud project: `traveleasy-454107`
- Credential shown in console: `API key 1`
- Action: created and tested a restricted backend-only replacement, then deleted
  the historically exposed key.
- Confirmation evidence: the old key no longer appears in Credentials and the
  application continued to return flights, hotels, attractions, and images.
- Rotation date: 2026-07-15

Logs Explorer query:

```text
protoPayload.serviceName="apikeys.googleapis.com"
protoPayload.methodName="google.api.apikeys.v2.ApiKeys.DeleteKey"
```

## Unidentified service-account key

**Status:** Completed on 2026-07-15

- Service account: `traveleasy@traveleasy-454107.iam.gserviceaccount.com`
- Classification: user-managed key; no repository or local runtime dependency was found.
- Action: the user-managed key was deleted without deleting the service account.
- Related account: `vertex-express@traveleasy-454107.iam.gserviceaccount.com`
  had no user-managed key and was left unchanged.
- Validation: flights, hotels, attractions, and images continued working after
  deletion.

## Replacement-credential validation

**Status:** Completed on 2026-07-15 for local development

- Gemini uses a replacement backend-only AI Studio key.
- SerpApi uses a backend-only key.
- Browser verification confirmed provider traffic is routed through `/api/*`.
- Production secret-manager configuration remains pending until a hosting
  platform is selected.

## Completion checklist

- [x] Old Google API key is deleted.
- [x] Gemini replacement is restricted and backend-only for local development.
- [x] Optional Custom Search is unconfigured; Wikipedia provides the key-free
  image fallback.
- [x] Unidentified service-account key is classified and safely handled.
- [x] Frontend production bundle contains no provider credentials.

Production secret-manager configuration remains a deployment task rather than
part of this completed local credential rotation.
