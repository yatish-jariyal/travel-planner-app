# Credential Rotation Record

Never record a credential value in this file. Store only provider metadata and evidence.

## Google API key previously committed to Git

**Status:** Pending user confirmation

- Google Cloud project: `traveleasy-454107`
- Credential shown in console: `API key 1`
- Required action: create restricted server-only replacements, deploy/test them, then delete the exposed key.
- Confirmation evidence: deleted status in Credentials plus an API Keys `DeleteKey` audit event.
- Rotation date: pending

Logs Explorer query:

```text
protoPayload.serviceName="apikeys.googleapis.com"
protoPayload.methodName="google.api.apikeys.v2.ApiKeys.DeleteKey"
```

## Unidentified service-account key

**Status:** Pending investigation

- Service account: `traveleasy@traveleasy-454107.iam.gserviceaccount.com`
- Required action: determine whether the active key is user-managed and review its recent authentication activity.
- If unrecognized and user-managed: disable it, verify no workload fails, then delete it.
- Do not delete Google-managed signing keys or the service account itself without confirming workload dependencies.

## Completion checklist

- [ ] Old Google API key is deleted.
- [ ] `DeleteKey` audit event is confirmed.
- [ ] Gemini replacement is restricted and stored only in the backend secret manager.
- [ ] Optional Custom Search replacement is separate, restricted, and server-only.
- [ ] Unidentified service-account key is classified and safely handled.
- [x] Frontend production bundle contains no provider credentials.
