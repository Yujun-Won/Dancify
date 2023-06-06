import { TNickname } from "./auth";
import { TComment } from "./comments";
import {
  TCommentCount,
  TContent,
  TPostId,
  TPostImage,
  TTitle,
  TViews,
  TcreateDate,
} from "./posts";

// 자유게시판의 1개 게시글
export interface IFreePost {
  postId: TPostId;
  title: TTitle;
  nickname: TNickname;
  content: TContent;
  createDate: TcreateDate;
  postImage: TPostImage;
  views: TViews;
  commentsCount: TCommentCount;
}

// 자유게시판의 무한스크롤 데이터
export interface IFreePostsPerPage {
  data: IFreePost[];
  totalPages: number;
  currentPage: number;
  totalCount: number;
}

// 자유게시글 1개 데이터
export interface IFreePostDetail {
  postId: TPostId;
  title: TTitle;
  nickname: TNickname;
  content: TContent;
  createDate: TcreateDate;
  postImage: TPostImage;
  views: TViews;
  comments: TComment[];
  userPK: string;
}

export interface IFreePostDataArr {
  data: IFreePost[];
}

//게시글 업로드 폼
export interface IPostForm {
  title: TTitle;
  content: TContent;
  postImage: string;
}
//게시글 업데이트 폼
export interface IUpdatePostForm {
  postId: TPostId; // url에 포함
  title: TTitle;
  content: TContent;
  postImage: string;
}

// 게시글 삭제 시 전송할 데이터
export interface IDeletePost {
  postId: TPostId; // url에 포함
}
