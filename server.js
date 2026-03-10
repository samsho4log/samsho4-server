const http = require("http");

const PORT = process.env.PORT || 3000;
const HOST = "0.0.0.0";

const html = `<!DOCTYPE html>
<html lang="ko">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Samsho4 Netplay</title>
  <style>
    body {
      margin: 0;
      font-family: Arial, sans-serif;
      background: #111827;
      color: #f9fafb;
      display: flex;
      justify-content: center;
      align-items: center;
      min-height: 100vh;
    }
    .card {
      width: 420px;
      background: #1f2937;
      border: 1px solid #374151;
      border-radius: 16px;
      padding: 28px;
      box-shadow: 0 10px 30px rgba(0,0,0,0.35);
    }
    h1 {
      margin: 0 0 10px;
      font-size: 28px;
    }
    p {
      margin: 0 0 20px;
      color: #d1d5db;
    }
    label {
      display: block;
      margin-bottom: 8px;
      font-size: 14px;
      color: #e5e7eb;
    }
    input {
      width: 100%;
      box-sizing: border-box;
      padding: 12px;
      border-radius: 10px;
      border: 1px solid #4b5563;
      background: #111827;
      color: white;
      font-size: 16px;
      margin-bottom: 14px;
    }
    button {
      width: 100%;
      padding: 12px;
      border: 0;
      border-radius: 10px;
      background: #2563eb;
      color: white;
      font-size: 16px;
      cursor: pointer;
      font-weight: bold;
    }
    button:hover {
      background: #1d4ed8;
    }
    .info {
      margin-top: 18px;
      font-size: 14px;
      color: #9ca3af;
      line-height: 1.5;
    }
  </style>
</head>
<body>
  <div class="card">
    <h1>Samsho4 Netplay</h1>
    <p>사쇼4 전용 넷플 플랫폼 시작 화면</p>

    <label for="nickname">닉네임</label>
    <input id="nickname" type="text" placeholder="닉네임 입력" />

    <button onclick="enterLobby()">입장</button>

    <div class="info">
      현재 단계: 서버 성공 / 첫 화면 테스트 완료 전<br />
      다음 단계: 로비, 채팅, 방 만들기
    </div>
  </div>

  <script>
    function enterLobby() {
      const nick = document.getElementById("nickname").value.trim();
      if (!nick) {
        alert("닉네임을 입력하세요.");
        return;
      }
      alert("입장 테스트 성공: " + nick);
    }
  </script>
</body>
</html>`;

const server = http.createServer((req, res) => {
  res.writeHead(200, { "Content-Type": "text/html; charset=utf-8" });
  res.end(html);
});

server.listen(PORT, HOST, () => {
  console.log(\`Server running on \${HOST}:\${PORT}\`);
});
