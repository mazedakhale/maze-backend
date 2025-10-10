const sonarqubeScanner = require('sonarqube-scanner').default;

sonarqubeScanner({
  serverUrl: 'http://localhost:9000',
  options: {
    'sonar.projectKey': 'maze_dakhle',
    'sonar.sources': './src',
    'sonar.host.url': 'http://localhost:9000',
    'sonar.login': 'your_token_here'
  }
}, () => process.exit());
