import Link from "next/link";
import { useState } from "react";
import { useRouter } from "next/router";

import { deleteFreePost } from "@api/posts/deleteFreePost";
import { TPostId } from "@type/posts";

import { Button } from "@components/ui/button";
import { MoreVerticalIcon } from "lucide-react";
import { useToast } from "@components/ui/use-toast";

export default function UpDelButton(postId: { postId: TPostId }) {
  const router = useRouter();
  const { toast } = useToast();

  // 더보기 버튼 클릭
  const [isToggle, setIsToggle] = useState(false);
  // 삭제 버튼 활성화 state
  const [isDel, setIsDel] = useState(false);

  const onValid = async () => {
    try {
      await deleteFreePost(postId);
      router.push("/posts/free");
      toast({ title: "Success", description: "게시글이 삭제되었습니다." });
    } catch (err) {
      console.log("deleteFreePost:", err);
    }
  };

  return (
    <div className="relative">
      {/* 오버레이 */}
      {isToggle && (
        <div
          className="fixed left-0 top-0 z-10 h-screen w-screen"
          onClick={() => {
            setIsToggle(false);
            setIsDel(false);
          }}
        ></div>
      )}

      {/* 더보기 토글 버튼 */}
      <button onClick={() => setIsToggle(!isToggle)}>
        <MoreVerticalIcon className="text-muted-foreground" />
      </button>

      {/* 수정 삭제 버튼 */}
      {isToggle ? (
        <div className="absolute right-0 z-10 w-36 gap-2 rounded-md border p-2">
          {isDel ? (
            <div className="row-between w-full">
              <Button variant={"destructive"} onClick={() => onValid()}>
                삭제
              </Button>
              <Button variant={"outline"} onClick={() => setIsDel(false)}>
                취소
              </Button>
            </div>
          ) : (
            <div className="row-between w-full">
              <Link href={`/posts/free/modify/${postId}`}>
                <Button variant={"outline"}>수정</Button>
              </Link>
              <Button variant={"destructive"} onClick={() => setIsDel(true)}>
                삭제
              </Button>
            </div>
          )}
        </div>
      ) : null}
    </div>
  );
}
