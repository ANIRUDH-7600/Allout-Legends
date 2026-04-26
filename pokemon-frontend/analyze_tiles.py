import numpy as np
from PIL import Image

def analyze_tileset(image_path):
    img = Image.open(image_path).convert('RGB')
    data = np.array(img)
    h, w, _ = data.shape
    print(f"Image Size: {w}x{h}")
    gray = np.mean(data, axis=2)
    row_means = np.mean(gray, axis=1)
    col_means = np.mean(gray, axis=0)

    # Sort indices by intensity (darkest first)
    top_h = sorted(np.argsort(row_means)[:20])
    top_v = sorted(np.argsort(col_means)[:20])
    print(f"Top 20 Darkest Rows: {top_h}")
    print(f"Top 20 Darkest Cols: {top_v}")

    # Calculate differences between consecutive dark lines
    h_diffs = np.diff(top_h)
    v_diffs = np.diff(top_v)
    print(f"H-Line Gaps: {h_diffs}")
    print(f"V-Line Gaps: {v_diffs}")

    candidate_sizes = [16, 24, 32, 48, 64, 80, 96]
    print("\nMean boundary strength (lower is darker):")
    for s in candidate_sizes:
        scores_v = []
        for off in range(s):
            scores_v.append(np.mean(col_means[off::s]))
        scores_h = []
        for off in range(s):
            scores_h.append(np.mean(row_means[off::s]))
        print(f"Size {s}: V-Best-Offset={np.argmin(scores_v)} (Val={min(scores_v):.2f}), H-Best-Offset={np.argmin(scores_h)} (Val={min(scores_h):.2f})")

analyze_tileset('public/assets/tileset.png')
