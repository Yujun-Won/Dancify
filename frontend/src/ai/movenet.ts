import Webcam from "react-webcam";

import { poseSimilarity } from "@ai/utils/posesim";
import { drawKeypoints, drawSkeleton } from "@ai/utilities";

import { IPoseMessages, TSectionId } from "@type/practice";
import { Pose as poseType } from "@type/moveNet";

import * as poseDetection from "@tensorflow-models/pose-detection";
import * as tf from "@tensorflow/tfjs";

import { postPracticeResult } from "@api/dance/postPracticeData";

export function webcamSize(webcam: HTMLVideoElement) {
  const webcamWidth = webcam.videoWidth;
  const webcamHeight = webcam.videoHeight;

  // Set video width
  webcam.width = webcamWidth;
  webcam.height = webcamHeight;

  return { webcam, webcamWidth, webcamHeight };
}

export function getCanvasContext(
  webcamWidth: number,
  webcamHeight: number,
  canvas: HTMLCanvasElement
) {
  const ctx = canvas.getContext("2d");
  canvas.width = webcamWidth;
  canvas.height = webcamHeight;
  return ctx;
}

export function drawCanvas(pose: poseType[], ctx: CanvasRenderingContext2D) {
  //? (keypoints, confidence_score, context)
  drawKeypoints(pose[0]["keypoints"], 0.45, ctx);
  drawSkeleton(pose[0]["keypoints"], 0.45, ctx);
}

export function clearCanvas(canvas: HTMLCanvasElement) {
  const ctx = canvas.getContext("2d");
  ctx !== null && ctx.clearRect(0, 0, canvas.width, canvas.height);
}

// export async function loadMoveNetDetector2(webcamRef) {
//   await tf.ready();
//   const model = poseDetection.SupportedModels.MoveNet;
//   const detector = await poseDetection.createDetector(model); // 모델 로드
//   const webcamTag = webcamRef.current?.video as HTMLVideoElement;

//   if (!isLoading) {
//     webcamTag && detect(webcamTag, detector);
//   } else if (!isBody && !isDevice) {
//     await danceableBodyCheck(webcamRef, detector);
//   }

//   if (isReady) {
//     runMovenet(
//       sectionId,
//       webcamRef,
//       canvasRef,
//       detector,
//       dancerJson,
//       setPoseMessage,
//       updateCallback,
//     )
//   }
// }

export async function loadMoveNetDetector() {
  await tf.ready();
  const model = poseDetection.SupportedModels.MoveNet;
  const detector = await poseDetection.createDetector(model); // 모델 로드
  return detector;
}

export async function detect(
  webcam: HTMLVideoElement,
  detector: poseDetection.PoseDetector
) {
  try {
    const videoWidth = webcam.videoWidth;
    const videoHeight = webcam.videoHeight;

    // Set video width
    webcam.width = videoWidth;
    webcam.height = videoHeight;
    const pose = (await detector.estimatePoses(webcam)) as poseType[];
    // console.log(pose);
    if (pose.length > 0) return pose;
    else return "error";
  } catch (error) {
    return "error";
  }
}

export function scoreToMessage(score: number) {
  if (score < 60) {
    return "Miss";
  } else if (score >= 60 && score < 80) {
    return "Good";
  } else if (score >= 80 && score < 90) {
    return "Great";
  } else {
    return "Excellent";
  }
}

export async function danceableBodyCheck(
  webcamRef: React.RefObject<Webcam>,
  bodyCheckCallback: () => void
) {
  await tf.ready();
  const model = poseDetection.SupportedModels.MoveNet;
  const detector = await poseDetection.createDetector(model);

  const bodyCheckPerSec = setInterval(async () => {
    // 댄서블의 keypoints값 추출
    const webcamTag = webcamRef.current?.video;
    const danceable = webcamTag && (await detect(webcamTag, detector));
    // 모든 부위의 confidence score가 0.5이상인지 확인
    if (danceable !== "error") {
      const scores = danceable && danceable[0].keypoints.map((kp) => kp.score);
      // console.log(scores);
      if (scores && scores.every((score) => score >= 0.5)) {
        clearInterval(bodyCheckPerSec);
        console.log("🚀 전신 체크 완료");
        bodyCheckCallback();
        return true;
      }
    }
  }, 1000);
}

export async function runMovenet(
  sectionId: TSectionId,
  webcamRef: React.RefObject<Webcam>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  detector: poseDetection.PoseDetector,
  dancerJson: poseType[][],
  setPoseMessage: React.Dispatch<React.SetStateAction<string>>,
  updateCallback: (avgScore: number, poseMessages: IPoseMessages) => void
) {
  //구간의 실시간 댄서블 keypoint 점수
  const danceableJson: poseType[][] = [];

  //구간의 평균 유사도 점수
  let avgCosineDistance = 0;
  let oneSecCosineDistance = 0; // 1초동안의 유사도 점수(miss, good, great, excellent)

  //반복문 실행
  let indx = 1;

  const postMessages: IPoseMessages = {
    Miss: 0,
    Good: 0,
    Great: 0,
    Excellent: 0,
  };

  const drawPerSec = setInterval(async () => {
    //webcam의 video tag로 width, height 추출
    const webcamTag = webcamRef.current?.video as HTMLVideoElement;
    const { webcam, webcamWidth, webcamHeight } = webcamSize(webcamTag);

    // 댄서블의 keypoint 추출
    const danceable = await detect(webcam, detector);
    const dancer = dancerJson[indx];

    // canvas에 댄서블의 스켈레톤 그리기
    const canvas = canvasRef.current as HTMLCanvasElement;
    const ctx = getCanvasContext(webcamWidth, webcamHeight, canvas);
    if (danceable !== "error" && ctx !== null) drawCanvas(danceable, ctx);

    //에러 안 나면 x,y의 좌표와 유사도 출력
    if (danceable !== "error" && dancer !== undefined) {
      const cosineDistance = poseSimilarity(danceable[0], dancer[0], {
        strategy: "cosineDistance",
      });
      danceableJson.push(danceable); //댄서블 실시간 keypoint 저장

      if (cosineDistance instanceof Error) {
        console.log(
          "🚀 ~ file: movenet.ts:138 ~ cosineDistance: error",
          cosineDistance
        );
      } else {
        oneSecCosineDistance += cosineDistance;

        //1초 지나면 avgCosineDistance에 더해주고 점수 메세지 출력한 뒤, oneSecCosineDistance 초기화
        if (indx % 15 === 0) {
          avgCosineDistance += oneSecCosineDistance;
          const poseMessage = scoreToMessage(oneSecCosineDistance / 15);
          setPoseMessage(poseMessage);
          postMessages[poseMessage] += 1; // 동작 평가 메시지 누적
          oneSecCosineDistance = 0; // 1분동안의 유사도 점수 초기화
        }

        indx += 1; //다음 이미지 비교
      }
    }

    //강사 영상 끝나면 setInterval 멈춤
    if (indx === dancerJson.length) {
      clearInterval(drawPerSec);
      clearCanvas(canvas);
      avgCosineDistance /= indx - 1;
      updateCallback(avgCosineDistance, postMessages);

      // 댄서블의 keypoint와 녹화한 댄서블 영상을 POST 요청
      const practicedata = new FormData();
      practicedata.append("keypoints", JSON.stringify(danceableJson));
      // practicedata.append("video", webcamRecodeFile);

      const data = {
        sectionId,
        practicedata,
      };

      await postPracticeResult(data);
    }
  }, 1000 / 15); //! 15 fps
}
