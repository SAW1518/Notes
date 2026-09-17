---
title: "Test Nimda_00001."
created: 2026-02-23T12:53:39-06:00
modified: 2026-06-25T16:20:07-06:00
source: Apple Notes (On My Mac)
---
Test Nimda_00001.

https://dev-euw1.nprd.polyphonic.jnjmedtech.com/login

Suspicion copilot https://learn.microsoft.com/en-us/training/modules/introduction-to-github-copilot/2-github-copilot-your-ai-pair-programmer

With cases: 

polyphonic-sit-surgeon-and-case-manager@mail-test.xena.dev

polyphonic-sit-surgeon-and-case-manager@mail-test.xena.dev

New :?

polyphonic-sit-surgeon@mail-test.xena.dev

polyphonic-sit-monarch-admin@mail-test.xena.dev

polyphonic-pm-monarch-admin@mail-test.xena.dev

 

usuario enterprise in monarch tenant

polyphonic-surgeon-monarch@mail-test.xena.dev

https://mail-test.xena.dev/

**Test Environments , users,  azure infra:**

**https://aurisrobotics.atlassian.net/wiki/spaces/Nucleus/pages/4670717973/Test+Plan****
**

[MONARCH] Robotic Case Input Updates**
**

**https://aurisrobotics.atlassian.net/wiki/spaces/Nucleus/pages/5178884151/MONARCH+Robotic+Case+Input+Updates****
**

Polyphonic for Monarch LMR:

https://aurisrobotics.atlassian.net/wiki/spaces/Nucleus/pages/5185667160/Polyphonic+for+Monarch+LMR

If: Could not start up the Kafka Microservice

export KAFKA_LOCAL=true                                                                      

  export EXT_JNJ_STATECHANGE_BROKERS=127.0.0.1:9092                                          

  export EXT_JNJ_STATECHANGE_CLUSTERNAME=jnj-plnc-sbox-evhns-noeu-01                           

  export EXT_JNJ_KAFKA_CONSUMER_GROUP_ID=robotic-case-input-group

KAFKA robotics commands

**OTTAVA:**

**echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"rdpCaseId":"eb36e2c4-a90a-11ef-ac52-f30347942f1a","ottavaCaseId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fc","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \**

**  | kcat -b localhost:9092 -t robotic-case-input -P**

**
**

**
**

echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"rdpCaseId":"eb36e2c4-a90a-11ef-ac52-f30347942f1a","ottavaCaseId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fc","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \

  | kcat -b localhost:9092 -t robotic-case-processing -P

**
**

**MONARCH:**

echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \

  | kcat -b localhost:9092 -t robotic-case-input -P

echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA"}' \

  | kcat -b localhost:9092 -t robotic-case-processing -P

Un FF repo  local 

POSTGRES_USERNAME=postgres \

POSTGRES_PASSWORD=postgres \

EXT_JNJ_JWT_KID=local-dev-kid \

EXT_JNJ_JWT_SECRET_ALGORITHM=HmacSHA256 \

EXT_JNJ_JWT_SECRET=dGhpcy1pcy1hLXNlY3JldC1rZXktZm9yLWxvY2FsLWRldmVsb3BtZW50LW9ubHk= \

./gradlew :app:bootRun --args='--spring.profiles.active=local --jnj.security.oauth2.enabled=false --jnj.security.rbac.enabled=false --jnj.security.abac.authorization-token.required-for-administrators=false'

echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa5626

  38-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0","usePdpMockApi":true},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7f

  b","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","mockPdpMetad

  ata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:

  30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin

  ":{"principalId":"","tenantId":"a4a93f5f-d158-4ef0-a5ea-3882ba8011bd"},"redactedOffsetsMilliseconds":[],"files":[{"type":"VID

  EO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarc

  h-case.mp4"}]}}' \

    | kcat -b localhost:9092 -t robotic-case-input -P

  echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa5626

  38-a86d-11ef-b26c-0b52ea46c7fb","schemaVersion":"1.0.0","usePdpMockApi":true},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7f

  b","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","mockPdpMetad

  ata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fb","deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:

  30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin

  ":{"principalId":"","tenantId":"a4a93f5f-d158-4ef0-a5ea-3882ba8011bd"},"redactedOffsetsMilliseconds":[],"files":[{"type":"VID

  EO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarc

  h-case.mp4"}]}}' \

    | kcat -b localhost:9092 -t robotic-case-processing -P

⏺ Para borrarlo, primero tenés que parar la app (Ctrl+C en la terminal donde corre). Si no,    

  Kafka te va a tirar error porque el group está Stable (con miembros activos).              

  Pasos                                                                                        

   

  1. Parar la app                                                                              

  Ctrl+C                                                                                     

  en la terminal donde está corriendo npm run start (o lo que uses).

                                                                    

  2. Esperar ~30 segundos para que Kafka detecte que los consumers se fueron y el group pase a 

  estado Empty.                                                                                

                                                                                               

  3. Verificar el estado (debe decir Empty):                                                   

  docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \                     

    --bootstrap-server localhost:9092 \                                                        

    --group robotic-case-input-group-client \                                                  

    --describe --state

                                                                                               

  4. Borrar el group:                                                                        

  docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \                       

    --bootstrap-server localhost:9092 \                                                      

    --delete --group robotic-case-input-group-client                                           

                                                    

  Deberías ver algo tipo:                                                                      

  Deletion of requested consumer groups ('robotic-case-input-group-client') was successful.    

   

  5. Confirmar que se borró:                                                                   

  docker exec jnj-robotic-case-input-svc-kafka-1 kafka-consumer-groups \                     

    --bootstrap-server localhost:9092 --list                                                   

  No debería aparecer en la lista.                                                             

                                  

  6. Levantar la app de nuevo y esperar al log:                                                

  INFO [ConsumerGroup] Consumer has joined the group                                           

                                                                                               

  Si te tira error "Group is not empty"                                                        

                                                                                               

  Significa que sigue habiendo un consumer conectado. Opciones:

  - Esperá más tiempo (1 min)                                                                  

  - Verificá que no quede un proceso node corriendo: lsof -i :8080 o ps aux | grep nest        

  - Como último recurso, reiniciá Kafka:                                               

  docker restart jnj-robotic-case-input-svc-kafka-1                                            

  - (esto también limpia el group, pero borra todo el estado de offsets — los 88 mensajes      

  acumulados quedan, pero no van a procesarse porque el offset arranca en "latest")      

{"level":30,"time":1779743213270,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","context":"[monarchCaseId:1000198765437]","source":"WEBHOOK","tenantId":"b32af673-24d4-49f2-ad86-886cc858dc7b","eventType":"CASE_PROCESSING_COMPLETED","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Processing PreIngestion event"}

{"level":30,"time":1779743213271,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","context":"FeatureAccessRedisService","key":"b32af673-24d4-49f2-ad86-886cc858dc7b","field":"MONARCH_AUTOMATIC_INGESTION","msg":"Checking feature access from Redis"}

{"level":30,"time":1779743213273,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","context":"FeatureAccessRedisService","key":"b32af673-24d4-49f2-ad86-886cc858dc7b","field":"MONARCH_AUTOMATIC_INGESTION","result":"true","msg":"Feature access fetched from Redis"}

{"level":30,"time":1779743213278,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","res":{"statusCode":202,"headers":{"content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"DENY","x-permitted-cross-domain-policies":"none","x-xss-protection":"1; mode=block","access-control-allow-origin":"*","x-app-version":"jnj-robotic-case-input-svc@0.15.39 | 1c28326","content-type":"application/json; charset=utf-8","content-length":"72","etag":"W/\"48-tlQUbB+wsQVkGkJcC/cjCNXaUBE\""}},"responseTime":16,"msg":"HTTP:RESPONSE:SUCCESS | 16 ms | POST /jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion 202"}

{"level":30,"time":1779743213278,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","res":{"statusCode":202,"headers":{"content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"DENY","x-permitted-cross-domain-policies":"none","x-xss-protection":"1; mode=block","access-control-allow-origin":"*","x-app-version":"jnj-robotic-case-input-svc@0.15.39 | 1c28326","content-type":"application/json; charset=utf-8","content-length":"72","etag":"W/\"48-tlQUbB+wsQVkGkJcC/cjCNXaUBE\""}},"responseTime":16,"msg":"HTTP:RESPONSE:SUCCESS | 16 ms | POST /jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion 202"}

{"level":30,"time":1779743213273,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","context":"FeatureToggleService","featureName":"MONARCH_AUTOMATIC_INGESTION","enabled":true,"msg":"Access to feature"}

{"level":30,"time":1779743213273,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","context":"[monarchCaseId:1000198765437]","messageId":"d486459c-fd69-4f6e-a02a-2a93a1bd4d50","tenantId":"b32af673-24d4-49f2-ad86-886cc858dc7b","source":"WEBHOOK","clusterName":"jnj-sbox-poly-msk-euw1","topic":"robotic-case-input","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Publishing event to Kafka (PreIngestion, fire-and-forget)"}

{"level":30,"time":1779743213278,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","req":{"method":"POST","url":"/jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion","query":{},"params":{"path":["api","v1","webhook","case-media-ingestion"]},"headers":{"x-forwarded-for":"200.92.174.12, 130.176.222.17","x-forwarded-proto":"https","x-forwarded-port":"443","host":"sbox-euw1.nprd.polyphonic.jnjmedtech.com","x-amzn-trace-id":"Root=1-6a14b9ed-5522312470f710ee64ff24c7","content-length":"1314","authorization":"🙈","x-tenant-id":"b32af673-24d4-49f2-ad86-886cc858dc7b","content-type":"application/json","accept-encoding":"gzip, deflate, br","user-agent":"httpyac","via":"1.1 37d2a353516746c778830a4bb18ad66c.cloudfront.net (CloudFront)","x-amz-cf-id":"jQoRvJXUM6quIld2fXJI8qBIsukrVRxoh7kEBcJTyOe2RrqlO2PCkg==","x-authorization":"🙈","accept":"*/*"},"remoteAddress":"10.25.14.203","remotePort":54068},"traceId":"9e4cbc57bb440fc11aa8127f0ffec15c","spanId":"702f8548c5c4b0fe","res":{"statusCode":202,"headers":{"content-security-policy":"default-src 'self';base-uri 'self';font-src 'self' https: data:;form-action 'self';frame-ancestors 'self';img-src 'self' data:;object-src 'none';script-src 'self';script-src-attr 'none';style-src 'self' https: 'unsafe-inline';upgrade-insecure-requests","cross-origin-opener-policy":"same-origin","cross-origin-resource-policy":"same-origin","origin-agent-cluster":"?1","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000; includeSubDomains","x-content-type-options":"nosniff","x-dns-prefetch-control":"off","x-download-options":"noopen","x-frame-options":"DENY","x-permitted-cross-domain-policies":"none","x-xss-protection":"1; mode=block","access-control-allow-origin":"*","x-app-version":"jnj-robotic-case-input-svc@0.15.39 | 1c28326","content-type":"application/json; charset=utf-8","content-length":"72","etag":"W/\"48-tlQUbB+wsQVkGkJcC/cjCNXaUBE\""}},"responseTime":16,"msg":"HTTP:RESPONSE:SUCCESS | 16 ms | POST /jnj-robotic-case-input-svc/api/v1/webhook/case-media-ingestion 202"}

{"level":30,"time":1779743213355,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","internalId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Received event for pre-ingestion"}

{"level":30,"time":1779743213356,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","eventType":"CASE_PROCESSING_COMPLETED","source":"KAFKA","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Received internal PreIngestion event. Triggering PreIngestion process."}

{"level":30,"time":1779743213356,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","internalId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Routing event {PreIngestion} to MONARCH orchestrator"}

{"level":30,"time":1779743213356,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Starting PreIngestion orchestration"}

{"level":30,"time":1779743213356,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"FeatureAccessRedisService","key":"b32af673-24d4-49f2-ad86-886cc858dc7b","field":"MONARCH_AUTOMATIC_INGESTION","msg":"Checking feature access from Redis"}

{"level":30,"time":1779743213357,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"FeatureAccessRedisService","key":"b32af673-24d4-49f2-ad86-886cc858dc7b","field":"MONARCH_AUTOMATIC_INGESTION","result":"true","msg":"Feature access fetched from Redis"}

{"level":30,"time":1779743213357,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"FeatureToggleService","featureName":"MONARCH_AUTOMATIC_INGESTION","enabled":true,"msg":"Access to feature"}

{"level":30,"time":1779743213358,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"MonarchIngestionOrchestratorService","usePdpMockApi":true,"logContext":{"messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437"},"messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Received event payload"}

{"level":30,"time":1779743213358,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Fetching Monarch case metadata for monarchCaseId: 1000198765437"}

{"level":30,"time":1779743213358,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Using custom PDP mock data for monarchCaseId: 1000198765437"}

{"level":30,"time":1779743213358,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Successfully retrieved Monarch PDP metadata for monarchCaseId: 1000198765437"}

{"level":30,"time":1779743213360,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"tenantMgmtV2ApiClient","timestamp":"2026-05-25T21:06:53.360Z","message":"HTTP Request Sent: GET https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=polyphonic-pm-monarch-admin%40mail-test.xena.dev","method":"GET","url":"https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=polyphonic-pm-monarch-admin%40mail-test.xena.dev","headers":{},"msg":"[HttpRequest] - tenantMgmtV2ApiClient"}

{"level":30,"time":1779743213360,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Sending request to: https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=polyphonic-pm-monarch-admin%40mail-test.xena.dev"}

{"level":30,"time":1779743214413,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"tenantMgmtV2ApiClient","timestamp":"2026-05-25T21:06:54.412Z","message":"HTTP Response Received: GET https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=polyphonic-pm-monarch-admin%40mail-test.xena.dev - 200 (1052ms)","method":"GET","url":"https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-tenant-mgmt-v2-svc/api/v2/principals?login=polyphonic-pm-monarch-admin%40mail-test.xena.dev","status":200,"ok":true,"durationMs":1052,"responseHeaders":{"cache-control":"no-cache, no-store, max-age=0, must-revalidate","connection":"keep-alive","content-security-policy":"default-src 'self'","content-type":"application/json","date":"Mon, 25 May 2026 21:06:54 GMT","expires":"0","pragma":"no-cache","referrer-policy":"no-referrer","strict-transport-security":"max-age=31536000 ; includeSubDomains","transfer-encoding":"chunked","vary":"Origin, Access-Control-Request-Method, Access-Control-Request-Headers","x-content-type-options":"nosniff","x-frame-options":"DENY","x-xss-protection":"0"},"msg":"[HttpResponse] - tenantMgmtV2ApiClient"}

{"level":30,"time":1779743214415,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","principalId":"e9605dbc-67af-43b5-9ef5-15d58a3f2459","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Completed Polyphonic identity resolution for user normalization"}

{"level":30,"time":1779743214415,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Enriched PDP metadata with Polyphonic identity resolution completed"}

{"level":30,"time":1779743214416,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: PDP metadata validation passed"}

{"level":30,"time":1779743214416,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Initiating file upload process"}

{"level":30,"time":1779743214416,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","monarchCaseId":"1000198765437","tenantId":"b32af673-24d4-49f2-ad86-886cc858dc7b","filesCount":1,"msg":"[monarchCaseId:1000198765437] [PreIngestion]: Initiating remote uploads for PDP files"}

{"level":40,"time":1779743214457,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"MediaRemoteUploadService","url":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2F2fa875b0-bc58-4e09-9427-ab18f6f92646%2F758733bd-e239-497a-b6bd-e07eadd87dd0.mp4?&Expires=1779408722&Key-Pair-Id=K213VULHQEBZJS&Signature=TjIriU-ATOhMcHq0kr9cvAvoHTKy5-ehrllG0QhGXLSxfP0K-JWQE3l-4D~LI~ZeF-DrI9VR8q5tr6MAklPfIL06w3d~pQ1eWxsHvapQXBcGAB~VTHseCfqLG5jDGi-NiKbtprrTylofDkgyS40AfxNY8~a940B1d5V8UB7amI18IZYewQcVahy5FRpGDIL0lAgg2Jd9x8IHV6WT6jv72R8BDIPRvqvRPO5Ii~mUf7vjPTkLKcxtetbgjqR9rV6OPZuMNNJ70k3XEjU1mYJMf~uKr0Z6TXZKiWhA3IMeSgDbitlYq~2sxjGE6ocguM-rTzDDD0kjGAK~K0PMAaQ~kw__","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] [PreIngestion]: Failed to fetch remote metadata from source URL: Request failed with status code 403"}

{"level":30,"time":1779743214459,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"[monarchCaseId:1000198765437]","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Sending request to: https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-media-mgmt-svc/api/v1/files/managed-remote-upload"}

{"level":50,"time":1779743214836,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"MediaMgmtClient","message":"Response returned an error code","status":422,"url":"https://sbox-euw1.nprd.polyphonic.jnjmedtech.com/jnj-media-mgmt-svc/api/v1/files/managed-remote-upload","responseBody":{"errorCode":"JS00001","message":"Validation has failed","errorDetails":"One or more validation errors have occurred","fixingInstructions":"Resolve the validation issues described in the \"details\" field","details":{"createFileInfoDto":{"sizeBytes":["sizeBytes must not be less than 0","sizeBytes must not be greater than 100000000000","sizeBytes must be a number conforming to the specified constraints"]}},"httpStatus":422,"stack":"GeneralValidationException: Validation has failed\n    at /var/api/node_modules/@jnj-npm-internal/nestjs-common/dist/swagger/decorators/buildApiRequest.js:65:23\n    at Array.forEach (<anonymous>)\n    at /var/api/node_modules/@jnj-npm-internal/nestjs-common/dist/swagger/decorators/buildApiRequest.js:18:46\n    at /var/api/node_modules/@nestjs/core/helpers/context-utils.js:43:28\n    at resolveParamValue (/var/api/node_modules/@nestjs/core/router/router-execution-context.js:146:31)\n    at Array.map (<anonymous>)\n    at pipesFn (/var/api/node_modules/@nestjs/core/router/router-execution-context.js:151:45)\n    at /var/api/node_modules/@nestjs/core/router/router-execution-context.js:37:36\n    at InterceptorsConsumer.transformDeferred (/var/api/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:31:33)\n    at /var/api/node_modules/@nestjs/core/interceptors/interceptors-consumer.js:18:86"},"monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] API error"}

{"level":50,"time":1779743214836,"pid":1,"hostname":"jnj-robotic-case-input-svc-74dbb8c4f6-5j8cr","context":"RoboticCasePreIngestionConsumer","messageId":"43fa6a27-840a-498e-bd01-8fef00766d6d","status":422,"error":"Response returned an error code","monarchCaseId":"1000198765437","msg":"[monarchCaseId:1000198765437] Non-retryable client error in PreIngestion. Skipping message."}

      

                                                                                               

echo '{"eventType":"CASE_PROCESSING_COMPLETED","eventTime":"2026-04-08T10:00:00.000Z","eventPayload":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fr”,”usePdpMockApi":true,"schemaVersion":"1.0.0"},"tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb","internalId":"da562638-a86d-11ef-b26c-0b52ea46c7fd","ingestedAt":"2026-04-08T10:00:00.000Z","source":"KAFKA","fileInfoIds":[],"mockPdpMetadata":{"monarchCaseId":"fa562638-a86d-11ef-b26c-0b52ea46c7fr”,”deviceId":"SYSTEM123456","monarchCaseStartedAt":"2025-01-02T03:30:00.999Z","monarchCaseDurationMilliseconds":"3600000","procedureType":"Bronchoscopy","physEmail":"test@test.com","userLogin":{"principalId":"53032e4c-6b19-470c-ac61-9deae6fa4866","tenantId":"da562638-a86d-11ef-b26c-0b52ea46c7fb"},"redactedOffsetsMilliseconds":[{"startedAt":1260000,"endedAt":1320000}],"files":[{"type":"VIDEO","sizeBytes":21474836480,"signedUrlForDownload":"https://d284xjgmbqtg3v.cloudfront.net/media-files%2Fmonarch-mock%2Fmonarch-case.mp4"}]}}' | kcat -b localhost:9092 -t robotic-case-processing -P

  
