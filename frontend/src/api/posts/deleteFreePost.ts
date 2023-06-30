import axios from "@api/axiosInstance";
import { useToast } from "@components/ui/use-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@toolkit/hook";
import { TPostId } from "@type/posts";
import { useRouter } from "next/router";

export const deleteFreePost = async (postId: TPostId) => {
  try {
    await axios.delete(`/posts/free/${postId}`);
    return true;
  } catch (err) {
    console.log("🚀 deleteFreePost.tsx", err);
    return false;
  }
};

// useDeleteFreePost
export const useDeleteFreePost = () => {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { toast } = useToast();

  // 검색, 정렬, 장르, 페이징
  const searchKeyword = useAppSelector((state) => state.search.searchKeyword);
  const { sort, genre } = useAppSelector((state) => state.filter);

  return useMutation({
    mutationFn: deleteFreePost,
    onSuccess: async (_, postId) => {
      await queryClient.removeQueries({
        queryKey: [`/postDetail/${postId}`],
      });
      await queryClient.invalidateQueries({
        queryKey: [
          `/posts/free`,
          "searchKeyword",
          searchKeyword,
          "sort",
          sort,
          "genre",
          genre,
        ],
      });

      router.push(`/free`);
      toast({ title: "Success", description: "게시글이 삭제되었습니다." });
    },
    onError: (err) => {
      console.error(err);
      toast({ title: "Fail", description: "게시글을 삭제하지 못했습니다." });
    },
  });
};
