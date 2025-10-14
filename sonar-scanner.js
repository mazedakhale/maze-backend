const sonarqubeScanner = require('sonarqube-scanner').default;

sonarqubeScanner({
  serverUrl: 'http://72.60.206.65:9000',
  options: {
    'sonar.projectKey': 'maze_dakhle',
    'sonar.sources': './src',
    'sonar.host.url': 'http://72.60.206.65:9000',
    'sonar.login': 'your_token_here'
  }
}, () => process.exit());
