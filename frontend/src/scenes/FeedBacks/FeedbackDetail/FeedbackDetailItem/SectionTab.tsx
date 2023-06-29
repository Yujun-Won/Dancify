import { useFeedbackRequest } from "@api/feedbacks/useFeedbackRequest";
import { useFeedbackResponse } from "@api/feedbacks/useFeedbackResponse";
import { Button } from "@components/ui/button";
import { TabsContent } from "@components/ui/tabs";
import { feedbackActions } from "@features/feedback/feedbackSlice";
import { useAppDispatch, useAppSelector } from "@toolkit/hook";
import { IFeedbackDetail } from "@type/feedbacks";

export default function Sectiontab({ data }: { data: IFeedbackDetail }) {
  const dispatch = useAppDispatch();
  const { sectionIndex, sections } = useAppSelector((state) => state.feedback);

  const { mutateAsync: feedbackRequest } = useFeedbackRequest(data.feedbackId);
  const { mutateAsync: feedbackResponse } = useFeedbackResponse(
    data.feedbackId
  );

  return (
    <div className="flex w-full items-center justify-between gap-5">
      <div className="space-x-3">
        {sections.length > 0 &&
          sections.map((section, index) => (
            <Button
              key={section.sectionId}
              onClick={() => dispatch(feedbackActions.selectSection(index))}
              className={`${
                sectionIndex === index
                  ? "bg-primary text-white"
                  : "bg-gray-300 text-black"
              }`}
            >
              {index + 1}
            </Button>
          ))}
      </div>

      {/* 댄서블인 경우 피드백 요청 완료 버튼 활성화 */}
      {!data.isDancer && (
        <TabsContent value="feedbackRequest" className="m-0">
          <Button
            disabled={
              !sections.some((section) => section.danceablemessage !== "")
            }
            onClick={() => {
              const feedbackRequestData = sections.map((section) => {
                const { sectionId, danceablemessage } = section;
                return {
                  sectionId,
                  message: danceablemessage,
                };
              });
              feedbackRequest({ sections: feedbackRequestData });
            }}
          >
            피드백 요청 완료
          </Button>
        </TabsContent>
      )}

      {/* 댄서인 경우 피드백 완료 버튼 활성화 */}
      <TabsContent value="feedbackWaiting">
        {data.isDancer && (
          <Button
            disabled={
              !sections.some((section) => section.danceablemessage !== "")
            }
            onClick={() => {
              const formData = new FormData();
              // "sectionId1": string,
              // "timeStamp1": int`int
              // "feedbacks1": string`string
              // "video1": 동영상
              // "sectionId2": string,
              // "timeStamp2": int`int
              // "feedbacks2": string`string
              // "video2": 동영상

              feedbackResponse(formData);
            }}
          >
            피드백 완료
          </Button>
        )}
      </TabsContent>
    </div>
  );
}
