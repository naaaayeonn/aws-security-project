const userPool = new AmazonCognitoIdentity.CognitoUserPool(poolData);

function showMessage(text) {
    document.getElementById('message').innerText = text;
}

function signUp() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    if (!email || !password) {
        showMessage("이메일과 비밀번호를 모두 입력해 주세요.");
        return; 
    }

    const attributeList = [
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'email', Value: email }),
        new AmazonCognitoIdentity.CognitoUserAttribute({ Name: 'address', Value: '대한민국 어딘가' }) 
    ];

    showMessage("요청을 처리 중입니다...");

    userPool.signUp(email, password, attributeList, null, function(err, result) {
        if (err) {
            showMessage("회원가입 실패: " + err.message);
            return;
        }
        showMessage("회원가입이 완료되었습니다. 로그인해 주십시오.");
    });
}

function login() {
    const email = document.getElementById('emailInput').value;
    const password = document.getElementById('passwordInput').value;

    const authenticationDetails = new AmazonCognitoIdentity.AuthenticationDetails({
        Username: email,
        Password: password,
    });

    const cognitoUser = new AmazonCognitoIdentity.CognitoUser({
        Username: email,
        Pool: userPool
    });

    showMessage("인증을 진행 중입니다...");

    cognitoUser.authenticateUser(authenticationDetails, {
        onSuccess: function (result) {
            showMessage("로그인 성공. 메인 페이지로 이동합니다.");
            setTimeout(() => {
                window.location.href = "main.html";
            }, 1000);
        },
        onFailure: function(err) {
            showMessage("로그인 실패: " + err.message);
        }
    });
}