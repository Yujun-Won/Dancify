import { useState } from "react";
import {useAppSelector } from "@toolkit/hook";

import Tiptap from "@components/tiptap";
import TitleForm from "@components/tiptap/TitleForm";

import { Button } from "@components/ui/button";
import UploadImage from "@components/UploadImage";

import { useUpdateFreePost } from "@api/posts/updateFreePost";
import PreviewImageUrl from "../PostItem/PreviewImageUrl";
import PreviewImageFile from "../PostItem/PreviewImageFile";

export default function EditFreePost({ id }: { id: string }) {
  const [fileName, setFileName] = useState<string>("");
  const [imageFile, setImageFile] = useState<File>();
  const { postTitle, postContent, postImage } = useAppSelector((state) => state.post);

  const { mutateAsync } = useUpdateFreePost();

  const onSubmit = async () => {
    // title, content 필수
    if (postTitle.length < 3 || postContent.length < 3) return;

    const formData = new FormData();

    // 이미지파일 넣기
    if (imageFile) formData.append("postImage", imageFile);

    // 제목과 내용 넣기
    formData.append("title", postTitle);
    formData.append("content", postContent);

    // POST 요청
    mutateAsync({postId:id, formData});
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

      {/* 이미지 미리보기 */}
      {imageFile && <PreviewImageFile imageFile={imageFile} />}
      {!imageFile && postImage !== "" && <PreviewImageUrl imageUrl={postImage} />}

      <Button className="w-full" onClick={onSubmit}>
        수정 완료
      </Button>
    </div>
  );
}
