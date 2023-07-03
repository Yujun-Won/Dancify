import { AxiosError } from "axios";
import axios from "@api/axiosInstance";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useAppSelector } from "@toolkit/hook";

import { TGenreValue, TSort } from "@type/filter";
import { TSearchKeyword } from "@type/search";
import { IPostQueryParams } from "@type/posts";
import { IHistoriesPerPage } from "@type/dancerPosts";

export const readViewHistoriesPerPage = async (
  page: number,
  searchKeyword: TSearchKeyword,
  sort: TSort,
  genre: TGenreValue
) => {
  const params: IPostQueryParams = { page };

  if (searchKeyword !== "") params.q = searchKeyword;
  if (sort !== "new") params.sort = sort;
  if (genre !== "전체") params.genre = genre;

  try {
    const response = await axios.get(`/view-history`, { params });
    return response.data;
  } catch (err) {
    console.log("🚀 readViewHistoriesPerPage.tsx", err);
    return { data: [] };
  }
};

export const useReadViewHistoriesPerPage = () => {
  // 검색, 정렬, 장르, 페이징
  const searchKeyword = useAppSelector((state) => state.search.searchKeyword);
  const { sort, genre } = useAppSelector((state) => state.filter);

  return useInfiniteQuery<IHistoriesPerPage, AxiosError>({
    queryKey: [
      `/view-history`,
      "searchKeyword",
      searchKeyword,
      "sort",
      sort,
      "genre",
      genre,
    ],
    queryFn: ({ pageParam = 1 }) =>
      readViewHistoriesPerPage(pageParam, searchKeyword, sort, genre),
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
