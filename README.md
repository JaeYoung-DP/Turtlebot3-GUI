# TurtleBot3 자율주행 모니터링 GUI

TurtleBot3 자율주행 로그를 시각화하는 모니터링 대시보드입니다.  
프론트엔드는 React + Vite, 백엔드는 FastAPI로 구성되어 있습니다.

## 주요 기능

- 객체 감지 영상 / 차선 인식 영상 동시 재생
- FPS, inference time, detection score, 조향 방향 실시간 시각화
- 재생 종료 후 분석 결과 탭 제공
- 평균 FPS, 평균 inference time, 7개 클래스 평균 confidence 확인 가능

## 저장소 구성

```text
.
├─ backend/
│  ├─ main.py
│  ├─ requirements.txt
│  └─ start.bat
├─ frontend/
│  ├─ public/
│  │  └─ sl_logo.png
│  ├─ src/
│  ├─ package.json
│  ├─ package-lock.json
│  └─ start.bat
├─ environment.yml
├─ setup.bat
└─ README.md
```

## 저장소에 포함하지 않는 파일

아래 파일들은 GitHub에 올리지 않고,  별도로 내려받아 지정 위치에 넣는 방식입니다.

### 로그 파일

아래 3개 파일을 `backend/` 폴더에 넣어야 합니다. ( → google drive → 고도화 → 로그데이터 )  

```text
backend/detection_info.txt
backend/lane_state.txt
backend/lane_error_norm.txt
```

### 영상 파일

아래 2개 파일을 `frontend/public/` 폴더에 넣어야 합니다. ( → google drive → 고도화 → LANE, OBJECT.mov 다운) 

```text
frontend/public/OBJECT.mov
frontend/public/LANE.mov
```

파일명은 반드시 위 이름과 동일해야 합니다.

## 설치 방법

### 1. 저장소 clone

```bash
git clone <YOUR_REPOSITORY_URL>
cd <REPOSITORY_NAME>
```

### 2. 초기 환경 세팅

아래 명령 한 번으로 conda 환경 생성과 프론트 패키지 설치까지 진행됩니다.

```bat
setup.bat
```

`setup.bat`가 하는 일:

1. `environment.yml` 기준으로 `slui` conda 환경 생성 또는 업데이트
2. `backend/requirements.txt` 기반 Python 패키지 설치
3. conda 환경 안에 Node.js 설치
4. `frontend/`에서 `npm install` 실행


다음과 구성.

- Python 의존성: `backend/requirements.txt`
- conda 환경 전체: `environment.yml`
- 한 번에 설치: `setup.bat`

즉, `setup.bat` 한 번이면 됩니다.

## 실행 방법

로그 파일과 `.mov` 파일을 지정 위치에 넣은 뒤, 터미널 2개를 열어서 실행합니다.

### 백엔드 실행

```bash
conda activate slui
cd 자신의 경로/GUI/backend
uvicorn main:app --reload --port 8000
```

또는:

```bat
backend\start.bat
```

### 프론트엔드 실행

```bash
conda activate slui
cd frontend
npm run dev
```

또는:

```bat
frontend\start.bat
```

## 접속 주소

- 프론트엔드: `http://localhost:5173`
- 백엔드: `http://localhost:8000`


## 주의사항
- 로그 파일이나 영상 파일이 없는 상태에서도 프로젝트는 clone 및 환경 세팅이 가능하도록 구성되어 있습니다.
- 로그 파일이나 영상을 꼭 추가하여 실행하여 주시길 바랍니다 ^^ 우리팀원들~ 
