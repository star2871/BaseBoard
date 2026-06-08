import admin from 'firebase-admin';
import { createRequire } from 'module';

let serviceAccount;

if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  // 프로덕션 환경(예: Render)에서는 환경 변수를 사용합니다.
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON 파싱에 실패했습니다. 유효한 JSON 문자열인지 확인하세요.', e);
    process.exit(1);
  }
} else {
  // 로컬 개발 환경에서는 JSON 파일에서 직접 로드합니다.
  const require = createRequire(import.meta.url);
  try {
    serviceAccount = require('./serviceAccountKey.json');
  } catch (error) {
    console.error("오류: 'serviceAccountKey.json' 파일을 찾을 수 없습니다. 로컬 개발 시에는 'apps/server' 디렉터리에 파일을 위치시켜 주세요. 프로덕션 환경에서는 FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수를 설정해야 합니다.");
    process.exit(1);
  }
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;