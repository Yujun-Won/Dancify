import { Separator } from "@components/ui/separator";
import { useAppSelector } from "@toolkit/hook";
import { IPractice } from "@type/practice";
import calculateAverage from "@util/calCulateAverage";

export default function Information({ data }: { data: IPractice }) {
  const sectionPracticeArr = useAppSelector(
    (state) => state.practice.sectionPracticeArr
  );

  const AvgBestScore = calculateAverage(
    sectionPracticeArr.map((section) => section.bestScore)
  );

  return (
    <div className="h-[500px] w-full flex-shrink-0 rounded-md bg-background p-6 shadow-md lg:w-[360px] xl:w-[440px]">
      <div className="flex h-full flex-col justify-between">
        {/* 제목과 댄서 이름 */}
        <div className="col-end">
          <span className="text-xl">{data.dancerPost.title}</span>
          <span className="text-muted-foreground">
            {data.dancerPost.nickname}
          </span>
        </div>

        {/* 구간별 반복 횟수 */}
        <div className="row-center flex-wrap">
          {sectionPracticeArr.map((section, index) => (
            <div key={section.sectionId} className="flex justify-between">
              <span className="">{index + 1}</span>
              <span className="">{section.playCounts}</span>
            </div>
          ))}
        </div>

        {/* 완료 문구와 전체 평균 점수 */}
        <div className="col-end w-full">
          <p>고생하셨습니다!</p>
          <Separator className="my-3" />
          <p className="text-xl">Score: {AvgBestScore}</p>
        </div>
      </div>
    </div>
  );
}
