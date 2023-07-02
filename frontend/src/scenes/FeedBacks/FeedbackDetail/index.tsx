import Header from "./FeedbackDetailItem/Header";
import NavTab from "./FeedbackDetailItem/NavTab";
import { Tabs } from "@components/ui/tabs";

import AiFeedback from "./AiFeedback";
import FeedbackRequest from "./FeedbackRequest";
import { useEffect, useState } from "react";
import { feedbackActions } from "@features/feedback/feedbackSlice";
import { feedbackDetailData } from "../data/feedbackDetailData";
import { useAppDispatch } from "@toolkit/hook";
import FeedbackFinished from "./FeedbackFinished";
import FeedbackWaiting from "./FeedbackWaiting";
import Sectiontab from "./FeedbackDetailItem/SectionTab";

export default function FeedbackDetail({ id }: { id: string }) {
  const dispatch = useAppDispatch();
  const [videoFile, setVideoFile] = useState<{
    [key: string]: { file: File; filename: string };
  }>({});

  // api 요청
  const data = feedbackDetailData;

  useEffect(() => {
    if (data) {
      const sections = data.sections.map((section) => {
        const {
          feedbackSectionId,
          danceablevideo,
          danceablemessage,
          dancerVideo,
          dancerMessage,
        } = section;

        return {
          feedbackSectionId,
          danceablevideo,
          danceablemessage: danceablemessage || "",
          dancerVideo: dancerVideo || "",
          dancerMessage: dancerMessage || [],
        };
      });

      dispatch(feedbackActions.getSections(sections));
    }
  }, [data, dispatch]);

  return (
    <Tabs defaultValue="aiFeedback" className="h-full w-full space-y-6">
      <Header data={data} />
      <NavTab status={data.status} />
      <Sectiontab data={data} />

      <AiFeedback data={data} />
      {data.status === "신청 전" && <FeedbackRequest data={data} />}
      {data.status === "대기 중" && (
        <FeedbackWaiting
          data={data}
          videoFile={videoFile}
          setVideoFile={setVideoFile}
        />
      )}
      {data.status === "완료" && <FeedbackFinished data={data} />}
    </Tabs>
  );
}
