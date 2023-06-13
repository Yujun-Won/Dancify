# complete

## 폴더 구조
```
📦complete
 ┣ 📂notebooks
 ┃ ┣ 📜angle1.ipynb
 ┃ ┗ 📜angle2.ipynb
 ┣ 📂point_sample
 ┃ ┣ 📜chansol.json
 ┃ ┣ 📜heewon.json
 ┃ ┗ 📜sample.json
 ┣ 📜angle_calc.py
 ┣ 📜example.py
 ┗ 📜note.md
```

- `notebooks`
    - `angle1.ipynb`
        - JSON 파일을 파싱하여, `matplotlib`을 이용하여 plot
        - 특정 부분만 떼어 내어 향후 진행 방안에 대한 탐구
    - `angle2.ipynb`
        - `angle1.ipynb`에 기반하여, 골격과 관절에 대한 `arctan2()` 각도 추출
- `point_sample`
    - `chansol.json`: 찬솔님께 받은 AI-HUB의 이미지에서 추출한 keypoint
    - `heewon.json`: 희원님께 받은 Movenet에서 추출한 keypoint
    - `sample.json`: `chansol.json`과 `heewon.json`을 하나의 리스트에 담은 파일
- `angle_calc.py`: 각도 추출이 구현된 함수
- `example.py`: `angle_calc.py`를 실제 사용한 예시