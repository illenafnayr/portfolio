import { NodeSSH } from 'node-ssh';
import { execSync } from 'child_process';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config({ path: '.env.production' }); 

const ssh = new NodeSSH();

const config = {
  host: process.env.SSH_HOST,
  username: process.env.SSH_USER,
  privateKey: process.env.SSH_PRIVATE_KEY_PATH,
  port: process.env.SSH_PORT ? parseInt(process.env.SSH_PORT) : 22,
  remotePath: process.env.SSH_TARGET_DIR
};

async function deploy() {
  try {
    console.log('Building project...');
    execSync('npm run build', { stdio: 'inherit' });

    console.log(`Connecting to ${config.host}...`);
    await ssh.connect(config);

    console.log('📦 Uploading files...');
    await ssh.putDirectory('dist', config.remotePath, {
      recursive: true,
      concurrency: 5,
      validate: function(itemPath) {
        const baseName = path.basename(itemPath);
        return baseName !== '.DS_Store';
      },
      tick: function(localPath, remotePath, error) {
        if (error) {
          console.error(`Error transferring ${localPath}`);
        }
      }
    });

    console.log('Deployment complete');
    ssh.dispose();
  } catch (err) {
    console.error(' Deployment failed:', err);
  }
}

deploy();
