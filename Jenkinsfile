pipeline {
    agent any

    environment {
        // CI mode: 2 retries, 1 worker, test.only not allowed (see playwright.config.js)
        CI = 'true'
    }

    options {
        timeout(time: 30, unit: 'MINUTES')
    }

    stages {
        stage('Install') {
            steps {
                bat 'npm ci'
                bat 'npx playwright install chromium'
            }
        }

        stage('Clean old results') {
            steps {
                bat 'if exist allure-results rmdir /s /q allure-results'
            }
        }

        stage('Run tests') {
            steps {
                bat 'npx playwright test'
            }
        }
    }

    post {
        always {
            // Playwright HTML report as a downloadable artifact
            archiveArtifacts artifacts: 'playwright-report/**', allowEmptyArchive: true

            // Allure report (needs the Allure Jenkins plugin)
            allure includeProperties: false, results: [[path: 'allure-results']]
        }
    }
}
