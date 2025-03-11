const YAML = require('yaml');
const fs = require('fs');
const path = require('path');

const specPath = path.join(__dirname, '..', 'resources', 'spec.yml');
const specFile = fs.readFileSync(specPath, 'utf8');
const openapiSpecification = YAML.parse(specFile);

module.exports = openapiSpecification; 