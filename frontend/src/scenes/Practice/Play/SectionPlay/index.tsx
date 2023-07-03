import { practiceActions } from "@features/practice/practiceSlice";
import { useAppDispatch, useAppSelector } from "@toolkit/hook";
import { IPoseMessages, IPractice } from "@type/practice";
import { Pose } from "@type/moveNet";

import { motion } from "framer-motion";
import {
  useEffect,
  useRef,
  useState,
  MutableRefObject,
  useCallback,
} from "react";
import ReactPlayer from "react-player";
import Webcam from "react-webcam";
import * as poseDetection from "@tensorflow-models/pose-detection";
import { danceableBodyCheck, runMovenet } from "@ai/movenet";
import { Button } from "@components/ui/button";

import { dancer_json } from "@ai/dancer_json_list";

export default function SectionPlay({
  data,
  detector,
  isForceEnd,
  webcamBestRecord,
  webcamCurrentRecord,
}: {
  data: IPractice;
  detector: poseDetection.PoseDetector;
  isForceEnd: React.MutableRefObject<boolean>;
  webcamBestRecord: MutableRefObject<Blob | undefined>;
  webcamCurrentRecord: MutableRefObject<Blob | undefined>;
}) {
  const dispatch = useAppDispatch();

  const webcamRef = useRef<Webcam>(null); // 댄서블 영상을 위한 웹캠
  const canvasRef = useRef<HTMLCanvasElement>(null); // 스캘레톤 매핑을 위한 캔버스
  const mediaRecorder = useRef<MediaRecorder | null>(null); // 녹화 객체

  const [webcamDims, setWebcamDims] = useState({
    width: 0,
    height: 0,
  });
  const [videoDims, setVideoDims] = useState({
    width: 0,
    height: 0,
  });

  const [count, setCount] = useState(5); // 카운트 다운 5초
  const [poseMessage, setPoseMessage] = useState(""); //? 1초 마다 동작 평가를 저장
  const {
    playIndex,
    isRealMode,
    isSkeleton,
    isFullBody,
    isPlaying,
    isFinished,
    selectedSections,
    sectionPracticeArr,
  } = useAppSelector((state) => state.practice); // 선택된 섹션 인덱스 배열 가져오기

  const sectionId = data.sections[playIndex].sectionId;

  // 연습 모드 or 실전 모드 구분 후 선택된 섹션의 url 배열 가져오기
  const selectedSectionUrls = isRealMode
    ? [{ video: data.dancerPost.video }]
    : data.sections.filter((section, index) =>
        selectedSections.includes(index)
      );

  // 댄서와 웹캠 화면 사이즈 조정
  const handleScreenResize = () => {
    const webcam = webcamRef.current?.video;
    // webcamRef의 크기를 state에 저장하는 함수
    if (webcam) {
      const { clientWidth, clientHeight } = webcam;
      setWebcamDims({ width: clientWidth, height: clientHeight });
    }

    // 창 크기가 변경될 때마다 웹캠의 크기를 변경하는 함수
    const video = webcamRef.current?.video;
    if (video) {
      const { clientWidth, clientHeight } = video;
      setVideoDims({ width: clientWidth, height: clientHeight });
    }
  };

  // 호출 시 전신 체크 완료
  const bodyCheckCallback = () => dispatch(practiceActions.checkFullBody());

  // 1.5초 뒤와 resize 시 캔버스 크기 변경
  useEffect(() => {
    handleScreenResize();
    danceableBodyCheck(webcamRef, bodyCheckCallback); // 전신 체크 함수 실행
    window.addEventListener("resize", handleScreenResize);
    const tick = setTimeout(() => handleScreenResize(), 3000);
    return () => clearTimeout(tick);
  }, []);

  // 전신 체크 시 카운트 다운 5초 시작
  useEffect(() => {
    if (isFullBody) {
      const countDown = setInterval(() => setCount((prev) => prev - 1), 1000);
      // 컴포넌트 언마운트 or isFullBody 값 변경 시
      return () => clearInterval(countDown);
    }
  }, [isFullBody, dispatch]);

  // 구간 연습 완료 시 실행
  function finishCallback(
    avgScore: number,
    poseMessages: IPoseMessages,
    keypointJson: Pose[][]
  ) {
    const timer = setTimeout(() => {
      console.log("🚀 구간 연습 완료");
      dispatch(practiceActions.finishSectionPlay());
      const recordedWebcam = webcamCurrentRecord.current;
      // 녹화된 웹캠 영상 및 Json 데이터 저장
      if (recordedWebcam) {
        const isFirst = sectionPracticeArr.findIndex(
          (section) => section.sectionId === sectionId
        );

        const data = {
          sectionId,
          score: avgScore,
          poseMessages,
          keypointJson,
        };

        if (isFirst === -1) {
          // 첫 시도
          webcamBestRecord.current = recordedWebcam;
          dispatch(practiceActions.getFirstSectionPractice(data));
        } else if (avgScore > sectionPracticeArr[playIndex].bestScore) {
          // 갱신
          webcamBestRecord.current = recordedWebcam;
          dispatch(practiceActions.getBestSectionPractice(data));
        } else {
          // 기존 유지
          dispatch(practiceActions.increasePlayCount(sectionId));
        }
      }
    }, 100);

    return () => clearTimeout(timer);
  }

  // 다음 구간으로 강제 이동 시 실행
  function forceCallback() {
    console.log("🚫 구간 연습 중지");
    // 첫 시도에 다음 구간으로 강제 이동했을 경우
    dispatch(practiceActions.updateSectionForce(sectionId));
    dispatch(practiceActions.finishSectionPlay());
    setTimeout(() => dispatch(practiceActions.moveNextSection()), 100); //! 임시 컴포넌트 언마운트
  }

  // 녹화 시작 함수
  const startRecording = useCallback(() => {
    const constraints = { video: true, audio: false };
    console.log("💛 recording started");

    navigator.mediaDevices
      .getUserMedia(constraints)
      .then((stream) => {
        const mediaRecorderInstance = new MediaRecorder(stream);
        const chunks: Blob[] = [];

        mediaRecorderInstance.addEventListener("dataavailable", (event) => {
          if (event.data && event.data.size > 0) {
            chunks.push(event.data);
          }
        });
        mediaRecorderInstance.addEventListener("stop", () => {
          const recordedBlob = new Blob(chunks, { type: "video/webm" });
          webcamCurrentRecord.current = recordedBlob;
        });
        mediaRecorderInstance.start();
        mediaRecorder.current = mediaRecorderInstance;
      })
      .catch((error) => {
        console.error("Error accessing webcam:", error);
      });
  }, [webcamCurrentRecord]);

  // 녹화 종료 함수
  const stopRecording = useCallback(async () => {
    if (mediaRecorder.current && mediaRecorder.current.state !== "inactive") {
      console.log("💛 recording ended");
      mediaRecorder.current.stop();
    }
  }, []);

  // 녹화된 비디오를 저장하는 배열
  useEffect(() => {
    if (isPlaying) startRecording();
    if (isFinished) stopRecording();
  }, [isPlaying, isFinished, startRecording, stopRecording]);

  useEffect(() => {
    if (isFullBody) {
      const timer = setTimeout(async () => {
        // 연습 시작
        dispatch(practiceActions.playVideo());

        // 무브넷 실행
        const moveNetResult = await runMovenet(
          isForceEnd,
          isSkeleton,
          webcamRef,
          canvasRef,
          detector,
          dancer_json,
          setPoseMessage
        );

        // 녹화 종료
        dispatch(practiceActions.finishWebcamRecording());

        // 무브넷 결과에 따라 다음 동작
        // avgScore, poseMessages, keypointJson,
        if (typeof moveNetResult !== "string") finishCallback(...moveNetResult);
        else forceCallback();
      }, 5000); // 5초 카운트 다운

      return () => {
        clearTimeout(timer);
        console.log("unmount");
      };
    }
  }, [isFullBody, isSkeleton, detector, sectionId, dispatch, isForceEnd]);

  return (
    <div className="row-center w-full gap-10">
      <div className="row-center h-80 w-full">
        {/* //! 숏폼 UI 구현 필요 */}
        {/* 스트리밍 영역 */}
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.5 }}
          className={`relative h-0 overflow-hidden rounded-md`}
          style={{
            width: `${videoDims.width / 2}px`,
            aspectRatio: `${videoDims.width / videoDims.height}`,
            paddingBottom: `${webcamDims.height}px`,
          }}
        >
          <ReactPlayer
            url={selectedSectionUrls.map((section) => section.video)[playIndex]}
            playing={isPlaying}
            width={"100%"}
            height={"100%"}
            className="absolute left-0 top-0 h-full w-full"
            // onEnded={() => dispatch(practiceActions.finishSectionPlay())}
          />
        </motion.section>

        <section className="relative overflow-hidden rounded-md">
          {/* 웹캠 영상 */}
          <Webcam ref={webcamRef} mirrored={true} />

          {/* 스캘레톤 매핑 */}
          <canvas
            ref={canvasRef}
            style={{
              transform: `scaleX(-1)`, // 거울모드
            }}
            className={`absolute top-0 z-10 h-full w-full`}
          />

          {!isFullBody ? (
            <div className="absolute top-0 z-10 flex h-full w-full items-end justify-end gap-2 pb-3 pr-3">
              {/* 전신 메시지 */}
              <p className="col-center rounded-md bg-background px-4 py-2">
                전신이 보이도록 뒤로 이동해주세요.
              </p>
              <Button onClick={() => dispatch(practiceActions.checkFullBody())}>
                강제 시작
              </Button>
            </div>
          ) : count > -1 ? (
            <div className="col-center absolute top-0 z-10 h-full w-full">
              {/* 카운트 다운 */}
              <div className="col-center h-32 w-32 rounded-full bg-background">
                <span className="text-5xl font-medium">{count}</span>
              </div>
            </div>
          ) : null}

          {/* 평가 UI 영역 */}
          <div className="col-center absolute bottom-4 left-4 z-10">
            {poseMessage !== "" && (
              <span className="text-lg font-medium">{poseMessage}</span>
            )}
          </div>
        </section>
      </div>
    </div>
  );
}
