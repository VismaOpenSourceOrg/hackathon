FROM openjdk:8-jdk-alpine

LABEL maintainer="julian.thrap-meyer@visma.com"

# Make port 8080 available to the world outside this container
EXPOSE 8081

# The application's jar file
ARG JAR_FILE=target/teamhacker-0.0.1-SNAPSHOT.jar

# Add the application's jar to the container
ADD ${JAR_FILE} teamhacker.jar

# Run the jar file
ENTRYPOINT ["java","-Djava.security.egd=file:/dev/./urandom","-jar","/teamhacker.jar"]