import axios from "@api/axiosInstance";
import { postActions } from "@features/post/postSlice";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useAppSelector } from "@toolkit/hook";
import { store } from "@toolkit/store";
import { useRouter } from "next/router";

// 자유게시글 Create
export const createDancerPost = async (postData: FormData) => {
  try {
    // "genre": string,
    // "title":string,
    // "content":string,
    // "video": File,
    // "feedbackPrice": number,

    const response = await axios.post("/posts/dancer", postData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  } catch (err) {
    console.error("🚀 createDancePost:", err);
    return false;
  }
};

export const createDancerVideoSections = async (videoData: FormData) => {
  try {
    await axios.post("/posts/dancer", videoData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return true;
  } catch (err) {
    console.error("🚀 createDancePost:", err);
    return false;
  }
};

// useMutation
export const useCreateDancerVideoSectionsMutation = () => {
  const router = useRouter();
  const queryClient = useQueryClient();

  // 검색, 정렬, 장르, 페이징
  const searchKeyword = useAppSelector((state) => state.search.searchKeyword);
  const { sort, genre } = useAppSelector((state) => state.filter);

  return useMutation({
    mutationFn: createDancerVideoSections,
    onSuccess: async () => {
      await queryClient.invalidateQueries({
        queryKey: [
          `/posts/dancer`,
          "searchKeyword",
          searchKeyword,
          "sort",
          sort,
          "genre",
          genre,
        ],
      });
      store.dispatch(postActions.resetPostInfo());
      router.push("/");
    },
    onError: (err) => {
      console.error("🚀 useCreateDancerPostMutation:", err);
    },
  });
};
