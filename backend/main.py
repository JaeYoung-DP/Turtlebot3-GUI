from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path
import json, re

app = FastAPI()
app.add_middleware(CORSMiddleware, allow_origins=["*"], allow_methods=["*"], allow_headers=["*"])
BASE_DIR = Path(__file__).parent
CLASS_ORDER = ["red", "green", "stop", "left", "right", "parking", "kids"]

def parse_detection_log(filepath):
    entries = []
    if not Path(filepath).exists():
        return entries
    try:
        text = Path(filepath).read_text(encoding="utf-8")
        for block in text.split("---"):
            m = re.search(r"data: '(.+?)'", block.strip())
            if m:
                try: entries.append(json.loads(m.group(1)))
                except: pass
    except Exception as e: print(f"detection log error: {e}")
    return entries

def parse_lane_log(filepath):
    values = []
    if not Path(filepath).exists():
        return values
    try:
        text = Path(filepath).read_text(encoding="utf-8")
        for block in text.split("---"):
            m = re.search(r"data: (\d+)", block.strip())
            if m: values.append(int(m.group(1)))
    except Exception as e: print(f"lane log error: {e}")
    return values

def parse_lane_error_log(filepath):
    values = []
    if not Path(filepath).exists():
        return values
    try:
        text = Path(filepath).read_text(encoding="utf-8")
        for block in text.split("---"):
            m = re.search(r"data: ([\-\d\.eE+]+)", block.strip())
            if m:
                try: values.append(float(m.group(1)))
                except: pass
    except Exception as e: print(f"lane error log error: {e}")
    return values

detection_data  = parse_detection_log(BASE_DIR / "detection_info.txt")
lane_data       = parse_lane_log(BASE_DIR / "lane_state.txt")
lane_error_data = parse_lane_error_log(BASE_DIR / "lane_error_norm.txt")
total_frames    = min(len(detection_data), len(lane_data), len(lane_error_data))
print(f"Loaded {total_frames} frames")

def build_summary():
    fps_values = []
    infer_values = []
    detected_frames = 0
    total_detections = 0
    class_scores = {label: [] for label in CLASS_ORDER}

    for i in range(total_frames):
        entry = detection_data[i]
        detections = entry.get("detections", [])
        fps_values.append(float(entry.get("fps", 0) or 0))
        infer_values.append(float(entry.get("infer_ms", 0) or 0))

        if detections:
            detected_frames += 1

        for det in detections:
            label = det.get("label")
            score = det.get("score")
            if not label or score is None:
                continue
            class_scores.setdefault(label, []).append(float(score))
            total_detections += 1

    ordered_labels = CLASS_ORDER + sorted(label for label in class_scores if label not in CLASS_ORDER)
    class_summary = []
    for label in ordered_labels:
        scores = class_scores.get(label, [])
        avg_score = round(sum(scores) / len(scores), 4) if scores else None
        class_summary.append({
            "label": label,
            "avg_score": avg_score,
            "count": len(scores),
        })

    return {
        "total_frames": total_frames,
        "avg_fps": round(sum(fps_values) / len(fps_values), 2) if fps_values else 0,
        "avg_infer_ms": round(sum(infer_values) / len(infer_values), 2) if infer_values else 0,
        "detected_frames": detected_frames,
        "detection_rate": round(detected_frames / total_frames, 4) if total_frames else 0,
        "total_detections": total_detections,
        "class_summary": class_summary,
    }

summary_data = build_summary()

@app.get("/api/total_frames")
def get_total_frames(): return {"total": total_frames}

@app.get("/api/summary")
def get_summary(): return summary_data

@app.get("/api/frames/{end_idx}")
def get_frames(end_idx: int):
    if total_frames == 0:
        return []
    end_idx = max(1, min(end_idx, total_frames))
    result = []
    for i in range(end_idx):
        d   = detection_data[i]
        det = d.get("detections", [])
        err = lane_error_data[i]
        direction = "left" if err < -0.03 else ("right" if err > 0.03 else "center")
        result.append({
            "frame": i, "fps": d.get("fps", 0), "infer": d.get("infer_ms", 0),
            "label": det[0]["label"] if det else "none",
            "score": det[0]["score"] if det else None,
            "lane": lane_data[i], "lane_error": err, "direction": direction,
        })
    return result
