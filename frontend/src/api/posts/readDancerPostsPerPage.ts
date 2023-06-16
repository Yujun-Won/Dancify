import { AxiosError } from "axios";
import axios from "@api/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAppSelector } from "@toolkit/hook";

import { TGenre, TSort } from "@type/filter";
import { TSearchKeyword } from "@type/search";
import { IPostQueryParams } from "@type/posts";
import { IDancerPostsPerPage } from "@type/dancerPosts";

export const readDancerPostsPerPage = async (
  page: number,
  searchKeyword: TSearchKeyword,
  sort: TSort,
  genre: TGenre
) => {
  const params: IPostQueryParams = { page };

  if (searchKeyword !== "") params.q = searchKeyword;
  if (sort !== "") params.sort = sort;
  if (genre !== "") params.genre = genre;

  try {
    const response = await axios.get(`/posts/dancer`, { params });
    return response.data;
  } catch (err) {
    console.log("🚀 readDancerPostsPerPage.tsx", err);
    return { data: [] };
  }
};

export const useReadDancerPostsPerPage = () => {
  // 검색, 정렬, 장르, 페이징
  const searchKeyword = useAppSelector((state) => state.search.searchKeyword);
  const { sort, genre } = useAppSelector((state) => state.filter);

  return useInfiniteQuery<IDancerPostsPerPage, AxiosError>({
    queryKey: [
      `/posts/dancer`,
      "searchKeyword",
      searchKeyword,
      "sort",
      sort,
      "genre",
      genre,
    ],
    queryFn: ({ pageParam = 1 }) =>
      readDancerPostsPerPage(pageParam, searchKeyword, sort, genre),
    getNextPageParam: (lastPage) => {
      if (lastPage.currentPage < lastPage.totalPages) {
        return lastPage.currentPage + 1;
      } else {
        return undefined;
      }
    },
    cacheTime: 300000, // 5분
    staleTime: 240000, // 4분
    refetchOnMount: true, //페이지 재방문시 refetch 적용
    refetchOnWindowFocus: false, // 브라우저 포커징시 refetch 금지
  });
};
