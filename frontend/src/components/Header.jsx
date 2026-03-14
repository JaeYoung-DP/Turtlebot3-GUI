export default function Header() {
  return (
    <div
      style={{
        background: "linear-gradient(135deg,#0A2463 0%,#1D4ED8 60%,#2563EB 100%)",
        padding: "18px 32px",
        display: "flex",
        alignItems: "center",
        gap: 20,
        borderRadius: 10,
        boxShadow: "0 4px 20px rgba(10,36,99,0.35)",
      }}
    >
      {/* 여기만 변경 */}
      <div
        style={{
          background: "white",
          padding: "4px 10px",
          borderRadius: 6,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src="/sl_logo.png"   // public 폴더에 넣은 파일 이름
          alt="SL Logo"
          style={{ height: 50, display: "block" }}
        />
      </div>

      <div>
        <div
          style={{
            color: "white",
            fontSize: "1.35rem",
            fontWeight: 700,
          }}
        >
          TurtleBot3 자율주행 모니터링 대시보드
        </div>
        <div
          style={{
            color: "#BFDBFE",
            fontSize: "0.82rem",
            marginTop: 3,
          }}
        >
          Autonomous Driving System · Powered by SL Corporation × HIGHLOW
        </div>
      </div>

      <div
        style={{
          marginLeft: "auto",
          color: "#93C5FD",
          fontSize: "0.78rem",
          textAlign: "right",
        }}
      >
        SL Corporation
        <br />
        신뢰·도전·겸손
      </div>
    </div>
  );
}
