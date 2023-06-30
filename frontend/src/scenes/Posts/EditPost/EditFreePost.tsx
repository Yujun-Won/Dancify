import { useEffect, useState } from "react";
import { useAppSelector } from "@toolkit/hook";

import Tiptap from "@components/tiptap";
import TitleForm from "@components/tiptap/TitleForm";

import { Button } from "@components/ui/button";
import UploadImage from "@components/UploadImage";

import { useUpdateFreePost } from "@api/posts/updateFreePost";
import PreviewImageUrl from "../PostItem/PreviewImageUrl";
import { ReloadIcon } from "@radix-ui/react-icons";

export default function EditFreePost({ id }: { id: string }) {
  const [isWait, setIsWait] = useState(false);

  const [fileName, setFileName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const { postTitle, postContent, postImage } = useAppSelector(
    (state) => state.post
  );

  const imagePreview = imageFile ? URL.createObjectURL(imageFile) : undefined;

  // 이미지 메모리 누수 처리
  useEffect(() => {
    return () => {
      if (imagePreview) URL.revokeObjectURL(imagePreview);
    };
  }, [imagePreview]);

  const { mutateAsync, isLoading } = useUpdateFreePost();

  const onSubmit = async () => {
    // title, content 필수
    if (postTitle.length < 3 || postContent.length < 3) return;

    const formData = new FormData();

    // 이미지파일 넣기
    if (imageFile) formData.append("postImage", imageFile);

    // 제목과 내용 넣기
    formData.append("title", postTitle);
    formData.append("content", postContent);

    //! PATCH 요청
    setIsWait(true);
    mutateAsync({ postId: id, formData });
    await new Promise((resolve) => setTimeout(resolve, 500));

    return;
  };

  return (
    <div className="mx-auto max-w-2xl space-y-4">
      {/* 제목 텍스트 필드 */}
      <TitleForm isUpdate={true} />

      {/* 내용 작성 에디터 */}
      <Tiptap isUpdate={true} />

      {/* 이미지 드레그 앤 드롭 영역 */}
      <UploadImage
        fileName={fileName}
        setFileName={setFileName}
        setImageFile={setImageFile}
      />

      {/* 기존 이미지 or 새로운 이미지 미리보기 */}
      {imagePreview && <PreviewImageUrl imageUrl={imagePreview} />}
      {!imageFile && postImage !== "" && (
        <PreviewImageUrl imageUrl={postImage} />
      )}

      {/* 작성 완료 버튼 */}
      {isLoading || isWait ? (
        <Button disabled className="w-full">
          <ReloadIcon className="mr-2 h-4 w-4 animate-spin" />
          잠시만 기다려주세요.
        </Button>
      ) : (
        <Button className="w-full" onClick={onSubmit}>
          수정 완료
        </Button>
      )}
    </div>
  );
}
