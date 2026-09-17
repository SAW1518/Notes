---
title: Kafka — kcat and consumer groups
type: command
area:
  - kafka
  - monarch
  - ottava
aliases:
  - kcat
  - produce event
  - send message to kafka
  - trigger a case
  - consumer group
  - Group is not empty
  - Could not start up the Kafka Microservice
tags:
  - command
created: 2026-02-23T12:53:39-06:00
---
colima start
lazydocker
# Kafka — kcat and consumer groups

> [!info] Context
> All of this runs against the local Kafka (`localhost:9092`) started by the `jnj-robotic-case-input-svc` compose file. Real environments are in [[Polyphonic — URLs by environment]].

## Trigger an OTTAVA case

Topic `robotic-case-input`:

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"rdpCaseId":"eb36e2c4-a90a-11ef-ac52-f30347942f1a","ottavaCaseId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fc","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \
  | kcat -b localhost:9092 -t robotic-case-input -P
```

Topic `robotic-case-processing` (same payload, only `-t` changes):

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"rdpCaseId":"eb36e2c4-a90a-11ef-ac52-f30347942f1a","ottavaCaseId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fc","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \
  | kcat -b localhost:9092 -t robotic-case-processing -P
```

## Trigger a MONARCH case

Topic `robotic-case-input`:

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \
  | kcat -b localhost:9092 -t robotic-case-input -P
```

Topic `robotic-case-processing`:

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \
  | kcat -b localhost:9092 -t robotic-case-processing -P
```

## Trigger a MONARCH case with mocked PDP

This is the one carrying `usePdpMockApi: true` and the `mockPdpMetadata` block (device, duration, procedure, and the test MP4 on CloudFront):

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0","usePdpMockApi":true},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","mockPdpMetadata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin":{"principalId":"","tenantId":"a4a93f5f-d158-4ef0-a5ea-3882ba8011bd"},"redactedOffsetsMilliseconds":[],"files":[{"type":"VIDEO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarch-case.mp4"}]}}' \
  | kcat -b localhost:9092 -t robotic-case-input -P
```

Same payload against `robotic-case-processing`:

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0","usePdpMockApi":true},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","mockPdpMetadata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin":{"principalId":"","tenantId":"a4a93f5f-d158-4ef0-a5ea-3882ba8011bd"},"redactedOffsetsMilliseconds":[],"files":[{"type":"VIDEO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarch-case.mp4"}]}}' \
  | kcat -b localhost:9092 -t robotic-case-processing -P
```

## Trigger a MONARCH case with redaction and a real principal

Variant with `fileInfoIds`, a real `principalId`, and a redaction window (`redactedOffsetsMilliseconds`, from 21:00 to 22:00 of the video):

```bash
echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","usePdpMockApi":true,"schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","fileInfoIds":[],"mockPdpMetadata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin":{"principalId":"53032e4c-6b19-470c-ac61-9deae6fa4866","tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb"},"redactedOffsetsMilliseconds":[{"startedAt":1260000,"endedAt":1320000}],"files":[{"type":"VIDEO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarch-case.mp4"}]}}' | kcat -b localhost:9092 -t robotic-case-processing -P
```

> [!bug] This command was broken in the old note
> Apple Notes had replaced two straight quotes with typographic ones (`”` instead of `"`), which breaks the JSON, and the `monarchCaseId` ended in `...c7fr` instead of `...c7fb` (`r` is not hex, so it was not a valid UUID). Fixed above, but **verify the case ID** against your data next time you use it.

## Publish a media change (SurgicalCaseVideo)

Topic `media-changes`. The `-v` flag prints delivery confirmation:

```bash
echo '{"id":"a1b2c3d4-e5f6-7890-abcd-ef1234567890","item":{"id":"1eac0d0e-eb13-423f-baf2-2cc5d21af746","surgicalCaseId":"cd31fffd-6c74-4f01-81e2-ed562b044be8","generatedFromEditPlan":null},"timestamp":"2026-06-03T11:50:14.414Z","tableName":"SurgicalCaseVideo","actionType":"CREATE"}' | kcat -b localhost:9092 -t media-changes -P -v
```

## Error — Could not start up the Kafka Microservice

Export these variables before starting the service:

```bash
export KAFKA_LOCAL=true
export EXT_JNJ_STATECHANGE_BROKERS=127.0.0.1:9092
export EXT_JNJ_STATECHANGE_CLUSTERNAME=jnj-plnc-sbox-evhns-noeu-01
export EXT_JNJ_KAFKA_CONSUMER_GROUP_ID=robotic-case-input-group
```

## Delete a consumer group

> [!warning] Stop the app first
> Kafka refuses to delete a group in `Stable` state (with active members). If you don't stop the app, it errors out.

**1. Stop the app** with `Ctrl+C` in the terminal running `npm run start`.

**2. Wait ~30 seconds** for Kafka to notice the consumers left and move the group to `Empty`.

**3. Check the state** (must say `Empty`):

```bash
docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --group robotic-case-input-group-client \
  --describe --state
```

**4. Delete the group:**

```bash
docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \
  --bootstrap-server localhost:9092 \
  --delete --group robotic-case-input-group-client
```

You should see: `Deletion of requested consumer groups ('robotic-case-input-group-client') was successful.`

**5. Confirm it's gone** (should not appear in the list):

```bash
docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \
  --bootstrap-server localhost:9092 --list
```

**6. Start the app again** and wait for the log line:

```
INFO [ConsumerGroup] Consumer has joined the group
```

## Error — Group is not empty

Means there is still a consumer connected. Options, in order:

- Wait longer (1 minute).
- Check no Node process is still running → [[Ports and processes]].
- Last resort, restart Kafka:

```bash
docker restart jnj-robotic-case-input-svc-kafka-1
```

> [!warning] What you lose by restarting Kafka
> It clears the group too, but wipes all offset state. Accumulated messages stay in the topic but **will not be processed**, because the offset starts at `latest`.

## See also

- [[Run services locally]]
- [[Ports and processes]]
- [[2026-06-25 — Monarch preingestion 422]]
