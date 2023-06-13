import Loading from "@components/Loading";
import Header from "./DancerDetailItem/Header";
import Content from "./DancerDetailItem/Content";
import ScrollButton from "@components/ScrollButton";

import { useReadVideoPost } from "@api/posts/readVideoPost";

export default function VideoPostDetail({ id }: { id: string }) {
  // 게시글 불어오기
  const { data, isLoading, error } = useReadVideoPost(id);

  return (
    <>
      {/* 로딩 시 로딩 화면 표시 */}
      {isLoading && <Loading />}

      {/* 에러 발생 시 에러 메시지 표시 */}
      {error && <p className="text-alert_danger">문제가 발생했습니다.</p>}

      {/* 데이터가 있을 경우 화면 표시 */}
      {data && (
        <div className="mx-auto w-full max-w-screen-lg rounded-2xl bg-white p-6 shadow-lg">
          {/* 게시글 해더 */}
          <Header data={data} />

          {/* 게시글 내용 */}
          <Content data={data.content} />
        </div>
      )}

      {/* 최상단 이동 버튼 */}
      <ScrollButton />
    </>
  );
}
