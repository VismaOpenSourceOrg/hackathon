library 'tlx-util@master'

timestamps {
    node('build') {
        stage('Checkout') {
            step([$class: 'WsCleanup'])
            checkout scm
        }

        stage('Compile') {
            mvn 'package -DskipTests=true -Pnode'
        }


        stage('Push docker image') {
            sh "eval `aws --region eu-west-1 ecr get-login --no-include-email`"
            def newContainer = docker.build "455710622635.dkr.ecr.eu-west-1.amazonaws.com/hackaton"
            newContainer.push()
        }

        stage('Cleanup') {
            step([$class: 'WsCleanup'])
        }
    }
}


def mvn(command) {
    mvnHome = tool 'Maven 3.5.4'
    env.JAVA_HOME = "${tool 'Java 1.8.0-181'}"
    env.MAVEN_OPTS = ""
    env.PATH = "${env.JAVA_HOME}/bin:${env.PATH}"
    sh "'${mvnHome}/bin/mvn' -B ${command}"
}