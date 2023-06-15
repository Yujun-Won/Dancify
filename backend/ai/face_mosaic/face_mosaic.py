# pip install -q mediapipe==0.10.0
# pip install moviepy
# pip install protobuf==3.20
# pip install opencv-python

'''
# 사용 예시
from face_mosaic.face_mosaic import *

AWS_ACCESS_KEY_ID ="blahblah"
AWS_SECRET_ACCESS_KEY = "blahblah"
bucket = 'dancify-hw-bucket'

localpath = os.path.dirname(os.path.abspath(__file__)) #현재 폴더
local_videopath =  os.path.join(localpath, 'spicy_winter.mp4')
videoname = 'spicy_winter'

face_mosaic(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, bucket, local_videopath, videoname)
'''

import boto3
import os
import cv2
import mediapipe as mp
import shutil

from .drawing_utils import draw_detection

import moviepy.editor as mvp


def face_mosaic(AWS_ACCESS_KEY_ID, AWS_SECRET_ACCESS_KEY, bucket, local_videopath, videoname):
    '''
    ---------------함수 설명---------------
    동영상에 얼굴 모자이크를 하여 저장해주는 함수입니다.
    현재 local경로(face_mosaic폴더)에 폴더를 만들어서 파일들(모자이크 영상 파일, 오디오 추출 파일)을 저장했다가,
    s3에 모자이크 영상 업로드를 완료하면 shutils로 지워줍니다. 원본 동영상은 지우지 않습니다.

    ---------------parameter---------------
    - AWS_ACCESS_KEY_ID : 키 아이디
    - AWS_SECRET_ACCESS_KEY : 시크릿 키
    - bucket : 버킷 이름
    - local_videopath : 로컬에 저장된 비디오 경로를 입력합니다.
    - videoname :   s3에 저장될 비디오 이름을 입력합니다.
                    ex) karina.mp4면 karina만 입력

    ---------------s3 저장 경로---------------
    (나중에 backend분들과 상의 후 수정 필요)
    - XXX 모자이크 한 영상이 저장될 경로 : f'video/mosaic_video/{videoname}.mp4' (s3_savepath)

    '''

    # s3로드
    client = boto3.client('s3', aws_access_key_id=AWS_ACCESS_KEY_ID, aws_secret_access_key=AWS_SECRET_ACCESS_KEY, region_name='ap-northeast-2')

    # 1) 영상 저장할 경로 지정
    localpath = os.path.dirname(os.path.abspath(__file__))  # 현재 폴더
    localpath = os.path.join(localpath, f'{videoname}\\')  # 현재 폴더/videoname/

    # 2) localpath 폴더 생성
    try:
        if not os.path.exists(localpath):
            os.makedirs(localpath)
    except OSError:
        print('Error: Creating directory. ' + localpath)

    # ------------------영상에 모자이크 효과------------------
    # 결과 비디오 : f'{videoname}.mp4'
    # 모자이크 한 무음 비디오 : f'{videoname}_mosaic.mp4'
    # 비디오 mp3 : f'{videoname}_mosaic.mp3'
    resultpath = localpath + videoname + '.mp4'
    mosaicpath = localpath + videoname + '_mosaic.mp4'
    audiopath = mosaicpath[:-4] + '.mp3'

    # 동영상 파일 열기
    cap = cv2.VideoCapture(local_videopath)

    # 잘 열렸는지 확인
    if not cap.isOpened():
        print('Can\'t open the video (%d)' % (local_videopath))
        exit()

    # 재생할 파일의 넓이 얻기
    width = cap.get(cv2.CAP_PROP_FRAME_WIDTH)
    # 재생할 파일의 높이 얻기
    height = cap.get(cv2.CAP_PROP_FRAME_HEIGHT)
    # 재생할 파일의 프레임 레이트 얻기
    fps = cap.get(cv2.CAP_PROP_FPS)

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')

    # 파일 stream 생성
    out = cv2.VideoWriter(mosaicpath, fourcc, fps, (int(width), int(height)))

    # 모델 불러오기
    mp_face_detection = mp.solutions.face_detection
    face_detection = mp_face_detection.FaceDetection(model_selection=1, min_detection_confidence=0.4)

    # 이전 detection값 저장해두는 변수
    flag = 0

    while True:
        ret, image = cap.read()

        if image is None:
            break

        # 작업 전에 BGR 이미지를 RGB로 변환합니다.
        results = face_detection.process(cv2.cvtColor(image, cv2.COLOR_BGR2RGB))

        if results.detections:
            flag = results.detections
            annotated_image = image.copy()
            frame = draw_detection(annotated_image, results.detections[0])
            out.write(frame)

        # detect 못 했으면 이전의 값 그대로 사용
        elif not results.detections and flag != 0:
            annotated_image = image.copy()
            frame = draw_detection(annotated_image, flag[0])
            out.write(frame)

        else:
            out.write(image)

    # 재생 파일 종료
    cap.release()
    # 저장 파일 종료
    out.release()

    # ------------------영상 오디오 추출하고 비디오에 merge하기------------------
    # 원본 비디오에서 오디오를 추출합니다.
    mvp.ffmpeg_tools.ffmpeg_extract_audio(local_videopath, audiopath)

    # 비디오와 오디오를 합쳐 저장합니다. (모자이크비디오, 오디오, 결과저장경로)
    mvp.ffmpeg_tools.ffmpeg_merge_video_audio(mosaicpath, audiopath, resultpath, vcodec='copy', acodec='copy', ffmpeg_output=False, logger='bar')

    # s3에 편집한 동영상 업로드하기
    s3_savepath = 'video/mosaic_video/' + videoname + '.mp4'
    client.upload_file(resultpath, bucket, s3_savepath)  # 파일 업로드 : 로컬 경로, 버킷, 저장할 s3경로
    # 편집에 사용되었던 localpath 폴더 삭제
    shutil.rmtree(localpath)
