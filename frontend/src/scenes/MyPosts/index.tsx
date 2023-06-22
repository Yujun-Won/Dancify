import { Separator } from "@components/ui/separator";
import { ScrollArea, ScrollBar } from "@components/ui/scroll-area";
import ViewMore from "@scenes/Posts/PostItem/ViewMore";

// useInfiniteQuery
import { useReadDancerMyPostsPerPage } from "@api/myPosts/readDancerMyPostsPerPage";
import { useReadVideoMyPostsPerPage } from "@api/myPosts/readVideoMyPostsPerPage";
import { useReadFreeMyPostsPerPage } from "@api/myPosts/readFreeMyPostsPerPage";

// 콘텐츠 로더
import DancerPostLoader from "@scenes/Posts/PostItem/DancerPostLoader";
import VideoPostLoader from "@scenes/Posts/PostItem/VideoPostLoader";
import FreePostLoader from "@scenes/Posts/PostItem/FreePostLoader";

// 미리보기 목록
import PreviewDancerPosts from "@scenes/Posts/PostItem/PreviewDancerPosts";
import PreviewVideoPosts from "@scenes/Posts/PostItem/PreviewVideoPosts";
import FreePostItem from "@scenes/Posts/Free/FreeItem/FreePostItem";

export default function MyPosts({ id }: { id: string }) {
  const {
    data: dancerData,
    error: dancerError,
    status: dancerStatus,
  } = useReadDancerMyPostsPerPage(id);

  const {
    data: videoData,
    error: videoError,
    status: videoStatus,
  } = useReadVideoMyPostsPerPage(id);

  const {
    data: freeData,
    error: freeError,
    status: freeStatus,
  } = useReadFreeMyPostsPerPage(id);

  return (
    <div className="space-y-10 border-none p-0 outline-none">
      <h1 className="text-2xl font-semibold tracking-tight">
        {id} 님의 게시글
      </h1>

      <div>
        {/* //!댄서게시판 헤더 */}
        <div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                댄서게시판
              </h2>
            </div>

            <div>
              <ViewMore href="/likes/dancer" />
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        {/* //!댄서게시판 미리보기 영역 */}
        <div className="relative">
          <ScrollArea>
            {dancerStatus === "loading" ? (
              <DancerPostLoader />
            ) : dancerStatus === "error" ? (
              <>{dancerError && <p>Error: {dancerError.message}</p>}</>
            ) : (
              dancerData && (
                <ul className="flex space-x-4 pb-4">
                  {dancerData?.pages[0].data.slice(0, 10).map((dancerData) => (
                    <PreviewDancerPosts
                      key={dancerData.postId}
                      data={dancerData}
                      href={`/posts/${dancerData.postId}`}
                    />
                  ))}
                </ul>
              )
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>
      <div>
        {/* //!자랑게시판 헤더 */}
        <div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                자랑게시판
              </h2>
            </div>

            <div>
              <ViewMore href="/likes/video" />
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        {/* //!자랑게시판 미리보기 영역 */}
        <div className="relative">
          <ScrollArea>
            {videoStatus === "loading" ? (
              <VideoPostLoader />
            ) : videoStatus === "error" ? (
              <>{videoError && <p>Error: {videoError.message}</p>}</>
            ) : (
              videoData && (
                <ul className="flex space-x-4 pb-4">
                  {videoData?.pages[0].data.slice(0, 10).map((videoData) => (
                    <PreviewVideoPosts
                      key={videoData.postId}
                      data={videoData}
                      href={`/posts/${videoData.postId}`}
                    />
                  ))}
                </ul>
              )
            )}
            <ScrollBar orientation="horizontal" />
          </ScrollArea>
        </div>
      </div>

      <div>
        {/* //!자유게시판 헤더 */}
        <div>
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h2 className="text-xl font-semibold tracking-tight">
                자유게시판
              </h2>
            </div>

            <div>
              <ViewMore href="/likes/free" />
            </div>
          </div>
          <Separator className="my-4" />
        </div>

        {/* //!자유게시판 미리보기 영역 */}
        <div className="w-full">
          <ScrollArea>
            {freeStatus === "loading" ? (
              <FreePostLoader />
            ) : freeStatus === "error" ? (
              <>{freeError && <p>Error: {freeError.message}</p>}</>
            ) : (
              freeData && (
                <ul className="col-center w-full gap-4 pb-4">
                  {freeData?.pages[0].data.slice(0, 10).map((freeData) => (
                    <FreePostItem key={freeData.postId} data={freeData} href={`/posts/${freeData.postId}`} />
                  ))}
                </ul>
              )
            )}
            <ScrollBar />
          </ScrollArea>
        </div>
      </div>
    </div>
  );
}
