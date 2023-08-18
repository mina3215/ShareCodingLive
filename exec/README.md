# 포팅 메뉴얼

<br>

## 운영 서버 - 쿠버네티스

<br>

### Mysql  관련 파일

---

<br>

01-stroage-class.yml

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer

```

<br>

02-persistent-volume-claim.yml

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: ebs-mysql-pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClassName: ebs-sc
  resources:
    requests:
      storage: 4Gi

```

<br>

03-sclive-dump-mysql-ConfigMap.yml

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: mysql-dump-configmap
data:
  mysql_sclive.sql: |-
    DROP DATABASE IF EXISTS sclive;
    CREATE DATABASE sclive;
    USE sclive;
    DROP TABLE IF EXISTS `user`;
    CREATE TABLE `user` (
      `email` varchar(100) NOT NULL COMMENT 'local 64 domain 255 @ 1 -> 320',
      `nickname` varchar(16) NOT NULL,
      `password` varchar(100) NOT NULL COMMENT 'bcrypt -> 60',
      `role` varchar(45) DEFAULT NULL,
      PRIMARY KEY (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
    INSERT INTO `user` VALUES ('ssafy','ssafy','$2a$10$EKnmGyXniND7A1mw.vu0ZeXlM6RkcTZDi0uHRoQmz2qLrbnu51YHK','USER'),('test11@gmail.com','test11','$2a$10$hzNR0yLjtI56NUCALdsKv.tn4CHFl.Rw1Q4oC/eLH4beIjf6dfUiu','USER');
    DROP TABLE IF EXISTS `conference`;
    CREATE TABLE `conference` (
      `course_id` varchar(40) NOT NULL,
      `start_time` datetime NOT NULL,
      `end_time` datetime DEFAULT NULL,
      `title` varchar(50) NOT NULL,
      `is_active` tinyint NOT NULL,
      `owner_email` varchar(100) NOT NULL,
      PRIMARY KEY (`course_id`),
      KEY `fk_conference_user1_idx` (`owner_email`),
      CONSTRAINT `fk_conference_user1` FOREIGN KEY (`owner_email`) REFERENCES `user` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
    DROP TABLE IF EXISTS `conference_history`;
    CREATE TABLE `conference_history` (
      `id` int NOT NULL AUTO_INCREMENT,
      `user_email` varchar(100) NOT NULL,
      `course_id` varchar(40) NOT NULL,
      `join_time` datetime DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `fk_user_has_conference_conference1_idx` (`course_id`),
      KEY `fk_user_has_conference_user1_idx` (`user_email`),
      CONSTRAINT `fk_user_has_conference_conference1` FOREIGN KEY (`course_id`) REFERENCES `conference` (`course_id`),
      CONSTRAINT `fk_user_has_conference_user1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;

```

<br>


04-mysql-deployment.yml

```
apiVersion: apps/v1
kind: Deployment
metadata:
  name: mysql-deploy
spec:
  replicas: 1
  selector:
    matchLabels:
      app: mysql-pv
  strategy:
    type: Recreate
  template:
    metadata:
      labels:
        app: mysql-pv
    spec:
      containers:
        - name: mysql
          image: mysql:latest
          env:
            - name: MYSQL_ROOT_PASSWORD
              valueFrom:
                secretKeyRef:
                  name: mysql-db-password
                  key: db-password
          ports:
            - containerPort: 3306
              name: mysql
          volumeMounts:
            - name: mysql-persistent-storage
              mountPath: /var/lib/mysql
            - name: mysql-dump-configmap
              mountPath: /docker-entrypoint-initdb.d #https://hub.docker.com/_/mysql Refer Initializing a fresh instance
      volumes:
        - name: mysql-persistent-storage
          persistentVolumeClaim:
            claimName: ebs-mysql-pv-claim
        - name: mysql-dump-configmap
          configMap:
            name: mysql-dump-configmap

```

<br>

05-mysql-clusterip-service.ym

```
apiVersion: v1
kind: Service
metadata:
  name: mysql-svc
spec:
  selector:
    app: mysql-pv
  ports:
    - port: 3306
  clusterIP: None # This means we are going to use Pod IP

```

<br>

06-kubernetes-secret.yml

```
apiVersion: v1
kind: Secret
metadata:
  name: mysql-db-password
#type: Opaque means that from kubernetes's point of view the contents of this Secret is unstructured.
#It can contain arbitrary key-value pairs.
type: Opaque
data:
  # Output of echo -n '0000' | base64
  db-password: MDAwMA==
  db-user: cm9vdA==

```

<br>

### mysql 이중화 관련 파일
---

<br>


01-mydb-duplicate-configMap.ym

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: mydb-config
  labels:
    app: mydb
data:
  master.cnf: |
    [mysqld] # 바이너리 로그 활성화
    log-bin
  slave.cnf: |
    [mysqld] # 슬레이브 sql을 위한 read only 모드 활성화
    super-read-only

```

<br>

02-sclive-dump-configMap.yml

```
apiVersion: v1
kind: ConfigMap
metadata:
  name: sclive-dump-configmap
data:
  mysql_sclive.sql: |-
    DROP DATABASE IF EXISTS sclive;
    CREATE DATABASE sclive;
    USE sclive;
    DROP TABLE IF EXISTS `user`;
    CREATE TABLE `user` (
      `email` varchar(100) NOT NULL COMMENT 'local 64 domain 255 @ 1 -> 320',
      `nickname` varchar(16) NOT NULL,
      `password` varchar(100) NOT NULL COMMENT 'bcrypt -> 60',
      `role` varchar(45) DEFAULT NULL,
      `fcm_access_token` varchar(200) DEFAULT NULL,
      PRIMARY KEY (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
    INSERT INTO `user` VALUES ('asdf12@a.a','asdf','$2a$10$ql03O3WB348wPMdT3ThJwONf0/5DEvVMCdfDBECZkQtXcDwylszgK','USER',NULL),('asdfasdf','asdfasdf','$2a$10$fLKQ7bF676ldmpweEzSOnOtguM3wgccPHvoQtZu/Uc1W9tW44fX2a','USER',NULL),('d@ssafy.com','d','$2a$10$uD3Bp7Q/t9c3EE3brBZsTumGwvEkPzd9p1VPdH2ulF/huhiDinLLC','USER',NULL),('dd@ssafy.com','ddan','$2a$10$Y94mlQsSQtMMbWNmjtnVU.lqouMIDgPOpJ89l/MWID/rzdjsoGS52','USER','eGD9j40IAAnHROA4_0MLJc:APA91bEfi_0XMrEdKXVwjWGFe4kPEY5spdMlCQQ3wtu9WDDvnCQjZraxQAbtyYDfn9S66pJhV7C30Km0FJom4Es78CJIdISnLs9EumpDBVVvXpCxBKvpvSDAiQYZfIxhkvJ8gvQfRKmf'),('ssafy','ssafy','$2a$10$EKnmGyXniND7A1mw.vu0ZeXlM6RkcTZDi0uHRoQmz2qLrbnu51YHK','USER',NULL),('string','string','$2a$10$4bwv1UonwnI6HhaVZUHKYOJGWCc9k8.bI.fMLgMscbrO46VxBFrOi','USER','asdfasfdasdfasdf'),('test11@gmail.com','test11','$2a$10$hzNR0yLjtI56NUCALdsKv.tn4CHFl.Rw1Q4oC/eLH4beIjf6dfUiu','USER',NULL);
    DROP TABLE IF EXISTS `conference`;
    CREATE TABLE `conference` (
      `course_id` varchar(40) NOT NULL,
      `start_time` datetime NOT NULL,
      `end_time` datetime DEFAULT NULL,
      `title` varchar(50) NOT NULL,
      `is_active` tinyint NOT NULL,
      `owner_email` varchar(100) NOT NULL,
      PRIMARY KEY (`course_id`),
      KEY `fk_conference_user1_idx` (`owner_email`),
      CONSTRAINT `fk_conference_user1` FOREIGN KEY (`owner_email`) REFERENCES `user` (`email`)
    ) ENGINE=InnoDB DEFAULT CHARSET=utf8mb3;
    DROP TABLE IF EXISTS `conference_history`;
    CREATE TABLE `conference_history` (
      `id` int NOT NULL AUTO_INCREMENT,
      `user_email` varchar(100) NOT NULL,
      `course_id` varchar(40) NOT NULL,
      `join_time` datetime DEFAULT NULL,
      PRIMARY KEY (`id`),
      KEY `fk_user_has_conference_conference1_idx` (`course_id`),
      KEY `fk_user_has_conference_user1_idx` (`user_email`),
      CONSTRAINT `fk_user_has_conference_conference1` FOREIGN KEY (`course_id`) REFERENCES `conference` (`course_id`),
      CONSTRAINT `fk_user_has_conference_user1` FOREIGN KEY (`user_email`) REFERENCES `user` (`email`)
    ) ENGINE=InnoDB AUTO_INCREMENT=570 DEFAULT CHARSET=utf8mb3;

```

<br>

03-mydb-svc-write-headless.yml

```
apiVersion: v1
kind: Service
metadata:
  name: mydb-write
  labels:
    app: mydb
spec:
  ports:
  - name: mysql
    port: 3306
  clusterIP: None
  selector:
    app: mydb

```

<br>

04-mydb-svc-read-cluster.yml

```
apiVersion: v1
kind: Service
metadata:
  name: mydb-read
  labels:
    app: mydb
spec:
  ports:
  - name: mysql
    port: 3306
  selector:
    app: mydb # statefull set으로 만든 pod 다 이 read로 관리함

```

<br>

05-duplicate-storage-class.yml

```
apiVersion: storage.k8s.io/v1
kind: StorageClass
metadata:
  name: duplicate-ebs-sc
provisioner: ebs.csi.aws.com
volumeBindingMode: WaitForFirstConsumer

```

<br>

06-duplicate-persistent-volume-claim.yml

```
apiVersion: v1
kind: PersistentVolumeClaim
metadata:
  name: duplicate-mysql-pv-claim
spec:
  accessModes:
    - ReadWriteOnce
  storageClase: duplicate-ebs-sc # 스토리지 이름 참조하기 위한 것
  resources:
    requests:
      storage: 1Gi
```

<br>

07-statefulset-mysql.yml

```
apiVersion: apps/v1
kind: StatefulSet
metadata:
  name: mydb
spec:
  selector:
    matchLabels:
      app: mydb
  serviceName: mydb
  replicas: 2
  template:
    metadata:
      labels:
        app: mydb
    spec:
      initContainers:
      - name: init-mysql
        image: mysql:5.7.36
        command:
        - bash
        - "-c"
        - |
          set -ex
          [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
          ordinal=${BASH_REMATCH[1]}
          echo [mysqld] > /mnt/conf.d/server-id.cnf
          echo server-id=$((100 + $ordinal)) >> /mnt/conf.d/server-id.cnf
          if [[ $ordinal -eq 0 ]]; then
            cp /mnt/config-map/master.cnf /mnt/conf.d/
          else
            cp /mnt/config-map/slave.cnf /mnt/conf.d/
          fi
        volumeMounts:
        - name: conf
          mountPath: /mnt/conf.d
        - name: config-map
          mountPath: /mnt/config-map
      - name: clone-mysql
        image: gcr.io/google-samples/xtrabackup:1.0
        command:
        - bash
        - "-c"
        - |
          set -ex
          [[ -d /var/lib/mysql/mysql ]] && exit 0
          [[ `hostname` =~ -([0-9]+)$ ]] || exit 1
          ordinal=${BASH_REMATCH[1]}
          [[ $ordinal -eq 0 ]] && exit 0
          ncat --recv-only mydb-$(($ordinal-1)).mydb 3307 | xbstream -x -C /var/lib/mysql
          xtrabackup --prepare --target-dir=/var/lib/mysql
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
          subPath: mysql
        - name: conf
          mountPath: /etc/mysql/conf.d
      containers:
      - name: mysql
        image: mysql:5.7.36
        env:
        - name: MYSQL_ALLOW_EMPTY_PASSWORD
          value: "1"
        ports:
        - name: mysql
          containerPort: 3306
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
          subPath: mysql
        - name: conf
          mountPath: /etc/mysql/conf.d
        livenessProbe:
          exec:
            command: ["mysqladmin", "ping"]
          initialDelaySeconds: 30
          periodSeconds: 10
          timeoutSeconds: 5
        readinessProbe:
          exec:
            command: ["mysql", "-h", "127.0.0.1", "-e", "SELECT 1"]
          initialDelaySeconds: 5
          periodSeconds: 2
          timeoutSeconds: 1
      - name: xtrabackup
        image: gcr.io/google-samples/xtrabackup:1.0
        ports:
        - name: xtrabackup
          containerPort: 3307
        command:
        - bash
        - "-c"
        - |
          set -ex
          cd /var/lib/mysql

          if [[ -f xtrabackup_slave_info && "x$(<xtrabackup_slave_info)" != "x" ]]; then
            cat xtrabackup_slave_info | sed -E 's/;$//g' > change_master_to.sql.in
            rm -f xtrabackup_slave_info xtrabackup_binlog_info
          elif [[ -f xtrabackup_binlog_info ]]; then
            [[ `cat xtrabackup_binlog_info` =~ ^(.*?)[[:space:]]+(.*?)$ ]] || exit 1
            rm -f xtrabackup_binlog_info xtrabackup_slave_info
            echo "CHANGE MASTER TO MASTER_LOG_FILE='${BASH_REMATCH[1]}',\
                  MASTER_LOG_POS=${BASH_REMATCH[2]}" > change_master_to.sql.in
          fi

          if [[ -f change_master_to.sql.in ]]; then
            echo "Waiting for mysqld to be ready (accepting connections)"
            until mysql -h 127.0.0.1 -e "SELECT 1"; do sleep 1; done

            echo "Initializing replication from clone position"
            mysql -h 127.0.0.1 \
                  -e "$(<change_master_to.sql.in), \
                          MASTER_HOST='mydb-0.mydb', \
                          MASTER_USER='root', \
                          MASTER_PASSWORD='', \
                          MASTER_CONNECT_RETRY=10; \
                        START SLAVE;" || exit 1
            mv change_master_to.sql.in change_master_to.sql.orig
          fi

          exec ncat --listen --keep-open --send-only --max-conns=1 3307 -c \
            "xtrabackup --backup --slave-info --stream=xbstream --host=127.0.0.1 --user=root"
        volumeMounts:
        - name: data
          mountPath: /var/lib/mysql
          subPath: mysql
        - name: conf
          mountPath: /etc/mysql/conf.d
      volumes:
      - name: conf
        emptyDir: {}
      - name: config-map
        configMap:
          name: mydb-config
  volumeClaimTemplates:
  - metadata:
      name: data
    spec:
      accessModes: ["ReadWriteOnce"]
      resources:
        requests:
          storage: 1Gi

```

<br>

### 스프링부트 백엔드 서버

---

<br>

01-deploy-bakcserver.yml

```
apiVersion: apps/v1
kind: Deployment
metadata:
    name: deploy-backserver
spec:
    replicas: 1
    selector:
        matchLabels:
            app: backserver
    template:
        metadata:
            name: backserver-pod
            labels:
                app: backserver
        spec:
          initContainers:
            - name: init-db
              image: busybox:1.31
              command: ['sh', '-c', 'echo -e "Checking for the availability of MySQL Server deployment"; while ! nc -z mysql-svc 3306; do sleep 1; printf "-"; done; echo -e "  >> MySQL DB Server has started";']
            - name: init-redis
              image: busybox:1.31
              command: ['sh', '-c', 'echo -e "Checking for the availability of Redis deployment"; while ! nc -z cluster-redis 6379; do sleep 1; printf "-"; done; echo -e "  >> Redis Server has started";']
            containers:
              - name: backserver-container
                image: heesom/backserver:master_v4
                ports:
                  - containerPort: 8080
                resources:
                  requests:
                    memory: "250Mi"
                    cpu: "150m"
                  limits:
                    memory: "500Mi"
                    cpu: "400m"
                env:
                  - name: SPRING_DATASOURCE_URL
                    value: "jdbc:mysql://mysql-svc:3306/sclive?serverTimezone=UTC&useUniCode=yes&characterEncoding=UTF-8"
                  - name: SPRING_DATASOURCE_USERNAME
                    valueFrom:
                      secretKeyRef:
                        name: mysql-db-password
                        key: db-user
                  - name: SPRING_DATASOURCE_PASSWORD
                    valueFrom:
                      secretKeyRef:
                        name: mysql-db-password
                        key: db-password
                  - name: SPRING_REDIS_HOST
                    value: "cluster-redis"
                livenessProbe:
                  httpGet:
                    path: /api/swagger-ui/
                    port: 8080
                  initialDelaySeconds: 60
                   periodSeconds: 10
                readinessProbe:
                  httpGet:
                    path: /api/swagger-ui/
                    port: 8080
                  initialDelaySeconds: 60
                  periodSeconds: 10

```

<br>

02-backserver-nodeport.yml

```
apiVersion: v1
kind: Service
metadata:
  name: app-backserver-nodeport-service
  labels:
    app: backserver
  annotations:
#Important Note:  Need to add health check path annotations in service level if we are planning to use multiple targets in a load balancer
    alb.ingress.kubernetes.io/healthcheck-path: /api/swagger-ui/
spec:
  type: NodePort
  selector:
    app: backserver
  ports:
    - port: 80
      targetPort: 8080

```

<br>

03-backserver-vpa.yml

```
apiVersion: "autoscaling.k8s.io/v1"
kind: VerticalPodAutoscaler
metadata:
  name: deploy-backserver-vpa
spec:
  targetRef: # 어떤 컨트롤러 가리킬건지
    apiVersion: "apps/v1"
    kind: Deployment
    name: deploy-backserver
  resourcePolicy:
    containerPolicies:
      - containerName: '*'
        minAllowed:
          cpu: "150m"
          memory: "250Mi"
        maxAllowed:
          cpu: "500m"
          memory: "400Mi"
        controlledResources: ["cpu", "memory"]

```

<br>

hpa 명령어 및 cluster autoscaler 와 부하테스트

```
kubectl autoscale deployment deploy-backserver --cpu-percent=50 --min=2 --max=30

kubectl -n kube-system set image deployment.apps/cluster-autoscaler cluster-autoscaler=us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.25.3

kubectl run apache-bench -i --tty --rm --image=httpd -- ab -n 500000 -c 1000 http://www.sclive.link/api
```

<br>

### 리액트 프론트 서버

---

<br>

01-deploy-frontserver.yml

```

apiVersion: apps/v1
kind: Deployment
metadata:
    name: deploy-frontserver
spec:
    replicas: 1
    selector:
        matchLabels:
            app: frontserver
    template:
        metadata:
            name: frontserver-pod
            labels:
                app: frontserver
        spec:
            containers:
            - name: frontserver-container
              image: heesom/frontserver:test
              ports:
                - containerPort: 80
              resources:
                requests:
                  memory: "250Mi"
                  cpu: "150m"
                limits:
                  memory: "500Mi"
                  cpu: "400m"
```

<br>

02-frontserver-nodeport.yml

```
apiVersion: v1
kind: Service
metadata:
  name: app-frontserver-nodeport-service
  labels:
    app: frontserver
  annotations:
#Important Note:  Need to add health check path annotations in service level if we are planning to use multiple targets in a load balancer
   alb.ingress.kubernetes.io/healthcheck-path: /
spec:
  type: NodePort
  selector:
    app: frontserver
  ports:
    - port: 80
      targetPort: 80

```

<br>

03-deploy-frontserver-vpa.yml

```
apiVersion: "autoscaling.k8s.io/v1"
kind: VerticalPodAutoscaler
metadata:
  name: deploy-backserver-vpa
spec:
  targetRef: # 어떤 컨트롤러 가리킬건지
    apiVersion: "apps/v1"
    kind: Deployment
    name: deploy-frontserver
  resourcePolicy:
    containerPolicies:
      - containerName: '*'
        minAllowed:
          cpu: "400m"
          memory: "300Mi"
        maxAllowed:
          cpu: "800m"
          memory: "600Mi"
        controlledResources: ["cpu", "memory"]

```

<br>

hpa 명령어 및 cluster autoscaler 와 부하테스트

```
kubectl autoscale deployment deploy-frontserver --cpu-percent=50 --min=2 --max=20

kubectl -n kube-system set image deployment.apps/cluster-autoscaler cluster-autoscaler=us.gcr.io/k8s-artifacts-prod/autoscaling/cluster-autoscaler:v1.25.3

kubectl run apache-bench -i --tty --rm --image=httpd -- ab -n 500000 -c 1000 http://www.sclive.link
```

<br>

### ingress 설정
---

<br>

01-ALB-Ingress-SSL.yml

```
apiVersion: networking.k8s.io/v1
kind: Ingress
metadata:
  name: ingress-ssl-apply
  labels:
    app: ingress
  annotations:
    # Load Balancer Name
    alb.ingress.kubernetes.io/load-balancer-name: ingress-ssl-apply
    #kubernetes.io/ingress.class: "alb" (OLD INGRESS CLASS NOTATION - STILL WORKS BUT RECOMMENDED TO USE IngressClass Resource)
    # Ingress Core Settings
    alb.ingress.kubernetes.io/scheme: internet-facing
    # Health Check Settings
    alb.ingress.kubernetes.io/healthcheck-protocol: HTTP
    alb.ingress.kubernetes.io/healthcheck-interval-seconds: '15'
    alb.ingress.kubernetes.io/healthcheck-timeout-seconds: '5'
    alb.ingress.kubernetes.io/success-codes: '200'
    alb.ingress.kubernetes.io/healthy-threshold-count: '2'
    alb.ingress.kubernetes.io/unhealthy-threshold-count: '2'
    # ssl 설정
    alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}, {"HTTP":80}]'
    # alb.ingress.kubernetes.io/listen-ports: '[{"HTTPS":443}]'
    alb.ingress.kubernetes.io/certificate-arn: arn:aws:acm:ap-northeast-2:411222900313:certificate/e492fd86-52bf-4cdf-be6e-608e83eb8c65
    alb.ingress.kubernetes.io/ssl-redirect: '443'
    # 스티키 세션 및 웹 소켓 관련 설정
    alb.ingress.kubernetes.io/healthcheck-port: traffic-port
    alb.ingress.kubernetes.io/target-type: ip
    alb.ingress.kubernetes.io/target-group-attributes: stickiness.enabled=true,stickiness.lb_cookie.duration_seconds=3600
    alb.ingress.kubernetes.io/load-balancer-attributes: idle_timeout.timeout_seconds=3600
spec:
  ingressClassName: my-aws-ingress-class # Ingress Class
  rules:
  - http:
      paths:
      - path: /api
        pathType: Prefix
        backend:
          service:
            name: app-backserver-nodeport-service # 노드 포트 이름
            port:
              number: 80
      - path: /
        pathType: Prefix
        backend:
          service:
            name: app-frontserver-nodeport-service
            port:
              number: 80

```

<br>

## 테스트 서버 - 도커

### nginx

```bash
"/etc/nginx/nginx.conf" [readonly] 82L, 1668C                                       20,20-48      Top
user www-data;
worker_processes auto;
pid /run/nginx.pid;
include /etc/nginx/modules-enabled/*.conf;

events {
        worker_connections 1024;
        # multi_accept on;
}

http {
        include mime.types;

        # master-backserver 리버스 프록시
        server {
                server_name i9d109.p.ssafy.io;
                listen 443 ssl;

                        location /api {
                                proxy_pass http://localhost:8093;

                                proxy_http_version 1.1;
                                proxy_set_header Upgrade $http_upgrade;
                                proxy_set_header Connection "Upgrade";
                                proxy_set_header Host $host;
                        }

                        location / {
                                proxy_pass http://localhost:8092;
                        }
        }

        server{
                server_name *.sclive.link
                listen 442 ssl;
        }

    ssl_certificate /etc/letsencrypt/live/i9d109.p.ssafy.io/fullchain.pem; # managed by Certbot
    ssl_certificate_key /etc/letsencrypt/live/i9d109.p.ssafy.io/privkey.pem; # managed by Certbot
    include /etc/letsencrypt/options-ssl-nginx.conf; # managed by Certbot
    ssl_dhparam /etc/letsencrypt/ssl-dhparams.pem; # managed by Certbot

}
```

<br>


### 도커 파일
---

<br>

Backserver 도커 파일

```bash
FROM openjdk:11-jre

COPY sclive-0.0.1-SNAPSHOT.jar app.jar

# 8080으로 노출 docker run 할때는 포트 바꾸기
EXPOSE 8080

CMD ["java", "-jar", "/app.jar"s]
```

<br>

Frontserver 도커 파일

```bash
# react-dockerizing/Dockerfile

# base image 설정(as build 로 완료된 파일을 밑에서 사용할 수 있다.)
FROM node:18-alpine as build

# 컨테이너 내부 작업 디렉토리 설정
WORKDIR /app

# app dependencies
# 컨테이너 내부로 package.json 파일들을 복사
COPY package*.json ./

# package.json 및 package-lock.json 파일에 명시된 의존성 패키지들을 설치
RUN yarn add react-scripts
RUN yarn install

COPY . .

RUN npm run build

FROM nginx:stable-alpine

COPY --from=build /app/build /usr/share/nginx/html

RUN rm /etc/nginx/conf.d/default.conf
.
COPY nginx/nginx.conf /etc/nginx/conf.d

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

<br>

### 도커 명령어

```bash
sudo docker network create dev-backserver-net

sudo docker volume create dev-mysql-volume

sudo docker volume create dev-redis-volume

sudo docker run -d -p 8094:8080 --name dev-backserver --network dev-backserver-net  heesom/backserver:dev_member_v1

sudo docker run -d --name dev-mysql --network dev-backserver-net -v dev-mysql-volume:/var/lib/mysql -e MYSQL_ROOT_PASSWORD=0000 -e MYSQL_DATABASE=sclive -e MYSQL_USER=ssafy -e MYSQL_PASSWORD=ssafy mysql:latest

sudo docker run -d --name dev-redis -v dev-redis-volume:/data  redis:latest

sudo docker run -d -p 8092:80 --name master-frontserver heesom/frontserver:test
```

<br>

### 도커 태그 관리
---

<br>

**[dev] - heesom/backserver**

- member 관련
    - dev_member_v1
    - dev_member_v2
    - dev_member_v3
- webrtc 관련
    - dev_webrtc_v1
    - dev_webrtc_v2
- chatting 관련
    - dev_chatting_v1
- total 테스트 관련 태그
    - dev_total_v2
    - dev_total_v3
    - dev_total_v4 - 알림기능 + 채팅 추가


<br>

**[master] - heesom/backserver**

- master_v1
- master_v2  - 알림기능 + 채팅 추가
- master_v3- db 쿼리 버그로 인한 업데이트
- master_v4 - 웹소켓 관련 업데이트
- master_v5 - 웹소켓 버그 픽스
- master_v6_redis_edit - 레디스 관련 버그 픽스

<br>

**[master] heesom/frontserver**
- test
- master_v1 - 채팅관련 버그 픽스
- master_v2

<br>

### 도커 포트 관리
---

<br>

**EC2 포트**

- openvidu
    - **22 TCP**: SSHOpenVidu.
    - **80 TCP**: Let's Encryptgenerate an SSL certificate (일단 두기)
    - **4443 TCP**: OpenVidu server and application (일단 두기)
    - **3478 TCP+UDP**: STUN/TURN server
    - **40000 - 57000 TCP+UDP**: Kurento Media Server
    - **57001 - 65535 TCP+UDP**: URN server to establish relayed media connections.
- cAdvisor
    - 8081

<br>

프론트를 위한 백엔드 컨테이너 네트워크 - **[dev-backserver-net]**

- dev-mysql
- dev-redis
- dev-backserver
    - 8080 export 8094 접속
    - 8094:8080

<br>

통합 테스트 컨테이너 - **[master-net]**

- master-backserver
    - 8093

