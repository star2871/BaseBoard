import admin from 'firebase-admin';

let firebaseAdmin = null;

// FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수가 있을 경우에만 Firebase Admin을 초기화합니다.
if (process.env.FIREBASE_SERVICE_ACCOUNT_JSON) {
  try {
    const serviceAccount = JSON.parse(process.env.FIREBASE_SERVICE_ACCOUNT_JSON);
    admin.initializeApp({
      credential: admin.credential.cert(serviceAccount)
    });
    firebaseAdmin = admin;
    console.log('✅ Firebase Admin SDK가 성공적으로 초기화되었습니다.');
  } catch (e) {
    // 환경 변수가 있지만 파싱에 실패한 경우, 경고만 하고 앱이 중단되지는 않습니다.
    console.warn('⚠️ Firebase Admin SDK 초기화 실패: FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수의 형식이 올바르지 않습니다.', e.message);
  }
} else {
  // 환경 변수가 없는 것은 정상적인 상황일 수 있으므로 경고 메시지를 출력합니다.
  console.warn("ℹ️ FIREBASE_SERVICE_ACCOUNT_JSON 환경 변수가 없어 Firebase Admin SDK가 초기화되지 않았습니다. Firebase 관련 기능은 동작하지 않습니다.");
}

// 초기화된 admin 객체 또는 null을 내보냅니다.
export default firebaseAdmin;