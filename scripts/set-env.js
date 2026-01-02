const fs = require('fs');
const path = require('path');

const envDirectory = path.join(__dirname, '../src/environments');
const dotEnvPath = path.join(__dirname, '../.env');

if (!fs.existsSync(envDirectory)) {
  fs.mkdirSync(envDirectory, { recursive: true });
}

// Simple .env parser to avoid extra dependencies
let dotEnvVars = {};
if (fs.existsSync(dotEnvPath)) {
  const content = fs.readFileSync(dotEnvPath, 'utf8');
  content.split('\n').forEach(line => {
    const [key, ...valueParts] = line.split('=');
    if (key && valueParts.length > 0) {
      dotEnvVars[key.trim()] = valueParts.join('=').trim();
    }
  });
}

const targetPath = path.join(envDirectory, 'environment.ts');
const targetPathProd = path.join(envDirectory, 'environment.prod.ts');

const supabaseUrl = process.env.ORD_SUPABASE_URL || dotEnvVars.SUPABASE_URL || '';
const supabaseKey = process.env.ORD_SUPABASE_KEY || dotEnvVars.SUPABASE_KEY || '';

const envConfigFile = `export const environment = {
  production: false,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

const envConfigFileProd = `export const environment = {
  production: true,
  supabaseUrl: '${supabaseUrl}',
  supabaseKey: '${supabaseKey}'
};
`;

console.log('Generating environment files...');

fs.writeFileSync(targetPath, envConfigFile);
fs.writeFileSync(targetPathProd, envConfigFileProd);

console.log('Environment files generated successfully.');
