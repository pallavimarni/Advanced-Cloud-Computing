FROM openjdk:19 AS builder
WORKDIR /app
COPY . /app
RUN chmod +x ./mvnw && ./mvnw clean package

FROM openjdk:19
VOLUME /tmp
EXPOSE 6001
ARG JAR_FILE=/app/target/docker-2-0.0.1-SNAPSHOT.jar
COPY --from=builder ${JAR_FILE} app.jar
ENTRYPOINT ["java","-jar","/app.jar"]
