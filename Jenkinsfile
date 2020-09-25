/* -*- mode: groovy -*- */
pipeline {
  options {
    buildDiscarder logRotator(artifactDaysToKeepStr: '30', artifactNumToKeepStr: '50', daysToKeepStr: '60', numToKeepStr: '50')
    disableConcurrentBuilds()
    disableResume()
    durabilityHint 'PERFORMANCE_OPTIMIZED'
    timestamps()
  }

  agent none

  stages {
    stage('multiple env') {
      parallel {
        stage('ci env') {
          when {
            beforeAgent true
            anyOf {
              branch 'dev'
            }
          }
          agent {label 'bounty-backend-test-machine'}
          steps {
            script {
              sh (label: 'build', script: """
yarn && yarn build
"""
              )
            }
            script {
              sh (label: 'move to nginx www', script: """
sudo rm -rf /www/shuttleflow/
sudo cp -r build /www/shuttleflow
""")
            }
          }
        }

        stage('prod env') {
          when {
            beforeAgent true
            allOf {
              branch 'master'
            }
          }
          agent {label 'bounty-frontend-production-machine'}
          steps {
            script {
              sh (label: 'build', script: """
yarn && yarn build
"""
              )
            }
            script {
              sh (label: 'move builds', script: """
sudo rm -rf /www/shuttleflow/
sudo cp -r build /www/shuttleflow
""")
            }
          }
        }
      }
    }
  }
}