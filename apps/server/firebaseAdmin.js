import admin from 'firebase-admin';
import { createRequire } from 'module';

const require = createRequire(import.meta.url);
// serviceAccountKey.json 파일의 상대 경로를 사용하여 로드합니다.
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;