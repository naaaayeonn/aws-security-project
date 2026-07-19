// config.js에 적어둔 정보로 AWS 명부 가져오기
const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);
const cognitoUser = userPool.getCurrentUser();

if (cognitoUser != null) {
    cognitoUser.getSession(function(err, session) {
        if (err) {
            alert("세션이 만료되었습니다. 다시 로그인해주세요.");
            window.location.href = "index.html";
            return;
        }

        // AWS가 준 신분증(ID 토큰) 해독하기
        const idToken = session.getIdToken().getJwtToken();
        const payload = idToken.split('.')[1];
        const decodedPayload = JSON.parse(atob(payload));

        const userGroups = decodedPayload['cognito:groups'] || [];
        const userEmail = decodedPayload['email'];

        // 화면에 로그인한 사람 이메일 띄워주기
        document.getElementById('userGreeting').innerText = userEmail + " 님 환영합니다!";

        // Admin 그룹인지 확인하고 화면 제어
        if (userGroups.includes('Admin')) {
            document.getElementById('uploadArea').style.display = 'block'; // 업로드 창 보이기
            document.getElementById('roleMessage').innerText = "👑 현재 권한: 관리자(Admin) - 파일 업로드 가능";
        } else {
            document.getElementById('roleMessage').innerText = "👤 현재 권한: 일반 사용자(User) - 읽기만 가능";
        }
    });
} else {
    
    alert("로그인이 필요합니다.");
    window.location.href = "index.html";
}

function logout() {
    if (cognitoUser != null) {
        cognitoUser.signOut();
    }
    alert("로그아웃 되었습니다.");
    window.location.href = "index.html";
}

// ====== [UI 테스트용 가짜 로직 추가(로그인이 안되는 상황이라 일단 바로 메인페이지 접속할수 있게 코드 추가함] ======
// AWS 연결 없이 무조건 관리자(Admin)인 것처럼 화면을 세팅

// document.getElementById('userGreeting').innerText = "테스트 계정 님 환영합니다!";
// document.getElementById('roleMessage').innerText = "👑 현재 권한: 관리자(Admin) - 파일 업로드 가능";
// document.getElementById('uploadArea').style.display = 'block'; // S3 드래그 앤 드롭 창 보이기

// function logout() {
   // alert("로그아웃 되었습니다. (테스트)");
   // window.location.href = "index.html";
}
// ==========================================
