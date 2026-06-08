import admin from 'firebase-admin';

let serviceAccount;

// 프로덕션 및 로컬 환경 모두 FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수를 사용합니다.
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  console.log('Firebase 인증: FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수를 사용하여 초기화합니다.');
  try {
    serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
  } catch (e) {
    console.error('FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수 파싱에 실패했습니다. 유효한 JSON 문자열인지 확인하세요.', e);
    process.exit(1);
  }
  } else {
  // 환경 변수가 없을 경우, 로컬/프로덕션 모두에서 에러를 발생시키고 종료합니다.
  console.error("오류: FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수가 설정되지 않았습니다. 로컬 개발을 위해서는 'apps/server/.env' 파일에 해당 변수를 설정해야 합니다.");
  process.exit(1);
}

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});

export default admin;